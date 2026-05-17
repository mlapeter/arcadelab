/**
 * One-time / periodic AI moderation backfill for games already on the site.
 *
 * New games are moderated automatically at publish/edit time (see
 * src/lib/moderation.ts, called via after()). This script applies the same
 * Claude Haiku check to *existing* games and computes their /play ranking
 * score. A non-"safe" verdict shadow-hides the game (status 'hidden') for
 * owner review at /admin.
 *
 * Usage:
 *   node scripts/moderate-games.mjs            # games not yet moderated
 *   node scripts/moderate-games.mjs --all      # re-moderate every game (AI)
 *   node scripts/moderate-games.mjs --rescore  # no AI — just refresh scores
 *   node scripts/moderate-games.mjs slug-a slug-b   # specific slugs
 *
 * Requires NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, and
 * ANTHROPIC_API_KEY in .env.local.
 */
import fs from "node:fs";
import { createClient } from "@supabase/supabase-js";

// --- env (standalone scripts don't get Next.js's .env.local loading) -------
for (const line of fs.readFileSync(new URL("../.env.local", import.meta.url), "utf8").split("\n")) {
  const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2].trim();
}
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY;
if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error("Missing Supabase env vars in .env.local");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY);
const MODEL = "claude-haiku-4-5-20251001";
const MAX_HTML_CHARS = 12000;

const args = process.argv.slice(2);
const recaptureAll = args.includes("--all");
const rescoreOnly = args.includes("--rescore");
const explicitSlugs = args.filter((a) => !a.startsWith("--"));

if (!rescoreOnly && !ANTHROPIC_KEY) {
  console.error("Missing ANTHROPIC_API_KEY in .env.local (needed unless --rescore)");
  process.exit(1);
}

// Mirrors src/lib/moderation.ts — kept in sync by hand (small + rarely changes).
const SYSTEM_PROMPT = `You are a content moderator for ArcadeLab, a site where anyone — including kids — publishes single-file HTML games, visualizations, and interactive experiments. Your job is to catch genuinely harmful or deceptive submissions, not to judge skill.

Respond with ONLY a JSON object: {"verdict","quality","confidence","note"}.

verdict:
- "safe": a real game, visualization, interactive thing, OR a harmless beginner test/experiment.
- "scam": phishing, fake gift cards, fake login/verification pages, brand impersonation, "verify your identity", crypto or giveaway scams.
- "adult": sexual or graphic content inappropriate for a kid-friendly site.
- "spam": ads, SEO spam, link farms, or content with no interactive purpose.

quality:
- "broken": empty, errors immediately, or an abandoned non-functional test.
- "basic": simple but works — totally fine.
- "good": polished and complete.

confidence: 0.0-1.0 — how sure you are of the verdict.
note: one short sentence explaining the verdict.

IMPORTANT: a simple, silly, or unpolished game from a beginner is "safe" + "basic". Never label it "spam" or "broken". Reserve "scam"/"adult"/"spam" for content that is genuinely deceptive or harmful.`;

const QUALITY_BASE = { good: 3, basic: 1, broken: -3 };
// Mirrors src/lib/moderation.ts: a scam at/above this confidence is removed
// and its creator banned; weaker verdicts are only hidden for review.
const AUTO_REMOVE_CONFIDENCE = 0.85;

/** Quality bucket + engagement → the /play ranking score. */
function qualityScore(quality, playCount, likeCount) {
  const base = QUALITY_BASE[quality] ?? 1;
  const engagement = (likeCount || 0) * 0.5 + Math.log10((playCount || 0) + 1);
  return Math.round((base + engagement) * 100) / 100;
}

/** Calls Haiku to classify one game. Returns the parsed result or null. */
async function moderate(title, description, html) {
  const clipped =
    html.length > MAX_HTML_CHARS ? html.slice(0, MAX_HTML_CHARS) + "\n…(truncated)" : html;
  const userMessage = [
    `Title: ${title}`,
    `Description: ${description || "(none)"}`,
    "",
    "HTML:",
    clipped,
  ].join("\n");

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": ANTHROPIC_KEY,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 300,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: userMessage }],
    }),
  });
  if (!res.ok) throw new Error(`Anthropic API ${res.status}`);

  const data = await res.json();
  const text = data?.content?.[0]?.text || "";
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start === -1 || end === -1) throw new Error("no JSON in response");

  const raw = JSON.parse(text.slice(start, end + 1));
  return {
    verdict: ["safe", "scam", "adult", "spam"].includes(raw.verdict) ? raw.verdict : "safe",
    quality: ["broken", "basic", "good"].includes(raw.quality) ? raw.quality : "basic",
    confidence: typeof raw.confidence === "number" ? Math.min(1, Math.max(0, raw.confidence)) : 0.5,
    note: typeof raw.note === "string" ? raw.note.slice(0, 200) : "",
  };
}

// --- main ------------------------------------------------------------------
let query = supabase
  .from("games")
  .select("id, slug, title, description, creator_id, play_count, like_count, status, moderation, game_content(html)")
  .eq("status", "active");
if (explicitSlugs.length) query = query.in("slug", explicitSlugs);

const { data: games, error } = await query;
if (error) {
  console.error("Failed to load games:", error.message);
  process.exit(1);
}

// --rescore: recompute quality_score from stored moderation, no AI calls.
if (rescoreOnly) {
  let n = 0;
  for (const g of games) {
    const score = qualityScore(g.moderation?.quality, g.play_count, g.like_count);
    await supabase.from("games").update({ quality_score: score }).eq("id", g.id);
    n++;
  }
  console.log(`Rescored ${n} game(s).`);
  process.exit(0);
}

const todo =
  recaptureAll || explicitSlugs.length ? games : games.filter((g) => !g.moderation);
console.log(`Moderating ${todo.length} game(s)...`);

let ok = 0;
let removed = 0;
let hidden = 0;
let fail = 0;
for (const g of todo) {
  const gc = g.game_content;
  const html = (Array.isArray(gc) ? gc[0]?.html : gc?.html) || "";
  try {
    const result = await moderate(g.title, g.description, html);
    const score = qualityScore(result.quality, g.play_count, g.like_count);
    const update = {
      moderation: { ...result, model: MODEL, checked_at: new Date().toISOString() },
      quality_score: score,
    };
    let tag = "✓";
    if (result.verdict === "scam" && result.confidence >= AUTO_REMOVE_CONFIDENCE) {
      // High-confidence scam: remove the game, ban the creator, hide their rest.
      update.status = "removed";
      update.flag_reason = "ai:scam";
      await supabase.from("games").update(update).eq("id", g.id);
      if (g.creator_id) {
        await supabase.from("creators").update({ trust: "banned" }).eq("id", g.creator_id);
        await supabase
          .from("games")
          .update({ status: "hidden", flag_reason: "creator-banned" })
          .eq("creator_id", g.creator_id)
          .eq("status", "active");
      }
      removed++;
      tag = "⛔ REMOVED+BANNED";
    } else if (result.verdict !== "safe") {
      update.status = "hidden";
      update.flag_reason = `ai:${result.verdict}`;
      await supabase.from("games").update(update).eq("id", g.id);
      hidden++;
      tag = "🚩 HIDDEN";
    } else {
      await supabase.from("games").update(update).eq("id", g.id);
    }
    ok++;
    console.log(`  ${tag} ${g.slug} — ${result.verdict}/${result.quality} (score ${score})`);
  } catch (e) {
    fail++;
    console.log(`  ✗ ${g.slug} — ${e?.message || e}`);
  }
}
console.log(`Done. ${ok} moderated, ${removed} removed, ${hidden} hidden, ${fail} failed.`);
