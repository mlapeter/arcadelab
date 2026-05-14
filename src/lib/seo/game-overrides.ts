/**
 * Per-game SEO/AEO overrides.
 *
 * Most games on ArcadeLab are kid-built, low-text, and don't need page-level
 * customization — the default game page is fine for them.
 *
 * For "showcase" games (educational, popular, visually striking, or genuinely
 * shareable), we add an override entry here. That entry enriches the game's
 * page with:
 *   - A custom long description above the iframe
 *   - LearningResource structured data (so AI engines see the page as an
 *     interactive demo of a specific topic, not just "a game")
 *   - Page-specific FAQ schema targeting the topic
 *   - Internal links to related articles, prompts, and library pages
 *
 * Adding a new override is a 15-minute weekly task:
 *   1. Pick a great new game published in the last week
 *   2. Add an entry below, keyed by its slug
 *   3. Commit + push (Vercel auto-deploys)
 *
 * See MARKETING_PRIVATE/FOLLOWUPS.md for the weekly review process.
 */

export interface GameSeoOverride {
  /**
   * Page-specific marketing description. Rendered above the iframe.
   * Targets long-tail queries for the topic this game covers.
   * Should be 2-4 sentences, written for both humans and AI engines.
   */
  longDescription?: string;

  /** Topics this game/visualization teaches. Used in LearningResource schema. */
  educationalTopics?: string[];

  /**
   * Schema.org LearningResource type.
   * Common values: "Interactive Demo", "Simulation", "Game", "Explorable",
   * "Tutorial", "Lesson", "Generative Art".
   */
  learningResourceType?: string;

  /** Optional educational level (e.g., "Beginner", "Intermediate", "High School"). */
  educationalLevel?: string;

  /** Page-specific FAQs. Rendered + included in FAQPage schema. */
  faqs?: { question: string; answer: string }[];

  /** If true, may be featured on the homepage or library landing pages. */
  featured?: boolean;

  /** Slugs of related /learn articles to cross-link from this page. */
  relatedArticleSlugs?: string[];

  /** Slugs of related /prompts pages to cross-link. */
  relatedPromptSlugs?: string[];

  /**
   * Override the library this game uses for cross-linking purposes.
   * Defaults to the first library in the game's `libraries` field.
   */
  primaryLibrary?: "phaser" | "p5" | "three" | "d3" | "gsap" | "tone" | "pixi" | "matter" | "react";
}

export const GAME_OVERRIDES: Record<string, GameSeoOverride> = {
  "light-wave-or-particle-ultraviper34": {
    longDescription:
      "An interactive demonstration of the double-slit experiment — one of the most famous puzzles in physics. Light arrives as discrete particles (photons) that land at single points on the detector, but while traveling it behaves like a wave that interferes with itself. Fire one photon at a time, then a thousand at once, and watch how the interference pattern emerges only from the statistics of many.",
    educationalTopics: [
      "double-slit experiment",
      "wave-particle duality",
      "quantum mechanics",
      "photons",
      "interference patterns",
      "physics",
    ],
    learningResourceType: "Interactive Demo",
    educationalLevel: "High School",
    faqs: [
      {
        question: "What is the double-slit experiment?",
        answer:
          "The double-slit experiment is a demonstration that light (and matter) exhibits both wave-like and particle-like properties. When a stream of particles is fired through two narrow slits, an interference pattern appears on the detector behind them — characteristic of waves, not particles. The mystery is that even single particles fired one at a time still produce an interference pattern when many are accumulated.",
      },
      {
        question: "Why does this interactive demo matter?",
        answer:
          "Seeing the interference pattern emerge from the statistics of individual photon impacts makes wave-particle duality concrete in a way a textbook diagram can't. You can fire a single photon, see it land somewhere on the detector, and only after firing hundreds do the bright and dark bands of the interference pattern reveal themselves.",
      },
      {
        question: "Can I make a physics simulation like this and host it?",
        answer:
          "Yes. ArcadeLab hosts any single-file HTML interactive content — physics simulations, math toys, data visualizations, explorables. Paste a complete HTML file at arcadelab.ai/publish and you get a permanent shareable URL. No signup, no build tools.",
      },
      {
        question: "What technology is this built with?",
        answer:
          "It's a single self-contained HTML file using the browser's 2D canvas API. No frameworks, no build step, no external assets. The entire experiment fits in one document — which makes it remixable: anyone can view the source and modify it.",
      },
    ],
    featured: true,
    relatedArticleSlugs: [
      "publish-interactive-visualization-online",
      "share-interactive-thing-made-with-ai",
      "share-d3-visualization-no-build",
    ],
    relatedPromptSlugs: ["make-an-interactive-visualization"],
  },
};

export function getGameOverride(slug: string): GameSeoOverride | undefined {
  return GAME_OVERRIDES[slug];
}

export function isFeaturedGame(slug: string): boolean {
  return GAME_OVERRIDES[slug]?.featured === true;
}

/** Returns all featured game slugs. Used for homepage / library landing surfaces. */
export function getFeaturedGameSlugs(): string[] {
  return Object.entries(GAME_OVERRIDES)
    .filter(([, override]) => override.featured)
    .map(([slug]) => slug);
}
