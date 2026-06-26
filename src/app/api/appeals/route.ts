import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

const MAX_CONTACT_LENGTH = 200;
const MAX_MESSAGE_LENGTH = 500;

/**
 * POST /api/appeals — the "think we made a mistake?" form. No login, no
 * email. A row lands in the appeals table for a real human to read.
 */
export async function POST(request: NextRequest) {
  // Scoped key: the limiter bucket is shared across routes per IP, and this
  // window is long — publishing a game must never eat a kid's appeal budget.
  if (!rateLimit(`appeal:${getClientIp(request)}`, { maxRequests: 3, windowMs: 600_000 })) {
    return NextResponse.json(
      { error: "Too many requests — slow down!" },
      { status: 429 }
    );
  }

  let contact = "";
  let message = "";
  try {
    const body = await request.json();
    contact = typeof body?.contact === "string" ? body.contact.trim() : "";
    message = typeof body?.message === "string" ? body.message.trim() : "";
  } catch {
    // fall through to validation below
  }

  // Expected outcomes for a kid-facing form return 200 with an error field —
  // keeps the browser console clean. Only the rate limiter is a real HTTP error.
  if (!contact || !message) {
    return NextResponse.json({
      error: "Both fields are required — tell us who you are and what happened!",
    });
  }
  if (contact.length > MAX_CONTACT_LENGTH || message.length > MAX_MESSAGE_LENGTH) {
    return NextResponse.json({
      error: "That's a bit too long — can you trim it down?",
    });
  }

  const { data, error } = await supabase
    .from("appeals")
    .insert({ contact, message })
    .select("id")
    .single();
  if (error) {
    // The appeals table may not exist yet (migration pending) — degrade
    // kindly, never crash.
    return NextResponse.json({ error: "Appeals are warming up — try again soon!" });
  }

  // appealId lets the chat helper resolve this appeal if it sorts things out.
  return NextResponse.json({ success: true, appealId: data?.id });
}
