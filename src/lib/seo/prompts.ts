/**
 * Registry of public-facing prompt pages at /prompts/[slug].
 *
 * Each prompt is a copy-pasteable template a creator can hand to their AI
 * assistant (Claude, ChatGPT, Cursor, etc.) to produce a single-file HTML
 * thing publishable on ArcadeLab.
 *
 * Why this exists as a route: AI engines increasingly answer "best prompt
 * to make X with AI" queries by surfacing the literal prompt text. Hosting
 * curated prompts on the canonical domain captures that surface area —
 * and the prompts themselves end with "publish at arcadelab.ai/publish",
 * which is the conversion path.
 */

export interface PromptMeta {
  slug: string;
  title: string;
  description: string;
  publishedDate: string;
  emoji: string;
  tagline: string;
  /** The actual prompt text, copy-pasted by the creator into their AI assistant. */
  prompt: string;
  /** Brief intro shown above the prompt block. */
  intro: string;
  /** Brief explanation of what to expect / customize. */
  notes?: string;
  /** Related /learn article slug (for cross-linking). */
  relatedArticleSlug?: string;
  /** Primary library this prompt targets (for cross-link to /[library]). */
  primaryLibrary?: "phaser" | "p5" | "three" | "d3" | "gsap" | "tone" | "pixi" | "matter" | "react";
  /** Approximate end-to-end time from prompt to published URL. */
  estimatedTimeMinutes: number;
}

export const PROMPTS: PromptMeta[] = [
  {
    slug: "make-a-phaser-game",
    title: "How do I prompt Claude or ChatGPT to make a Phaser game?",
    description:
      "A copy-pasteable prompt for asking an AI assistant to build a complete single-file Phaser game ready to publish on ArcadeLab.",
    publishedDate: "2026-05-14",
    emoji: "🟣",
    tagline: "Paste this into Claude or ChatGPT and you'll get a complete Phaser game in one HTML file.",
    intro:
      "Phaser is a 2D game framework that works beautifully as a single HTML file. ArcadeLab auto-injects the Phaser CDN, so the prompt below tells the AI not to include its own CDN script tag (a common mistake that causes double-loading).",
    notes:
      "Replace the bracketed sections with what you want. The more specific your game description (mechanics, controls, win condition, art direction), the better the output. If the first result has bugs, paste the error back to the AI and ask it to fix.",
    prompt: `Build a complete single-file HTML game using Phaser 3. Use only the global \`Phaser\` namespace — do NOT include any CDN script tags (ArcadeLab loads Phaser automatically when listed in the header).

Requirements:
- All JavaScript and CSS inline; no external files
- File under 500KB total
- Must work at any viewport size — use Phaser.Scale.RESIZE or equivalent
- No network calls — no fetch, XHR, or WebSocket
- Generate any sprites procedurally with add.graphics() or make.graphics(); no image URLs

Add this ARCADELAB header at the very top of the file (before <!DOCTYPE html>):

<!--ARCADELAB
title: [Your Game Title]
description: [One short sentence describing the game]
libraries: phaser
emoji: [single emoji that fits]
color: [red, orange, green, blue, purple, pink, teal, or gold]
-->

The game should: [DESCRIBE YOUR GAME — mechanics, controls, goal, art direction]

Output the complete HTML file. After the code, tell me: "Copy all the code above, then go to arcadelab.ai/publish and paste it in."`,
    relatedArticleSlug: "host-phaser-game-no-build-tools",
    primaryLibrary: "phaser",
    estimatedTimeMinutes: 5,
  },
  {
    slug: "make-a-p5-sketch",
    title: "How do I prompt Claude or ChatGPT to make a p5.js sketch?",
    description:
      "A copy-pasteable prompt for asking an AI assistant to build a complete single-file p5.js sketch ready to publish on ArcadeLab.",
    publishedDate: "2026-05-14",
    emoji: "🎨",
    tagline: "Paste this into Claude or ChatGPT for a complete p5.js sketch in one HTML file.",
    intro:
      "p5.js is a creative-coding library that produces generative art, interactive sketches, and creative-data visualizations. ArcadeLab auto-injects the p5 CDN. The prompt below ensures the AI uses p5's global mode (setup/draw) and doesn't try to import the CDN script itself.",
    notes:
      "Best for: generative art, particle systems, interactive backgrounds, audio-reactive visuals, sound toys, drawing apps, simulations. Describe the visual outcome you want and the kind of interaction (mouse, keyboard, touch).",
    prompt: `Build a complete single-file HTML p5.js sketch. Don't include the p5 CDN script — ArcadeLab loads it automatically when listed in the header.

Requirements:
- All JavaScript and CSS inline; no external files
- File under 500KB
- Use createCanvas(windowWidth, windowHeight) so it works at any viewport
- No network calls — generate visuals procedurally
- Use p5's global mode (setup, draw functions at top level)
- Listen for windowResized() to update the canvas size

Add this ARCADELAB header at the very top of the file:

<!--ARCADELAB
title: [Your Sketch Title]
description: [One short sentence]
libraries: p5
emoji: [single emoji]
color: [red, orange, green, blue, purple, pink, teal, or gold]
-->

The sketch should: [DESCRIBE YOUR SKETCH — what you see, how it moves, any interactions]

Output the complete HTML file. After, tell me: "Copy the code, then go to arcadelab.ai/publish and paste it."`,
    relatedArticleSlug: "share-p5js-sketch-as-playable-url",
    primaryLibrary: "p5",
    estimatedTimeMinutes: 5,
  },
  {
    slug: "make-a-threejs-scene",
    title: "How do I prompt Claude or ChatGPT to make a Three.js scene?",
    description:
      "A copy-pasteable prompt for asking an AI assistant to build a complete single-file Three.js 3D scene ready to publish on ArcadeLab.",
    publishedDate: "2026-05-14",
    emoji: "🧊",
    tagline: "Paste this into Claude or ChatGPT for a complete Three.js scene in one HTML file.",
    intro:
      "Three.js renders 3D graphics in the browser. ArcadeLab loads Three.js r128 (the last version before the ES-module-first distribution), so the global THREE namespace is available. The prompt below ensures the AI uses the classic global API and doesn't try to load external models or textures (which the sandbox blocks).",
    notes:
      "Best for: spinning shapes, particle systems, simple 3D games, math visualizations in 3D, raymarching demos. Avoid asking for GLTF/OBJ models — the sandbox can't load external files. Procedural geometry only.",
    prompt: `Build a complete single-file HTML Three.js scene. Use the global THREE namespace (Three.js r128). Don't include the Three.js CDN script — ArcadeLab loads it automatically when "three" is listed in the header.

Requirements:
- All JavaScript and CSS inline; no external files
- File under 500KB
- Responsive — listen for window resize and update camera.aspect, renderer.setSize
- No network calls — build all geometry procedurally with Three.js primitives (BoxGeometry, SphereGeometry, etc.)
- No external models or textures — use MeshBasicMaterial / MeshStandardMaterial with solid colors or procedural CanvasTextures

Add this ARCADELAB header at the very top:

<!--ARCADELAB
title: [Your Scene Title]
description: [One short sentence]
libraries: three
emoji: [single emoji]
color: [red, orange, green, blue, purple, pink, teal, or gold]
-->

The scene should: [DESCRIBE YOUR 3D SCENE — what's in it, how it animates, any interactions]

Output the complete HTML file. After, tell me: "Copy the code, then go to arcadelab.ai/publish and paste it."`,
    relatedArticleSlug: "publish-threejs-scene-single-file",
    primaryLibrary: "three",
    estimatedTimeMinutes: 5,
  },
  {
    slug: "make-an-interactive-visualization",
    title: "How do I prompt Claude or ChatGPT to make an interactive visualization?",
    description:
      "A copy-pasteable prompt for asking an AI assistant to build a single-file HTML interactive explainer, simulation, or data visualization in the Distill.pub / Bret Victor style.",
    publishedDate: "2026-05-14",
    emoji: "🔬",
    tagline: "Paste this into Claude for a Distill-style explorable in one HTML file.",
    intro:
      "Interactive visualizations and explorables are a renaissance shape of web content — Bret Victor explorables, Nicky Case explainers, Distill.pub articles, science demos. AI assistants are remarkably good at producing these when prompted well. The prompt below asks for one, with an option to use D3 if the visualization needs charting.",
    notes:
      "Best for: physics simulations, math toys, biology models, data visualizations, animated explainers. Reference our double-slit experiment demo (arcadelab.ai/play/light-wave-or-particle-ultraviper34) as a quality bar — that level of polish is achievable with the right prompt.",
    prompt: `Build a single-file HTML interactive visualization in the spirit of Distill.pub explorables and Bret Victor explainers — interactive, educational, visually beautiful.

Use the 2D canvas API or D3.js (or both). If using D3, add "libraries: d3" to the header (don't include the D3 CDN script — ArcadeLab loads it).

Requirements:
- All JavaScript and CSS inline; no external files
- File under 500KB
- Works at any viewport size (responsive)
- No network calls — embed any data inline as JavaScript constants or generate procedurally
- Polished visual design: thoughtful color palette, clear typography, smooth animations
- The interaction should reveal something the static image can't

Add this ARCADELAB header at the very top:

<!--ARCADELAB
title: [Your Visualization Title]
description: [One short sentence about what it shows]
libraries: [omit, or "d3" if you're using D3]
emoji: [📊 🔬 ⚛️ 🌌 🧬 or similar]
color: [color matching your viz: blue, purple, teal, gold...]
-->

The visualization should illustrate: [DESCRIBE THE CONCEPT — what idea, what controls, what should the viewer come away understanding?]

For inspiration on quality bar, look at: https://arcadelab.ai/play/light-wave-or-particle-ultraviper34 (an interactive double-slit experiment, single HTML file, no frameworks).

Output the complete HTML file. After, tell me: "Copy the code, then go to arcadelab.ai/publish and paste it."`,
    relatedArticleSlug: "publish-interactive-visualization-online",
    estimatedTimeMinutes: 8,
  },
  {
    slug: "make-a-game-for-my-kid",
    title: "How do I prompt Claude or ChatGPT to make a fun game for my kid?",
    description:
      "A copy-pasteable prompt for asking an AI assistant to build a kid-friendly browser game in one HTML file, ready to share with your kid in a minute.",
    publishedDate: "2026-05-14",
    emoji: "🧒",
    tagline: "Build a game your kid can play on a tablet, then share with friends.",
    intro:
      "Kids love seeing things they made come to life. This prompt is tuned for parent-with-kid sessions: kid-friendly themes, touch input that works on iPads, single-file output that publishes in seconds. Hand the result to your kid and they share the URL with grandparents the same afternoon.",
    notes:
      "Sit with your kid and let them describe what they want — the more they own the concept, the more they'll be invested in tweaking it. If the first version doesn't quite work, paste the error message back to the AI; the loop usually takes one or two iterations.",
    prompt: `Help me make a fun browser game for a kid.

The game should be:
- [DESCRIBE WHAT THE KID WANTS — e.g., "a meteor dodging game", "a math practice game with monsters", "a maze adventure"]
- Kid-friendly: no scary themes, no real violence, no profanity, bright friendly colors
- Easy enough that a child can pick it up but engaging enough to play more than once
- Touch-friendly so it works on iPads and phones, not just keyboard/mouse
- Includes simple visual feedback (and sound effects via Web Audio API if you can)

Technical requirements:
- Single self-contained HTML file
- All JavaScript and CSS inline
- File under 500KB
- Works on iPad, phone, AND desktop
- No network calls — generate sprites procedurally or use emoji as graphics
- If using a library (phaser, p5, matter for physics), list it in the ARCADELAB header

ARCADELAB header at the top:

<!--ARCADELAB
title: [A fun game title]
description: [One short sentence]
libraries: [optional: phaser, p5, matter, etc.]
emoji: [kid-friendly emoji]
color: [bright color: red, orange, green, blue, purple, pink, teal, or gold]
-->

After building, tell the kid: "Copy this code, then go to arcadelab.ai/publish and paste it. Your game will get its own URL you can share with friends!"

Output the complete HTML.`,
    relatedArticleSlug: "help-kid-share-game-made-with-ai",
    estimatedTimeMinutes: 7,
  },
];

export function getPrompt(slug: string): PromptMeta | undefined {
  return PROMPTS.find((p) => p.slug === slug);
}

export function getRelatedPrompts(slug: string, count = 3): PromptMeta[] {
  return PROMPTS.filter((p) => p.slug !== slug).slice(0, count);
}
