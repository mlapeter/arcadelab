import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

// Distinct viewer reports needed before a game is auto-shadow-hidden.
// Low, but each report is deduped per session — three different people.
const REPORT_HIDE_THRESHOLD = 3;
const MAX_REASON_LENGTH = 200;

/**
 * POST /api/games/[id]/report — anyone can flag a game (no login, like StarButton).
 * Reports are deduped per session. Once enough distinct sessions report a game
 * it is auto-shadow-hidden (status 'hidden') pending owner review — still
 * playable by direct link, but gone from every discovery surface.
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!rateLimit(getClientIp(request), { maxRequests: 10, windowMs: 60_000 })) {
    return NextResponse.json({ error: "Too many requests — slow down!" }, { status: 429 });
  }

  // Reuse the same anonymous session cookie the like system uses.
  const sessionId =
    request.cookies.get("kh_session")?.value || crypto.randomUUID();

  let reason: string | null = null;
  try {
    const body = await request.json();
    if (typeof body?.reason === "string") {
      reason = body.reason.trim().slice(0, MAX_REASON_LENGTH) || null;
    }
  } catch {
    // No body is fine — reason is optional.
  }

  const { data: game } = await supabase
    .from("games")
    .select("id, status, report_count")
    .eq("id", id)
    .single();

  if (!game) {
    return NextResponse.json({ error: "Game not found" }, { status: 404 });
  }

  // Insert the report; the partial unique index dedupes per session.
  const { error: insertError } = await supabase.from("reports").insert({
    game_id: id,
    reason,
    reporter_hash: sessionId,
    status: "open",
  });

  if (insertError) {
    // 23505 = already reported by this session. Treat as success (idempotent).
    if (insertError.code === "23505") {
      return NextResponse.json({ success: true, alreadyReported: true });
    }
    return NextResponse.json({ error: "Failed to submit report" }, { status: 500 });
  }

  const newCount = (game.report_count || 0) + 1;
  const update: Record<string, unknown> = { report_count: newCount };

  // Auto-shadow-hide once enough distinct sessions have reported an active game.
  if (newCount >= REPORT_HIDE_THRESHOLD && game.status === "active") {
    update.status = "hidden";
    update.flag_reason = "reported";
  }

  await supabase.from("games").update(update).eq("id", id);

  const response = NextResponse.json({ success: true });
  if (!request.cookies.get("kh_session")) {
    response.cookies.set("kh_session", sessionId, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 365,
    });
  }
  return response;
}
