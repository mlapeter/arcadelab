import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import {
  storeScamFingerprint,
  flagSharedIpCreators,
  contentFingerprint,
} from "@/lib/moderation";
import {
  recordCorrection,
  recordFingerprintMemory,
  consolidateMemory,
} from "@/lib/memory";

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
          .select("creator_id, status, flag_reason, moderation")
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
        // An approval that contradicts an AI flag is ground truth — remember it.
        if (g?.flag_reason?.startsWith("ai") || g?.flag_reason === "fingerprint") {
          const mod = g.moderation as { verdict?: string; confidence?: number } | null;
          await recordCorrection({
            source: "admin-reversal",
            gameId,
            summary: "Admin approved a game the AI had flagged.",
            ai_decided: `flagged as ${g.flag_reason}${mod?.verdict ? ` (verdict ${mod.verdict}${typeof mod.confidence === "number" ? ` @ ${mod.confidence}` : ""})` : ""}`,
            human_did: "approved — game restored, creator vouched for",
          });
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
          .select("creator_id, slug, title, moderation")
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
        // The teachable half of the fingerprint: what made this a scam.
        const { data: content } = await supabase
          .from("game_content")
          .select("html")
          .eq("game_id", gameId)
          .single();
        if (g && content?.html) {
          const mod = g.moderation as { verdict?: string; note?: string } | null;
          await recordFingerprintMemory({
            fingerprint: contentFingerprint(content.html),
            scam_kind: mod?.verdict === "scam" ? "scam (admin-confirmed)" : "admin-removed",
            features: [
              `title: ${g.title}`,
              ...(mod?.note ? [`ai note: ${mod.note}`] : []),
            ],
            source_game_slug: g.slug,
            source_game_title: g.title,
          });
        }
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
          .select("creator_id, data")
          .eq("id", decisionId)
          .single();
        if (pErr || !proposal) return unavailable("Couldn't load that proposal");
        // The proposal is the source of truth — the request may only pick the
        // direction, never which accounts get merged.
        const pair = [
          proposal.creator_id,
          (proposal.data as { other_creator_id?: string })?.other_creator_id,
        ];
        if (
          !pair.includes(fromCreatorId) ||
          !pair.includes(toCreatorId) ||
          fromCreatorId === toCreatorId
        ) {
          return badRequest("Creators don't match that proposal");
        }

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
      case "unban": {
        // One click on an escalated appeal: un-ban and close the escalation.
        if (!creatorId) return badRequest("creatorId required");
        await unbanCreator(creatorId);
        if (body.decisionId) {
          await supabase
            .from("moderation_decisions")
            .update({ status: "done" })
            .eq("id", body.decisionId);
        }
        await recordCorrection({
          source: "admin-reversal",
          gameId: body.gameId,
          summary: "Admin un-banned a creator after an escalated appeal.",
          ai_decided: "banned the creator; the appeals chat escalated instead of reversing",
          human_did: "un-banned the creator",
        });
        return NextResponse.json({ success: true });
      }
      case "consolidate": {
        // Re-distill the lessons document from recent cases (the panel's
        // regenerate button; the weekly digest cron runs the same function).
        const lessons = await consolidateMemory();
        if (!lessons) {
          return unavailable("Nothing to consolidate yet (or memory table pending)");
        }
        return NextResponse.json({ success: true, lessons });
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
    case "appeal_resolve": {
      // The appeals chat restored/unbanned on its own; the admin says no.
      const data = (d.data || {}) as { action?: string };
      if (data.action === "unban" && d.creator_id) {
        await supabase
          .from("creators")
          .update({ trust: "banned" })
          .eq("id", d.creator_id);
        await supabase
          .from("games")
          .update({ status: "hidden", flag_reason: "creator-banned" })
          .eq("creator_id", d.creator_id)
          .eq("status", "active");
      }
      if (data.action === "restore" && d.game_id) {
        await supabase
          .from("games")
          .update({ status: "hidden", flag_reason: "admin" })
          .eq("id", d.game_id)
          .eq("status", "active");
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

  // A reversal is ground truth — write the correcting case so the system can
  // learn (and, for memory-driven decisions, unlearn).
  await recordReversalCase(d);
  return NextResponse.json({ success: true });
}

/** What each reversal teaches the memory, in plain words. */
async function recordReversalCase(d: {
  kind: string;
  game_id: string | null;
  creator_id: string | null;
  data: Record<string, unknown> | null;
}) {
  const data = (d.data || {}) as Record<string, unknown>;
  const verdict = data.verdict
    ? ` (verdict ${data.verdict}${typeof data.confidence === "number" ? ` @ ${data.confidence}` : ""})`
    : "";
  const story: Record<string, { ai: string; human: string }> = {
    remove: {
      ai: `auto-removed the game and banned the creator as a scam${verdict}`,
      human: "reversed — restored the game and un-banned the creator",
    },
    ban: { ai: `auto-banned the creator${verdict}`, human: "un-banned the creator" },
    ip_flag: {
      ai: "flagged the creator for sharing an IP with a confirmed scammer (admin banned from the flag)",
      human: "reversed the ban",
    },
    hide: { ai: `shadow-hid the game${verdict}`, human: "restored the game" },
    fingerprint_hide: {
      ai: `auto-hid the game as a confirmed-scam fingerprint match${data.source_title ? ` (matched "${data.source_title}")` : ""}`,
      human: "restored the game — the fingerprint match was a false positive",
    },
    report_dismiss: {
      ai: "auto-dismissed viewer reports as safe",
      human: "reopened the reports",
    },
    appeal_resolve: {
      ai: `appeals chat resolved on its own: ${data.action || "acted"}${data.reason ? ` — ${data.reason}` : ""}`,
      human: "admin reversed the appeal outcome",
    },
  };
  const s = story[d.kind];
  if (!s) return;
  await recordCorrection({
    source: "admin-reversal",
    gameId: d.game_id,
    summary: `Admin reversed an automatic '${d.kind}' decision.`,
    ai_decided: s.ai,
    human_did: s.human,
  });
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
