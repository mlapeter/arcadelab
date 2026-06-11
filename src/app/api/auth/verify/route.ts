import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  if (!rateLimit(getClientIp(request), { maxRequests: 10 })) {
    return NextResponse.json({ error: "Too many requests — slow down!" }, { status: 429 });
  }

  try {
    const body = await request.json();
    const creatorCode = body.creator_code?.trim()?.toUpperCase();

    if (!creatorCode) {
      return NextResponse.json(
        { error: "Creator code is required" },
        { status: 400 }
      );
    }

    const { data: creator } = await supabase
      .from("creators")
      .select("id, creator_code, display_name")
      .eq("creator_code", creatorCode)
      .single();

    if (!creator) {
      return NextResponse.json(
        { error: "Code not found — check for typos!" },
        { status: 404 }
      );
    }

    // Peek mode: resolve the code without signing the browser in. Used by the
    // publish box to offer "Sign in as {name}?" before setting any cookie.
    if (body.peek === true) {
      let gamesCount: number | undefined;
      // The client may send its current identity so the form can decide
      // whether switching accounts needs a reassurance line (games > 0) or
      // can just happen (empty account, silently abandoned).
      if (typeof body.current_creator_id === "string" && body.current_creator_id) {
        const { count } = await supabase
          .from("games")
          .select("id", { count: "exact", head: true })
          .eq("creator_id", body.current_creator_id)
          .eq("status", "active");
        gamesCount = count ?? 0;
      }
      return NextResponse.json({
        display_name: creator.display_name,
        ...(gamesCount !== undefined && { games_count: gamesCount }),
      });
    }

    const response = NextResponse.json({
      id: creator.id,
      creator_code: creator.creator_code,
      display_name: creator.display_name,
    });
    response.cookies.set("arcadelab_identity", JSON.stringify({
      creator_id: creator.id,
      creator_code: creator.creator_code,
      display_name: creator.display_name,
    }), {
      path: "/",
      maxAge: 31536000,
      sameSite: "lax",
      httpOnly: false,
    });
    return response;
  } catch {
    return NextResponse.json(
      { error: "Invalid request" },
      { status: 400 }
    );
  }
}
