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
  if (!rateLimit(getClientIp(request), { maxRequests: 3, windowMs: 600_000 })) {
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

  if (!contact || !message) {
    return NextResponse.json(
      { error: "Both fields are required — tell us who you are and what happened!" },
      { status: 400 }
    );
  }
  if (contact.length > MAX_CONTACT_LENGTH || message.length > MAX_MESSAGE_LENGTH) {
    return NextResponse.json(
      { error: "That's a bit too long — can you trim it down?" },
      { status: 400 }
    );
  }

  const { error } = await supabase.from("appeals").insert({ contact, message });
  if (error) {
    // The appeals table may not exist yet (migration pending) — degrade
    // kindly, never crash.
    return NextResponse.json(
      { error: "Appeals are warming up — try again soon!" },
      { status: 503 }
    );
  }

  return NextResponse.json({ success: true });
}
