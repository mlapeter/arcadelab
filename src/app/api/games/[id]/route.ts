import { NextRequest, NextResponse, after } from "next/server";
import { supabase } from "@/lib/supabase";
import { authenticateCreator } from "@/lib/auth";
import {
  scanGameContent,
  isCreatorCodeMessage,
  explainNotHtml,
  MAX_HTML_SIZE,
  MAX_TITLE_LENGTH,
  MAX_DESCRIPTION_LENGTH,
} from "@/lib/safety";
import { moderateAndApply, checkScamFingerprint } from "@/lib/moderation";
import { logDecision } from "@/lib/decisions";
import { scrubCreatorCodes } from "@/lib/creator-codes";
import { VALID_LIBRARY_KEYS } from "@/lib/libraries";
import {
  VALID_COLORS,
  stripHeaderCreatorCode,
  type GameColor,
} from "@/lib/parse-game";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import crypto from "crypto";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const { data: game, error } = await supabase
    .from("games")
    .select("id, slug, title, description, creator_id, libraries, play_count, like_count, emoji, color, status, created_at")
    .eq("id", id)
    .single();

  if (error || !game) {
    return NextResponse.json({ error: "Game not found" }, { status: 404 });
  }

  const { data: creator } = await supabase
    .from("creators")
    .select("display_name")
    .eq("id", game.creator_id)
    .single();

  return NextResponse.json({
    ...game,
    creator_name: creator?.display_name || "Unknown",
  });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!rateLimit(getClientIp(request))) {
    return NextResponse.json({ error: "Too many requests — slow down!" }, { status: 429 });
  }

  const { id } = await params;

  try {
    const creator = await authenticateCreator(
      request.headers.get("authorization")
    );

    const body = await request.json();

    // Strip the header creator_code line before the html can reach storage
    // (same non-negotiable as publish); it also works as an identity fallback.
    const stripped =
      typeof body.html === "string"
        ? stripHeaderCreatorCode(body.html)
        : { html: body.html, creatorCode: undefined };

    let creatorId = creator?.id;
    let creatorTrust = creator?.trust;

    for (const code of [body.creator_code, stripped.creatorCode]) {
      if (creatorId || !code) continue;
      const { data } = await supabase
        .from("creators")
        .select("id, trust")
        .eq("creator_code", code)
        .single();

      if (data) {
        creatorId = data.id;
        creatorTrust = data.trust;
      }
    }

    if (!creatorId) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // Banned creators can't publish updates either. Neutral message — 200 +
    // error like other expected outcomes, so the web form's ban panel renders
    // without a console error.
    if (creatorTrust === "banned") {
      return NextResponse.json({
        error:
          "Publishing isn't available for this account. Think this was a mistake? Tell us at arcadelab.ai/appeal",
        banned: true,
      });
    }

    // Verify game exists and creator owns it
    const { data: game } = await supabase
      .from("games")
      .select("id, slug, creator_id")
      .eq("id", id)
      .single();

    if (!game) {
      return NextResponse.json({ error: "Game not found" }, { status: 404 });
    }

    if (game.creator_id !== creatorId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const html = stripped.html;
    if (!html || typeof html !== "string") {
      return NextResponse.json({ error: "Game HTML is required" }, { status: 400 });
    }

    if (new TextEncoder().encode(html).length > MAX_HTML_SIZE) {
      return NextResponse.json({ error: "Game code is too large (max 500KB)" }, { status: 400 });
    }

    // Same friendly guards as publish: no creator-code messages, no non-HTML.
    if (isCreatorCodeMessage(html)) {
      return NextResponse.json(
        {
          error:
            "That looks like your creator code message — keep it private! It's how you publish. Paste your game's HTML code here instead.",
        },
        { status: 400 }
      );
    }
    const notHtml = explainNotHtml(html);
    if (notHtml) {
      return NextResponse.json({ error: notHtml }, { status: 400 });
    }

    // Code-shaped tokens never belong in a title or description.
    const title = scrubCreatorCodes(body.title?.trim() || "") || undefined;
    const description =
      body.description !== undefined
        ? scrubCreatorCodes(body.description?.trim() || "") || null
        : undefined;
    const libraries = body.libraries
      ? (body.libraries as string[]).filter((l) => VALID_LIBRARY_KEYS.includes(l))
      : undefined;
    const emoji = body.emoji?.trim() || undefined;
    const color = VALID_COLORS.includes(body.color as GameColor) ? body.color : undefined;

    if (title && title.length > MAX_TITLE_LENGTH) {
      return NextResponse.json({ error: `Title must be under ${MAX_TITLE_LENGTH} characters` }, { status: 400 });
    }

    if (description && description.length > MAX_DESCRIPTION_LENGTH) {
      return NextResponse.json({ error: `Description must be under ${MAX_DESCRIPTION_LENGTH} characters` }, { status: 400 });
    }

    const scanResult = scanGameContent(html);
    if (!scanResult.safe) {
      return NextResponse.json({
        error: "Game code contains blocked patterns",
        warnings: scanResult.warnings,
      }, { status: 400 });
    }

    const contentHash = crypto.createHash("sha256").update(html).digest("hex");

    // Update game content
    const { error: contentError } = await supabase
      .from("game_content")
      .update({ html, content_hash: contentHash })
      .eq("game_id", game.id);

    if (contentError) {
      return NextResponse.json({ error: "Failed to update game content" }, { status: 500 });
    }

    // Update game metadata
    const gameUpdate: Record<string, unknown> = { updated_at: new Date().toISOString() };
    if (title) gameUpdate.title = title;
    if (description !== undefined) gameUpdate.description = description;
    if (libraries) gameUpdate.libraries = libraries;
    if (emoji) gameUpdate.emoji = emoji;
    if (color) gameUpdate.color = color;

    const { data: updatedGame, error: gameError } = await supabase
      .from("games")
      .update(gameUpdate)
      .eq("id", game.id)
      .select("id, slug, title")
      .single();

    if (gameError) {
      return NextResponse.json({ error: "Failed to update game" }, { status: 500 });
    }

    // Re-moderate after the response — closes the publish-clean-then-edit-to-scam
    // gap. Fingerprint-matched content (a confirmed scam edited into an existing
    // game) is hidden immediately, pre-AI.
    const ownerId = creatorId;
    if (await checkScamFingerprint(html)) {
      await supabase
        .from("games")
        .update({ status: "hidden", flag_reason: "fingerprint" })
        .eq("id", game.id);
      after(() =>
        logDecision("fingerprint_hide", { gameId: game.id, creatorId: ownerId })
      );
    } else {
      after(async () => {
        await moderateAndApply(game.id, {
          title: updatedGame.title,
          description: description ?? null,
          html,
          emoji: emoji ?? null,
          creatorId: ownerId,
        });
      });
    }

    return NextResponse.json({
      id: updatedGame.id,
      slug: updatedGame.slug,
      url: `https://arcadelab.ai/play/${updatedGame.slug}`,
      title: updatedGame.title,
    });
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!rateLimit(getClientIp(request))) {
    return NextResponse.json({ error: "Too many requests — slow down!" }, { status: 429 });
  }

  const { id } = await params;

  const creator = await authenticateCreator(
    request.headers.get("authorization")
  );

  let creatorId = creator?.id;

  // Also support creator_code auth for web form
  if (!creatorId) {
    try {
      const body = await request.json();
      if (body.creator_code) {
        const { data } = await supabase
          .from("creators")
          .select("id")
          .eq("creator_code", body.creator_code)
          .single();

        if (data) creatorId = data.id;
      }
    } catch {
      // No body or invalid JSON — that's fine
    }
  }

  if (!creatorId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Verify ownership
  const { data: game } = await supabase
    .from("games")
    .select("creator_id")
    .eq("id", id)
    .single();

  if (!game) {
    return NextResponse.json({ error: "Game not found" }, { status: 404 });
  }

  if (game.creator_id !== creatorId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { error } = await supabase.from("games").delete().eq("id", id);

  if (error) {
    return NextResponse.json({ error: "Failed to delete game" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
