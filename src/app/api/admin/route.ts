import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { storeScamFingerprint, flagSharedIpCreators } from "@/lib/moderation";

/**
 * Moderation actions for /admin. Gated by a single shared secret (ADMIN_SECRET
 * env var) — there is exactly one moderator (the owner), so a full auth system
 * would be over-engineering.
 *
 * Game-queue actions (the low-confidence cases the AI chose not to decide):
 *   approve  — game back to 'active', clear flag, resolve its reports
 *   hide     — game to 'hidden' (playable by link, off all discovery)
 *   remove   — game to 'removed'; admin-confirmed scam, so also store its
 *              fingerprint and flag same-IP accounts for review
 *   dismiss  — false-alarm: clear report_count, resolve reports, keep status
 *   ban      — creator to trust 'banned' and hide all their games; also flags
 *              same-IP accounts. Pass decisionId to close the ip_flag it came from.
 *
 * Decisions-feed actions (auditing what the AI already did):
 *   merge            {fromCreatorId, toCreatorId, decisionId} — move every game
 *                    from → to, mark the proposal done, log a 'merge' decision
 *                    carrying moved_game_ids for one-click unmerge
 *   unmerge          {decisionId} — alias of reverse_decision for a 'merge' row
 *   reverse_decision {decisionId} — per-kind one-click reverse, status → 'reversed'
 *   dismiss_decision {decisionId} — "not the same kid" / "looks fine". Dismissals
 *                    and reversals share status 'reversed' (both mean "the admin
 *                    said no") so they render dimmed in the feed the same way.
 *   resolve_appeal   {appealId} — appeals.status = 'resolved'
 */
export async function POST(request: NextRequest) {
  const secret = process.env.ADMIN_SECRET;
  if (!secret) {
    return NextResponse.json(
      { error: "ADMIN_SECRET is not configured" },
      { status: 503 }
    );
  }

  let body: {
    key?: string;
    action?: string;
    gameId?: string;
    creatorId?: string;
    fromCreatorId?: string;
    toCreatorId?: string;
    decisionId?: string;
    appealId?: string;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  if (body.key !== secret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { action, gameId, creatorId } = body;

  try {
    switch (action) {
      case "approve": {
        if (!gameId) return badRequest("gameId required");
        const { data: g } = await supabase
          .from("games")
          .select("creator_id")
          .eq("id", gameId)
          .single();
        await supabase
          .from("games")
          .update({ status: "active", flag_reason: null, report_count: 0 })
          .eq("id", gameId);
        await resolveReports(gameId);
        // Approving a game from a banned creator vouches for them — un-ban,
        // which reverses an auto-remove + auto-ban false positive in one click.
        if (g?.creator_id) {
          await supabase
            .from("creators")
            .update({ trust: "new" })
            .eq("id", g.creator_id)
            .eq("trust", "banned");
        }
        return NextResponse.json({ success: true });
      }
      case "hide": {
        if (!gameId) return badRequest("gameId required");
        await supabase
          .from("games")
          .update({ status: "hidden", flag_reason: "admin" })
          .eq("id", gameId);
        return NextResponse.json({ success: true });
      }
      case "remove": {
        if (!gameId) return badRequest("gameId required");
        const { data: g } = await supabase
          .from("games")
          .select("creator_id")
          .eq("id", gameId)
          .single();
        await supabase
          .from("games")
          .update({ status: "removed", flag_reason: "admin" })
          .eq("id", gameId);
        await resolveReports(gameId);
        // The admin just confirmed a scam: remember its content fingerprint so
        // it can never come back, and flag same-IP accounts for review. Both
        // helpers swallow their own errors — best-effort, never blocking.
        await storeScamFingerprint(gameId);
        if (g?.creator_id) await flagSharedIpCreators(g.creator_id);
        return NextResponse.json({ success: true });
      }
      case "dismiss": {
        if (!gameId) return badRequest("gameId required");
        // False alarm — clear the report tally but leave the game as-is.
        await supabase
          .from("games")
          .update({ report_count: 0 })
          .eq("id", gameId);
        await resolveReports(gameId);
        return NextResponse.json({ success: true });
      }
      case "ban": {
        if (!creatorId) return badRequest("creatorId required");
        await supabase
          .from("creators")
          .update({ trust: "banned" })
          .eq("id", creatorId);
        // Hide every game from this creator (reversible — not 'removed').
        await supabase
          .from("games")
          .update({ status: "hidden", flag_reason: "creator-banned" })
          .eq("creator_id", creatorId)
          .neq("status", "removed");
        await flagSharedIpCreators(creatorId);
        // Banning straight from an ip_flag card closes that flag; a 'done'
        // ip_flag in the feed reverses like a ban (un-ban + un-hide).
        if (body.decisionId) {
          await supabase
            .from("moderation_decisions")
            .update({ status: "done" })
            .eq("id", body.decisionId);
        }
        return NextResponse.json({ success: true });
      }
      case "merge": {
        const { fromCreatorId, toCreatorId, decisionId } = body;
        if (!fromCreatorId || !toCreatorId || !decisionId) {
          return badRequest("fromCreatorId, toCreatorId, decisionId required");
        }
        const { data: proposal, error: pErr } = await supabase
          .from("moderation_decisions")
          .select("data")
          .eq("id", decisionId)
          .single();
        if (pErr || !proposal) return unavailable("Couldn't load that proposal");

        const { data: moved } = await supabase
          .from("games")
          .select("id")
          .eq("creator_id", fromCreatorId);
        const movedIds = (moved || []).map((g) => g.id);
        await supabase
          .from("games")
          .update({ creator_id: toCreatorId })
          .eq("creator_id", fromCreatorId);
        // The emptied from-account is just abandoned — leave its row alone.

        const pdata = (proposal.data || {}) as Record<string, unknown>;
        await supabase
          .from("moderation_decisions")
          .update({
            status: "done",
            data: {
              ...pdata,
              moved_game_ids: movedIds,
              merged_at: new Date().toISOString(),
            },
          })
          .eq("id", decisionId);
        // A fresh 'merge' row in the feed carries the one-click unmerge.
        await supabase.from("moderation_decisions").insert({
          kind: "merge",
          creator_id: toCreatorId,
          status: "done",
          data: {
            moved_game_ids: movedIds,
            from_creator_id: fromCreatorId,
            to_creator_id: toCreatorId,
            from_name: pdata.from_name,
            to_name: pdata.to_name,
          },
        });
        return NextResponse.json({ success: true });
      }
      case "unmerge":
      case "reverse_decision": {
        if (!body.decisionId) return badRequest("decisionId required");
        return reverseDecision(body.decisionId);
      }
      case "dismiss_decision": {
        if (!body.decisionId) return badRequest("decisionId required");
        const { error } = await supabase
          .from("moderation_decisions")
          .update({ status: "reversed" })
          .eq("id", body.decisionId);
        if (error) return unavailable("Decisions table not available yet");
        return NextResponse.json({ success: true });
      }
      case "resolve_appeal": {
        if (!body.appealId) return badRequest("appealId required");
        const { error } = await supabase
          .from("appeals")
          .update({ status: "resolved" })
          .eq("id", body.appealId);
        if (error) return unavailable("Appeals table not available yet");
        return NextResponse.json({ success: true });
      }
      default:
        return badRequest("Unknown action");
    }
  } catch {
    return NextResponse.json({ error: "Action failed" }, { status: 500 });
  }
}

/** One-click reverse of an AI decision — the per-kind undo, then status 'reversed'. */
async function reverseDecision(decisionId: string) {
  const { data: d, error } = await supabase
    .from("moderation_decisions")
    .select("kind, game_id, creator_id, data, status")
    .eq("id", decisionId)
    .single();
  if (error || !d) return unavailable("Couldn't load that decision");
  if (d.status !== "done") return badRequest("Only 'done' decisions can be reversed");

  switch (d.kind) {
    case "remove":
      // Same semantics as approve: restore the game and vouch for the creator.
      if (d.game_id) {
        await supabase
          .from("games")
          .update({ status: "active", flag_reason: null, report_count: 0 })
          .eq("id", d.game_id);
        await resolveReports(d.game_id);
      }
      if (d.creator_id) await unbanCreator(d.creator_id);
      break;
    case "ban":
    case "ip_flag": // a 'done' ip_flag means the admin banned from the flag
      if (d.creator_id) await unbanCreator(d.creator_id);
      break;
    case "hide":
    case "fingerprint_hide":
      if (d.game_id) {
        await supabase
          .from("games")
          .update({ status: "active", flag_reason: null })
          .eq("id", d.game_id)
          .eq("status", "hidden");
      }
      break;
    case "report_dismiss":
      if (d.game_id) {
        const { data: reopened } = await supabase
          .from("reports")
          .update({ status: "open" })
          .eq("game_id", d.game_id)
          .eq("status", "resolved")
          .select("id");
        await supabase
          .from("games")
          .update({ report_count: reopened?.length || 0 })
          .eq("id", d.game_id);
      }
      break;
    case "merge": {
      const data = (d.data || {}) as {
        moved_game_ids?: string[];
        from_creator_id?: string;
      };
      if (data.moved_game_ids?.length && data.from_creator_id) {
        await supabase
          .from("games")
          .update({ creator_id: data.from_creator_id })
          .in("id", data.moved_game_ids);
      }
      break;
    }
    default:
      return badRequest(`Can't reverse a '${d.kind}' decision`);
  }

  await supabase
    .from("moderation_decisions")
    .update({ status: "reversed" })
    .eq("id", decisionId);
  return NextResponse.json({ success: true });
}

/** Un-ban a creator and restore the games that were hidden by the ban. */
async function unbanCreator(creatorId: string) {
  await supabase
    .from("creators")
    .update({ trust: "new" })
    .eq("id", creatorId)
    .eq("trust", "banned");
  await supabase
    .from("games")
    .update({ status: "active", flag_reason: null })
    .eq("creator_id", creatorId)
    .eq("flag_reason", "creator-banned");
}

function badRequest(msg: string) {
  return NextResponse.json({ error: msg }, { status: 400 });
}

/** Table missing (migration not applied yet) or row unreadable — never crash. */
function unavailable(msg: string) {
  return NextResponse.json({ error: msg }, { status: 503 });
}

async function resolveReports(gameId: string) {
  await supabase
    .from("reports")
    .update({ status: "resolved" })
    .eq("game_id", gameId)
    .eq("status", "open");
}
