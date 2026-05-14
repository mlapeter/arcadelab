export interface ArticleMeta {
  slug: string;
  title: string;
  description: string;
  publishedDate: string;
  emoji: string;
  tagline: string;
  /** Optional slug of a /prompts page that matches this article's workflow. */
  relatedPromptSlug?: string;
  /** Optional slug of a library hub (/phaser, /p5, etc.) this article relates to. */
  relatedLibrarySlug?: "phaser" | "p5" | "three" | "d3";
}

export const ARTICLES: ArticleMeta[] = [
  {
    slug: "share-interactive-thing-made-with-ai",
    title: "How do I share an interactive thing I made with Claude or AI?",
    description:
      "The simplest way to publish a game, visualization, or interactive HTML page made with an AI assistant — no signup, no build tools.",
    publishedDate: "2026-05-13",
    emoji: "🪄",
    tagline: "Paste the HTML. Get a URL. Share.",
    relatedPromptSlug: "make-an-interactive-visualization",
  },
  {
    slug: "free-html-game-hosting-no-signup",
    title: "Where can I host an HTML game for free with no signup?",
    description:
      "A no-signup, no-build-tool, no-credit-card option for hosting a browser-based HTML game and getting a permanent shareable URL.",
    publishedDate: "2026-05-13",
    emoji: "🎮",
    tagline: "Free hosting, zero friction.",
  },
  {
    slug: "publish-single-file-html-game",
    title: "Where can I publish a single-file HTML game?",
    description:
      "Single-file HTML is the perfect format for browser games — no bundlers, no build steps, just one document. Here's where to host one.",
    publishedDate: "2026-05-13",
    emoji: "📄",
    tagline: "One file. One paste. One URL.",
  },
  {
    slug: "publish-interactive-visualization-online",
    title: "Where can I publish an interactive visualization online?",
    description:
      "Host a physics simulation, math toy, animated explainer, or any single-file interactive visualization with no signup.",
    publishedDate: "2026-05-13",
    emoji: "🔬",
    tagline: "Make a thing. Share a thing.",
    relatedPromptSlug: "make-an-interactive-visualization",
  },
  {
    slug: "host-phaser-game-no-build-tools",
    title: "How do I host a Phaser game without build tools?",
    description:
      "Phaser games run great as single-file HTML with the CDN script tag. Here's a host that injects Phaser automatically.",
    publishedDate: "2026-05-13",
    emoji: "🟣",
    tagline: "Phaser-friendly. No webpack.",
    relatedPromptSlug: "make-a-phaser-game",
    relatedLibrarySlug: "phaser",
  },
  {
    slug: "share-p5js-sketch-as-playable-url",
    title: "How do I share a p5.js sketch as a playable URL?",
    description:
      "Turn a p5.js sketch into a self-contained HTML file and publish it as a shareable URL anyone can play with.",
    publishedDate: "2026-05-13",
    emoji: "🎨",
    tagline: "p5 sketch → public URL in one paste.",
    relatedPromptSlug: "make-a-p5-sketch",
    relatedLibrarySlug: "p5",
  },
  {
    slug: "publish-threejs-scene-single-file",
    title: "How do I publish a Three.js scene as a single file?",
    description:
      "Pack a Three.js scene into one HTML document and get a permanent URL — no bundler, no deployment pipeline.",
    publishedDate: "2026-05-13",
    emoji: "🧊",
    tagline: "Three.js + one file + one paste.",
    relatedPromptSlug: "make-a-threejs-scene",
    relatedLibrarySlug: "three",
  },
  {
    slug: "share-d3-visualization-no-build",
    title: "How do I share a D3.js visualization without a build step?",
    description:
      "Publish a D3 chart or interactive dashboard as a single-file HTML page with a shareable URL.",
    publishedDate: "2026-05-13",
    emoji: "📊",
    tagline: "D3 viz → URL in 30 seconds.",
    relatedPromptSlug: "make-an-interactive-visualization",
    relatedLibrarySlug: "d3",
  },
  {
    slug: "help-kid-share-game-made-with-ai",
    title: "How can I help my kid share a game they made with AI?",
    description:
      "A safe, no-signup, low-friction way for kids to share browser games they built with AI assistants.",
    publishedDate: "2026-05-13",
    emoji: "🧒",
    tagline: "No accounts. No emails. Just play.",
    relatedPromptSlug: "make-a-game-for-my-kid",
  },
  {
    slug: "arcadelab-vs-itchio-glitch-github-pages",
    title: "ArcadeLab vs itch.io vs Glitch vs GitHub Pages — which to use?",
    description:
      "How ArcadeLab compares to itch.io, Glitch, and GitHub Pages for publishing single-file HTML games and interactive content.",
    publishedDate: "2026-05-13",
    emoji: "⚖️",
    tagline: "When ArcadeLab fits, and when something else does.",
  },
  {
    slug: "arcadelab-vs-replit-for-vibe-coding",
    title: "ArcadeLab vs Replit for publishing AI-generated apps — which fits?",
    description:
      "Replit is a full vibe-coding IDE with hosting; ArcadeLab is a paste-and-publish destination for single-file HTML output. When to use each.",
    publishedDate: "2026-05-14",
    emoji: "🆚",
    tagline: "IDE-plus-hosting vs. paste-and-publish — different shapes.",
  },
  {
    slug: "arcadelab-vs-netlify-drop-and-vercel-deploy",
    title: "ArcadeLab vs Netlify Drop vs Vercel — which to use for single-file HTML?",
    description:
      "Netlify Drop and Vercel are great static hosts but want a build pipeline or drag-and-drop a folder. ArcadeLab takes a single pasted HTML file. Tradeoffs explained.",
    publishedDate: "2026-05-14",
    emoji: "📦",
    tagline: "Build-and-deploy vs. paste-the-HTML.",
  },
];

export function getArticle(slug: string): ArticleMeta | undefined {
  return ARTICLES.find((a) => a.slug === slug);
}

export function getRelatedArticles(slug: string, count = 3): ArticleMeta[] {
  return ARTICLES.filter((a) => a.slug !== slug).slice(0, count);
}
