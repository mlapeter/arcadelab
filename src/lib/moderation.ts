// AI content moderation. A single cheap Claude Haiku call classifies a
// submission for *deceptive content* (scams, phishing, adult, spam) — the
// thing static code scanning in safety.ts fundamentally cannot catch — and
// also returns a coarse quality bucket used for /play ranking.
//
// Fail-open by design: any error (missing key, API hiccup, bad JSON) returns
// null and the caller leaves the game live. Moderation is a backstop, not a
// publish gate — a real creator's URL must never break because the API is down.
import { supabase } from "@/lib/supabase";

const MODEL = "claude-haiku-4-5-20251001";
const API_URL = "https://api.anthropic.com/v1/messages";
const MAX_HTML_CHARS = 12000;

export interface ModerationResult {
  /** safe = a genuine game / harmless experiment; the rest are removable. */
  verdict: "safe" | "scam" | "adult" | "spam";
  /** Coarse quality bucket — feeds /play ranking, never hides a game. */
  quality: "broken" | "basic" | "good";
  confidence: number; // 0..1
  note: string;
}

interface ModerationInput {
  title: string;
  description: string | null;
  html: string;
}

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

/** Calls Haiku to classify a submission. Returns null on any failure. */
export async function moderateContent(
  input: ModerationInput
): Promise<ModerationResult | null> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return null;

  const html =
    input.html.length > MAX_HTML_CHARS
      ? input.html.slice(0, MAX_HTML_CHARS) + "\n…(truncated)"
      : input.html;

  const userMessage = [
    `Title: ${input.title}`,
    `Description: ${input.description || "(none)"}`,
    "",
    "HTML:",
    html,
  ].join("\n");

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
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

    if (!res.ok) return null;

    const data = await res.json();
    const text: string = data?.content?.[0]?.text || "";
    return parseResult(text);
  } catch {
    return null;
  }
}

/** Leniently extract the JSON object from the model's reply. */
function parseResult(text: string): ModerationResult | null {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start === -1 || end === -1 || end <= start) return null;

  try {
    const raw = JSON.parse(text.slice(start, end + 1));
    const verdict = ["safe", "scam", "adult", "spam"].includes(raw.verdict)
      ? raw.verdict
      : "safe";
    const quality = ["broken", "basic", "good"].includes(raw.quality)
      ? raw.quality
      : "basic";
    const confidence =
      typeof raw.confidence === "number"
        ? Math.min(1, Math.max(0, raw.confidence))
        : 0.5;
    return {
      verdict,
      quality,
      confidence,
      note: typeof raw.note === "string" ? raw.note.slice(0, 200) : "",
    };
  } catch {
    return null;
  }
}

// Base quality contribution to a game's /play ranking score. Engagement
// (plays, likes) is layered on top by the rescore pass in moderate-games.mjs.
const QUALITY_BASE: Record<string, number> = { good: 3, basic: 1, broken: -3 };

/**
 * Records a moderation result on a game. A non-"safe" verdict auto-shadow-hides
 * the game (still playable by link, off all discovery) for owner review — but
 * only if it's currently 'active', so this never resurrects a removed game.
 */
export async function applyModeration(gameId: string, result: ModerationResult) {
  await supabase
    .from("games")
    .update({
      moderation: { ...result, model: MODEL, checked_at: new Date().toISOString() },
      quality_score: QUALITY_BASE[result.quality] ?? 1,
    })
    .eq("id", gameId);

  if (result.verdict !== "safe") {
    await supabase
      .from("games")
      .update({ status: "hidden", flag_reason: `ai:${result.verdict}` })
      .eq("id", gameId)
      .eq("status", "active");
  }
}
