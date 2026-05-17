import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

/**
 * Moderation actions for the /admin review queue. Gated by a single shared
 * secret (ADMIN_SECRET env var) — there is exactly one moderator (the owner),
 * so a full auth system would be over-engineering.
 *
 * Actions:
 *   approve  — game back to 'active', clear flag, resolve its reports
 *   hide     — game to 'hidden' (playable by link, off all discovery)
 *   remove   — game to 'removed' (fully gone, render + play page 404)
 *   dismiss  — false-alarm: clear report_count, resolve reports, keep status
 *   ban      — creator to trust 'banned' and hide all their games
 */
export async function POST(request: NextRequest) {
  const secret = process.env.ADMIN_SECRET;
  if (!secret) {
    return NextResponse.json(
      { error: "ADMIN_SECRET is not configured" },
      { status: 503 }
    );
  }

  let body: { key?: string; action?: string; gameId?: string; creatorId?: string };
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
        await supabase
          .from("games")
          .update({ status: "removed", flag_reason: "admin" })
          .eq("id", gameId);
        await resolveReports(gameId);
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
        return NextResponse.json({ success: true });
      }
      default:
        return badRequest("Unknown action");
    }
  } catch {
    return NextResponse.json({ error: "Action failed" }, { status: 500 });
  }
}

function badRequest(msg: string) {
  return NextResponse.json({ error: msg }, { status: 400 });
}

async function resolveReports(gameId: string) {
  await supabase
    .from("reports")
    .update({ status: "resolved" })
    .eq("game_id", gameId)
    .eq("status", "open");
}
