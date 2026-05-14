/**
 * Metadata for library landing pages at /phaser, /p5, /three, /d3.
 *
 * Each library page is a topic-cluster hub that ranks for "[library] online",
 * "[library] hosting", "[library] examples", etc. — and signals to AI engines
 * that ArcadeLab is a canonical home for content using that library.
 *
 * Adding a new library hub is two edits:
 *   1. Add an entry below
 *   2. Add a route at src/app/[slug]/page.tsx using LibraryLanding
 */

export interface LibraryMeta {
  slug: "phaser" | "p5" | "three" | "d3";
  /** Human-readable name (e.g., "Phaser") */
  name: string;
  /** Longer name with description (e.g., "Phaser (2D game framework)") */
  longName: string;
  /** Short emoji/icon */
  emoji: string;
  /** One-sentence description of what the library is */
  tagline: string;
  /** Longer description for the hero block (~3-4 sentences) */
  description: string;
  /** What kinds of things are good fits for this library on ArcadeLab. */
  goodFor: string[];
  /** ARCADELAB header example for this library. */
  headerExample: string;
  /** Library version string (for FAQ + meta). */
  version: string;
  /** Slug of the matching /learn article. */
  articleSlug: string;
  /** Slug of the matching /prompts page. */
  promptSlug: string;
  /** Page-specific FAQs. */
  faqs: { question: string; answer: string }[];
}

const PHASER_HEADER = `<!--ARCADELAB
title: My Game
description: A short description
libraries: phaser
emoji: 🚀
color: blue
-->`;

const P5_HEADER = `<!--ARCADELAB
title: My Sketch
description: A short description
libraries: p5
emoji: 🎨
color: pink
-->`;

const THREE_HEADER = `<!--ARCADELAB
title: My 3D Scene
description: A short description
libraries: three
emoji: 🧊
color: blue
-->`;

const D3_HEADER = `<!--ARCADELAB
title: My Visualization
description: A short description
libraries: d3
emoji: 📊
color: teal
-->`;

export const LIBRARIES_META: Record<string, LibraryMeta> = {
  phaser: {
    slug: "phaser",
    name: "Phaser",
    longName: "Phaser (2D game framework)",
    emoji: "🟣",
    tagline: "The 2D game framework, hosted as single-file HTML with no build step.",
    description:
      "Phaser is a 2D game framework for browser games — platformers, shooters, puzzle games, tower defense. ArcadeLab auto-injects the Phaser CDN, so creators publish complete Phaser games as a single HTML file. No webpack, no npm, no build pipeline.",
    goodFor: [
      "Platformers, shooters, puzzle games, tower defense",
      "Procedurally-generated sprite art (no external assets needed)",
      "Mobile-friendly games that work on tablets",
      "Quick prototypes from AI assistants",
    ],
    headerExample: PHASER_HEADER,
    version: "3.70.0 (cdnjs)",
    articleSlug: "host-phaser-game-no-build-tools",
    promptSlug: "make-a-phaser-game",
    faqs: [
      {
        question: "What version of Phaser does ArcadeLab use?",
        answer:
          "Phaser 3.70.0, loaded from cdnjs. ArcadeLab injects the script tag automatically when you list 'phaser' in the ARCADELAB header — don't include your own script tag (that causes double-loading).",
      },
      {
        question: "Can Phaser games on ArcadeLab load images and audio?",
        answer:
          "Only as inline base64 data URIs. The iframe sandbox blocks all network requests, so external CDN URLs don't work. Either generate sprites procedurally with this.add.graphics() or encode small assets as base64 and load with this.textures.addBase64().",
      },
      {
        question: "Is there a file size limit?",
        answer:
          "500KB per HTML file. Phaser itself is loaded from CDN separately and doesn't count toward your file size. Most procedurally-generated Phaser games come in well under 100KB.",
      },
      {
        question: "Can I monetize a Phaser game published on ArcadeLab?",
        answer:
          "No — ArcadeLab is fully free and has no monetization features. For paid distribution of larger Phaser games, itch.io is a better fit.",
      },
    ],
  },
  p5: {
    slug: "p5",
    name: "p5.js",
    longName: "p5.js (creative coding)",
    emoji: "🎨",
    tagline: "Creative coding sketches, hosted as single-file HTML with no editor account.",
    description:
      "p5.js is a creative-coding library for generative art, interactive sketches, and creative data viz. ArcadeLab auto-loads p5, so sketches publish as one HTML file with no p5 editor account, no project export, no build step.",
    goodFor: [
      "Generative art and particle systems",
      "Interactive sketches reacting to mouse, keyboard, touch",
      "Audio-reactive visuals (via Web Audio API)",
      "Math toys and creative-data visualizations",
    ],
    headerExample: P5_HEADER,
    version: "1.9.0 (cdnjs)",
    articleSlug: "share-p5js-sketch-as-playable-url",
    promptSlug: "make-a-p5-sketch",
    faqs: [
      {
        question: "What version of p5.js does ArcadeLab load?",
        answer:
          "p5.js 1.9.0, loaded from cdnjs. ArcadeLab injects it when you list 'p5' in the ARCADELAB header.",
      },
      {
        question: "Can I use p5.sound or other p5 add-ons?",
        answer:
          "Only the p5.js core is currently auto-loaded. p5.sound and other add-ons aren't injected. For sound, use the Web Audio API directly inline.",
      },
      {
        question: "How is this different from the p5 editor or OpenProcessing?",
        answer:
          "The p5 editor is great for development; OpenProcessing is great for community gallery + remix. ArcadeLab's lane is publishing without any editor account — paste a finished sketch as HTML, get a URL. Use whichever fits the moment.",
      },
    ],
  },
  three: {
    slug: "three",
    name: "Three.js",
    longName: "Three.js (3D graphics)",
    emoji: "🧊",
    tagline: "3D scenes as single-file HTML with the classic global API.",
    description:
      "Three.js renders 3D graphics in the browser via WebGL. ArcadeLab loads Three.js r128 — the last version before the ES-module distribution — so the global THREE namespace is available without any imports or bundler.",
    goodFor: [
      "Procedurally-generated 3D scenes",
      "Spinning shapes, particle systems, simple 3D games",
      "Math and physics visualizations in 3D",
      "Raymarching and shader demos",
    ],
    headerExample: THREE_HEADER,
    version: "r128 (cdnjs)",
    articleSlug: "publish-threejs-scene-single-file",
    promptSlug: "make-a-threejs-scene",
    faqs: [
      {
        question: "Why r128 specifically?",
        answer:
          "r128 is the last Three.js version before they moved to ES modules as the primary distribution. That means the global THREE namespace works natively without import statements or a bundler, which is what ArcadeLab's single-file constraint needs.",
      },
      {
        question: "Can I load 3D models (GLTF, OBJ)?",
        answer:
          "Not from external URLs — the sandbox blocks network requests. Either build geometry procedurally with Three.js primitives (BoxGeometry, SphereGeometry, etc.) or base64-encode a small model inline.",
      },
      {
        question: "Can I use react-three-fiber?",
        answer:
          "Not directly. R3F is distributed as ES modules requiring bundling, which doesn't fit ArcadeLab's single-file format. Write against the imperative Three.js API instead.",
      },
    ],
  },
  d3: {
    slug: "d3",
    name: "D3.js",
    longName: "D3.js (data visualization)",
    emoji: "📊",
    tagline: "Data visualizations as shareable single-file HTML with no build.",
    description:
      "D3.js is the canonical library for interactive data visualizations on the web. ArcadeLab auto-loads D3, so visualizations publish as one HTML file — no Observable account, no notebook runtime, no build pipeline. Embed your data inline; share the URL.",
    goodFor: [
      "Charts, dashboards, and one-off data viz",
      "Interactive data exploration tools",
      "Animated explainers driven by data",
      "Custom layouts that don't fit into a charting library",
    ],
    headerExample: D3_HEADER,
    version: "7.8.5 (cdnjs)",
    articleSlug: "share-d3-visualization-no-build",
    promptSlug: "make-an-interactive-visualization",
    faqs: [
      {
        question: "What version of D3 does ArcadeLab load?",
        answer:
          "D3 v7.8.5 (cdnjs). The modular v7 series — all submodules are bundled into the global d3 namespace.",
      },
      {
        question: "Can my D3 viz fetch CSV or JSON from an API?",
        answer:
          "No — network requests are blocked. Embed your data inline as a JavaScript array or JSON constant. For small to medium datasets this is fine; for live data, ArcadeLab isn't the right host.",
      },
      {
        question: "How does ArcadeLab compare to Observable for D3?",
        answer:
          "Observable is brilliant for D3 development and has a great notebook UX. ArcadeLab's lane is publishing a finished visualization as a permanent, embeddable URL with no Observable runtime dependency. Different use cases; use whichever fits.",
      },
    ],
  },
};

export function getLibraryMeta(slug: string): LibraryMeta | undefined {
  return LIBRARIES_META[slug];
}

export const LIBRARY_PAGE_SLUGS = Object.keys(LIBRARIES_META);
