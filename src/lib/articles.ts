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
  {
    slug: "vibe-coding-publish-platforms",
    title: "Where can I publish something I vibe-coded?",
    description:
      "A practical guide to publishing destinations for vibe-coded projects — from single-file HTML games to full apps — and which tool fits which output.",
    publishedDate: "2026-05-15",
    emoji: "🌊",
    tagline: "From prototype to public URL.",
  },
  {
    slug: "cursor-bolt-claude-publishing-workflow",
    title: "How do I publish what I built with Cursor, Bolt, or an AI assistant?",
    description:
      "A step-by-step workflow for taking output from Cursor, Bolt, v0, Claude, or any AI coding tool and turning it into a public URL.",
    publishedDate: "2026-05-15",
    emoji: "🛠️",
    tagline: "From AI output to a public link.",
  },
  {
    slug: "single-file-html-game-template",
    title: "What is a good single-file HTML game template?",
    description:
      "A clean, copy-paste single-file HTML game template — canvas setup, game loop, and input handling — ready to extend or hand to an AI assistant.",
    publishedDate: "2026-05-15",
    emoji: "📐",
    tagline: "A starting skeleton for any browser game.",
  },
  {
    slug: "prompts-to-make-a-browser-game-with-ai",
    title: "What prompts make a good browser game with AI?",
    description:
      "How to prompt an AI assistant so it produces a publishable single-file browser game — what to specify, what to leave out, and an example prompt.",
    publishedDate: "2026-05-15",
    emoji: "💬",
    tagline: "Prompt it right, publish it fast.",
    relatedPromptSlug: "make-a-phaser-game",
  },
  {
    slug: "common-bugs-ai-generated-games",
    title: "What are the common bugs in AI-generated games?",
    description:
      "The recurring bugs in AI-generated browser games — external scripts, blocked network calls, sizing issues — and how to spot and fix them before publishing.",
    publishedDate: "2026-05-15",
    emoji: "🐛",
    tagline: "Catch the usual suspects before you publish.",
  },
  {
    slug: "make-an-html-game-in-30-minutes-with-ai",
    title: "How do I make an HTML game in 30 minutes with AI?",
    description:
      "A 30-minute path from idea to a published browser game using an AI assistant and a single HTML file.",
    publishedDate: "2026-05-15",
    emoji: "⏱️",
    tagline: "Idea to playable link in half an hour.",
  },
  {
    slug: "game-ideas-you-can-build-with-ai-tonight",
    title: "What game ideas can I build with AI tonight?",
    description:
      "Ten browser game ideas small enough to build with an AI assistant in one evening and publish as a single HTML file.",
    publishedDate: "2026-05-15",
    emoji: "🌙",
    tagline: "Small, finishable, shippable tonight.",
  },
  {
    slug: "from-claude-artifact-to-public-url",
    title: "How do I turn a Claude artifact into a public URL?",
    description:
      "Claude artifacts are interactive but live inside the chat. Here is how to turn one into a permanent public URL anyone can open.",
    publishedDate: "2026-05-15",
    emoji: "🔗",
    tagline: "Artifact in chat to a link anyone can open.",
  },
  {
    slug: "build-physics-simulation-with-claude",
    title: "How do I build a physics simulation with Claude?",
    description:
      "How to build an interactive physics simulation with an AI assistant and publish it as a single shareable HTML file.",
    publishedDate: "2026-05-15",
    emoji: "⚛️",
    tagline: "Simulate it, then share it.",
    relatedPromptSlug: "make-an-interactive-visualization",
  },
  {
    slug: "make-interactive-explainer-with-ai",
    title: "How do I make an interactive explainer with AI?",
    description:
      "Turn a concept into an interactive explainer — sliders, animations, live diagrams — with an AI assistant, and publish it as one HTML file.",
    publishedDate: "2026-05-15",
    emoji: "🧠",
    tagline: "Explain it by letting people poke at it.",
    relatedPromptSlug: "make-an-interactive-visualization",
  },
  {
    slug: "share-bret-victor-style-explorable",
    title: "How do I share a Bret Victor-style explorable?",
    description:
      "Explorable explanations — interactive essays in the Bret Victor tradition — work beautifully as single-file HTML. Here is how to publish one.",
    publishedDate: "2026-05-15",
    emoji: "🔭",
    tagline: "Explorable explanations, one paste away.",
  },
  {
    slug: "host-interactive-essay-online",
    title: "Where can I host an interactive essay online?",
    description:
      "An interactive essay mixes prose with live diagrams and controls. Here is where to host one as a single self-contained HTML file.",
    publishedDate: "2026-05-15",
    emoji: "📜",
    tagline: "Prose plus interaction, on its own URL.",
  },
  {
    slug: "single-file-data-viz-publishing",
    title: "How do I publish a single-file data visualization?",
    description:
      "Publish a data visualization — a chart, a dashboard, an interactive graphic — as one self-contained HTML file with a shareable URL.",
    publishedDate: "2026-05-15",
    emoji: "📈",
    tagline: "One chart, one file, one URL.",
    relatedLibrarySlug: "d3",
  },
  {
    slug: "interactive-visualization-prompts-for-claude",
    title: "What prompts make a good interactive visualization?",
    description:
      "How to prompt an AI assistant for an interactive visualization that is publishable as a single HTML file — with an example prompt.",
    publishedDate: "2026-05-15",
    emoji: "✨",
    tagline: "Prompt for a visualization, get a publishable file.",
    relatedPromptSlug: "make-an-interactive-visualization",
  },
  {
    slug: "from-jupyter-notebook-to-shareable-explainer",
    title: "How do I turn a Jupyter notebook into a shareable explainer?",
    description:
      "A Jupyter notebook is great for analysis but hard to share. Here is how to turn its key result into an interactive HTML explainer anyone can open.",
    publishedDate: "2026-05-15",
    emoji: "📓",
    tagline: "From notebook cells to a link anyone can open.",
  },
  {
    slug: "sandboxed-iframe-game-embed-explained",
    title: "How does a sandboxed iframe game embed work?",
    description:
      "What a sandboxed iframe is, why game platforms use one, and how to embed a sandboxed game safely in your own site.",
    publishedDate: "2026-05-15",
    emoji: "🪟",
    tagline: "Safe embeds, explained.",
  },
  {
    slug: "connect-src-none-iframe-csp",
    title: "What does connect-src 'none' do in an iframe CSP?",
    description:
      "How the connect-src 'none' Content Security Policy directive blocks network access in sandboxed iframes — and why game hosts use it.",
    publishedDate: "2026-05-15",
    emoji: "🛡️",
    tagline: "Why your published game has no network access.",
  },
  {
    slug: "single-file-html-with-cdn-libraries",
    title: "How do I use CDN libraries in a single-file HTML page?",
    description:
      "How to use libraries like Phaser, p5.js, and Three.js in a single-file HTML page — and how library injection avoids hard-coded script tags.",
    publishedDate: "2026-05-15",
    emoji: "📦",
    tagline: "Libraries without leaving the single-file format.",
  },
  {
    slug: "why-single-file-html-content-is-back",
    title: "Why is single-file HTML content making a comeback?",
    description:
      "Single-file HTML — one document, no build step — is resurging alongside AI assistants. Here is why the format fits the moment.",
    publishedDate: "2026-05-15",
    emoji: "🔄",
    tagline: "One file, no build step — and newly relevant.",
  },
  {
    slug: "arcadelab-vs-codepen-for-games",
    title: "ArcadeLab vs CodePen for games — which should I use?",
    description:
      "CodePen is a code playground; ArcadeLab is a publishing destination. How they differ for building and sharing browser games.",
    publishedDate: "2026-05-15",
    emoji: "🖊️",
    tagline: "Playground vs. publishing destination.",
  },
  {
    slug: "classroom-friendly-game-publishing",
    title: "What is a classroom-friendly way to publish student games?",
    description:
      "A no-account, no-email way for students to publish browser games — safe for a classroom, simple enough for any age.",
    publishedDate: "2026-05-15",
    emoji: "🏫",
    tagline: "Publishing that works for a whole class.",
  },
  {
    slug: "homeschool-coding-projects-with-ai",
    title: "What coding projects can homeschoolers do with AI?",
    description:
      "Browser game and visualization projects a homeschooler can build with an AI assistant and publish as a shareable link.",
    publishedDate: "2026-05-15",
    emoji: "🏡",
    tagline: "Real projects, real links, at home.",
  },
  {
    slug: "safe-game-sharing-for-kids",
    title: "What is a safe way for kids to share games online?",
    description:
      "How kids can share browser games safely — no personal data, no accounts, sandboxed play, and what parents should know.",
    publishedDate: "2026-05-15",
    emoji: "🛟",
    tagline: "Sharing games without the risky parts.",
  },
  {
    slug: "what-is-an-llms-txt-file",
    title: "What is an llms.txt file?",
    description:
      "llms.txt is a plain-text file that tells AI assistants what a website is and how to use it. Here is what it is and why sites add one.",
    publishedDate: "2026-05-15",
    emoji: "🤖",
    tagline: "A README, but for AI assistants.",
  },
  {
    slug: "building-ai-friendly-websites",
    title: "How do I build an AI-friendly website?",
    description:
      "Practical ways to make a website legible to AI assistants and answer engines — structured data, clear content, llms.txt, and more.",
    publishedDate: "2026-05-15",
    emoji: "🧭",
    tagline: "Make your site easy for AI to understand.",
  },
];

export function getArticle(slug: string): ArticleMeta | undefined {
  return ARTICLES.find((a) => a.slug === slug);
}

export function getRelatedArticles(slug: string, count = 3): ArticleMeta[] {
  return ARTICLES.filter((a) => a.slug !== slug).slice(0, count);
}
