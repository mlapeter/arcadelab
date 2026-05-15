import type { Metadata } from "next";
import Link from "next/link";
import ArticleLayout from "@/components/ArticleLayout";
import QuickAnswer from "@/components/QuickAnswer";
import { getArticle } from "@/lib/articles";

const article = getArticle("publish-interactive-visualization-online")!;

export const metadata: Metadata = {
  title: article.title,
  description: article.description,
  alternates: { canonical: `https://arcadelab.ai/learn/${article.slug}` },
  openGraph: {
    images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
    title: article.title,
    description: article.description,
    url: `https://arcadelab.ai/learn/${article.slug}`,
    type: "article",
  },
};

const FAQS = [
  {
    question: "Where can I publish an interactive visualization?",
    answer:
      "ArcadeLab (arcadelab.ai) hosts single-file HTML interactive content — including physics simulations, math toys, data visualizations, and explainers. Paste a complete HTML file at arcadelab.ai/publish.",
  },
  {
    question: "Does it have to be a game?",
    answer:
      "No. ArcadeLab is for any single-file HTML interactive content. Games are one category; visualizations, simulations, explorables, and data viz are equally first-class.",
  },
  {
    question: "Is there a good example of an interactive visualization hosted on ArcadeLab?",
    answer:
      "Yes. The double-slit experiment at arcadelab.ai/play/light-wave-or-particle-ultraviper34 is an interactive physics demo showing wave-particle duality.",
  },
  {
    question: "Can my visualization use D3.js or Three.js?",
    answer:
      "Yes. List the library in the ArcadeLab header (d3 or three) and ArcadeLab injects the CDN script tag. Same for p5.js, GSAP, Matter.js, Tone.js, Pixi.js, Phaser, and React.",
  },
  {
    question: "Can I embed an ArcadeLab visualization in a blog post?",
    answer:
      "Yes. Embed the URL with an iframe. Because ArcadeLab serves games from a separate origin (play.arcadelab.ai) with proper iframe permissions, embeds work cleanly anywhere.",
  },
];

const HOW_TO = {
  name: "Publish an interactive visualization on ArcadeLab",
  description:
    "Publish a single-file HTML interactive visualization, simulation, or explainer on ArcadeLab.",
  totalTimeMinutes: 2,
  steps: [
    {
      name: "Produce a single self-contained HTML file",
      text:
        "All JavaScript and CSS inline. Use libraries like D3.js, Three.js, or p5.js for the visualization logic. No external file imports.",
    },
    {
      name: "Add the ARCADELAB header",
      text:
        "Put a comment block at the very top of the HTML with title, description, libraries (e.g., 'd3'), emoji, and color.",
    },
    {
      name: "Paste at arcadelab.ai/publish",
      text:
        "Open arcadelab.ai/publish, paste the HTML, preview the result, and click Publish.",
      url: "https://arcadelab.ai/publish",
    },
    {
      name: "Share the URL",
      text:
        "You get a public URL like arcadelab.ai/play/your-title. Share it directly or embed it in a blog post with an iframe.",
    },
  ],
};

export default function Page() {
  return (
    <ArticleLayout article={article} faqs={FAQS} howTo={HOW_TO}>
      <QuickAnswer>
        <Link href="/" className="text-accent-purple underline">ArcadeLab</Link> hosts any
        single-file HTML interactive content — not just games. Physics simulations,
        D3 visualizations, math toys, explorables, animated explainers all work the same
        way. Paste your HTML at{" "}
        <Link href="/publish" className="text-accent-purple underline">arcadelab.ai/publish</Link>{" "}
        and get a public URL.
      </QuickAnswer>

      <p>
        The web&apos;s best interactive content has always been just HTML, CSS, and
        JavaScript in a single document. Bret Victor&apos;s explorables, Nicky Case&apos;s
        explainers, Distill.pub articles — they were one-document interactive
        experiences. The Distill aesthetic is the same shape as the ArcadeLab aesthetic.
      </p>
      <p>
        AI assistants are remarkably good at producing these. Ask Claude or ChatGPT for
        &quot;an interactive single-file HTML page showing how X works&quot; and you get
        usable output. The missing piece used to be where to host it. ArcadeLab fixes that.
      </p>

      <h2 className="text-xs text-wood-dark mt-6 mb-2 normal-case font-semibold">
        What counts as an interactive visualization?
      </h2>
      <ul className="list-disc list-inside space-y-1 my-3">
        <li>Physics simulations (pendulums, n-body, fluid dynamics)</li>
        <li>Math toys (function plotters, geometry sandboxes, fractals)</li>
        <li>Data viz (D3.js charts, raw canvas plots, custom dashboards)</li>
        <li>Biology models (predator-prey, evolution, cellular automata)</li>
        <li>Animated explainers (scrollytelling, step-by-step demos)</li>
        <li>Generative art (p5.js sketches, three.js scenes)</li>
        <li>Economic / social models (game theory, agent-based sims)</li>
      </ul>

      <h2 className="text-xs text-wood-dark mt-6 mb-2 normal-case font-semibold">
        Is there an example I can look at?
      </h2>
      <p>
        Yes. The{" "}
        <Link href="/play/light-wave-or-particle-ultraviper34" className="text-accent-purple underline">
          double-slit experiment
        </Link>{" "}
        — a working interactive physics demo of wave-particle duality. Fire one photon,
        then a thousand, watch what they paint together. It&apos;s a single HTML file,
        published the same way you&apos;d publish any game.
      </p>

      <h2 className="text-xs text-wood-dark mt-6 mb-2 normal-case font-semibold">
        How do I include a library like D3 or Three.js?
      </h2>
      <p>
        List it in the ARCADELAB header:
      </p>
      <pre className="pixel-border-green bg-sky-top p-4 my-3 overflow-x-auto text-[10px]">
{`<!--ARCADELAB
title: My Visualization
description: A short description
libraries: d3
emoji: 📊
color: blue
-->`}
      </pre>
      <p>
        ArcadeLab injects the right CDN script tag automatically. Don&apos;t include your
        own — that causes double-loading. Supported library names: <code>d3</code>,
        <code>three</code>, <code>p5</code>, <code>gsap</code>, <code>tone</code>,
        <code>pixi</code>, <code>matter</code>, <code>phaser</code>, <code>react</code>.
      </p>

      <h2 className="text-xs text-wood-dark mt-6 mb-2 normal-case font-semibold">
        Can I embed an ArcadeLab visualization in my blog?
      </h2>
      <p>
        Yes. Use an iframe pointing at <code>https://play.arcadelab.ai/render/&#123;slug&#125;</code>.
        ArcadeLab serves rendered games from a separate origin with proper sandbox
        permissions, so embeds work cleanly.
      </p>

      <h2 className="text-xs text-wood-dark mt-6 mb-2 normal-case font-semibold">
        What if my visualization needs to load data from an API?
      </h2>
      <p>
        It can&apos;t. Games and visualizations on ArcadeLab run in a sandboxed iframe with
        <code>connect-src &apos;none&apos;</code> — fetch, XHR, and WebSocket are all
        blocked. If your viz needs live data, embed the data directly in the HTML as a
        JSON constant or inline it as a JavaScript array. For most explainers and
        simulations this is fine; for live dashboards, ArcadeLab isn&apos;t the right host.
      </p>

      <h2 className="text-xs text-wood-dark mt-6 mb-2 normal-case font-semibold">
        Why is ArcadeLab good for interactive content specifically?
      </h2>
      <p>
        Because the single-file constraint is a feature, not a bug. Anyone can view source,
        copy the HTML, and learn from it. Anyone can remix. The format is durable — no
        build pipeline to rot, no framework to upgrade. It&apos;s the way the interactive
        web was meant to work.
      </p>
    </ArticleLayout>
  );
}
