/**
 * Backfills missing descriptions/emoji for games already on the site.
 *
 * New games get AI-generated fallbacks automatically at publish time (see
 * src/lib/moderation.ts — the same Haiku moderation call also returns a
 * kid-friendly description and an emoji when the creator left them blank).
 * This script runs that same call for *existing* active games missing either
 * field. It only fills blanks — it never touches status, moderation, or
 * quality_score (scripts/moderate-games.mjs owns those), and it never
 * overwrites a creator's own words.
 *
 * DRY-RUN BY DEFAULT: prints proposals and writes nothing. Pass --apply to
 * actually fill in the missing columns.
 *
 * Usage:
 *   node scripts/backfill-descriptions.mjs              # dry run, all games
 *   node scripts/backfill-descriptions.mjs --limit 5    # dry run, first 5
 *   node scripts/backfill-descriptions.mjs --apply      # write the blanks
 *   node scripts/backfill-descriptions.mjs slug-a slug-b  # specific slugs
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
if (!ANTHROPIC_KEY) {
  console.error("Missing ANTHROPIC_API_KEY in .env.local");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY);
const MODEL = "claude-haiku-4-5-20251001";
const MAX_HTML_CHARS = 12000;

const args = process.argv.slice(2);
const apply = args.includes("--apply");
const limitIdx = args.indexOf("--limit");
const limit = limitIdx !== -1 ? parseInt(args[limitIdx + 1], 10) || 0 : 0;
const explicitSlugs = args.filter(
  (a, i) => !a.startsWith("--") && (limitIdx === -1 || i !== limitIdx + 1)
);

// Mirrors src/lib/moderation.ts — kept in sync by hand (small + rarely changes).
// It's the same moderation call; this script just uses different fields of it.
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

/**
 * Calls Haiku, asking only for the fallback fields this game is missing.
 * Mirrors moderateContent() in src/lib/moderation.ts; returns {description?, emoji?}.
 */
async function generateFallbacks(title, description, emoji, html) {
  const clipped =
    html.length > MAX_HTML_CHARS ? html.slice(0, MAX_HTML_CHARS) + "\n…(truncated)" : html;

  const extras = [];
  if (!description) {
    extras.push(
      'The creator left the description blank. Also include a "description" field: one kid-friendly sentence (under 100 characters) telling players what they get to do.'
    );
  }
  if (!emoji) {
    extras.push('Also include an "emoji" field: one single emoji that fits the game.');
  }

  const userMessage = [
    `Title: ${title}`,
    `Description: ${description || "(none)"}`,
    ...(extras.length ? ["", ...extras] : []),
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
  if (start === -1 || end === -1 || end <= start) throw new Error("no JSON in response");

  // Same lenient clipping as parseResult() in src/lib/moderation.ts. The reply
  // also carries verdict/quality — deliberately ignored here; moderate-games.mjs
  // owns status/moderation/quality_score.
  const raw = JSON.parse(text.slice(start, end + 1));
  const out = {};
  if (typeof raw.description === "string" && raw.description.trim()) {
    out.description = raw.description.trim().slice(0, 150);
  }
  if (typeof raw.emoji === "string" && raw.emoji.trim()) {
    out.emoji = [...raw.emoji.trim()].slice(0, 2).join(""); // one emoji (may be 2 code points)
  }
  return out;
}

// --- main ------------------------------------------------------------------
let query = supabase
  .from("games")
  .select("id, slug, title, description, emoji, game_content(html)")
  .eq("status", "active")
  .or("description.is.null,emoji.is.null");
if (explicitSlugs.length) query = query.in("slug", explicitSlugs);
if (limit > 0) query = query.limit(limit);

const { data: games, error } = await query;
if (error) {
  console.error("Failed to load games:", error.message);
  process.exit(1);
}

console.log(
  `${apply ? "Backfilling" : "Dry run (pass --apply to write):"} ${games.length} game(s) missing description and/or emoji...`
);

let ok = 0;
let fail = 0;
for (const g of games) {
  const gc = g.game_content;
  const html = (Array.isArray(gc) ? gc[0]?.html : gc?.html) || "";
  try {
    const result = await generateFallbacks(g.title, g.description, g.emoji, html);
    const wantDesc = !g.description;
    const wantEmoji = !g.emoji;
    const descNote = wantDesc ? `"${result.description || "(none returned)"}"` : "(keeps creator's)";
    const emojiNote = wantEmoji ? result.emoji || "(none returned)" : "(keeps creator's)";

    if (apply) {
      // Only ever fill blanks — never overwrite a creator's words.
      if (wantDesc && result.description) {
        await supabase
          .from("games")
          .update({ description: result.description })
          .eq("id", g.id)
          .is("description", null);
      }
      if (wantEmoji && result.emoji) {
        await supabase
          .from("games")
          .update({ emoji: result.emoji })
          .eq("id", g.id)
          .is("emoji", null);
      }
    }

    ok++;
    console.log(`  ✓ ${g.slug} — description ${descNote} / emoji ${emojiNote}`);
  } catch (e) {
    fail++;
    console.log(`  ✗ ${g.slug} — ${e?.message || e}`);
  }
}
console.log(`Done. ${ok} ${apply ? "backfilled" : "proposed"}, ${fail} failed.${apply ? "" : " Nothing was written."}`);
