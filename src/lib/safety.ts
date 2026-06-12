// Only block patterns that are clearly malicious.
// The real security comes from iframe sandbox="allow-scripts" (no allow-same-origin
// for preview) and a separate subdomain (play.arcadelab.ai) for production renders.
// CSP headers (connect-src 'none', form-action 'none') add another layer. These
// patterns are a lightweight first pass to catch obviously bad intent — not a
// security boundary.
import { extractPastedCode } from "./creator-codes";

const BLOCKED_PATTERNS: { pattern: RegExp; reason: string }[] = [
  // Crypto mining
  { pattern: /CoinHive/i, reason: "Crypto mining" },
  { pattern: /crypto-?mine/i, reason: "Crypto mining" },

  // Parent frame escape attempts
  { pattern: /window\.parent/i, reason: "Parent window access" },
  { pattern: /window\.top\b/i, reason: "Top window access" },
  { pattern: /window\.opener/i, reason: "Opener window access" },
  { pattern: /parent\.postMessage/i, reason: "Parent frame messaging" },

  // Cookie theft (localStorage/sessionStorage are fine — sandbox blocks access anyway)
  { pattern: /document\.cookie/i, reason: "Cookie access" },

  // Redirect/exfiltration
  { pattern: /<meta[^>]+http-equiv\s*=\s*["']?refresh/i, reason: "Meta redirect" },
  { pattern: /<form[^>]+action\s*=\s*["']?https?:/i, reason: "External form action" },
];

export interface ScanResult {
  safe: boolean;
  warnings: string[];
}

export function scanGameContent(html: string): ScanResult {
  const warnings: string[] = [];

  for (const { pattern, reason } of BLOCKED_PATTERNS) {
    if (pattern.test(html)) {
      warnings.push(reason);
    }
  }

  warnings.push(...detectInfiniteLoops(html));

  return {
    safe: warnings.length === 0,
    warnings,
  };
}

// --- Infinite loop detection ---

/** Extract text content from all <script> tags in the HTML. */
function extractScriptContent(html: string): string[] {
  const scripts: string[] = [];
  const re = /<script\b[^>]*>([\s\S]*?)<\/script>/gi;
  let m;
  while ((m = re.exec(html)) !== null) {
    scripts.push(m[1]);
  }
  return scripts;
}

/**
 * Starting from an opening brace at `start`, walk brace depth to extract
 * the full body (including nested braces). Returns the content between the
 * outer braces, or null if unbalanced.
 */
function extractBracedBody(code: string, start: number): string | null {
  if (code[start] !== "{") return null;
  let depth = 1;
  let i = start + 1;
  while (i < code.length && depth > 0) {
    if (code[i] === "{") depth++;
    else if (code[i] === "}") depth--;
    i++;
  }
  if (depth !== 0) return null;
  return code.slice(start + 1, i - 1);
}

const ESCAPE_PATTERNS = [
  /\bbreak\b/,
  /\breturn\b/,
  /\bawait\b/,
  /\byield\b/,
  /\brequestAnimationFrame\b/,
  /\bsetTimeout\b/,
  /\bsetInterval\b/,
  /\bthrow\b/,
];

/** Check whether a loop body contains any mechanism that could exit or yield. */
function hasEscapeInBody(body: string): boolean {
  return ESCAPE_PATTERNS.some((p) => p.test(body));
}

/**
 * Scan HTML for likely infinite loops. Returns an array of warning strings
 * (empty if nothing suspicious found).
 *
 * Detects:
 * 1. Always-true loops (while(true), for(;;)) with no escape mechanism
 * 2. for-loops where the counter moves the wrong direction relative to
 *    the condition (e.g. `i > 3; i++` or `i < 10; i--`)
 */
export function detectInfiniteLoops(html: string): string[] {
  const warnings: string[] = [];
  const scripts = extractScriptContent(html);

  for (const script of scripts) {
    // 1. Always-true loops: while(true), while(1), for(;;), for(;true;), for(;1;)
    const alwaysTrue =
      /\b(?:while\s*\(\s*(?:true|1)\s*\)|for\s*\(\s*;?\s*(?:true|1)?\s*;\s*\))\s*\{/g;
    let m;
    while ((m = alwaysTrue.exec(script)) !== null) {
      const braceIdx = script.indexOf("{", m.index);
      const body = extractBracedBody(script, braceIdx);
      if (body !== null && !hasEscapeInBody(body)) {
        warnings.push("Potential infinite loop (always-true loop with no exit)");
        break;
      }
    }

    // 2. for-loops where counter goes wrong direction
    // Capture the full update expression to parse direction from it
    const forLoop =
      /\bfor\s*\(\s*(?:var|let|const)?\s*(\w+)\s*=\s*[\w.]+\s*;\s*(\w+)\s*([<>]=?)\s*[\w.]+\s*;\s*([^)]+)\)\s*\{/g;
    while ((m = forLoop.exec(script)) !== null) {
      const [, initVar, condVar, operator, rawUpdate] = m;
      const update = rawUpdate.trim();

      // Extract the variable being updated
      const updateVarMatch = update.match(/^(\w+)/);
      if (!updateVarMatch) continue;
      const updateVar = updateVarMatch[1];

      // All three parts must reference the same variable
      if (initVar !== condVar || initVar !== updateVar) continue;

      const braceIdx = script.indexOf("{", m.index);
      const body = extractBracedBody(script, braceIdx);
      if (body !== null && hasEscapeInBody(body)) continue;

      // Determine update direction from various patterns:
      // i++, i--, i += N, i -= N, i = i + N, i = i - N
      let direction: "up" | "down" | null = null;
      if (/\+\+$/.test(update) || /\+=\s*\d/.test(update)) {
        direction = "up";
      } else if (/--$/.test(update) || /-=\s*\d/.test(update)) {
        direction = "down";
      } else {
        // Match: IDENT = IDENT + EXPR or IDENT = IDENT - EXPR
        const assignMatch = update.match(
          /^\w+\s*=\s*\w+\s*([+-])\s*/
        );
        if (assignMatch) {
          direction = assignMatch[1] === "+" ? "up" : "down";
        }
      }

      if (direction === null) continue;

      // Check for mismatch: counting up but condition needs smaller, or vice versa
      const condNeedsSmaller = operator === "<" || operator === "<=";
      const condNeedsLarger = operator === ">" || operator === ">=";

      if (
        (direction === "up" && condNeedsLarger) ||
        (direction === "down" && condNeedsSmaller)
      ) {
        warnings.push(
          "Potential infinite loop (counter moves away from exit condition)"
        );
        break;
      }
    }
  }

  return warnings;
}

export const MAX_HTML_SIZE = 500 * 1024; // 500 KB
export const MAX_TITLE_LENGTH = 60;
export const MAX_DESCRIPTION_LENGTH = 280;

// --- "That's not a game" detection ---
// The paste box receives things that aren't games: a kid pasting back their
// creator-code reminder message, or code in a language browsers can't run.
// Both deserve a friendly pointer instead of a confusing failure. Used by
// both the publish form (client) and the API (server) — keep these pure.

/** Does the text contain anything that looks like a real HTML tag? */
function looksLikeHtml(text: string): boolean {
  return (
    /<(!doctype|html|head|body|script|style|canvas|div|svg|main|section|h[1-6]|button|img)\b/i.test(text) ||
    /<\/[a-z][a-z0-9]*>/i.test(text) // any closing tag (covers <pre>, <table>, ...)
  );
}

/** Strip the ARCADELAB/KIDHUBB metadata header so only the game code is judged. */
function withoutHeader(text: string): string {
  return text.replace(/<!--\s*(ARCADELAB|KIDHUBB)[\s\S]*?-->/i, "").trim();
}

/**
 * A pasted creator-code message ("My ArcadeLab creator code is WORD-WORD-WORD-12...")
 * or a bare code, instead of game code. Detection is shared with the rest of the
 * site via findCreatorCodes (word-list validated, typo-tolerant) — never the case
 * that the publish box and the moderation pipeline disagree about what a code is.
 * The message must never be echoed back or published.
 */
export function isCreatorCodeMessage(text: string): boolean {
  if (looksLikeHtml(text)) return false;
  if (extractPastedCode(text)) return true;
  // The classic reminder phrasing, even with a mangled/extra code in it.
  return /creator\s+code[\s\S]{0,40}?\b[A-Za-z]+-[A-Za-z]+-[A-Za-z]+-\d+\b/.test(text);
}

/**
 * If the paste isn't HTML at all (pygame, a bare JS module, plain text...),
 * returns an encouraging explanation an AI assistant can act on. Returns null
 * when the content looks like an HTML document.
 */
export function explainNotHtml(text: string): string | null {
  const code = withoutHeader(text);
  if (looksLikeHtml(code)) return null;

  const intro =
    "ArcadeLab runs single-file HTML games: one .html file with the JavaScript in <script> tags and CSS in <style> tags, drawing to the page or a <canvas>.";
  const outro =
    "Ask your AI assistant to convert it into one complete HTML file, then paste that here — you're close!";

  if (/\bimport\s+pygame\b|\bpygame\./.test(code)) {
    return `This looks like Python (pygame) — awesome start! Browsers can't run Python, though. ${intro} ${outro}`;
  }
  if (/^\s*(import\s+\w|from\s+\w+\s+import)\b/m.test(code) && /\bdef\s+\w+\s*\(/.test(code)) {
    return `This looks like Python code — nice work! Browsers can't run Python directly. ${intro} ${outro}`;
  }
  if (/^\s*(import\s+.+from\s+['"]|export\s+(default|const|function))/m.test(code)) {
    return `This looks like a JavaScript module, but ArcadeLab needs everything in one HTML file. ${intro} Put your JavaScript inside a <script> tag in the HTML (no import/export). ${outro}`;
  }
  return `Hmm, this doesn't look like HTML game code yet. ${intro} ${outro}`;
}
