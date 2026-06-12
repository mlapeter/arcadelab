export const ADJECTIVES = [
  // Original
  "ROCKET", "PIXEL", "COSMIC", "TURBO", "MEGA", "SUPER", "HYPER", "ULTRA",
  "NEON", "SOLAR", "LUNAR", "ASTRO", "CYBER", "BLAZE", "FROST", "STORM",
  "THUNDER", "SHADOW", "CRYSTAL", "GOLDEN", "SILVER", "RUBY", "JADE", "CORAL",
  "CRIMSON", "AZURE", "VIOLET", "SCARLET", "AMBER", "EMERALD", "SWIFT",
  "BRAVE", "BOLD", "WILD", "EPIC", "LUCKY", "MAGIC", "NINJA", "LASER",
  "PHANTOM", "SPARK", "FLASH", "BLAZING", "FROZEN", "ELECTRIC", "ATOMIC",
  "QUANTUM", "PLASMA", "NOVA", "COMET", "ORBIT", "PRISM", "TITAN", "DRIFT",
  "GLITCH", "CHROME", "STEALTH", "MYSTIC", "RAPID", "SONIC", "FUSION",
  "VORTEX", "ECHO", "PULSE", "ZEN", "APEX", "OMEGA", "ALPHA", "DELTA",
  // Colors & materials
  "COPPER", "IRON", "COBALT", "ONYX", "IVORY", "OPAL", "PEARL", "BRONZE",
  "MARBLE", "VELVET", "SATIN", "MISTY", "DUSTY", "RUSTY", "SHINY", "GLOSSY",
  // Nature & weather
  "CLOUDY", "SUNNY", "WINDY", "RAINY", "SNOWY", "FOGGY", "ROCKY", "SANDY",
  "MOSSY", "LEAFY", "THORNY", "FROSTY", "STORMY", "BREEZY", "TROPICAL", "ARCTIC",
  // Personality & vibe
  "CLEVER", "SNEAKY", "MIGHTY", "TINY", "GIANT", "FIERCE", "GENTLE", "SILENT",
  "LOUD", "DIZZY", "FUZZY", "GOOFY", "JOLLY", "GRUMPY", "SLEEPY", "ZIPPY",
  "PEPPY", "SPICY", "CRISPY", "CHILL", "FUNKY", "GROOVY", "WACKY", "ZAPPY",
  // Tech & sci-fi
  "BINARY", "MATRIX", "VECTOR", "NEURAL", "PHOTON", "PROTON", "CARBON", "SILICON",
  "DIGITAL", "ANALOG", "SIGNAL", "STATIC", "CRYPTO", "WARP", "FLUX", "ZERO",
  // Action & movement
  "DASHING", "FLYING", "RACING", "DIVING", "RISING", "ROAMING", "DRIFTING", "SPINNING",
  "BOUNCING", "ROLLING", "SLIDING", "GLIDING", "SOARING", "CHARGING", "LEAPING", "ZOOMING",
];

export const NOUNS = [
  // Animals
  "WOLF", "DRAGON", "PHOENIX", "TIGER", "HAWK", "EAGLE", "FALCON", "PANTHER",
  "LION", "BEAR", "FOX", "OWL", "SHARK", "COBRA", "VIPER", "RAVEN",
  "PANDA", "KOALA", "OTTER", "BUNNY", "PENGUIN", "DOLPHIN", "TURTLE", "GECKO",
  "LYNX", "MOOSE", "BISON", "CRANE", "HERON", "PARROT", "TOUCAN", "MANTIS",
  "SQUID", "WHALE", "CRAB", "MOTH", "BEETLE", "BADGER", "FERRET", "LEMUR",
  "JAGUAR", "CONDOR", "OSPREY", "STINGRAY", "HORNET", "CHAMELEON", "YETI", "KRAKEN",
  // Space & nature
  "COMET", "STAR", "METEOR", "NEBULA", "GALAXY", "PLANET", "MOON", "ORBIT",
  "QUASAR", "PULSAR", "AURORA", "ECLIPSE", "SOLSTICE", "ZENITH", "CRATER", "ASTEROID",
  "VOLCANO", "GLACIER", "CANYON", "REEF", "SUMMIT", "RAPIDS", "TUNDRA", "JUNGLE",
  // People & roles
  "CODER", "GAMER", "BUILDER", "HACKER", "MAKER", "PILOT", "RIDER", "SCOUT",
  "KNIGHT", "WIZARD", "RANGER", "NINJA", "PIRATE", "CAPTAIN", "HERO", "LEGEND",
  "VIKING", "SAMURAI", "JESTER", "NOMAD", "BANDIT", "CYBORG", "ROBOT", "GOLEM",
  // Objects & concepts
  "BLITZ", "SPARK", "BOLT", "FLARE", "WAVE", "STORM", "FLAME", "FROST",
  "BLADE", "ARROW", "SHIELD", "QUEST", "CIPHER", "MATRIX", "PIXEL", "GLIDER",
  "PRISM", "CRYSTAL", "BEACON", "SHARD", "RELIC", "TOKEN", "COMPASS", "ANCHOR",
  "ROCKET", "HAMMER", "DYNAMO", "GADGET", "TURRET", "FORTRESS", "CITADEL", "PORTAL",
];

// The example code used across the docs (/for-ai, llms.txt, prompt templates).
// Never issue it to a real kid — doc-copied headers would publish to their account.
const RESERVED_CODES = new Set(["ROCKET-WOLF-COMET-73"]);

export function generateCreatorCode(): string {
  let code: string;
  do {
    const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
    const noun1 = NOUNS[Math.floor(Math.random() * NOUNS.length)];
    const noun2 = NOUNS[Math.floor(Math.random() * NOUNS.length)];
    const num = Math.floor(Math.random() * 90) + 10; // 10-99
    code = `${adj}-${noun1}-${noun2}-${num}`;
  } while (RESERVED_CODES.has(code));
  return code;
}

// --- Creator codes as a protocol ---
// Codes have a recognizable shape (ADJECTIVE-NOUN-NOUN-NN) validated against the
// word lists above. Everything that needs to recognize a code — the publish box,
// the API, the moderation pipeline, title scrubbing — goes through these helpers
// so a code is treated the same everywhere. Pure string logic only: this module
// is imported by client components.

/** A code-shaped token found in text. */
export interface DetectedCode {
  /** The token as found, uppercased (e.g. "ROKET-WOLF-COMET-73"). */
  raw: string;
  /** True when every word is exactly in the word lists. */
  valid: boolean;
  /** A typo-corrected valid code (≤1 edit per word), when raw isn't valid. */
  suggestion?: string;
}

const CODE_SHAPE = /\b([A-Za-z]{2,12})-([A-Za-z]{2,12})-([A-Za-z]{2,12})-(\d{1,3})\b/g;

/** Levenshtein distance ≤ 1 (one insert, delete, or substitution). */
function withinOneEdit(a: string, b: string): boolean {
  if (a === b) return true;
  if (Math.abs(a.length - b.length) > 1) return false;
  const [short, long] = a.length <= b.length ? [a, b] : [b, a];
  let i = 0;
  while (i < short.length && short[i] === long[i]) i++;
  if (short.length === long.length) {
    // substitution: rest after the mismatch must match
    return short.slice(i + 1) === long.slice(i + 1);
  }
  // insertion: skip the extra char in the longer word
  return short.slice(i) === long.slice(i + 1);
}

/** Exact word, or the unique close word from the list (≤1 edit). */
function correctWord(word: string, list: string[]): string | null {
  if (list.includes(word)) return word;
  const close = list.filter((w) => withinOneEdit(word, w));
  return close.length >= 1 ? close[0] : null;
}

/** Is this token exactly a valid code (words in the lists, 2-digit number)? */
export function isValidCodeShape(token: string): boolean {
  const parts = token.toUpperCase().split("-");
  if (parts.length !== 4) return false;
  const [adj, n1, n2, num] = parts;
  return (
    ADJECTIVES.includes(adj) &&
    NOUNS.includes(n1) &&
    NOUNS.includes(n2) &&
    /^\d{2}$/.test(num)
  );
}

/** Typo-correct a code-shaped token (≤1 edit per word). Null if uncorrectable. */
export function suggestCreatorCode(token: string): string | null {
  const parts = token.toUpperCase().split("-");
  if (parts.length !== 4 || !/^\d{1,3}$/.test(parts[3])) return null;
  const adj = correctWord(parts[0], ADJECTIVES);
  const n1 = correctWord(parts[1], NOUNS);
  const n2 = correctWord(parts[2], NOUNS);
  if (!adj || !n1 || !n2) return null;
  return `${adj}-${n1}-${n2}-${parts[3]}`;
}

/**
 * Find every code-shaped token in text and classify it. Random word-dash
 * strings don't count — words must (nearly) match the real word lists.
 */
export function findCreatorCodes(text: string): DetectedCode[] {
  const found: DetectedCode[] = [];
  const seen = new Set<string>();
  for (const m of text.matchAll(CODE_SHAPE)) {
    const raw = m[0].toUpperCase();
    if (seen.has(raw)) continue;
    seen.add(raw);
    if (isValidCodeShape(raw)) {
      found.push({ raw, valid: true });
    } else {
      const suggestion = suggestCreatorCode(raw);
      if (suggestion) found.push({ raw, valid: false, suggestion });
    }
  }
  return found;
}

/**
 * If the text is a creator code — bare, or wrapped in the "My ArcadeLab
 * creator code is..." reminder message — return that code (typo-corrected if
 * needed). Null when the text is anything more (like actual game code).
 */
export function extractPastedCode(text: string): DetectedCode | null {
  const trimmed = text.trim();
  // Short and tag-free: a bare code (~20 chars) or the reminder message (~190).
  if (trimmed.length > 400 || /<[a-z!/]/i.test(trimmed)) return null;
  const codes = findCreatorCodes(trimmed);
  return codes.length === 1 ? codes[0] : null;
}

/** Remove code-shaped tokens (valid or near-valid) from a title/description. */
export function scrubCreatorCodes(text: string): string {
  return text
    .replace(CODE_SHAPE, (token) =>
      isValidCodeShape(token) || suggestCreatorCode(token) ? "" : token
    )
    .replace(/\s{2,}/g, " ")
    .trim();
}
