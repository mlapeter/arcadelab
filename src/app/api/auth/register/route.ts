import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { generateCreatorCode } from "@/lib/creator-codes";
import { generateApiToken, hashToken } from "@/lib/auth";
import { generateDisplayName } from "@/lib/display-names";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import crypto from "crypto";

export async function POST(request: NextRequest) {
  const clientIp = getClientIp(request);
  if (!rateLimit(clientIp)) {
    return NextResponse.json({ error: "Too many requests — slow down!" }, { status: 429 });
  }

  // Same keyed hash as games.submit_ip_hash — a same-device signal, never a raw IP.
  const registerIpHash = crypto
    .createHmac("sha256", process.env.SUPABASE_SERVICE_ROLE_KEY || "salt")
    .update(clientIp)
    .digest("hex");

  try {
    const body = await request.json();
    const isAuto = body.auto === true;

    // Same device just made an account? Suggest it instead of silently creating
    // a twin. Suggestion only — the kid becomes that account by pasting its
    // code, never automatically. body.fresh means they already said "someone new".
    if (isAuto && body.fresh !== true) {
      const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
      const { data: recent, error: lookupError } = await supabase
        .from("creators")
        .select("display_name")
        .eq("register_ip_hash", registerIpHash)
        .gte("created_at", sevenDaysAgo)
        .neq("trust", "banned")
        .order("created_at", { ascending: false })
        .limit(1);
      // Column may not exist yet (migration pending) — skip the suggestion silently.
      if (!lookupError && recent && recent.length > 0) {
        return NextResponse.json({ suggestion: { display_name: recent[0].display_name } });
      }
    }

    let displayName: string;

    if (isAuto) {
      // Auto-create: generate a random display name
      // Try a few times to find a unique one
      let found = false;
      displayName = generateDisplayName();
      for (let i = 0; i < 10; i++) {
        const { data: existing } = await supabase
          .from("creators")
          .select("id")
          .eq("display_name", displayName)
          .single();
        if (!existing) {
          found = true;
          break;
        }
        displayName = generateDisplayName();
      }
      if (!found) {
        // Fallback: append extra random digits
        displayName = `${generateDisplayName()}${Math.floor(Math.random() * 900) + 100}`;
      }
    } else {
      displayName = body.display_name?.trim();

      if (!displayName || displayName.length < 2 || displayName.length > 30) {
        return NextResponse.json(
          { error: "Display name must be 2-30 characters" },
          { status: 400 }
        );
      }

      if (!/^[a-zA-Z0-9_-]+$/.test(displayName)) {
        return NextResponse.json(
          { error: "Display name can only contain letters, numbers, hyphens, and underscores" },
          { status: 400 }
        );
      }

      // Check if display name is taken
      const { data: existing } = await supabase
        .from("creators")
        .select("id")
        .eq("display_name", displayName)
        .single();

      if (existing) {
        return NextResponse.json(
          { error: "That name is already taken — try another!" },
          { status: 409 }
        );
      }
    }

    // Generate unique creator code
    let creatorCode: string;
    let isUnique = false;
    let attempts = 0;
    do {
      creatorCode = generateCreatorCode();
      const { data } = await supabase
        .from("creators")
        .select("id")
        .eq("creator_code", creatorCode)
        .single();
      isUnique = !data;
      attempts++;
    } while (!isUnique && attempts < 10);

    if (!isUnique) {
      return NextResponse.json(
        { error: "Failed to generate unique code, please try again" },
        { status: 500 }
      );
    }

    const rawToken = generateApiToken();
    const hashedToken = hashToken(rawToken);

    let { data: creator, error } = await supabase
      .from("creators")
      .insert({
        display_name: displayName,
        creator_code: creatorCode,
        api_token: hashedToken,
        register_ip_hash: registerIpHash,
      })
      .select("id, display_name, creator_code, created_at")
      .single();

    // register_ip_hash column may not exist yet (migration pending) — retry without it.
    if (error && (error.code === "42703" || error.code === "PGRST204")) {
      ({ data: creator, error } = await supabase
        .from("creators")
        .insert({
          display_name: displayName,
          creator_code: creatorCode,
          api_token: hashedToken,
        })
        .select("id, display_name, creator_code, created_at")
        .single());
    }

    if (error || !creator) {
      console.error("Failed to create creator:", error);
      return NextResponse.json(
        { error: "Failed to create account" },
        { status: 500 }
      );
    }

    const response = NextResponse.json(
      {
        ...creator,
        api_token: rawToken, // Return raw token only on creation
      },
      { status: 201 }
    );
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
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
}
