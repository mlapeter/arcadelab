import { NextRequest, NextResponse, after } from "next/server";
import { supabase } from "@/lib/supabase";
import { authenticateCreator } from "@/lib/auth";
import { generateSlug } from "@/lib/slug";
import {
  scanGameContent,
  isCreatorCodeMessage,
  explainNotHtml,
  MAX_HTML_SIZE,
  MAX_TITLE_LENGTH,
  MAX_DESCRIPTION_LENGTH,
} from "@/lib/safety";
import { moderateAndApply, checkScamFingerprint } from "@/lib/moderation";
import { logDecision, maybeProposeMerge } from "@/lib/decisions";
import { scrubCreatorCodes } from "@/lib/creator-codes";
import { VALID_LIBRARY_KEYS } from "@/lib/libraries";
import {
  VALID_COLORS,
  parseGameHeader,
  stripHeaderCreatorCode,
  type GameColor,
} from "@/lib/parse-game";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import crypto from "crypto";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
  const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "20")));
  const sort = searchParams.get("sort") || "newest";
  const q = (searchParams.get("q") || "").trim().slice(0, 100);
  const offset = (page - 1) * limit;

  let orderColumn = "created_at";
  if (sort === "popular") orderColumn = "play_count";
  if (sort === "liked") orderColumn = "like_count";
  if (sort === "best") orderColumn = "quality_score";

  let query = supabase
    .from("games")
    .select("id, slug, title, description, creator_id, libraries, play_count, like_count, emoji, color, thumbnail_url, preview_url, created_at", { count: "exact" })
    .eq("status", "active");

  if (q) {
    // Escape ilike wildcards so a kid typing "100%" searches literally.
    query = query.ilike("title", `%${q.replace(/[%_\\]/g, "\\$&")}%`);
  }

  query = query.order(orderColumn, { ascending: false });
  if (orderColumn !== "created_at") {
    // Stable tiebreaker so pagination never skips or repeats games.
    query = query.order("created_at", { ascending: false });
  }

  const { data: games, error, count } = await query.range(offset, offset + limit - 1);

  if (error) {
    return NextResponse.json({ error: "Failed to fetch games" }, { status: 500 });
  }

  // Fetch creator names for all games
  const creatorIds = [...new Set((games || []).map((g) => g.creator_id).filter(Boolean))];
  let creatorsMap: Record<string, string> = {};

  if (creatorIds.length > 0) {
    const { data: creators } = await supabase
      .from("creators")
      .select("id, display_name")
      .in("id", creatorIds);

    if (creators) {
      creatorsMap = Object.fromEntries(creators.map((c) => [c.id, c.display_name]));
    }
  }

  const gamesWithCreators = (games || []).map((game) => ({
    ...game,
    creator_name: creatorsMap[game.creator_id] || "Unknown",
  }));

  return NextResponse.json({
    games: gamesWithCreators,
    total: count || 0,
    page,
    limit,
  });
}

// --- Rapid-duplicate detection ---
// A kid (or their AI) re-submitting the same title within minutes is a retry,
// not a new game — we update the existing game instead of creating a twin.

// Same title ignoring case, punctuation, and extra whitespace — and nothing
// fuzzier. "Snake" vs "Snake 2" is a kid making a sequel, not a retry, and
// merging those would silently destroy the first game.
const normalizeTitle = (t: string) =>
  t.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, " ").trim();

function isNearSameTitle(a: string, b: string): boolean {
  const na = normalizeTitle(a);
  return na.length > 0 && na === normalizeTitle(b);
}

export async function POST(request: NextRequest) {
  const clientIp = getClientIp(request);
  if (!rateLimit(clientIp)) {
    return NextResponse.json({ error: "Too many requests — slow down!" }, { status: 429 });
  }

  // Keyed hash of the submitter IP — a clustering signal for the admin queue,
  // never a stored raw IP. Keyed with the service key so it can't be reversed
  // from the public repo.
  const ipHash = crypto
    .createHmac("sha256", process.env.SUPABASE_SERVICE_ROLE_KEY || "salt")
    .update(clientIp)
    .digest("hex");

  try {
    const creator = await authenticateCreator(
      request.headers.get("authorization")
    );

    const body = await request.json();

    // An AI assistant may embed the kid's creator_code in the game header so
    // identity survives any browser. It's an identity signal only — the line
    // is ALWAYS stripped here, before the html goes anywhere near storage.
    // A creator code must never reach game_content, the render, or /source.
    const stripped =
      typeof body.html === "string"
        ? stripHeaderCreatorCode(body.html)
        : { html: body.html, creatorCode: undefined };
    const html = stripped.html;

    // Identity priority: API token > creator_code in body > header code.
    let creatorId = creator?.id;
    let creatorName = creator?.display_name;
    let creatorTrust = creator?.trust;

    for (const code of [body.creator_code, stripped.creatorCode]) {
      if (creatorId || !code) continue;
      const { data } = await supabase
        .from("creators")
        .select("id, display_name, trust")
        .eq("creator_code", code)
        .single();

      if (data) {
        creatorId = data.id;
        creatorName = data.display_name;
        creatorTrust = data.trust;
      }
    }

    if (!creatorId || !creatorName) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Banned creators can't publish. Neutral message — no need to advertise
    // it. banned:true lets the web form swap in the friendly ban panel with
    // its one-tap appeal.
    if (creatorTrust === "banned") {
      return NextResponse.json(
        {
          error:
            "Publishing isn't available for this account. Think this was a mistake? Tell us at arcadelab.ai/appeal",
          banned: true,
        },
        { status: 403 }
      );
    }

    // A direct API publish may send just { html } — the ARCADELAB header is
    // then the source of metadata, same as the paste box parses client-side.
    // Body fields win when both are present.
    const header = typeof html === "string" ? parseGameHeader(html) : ({} as ReturnType<typeof parseGameHeader>);

    // Code-shaped tokens never belong in a title or description.
    const title =
      scrubCreatorCodes((body.title ?? header.title)?.trim() || "") || "Untitled Game";
    const description =
      scrubCreatorCodes((body.description ?? header.description)?.trim() || "") || null;
    const libraries = (body.libraries || header.libraries || []).filter((l: string) =>
      VALID_LIBRARY_KEYS.includes(l)
    );
    const emoji = (body.emoji ?? header.emoji)?.trim() || null;
    const headerOrBodyColor = body.color ?? header.color;
    const color = VALID_COLORS.includes(headerOrBodyColor as GameColor)
      ? headerOrBodyColor
      : null;

    // Resolve remix_of slug to forked_from UUID
    const remixOfSlug = body.remix_of || header.remix_of || null;
    let forkedFrom: string | null = null;
    if (remixOfSlug) {
      const { data: original } = await supabase
        .from("games")
        .select("id")
        .eq("slug", remixOfSlug)
        .eq("status", "active")
        .single();
      if (original) forkedFrom = original.id;
    }

    // Validate
    if (title.length > MAX_TITLE_LENGTH) {
      return NextResponse.json(
        { error: `Title must be under ${MAX_TITLE_LENGTH} characters` },
        { status: 400 }
      );
    }

    if (description && description.length > MAX_DESCRIPTION_LENGTH) {
      return NextResponse.json(
        { error: `Description must be under ${MAX_DESCRIPTION_LENGTH} characters` },
        { status: 400 }
      );
    }

    if (!html || typeof html !== "string") {
      return NextResponse.json(
        { error: "Game HTML is required" },
        { status: 400 }
      );
    }

    if (new TextEncoder().encode(html).length > MAX_HTML_SIZE) {
      return NextResponse.json(
        { error: "Game code is too large (max 500KB)" },
        { status: 400 }
      );
    }

    // A pasted creator-code message isn't a game — and must never be echoed back.
    if (isCreatorCodeMessage(html)) {
      return NextResponse.json(
        {
          error:
            "That looks like a creator code, not a game! To sign in with it, paste it by itself at arcadelab.ai/publish. Paste your game's HTML code here instead — and keep your code private.",
        },
        { status: 400 }
      );
    }

    // Not HTML at all (Python, a bare JS module, plain text...) — explain kindly.
    const notHtml = explainNotHtml(html);
    if (notHtml) {
      return NextResponse.json({ error: notHtml }, { status: 400 });
    }

    // Safety scan
    const scanResult = scanGameContent(html);
    if (!scanResult.safe) {
      return NextResponse.json(
        {
          error: "Game code contains blocked patterns",
          warnings: scanResult.warnings,
        },
        { status: 400 }
      );
    }

    const contentHash = crypto.createHash("sha256").update(html).digest("hex");
    const publisherId = creatorId;

    // Confirmed-scam content never gets a second life: a fingerprint match
    // (normalized, so swapping the code or amounts doesn't dodge it) hides
    // the game on arrival, before any AI call. The direct link still works.
    const fingerprintMatched = await checkScamFingerprint(html);

    // Same creator + same/near-same title in the last 15 minutes → treat as an
    // update to that game, not a new one. (Skipped for the default "Untitled
    // Game" title — two quick untitled experiments shouldn't merge.)
    if (title !== "Untitled Game") {
      const fifteenMinAgo = new Date(Date.now() - 15 * 60 * 1000).toISOString();
      const { data: recent } = await supabase
        .from("games")
        .select("id, slug, title")
        .eq("creator_id", creatorId)
        .eq("status", "active")
        .gte("created_at", fifteenMinAgo);

      const existing = (recent || []).find((g) => isNearSameTitle(g.title, title));
      if (existing) {
        const { error: contentError } = await supabase
          .from("game_content")
          .update({ html, content_hash: contentHash })
          .eq("game_id", existing.id);
        const { error: gameError } = await supabase
          .from("games")
          .update({
            title,
            description,
            libraries,
            emoji,
            color,
            updated_at: new Date().toISOString(),
          })
          .eq("id", existing.id);
        if (contentError || gameError) {
          console.error("Failed to update recent duplicate:", contentError || gameError);
          return NextResponse.json(
            { error: "Failed to update your game — please try again" },
            { status: 500 }
          );
        }

        if (fingerprintMatched) {
          await supabase
            .from("games")
            .update({ status: "hidden", flag_reason: "fingerprint" })
            .eq("id", existing.id);
        }
        after(async () => {
          if (fingerprintMatched) {
            await logDecision("fingerprint_hide", {
              gameId: existing.id,
              creatorId: publisherId,
              data: { memory: true, ...fingerprintMatched },
            });
            return;
          }
          await moderateAndApply(existing.id, {
            title,
            description,
            html,
            emoji,
            creatorId: publisherId,
          });
        });

        return NextResponse.json(
          {
            id: existing.id,
            slug: existing.slug,
            url: `https://arcadelab.ai/play/${existing.slug}`,
            title,
            creator: creatorName,
            updated: true,
            message: `You published this game a few minutes ago, so we updated it instead of making a copy.`,
          },
          { status: 200 }
        );
      }
    }

    // Generate unique slug
    let slug = generateSlug(title, creatorName);
    const { data: existingSlug } = await supabase
      .from("games")
      .select("id")
      .eq("slug", slug)
      .single();

    if (existingSlug) {
      slug = `${slug}-${Date.now().toString(36)}`;
    }

    // Insert game
    const { data: game, error: gameError } = await supabase
      .from("games")
      .insert({
        slug,
        title,
        description,
        creator_id: creatorId,
        libraries,
        emoji,
        color,
        forked_from: forkedFrom,
        submit_ip_hash: ipHash,
        ...(fingerprintMatched ? { status: "hidden", flag_reason: "fingerprint" } : {}),
      })
      .select("id, slug, title, description, created_at")
      .single();

    if (gameError) {
      console.error("Failed to create game:", gameError);
      return NextResponse.json(
        { error: "Failed to publish game" },
        { status: 500 }
      );
    }

    // Insert game content
    const { error: contentError } = await supabase
      .from("game_content")
      .insert({
        game_id: game.id,
        html,
        content_hash: contentHash,
      });

    if (contentError) {
      // Rollback game creation
      await supabase.from("games").delete().eq("id", game.id);
      console.error("Failed to save game content:", contentError);
      return NextResponse.json(
        { error: "Failed to save game content" },
        { status: 500 }
      );
    }

    // AI moderation runs after the response is sent — publishing stays
    // instant. The same pass spots a same-device account split and proposes
    // a merge for the admin (a proposal only — games never move on their own).
    after(async () => {
      if (fingerprintMatched) {
        await logDecision("fingerprint_hide", {
          gameId: game.id,
          creatorId: publisherId,
          data: { memory: true, ...fingerprintMatched },
        });
        return;
      }
      await moderateAndApply(game.id, {
        title,
        description,
        html,
        emoji,
        creatorId: publisherId,
      });
      await maybeProposeMerge(publisherId, ipHash);
    });

    return NextResponse.json(
      {
        id: game.id,
        slug: game.slug,
        url: `https://arcadelab.ai/play/${game.slug}`,
        title: game.title,
        creator: creatorName,
        created_at: game.created_at,
      },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
}
