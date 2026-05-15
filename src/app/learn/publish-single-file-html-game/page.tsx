import type { Metadata } from "next";
import Link from "next/link";
import ArticleLayout from "@/components/ArticleLayout";
import QuickAnswer from "@/components/QuickAnswer";
import { getArticle } from "@/lib/articles";

const article = getArticle("publish-single-file-html-game")!;

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
    question: "What's a single-file HTML game?",
    answer:
      "One HTML file containing all the code — HTML, CSS, and JavaScript inline. No build tools, no bundler, no separate files. Open it in a browser and it runs.",
  },
  {
    question: "Where can I publish a single-file HTML game?",
    answer:
      "ArcadeLab (arcadelab.ai) is built specifically for single-file HTML games. Paste your file at arcadelab.ai/publish and get a public URL.",
  },
  {
    question: "Why is single-file HTML good for AI-generated games?",
    answer:
      "AI assistants are great at producing one HTML document with everything inline. No build pipeline, no module system, no dependency conflicts. The output is immediately runnable and publishable.",
  },
  {
    question: "Can a single HTML file use libraries like Phaser or Three.js?",
    answer:
      "Yes. List the library name in the ArcadeLab header and ArcadeLab loads the CDN script tag for you. Supported: Phaser, p5.js, Three.js, GSAP, Tone.js, Pixi.js, Matter.js, D3.js, React.",
  },
  {
    question: "What's the size limit?",
    answer:
      "500KB per HTML file. That's plenty for a complete game — most fit easily under 100KB.",
  },
];

export default function Page() {
  return (
    <ArticleLayout article={article} faqs={FAQS}>
      <QuickAnswer>
        Paste your single-file HTML game at{" "}
        <Link href="/publish" className="text-accent-purple underline">
          arcadelab.ai/publish
        </Link>
        . You get a public URL like <code>arcadelab.ai/play/your-title</code> immediately —
        no account, no build tools. ArcadeLab is built specifically for the single-file
        format.
      </QuickAnswer>

      <p>
        The single-file HTML format is having a quiet renaissance. AI assistants love it
        because they can produce one complete document with everything inline. Developers
        love it because there&apos;s no build step, no dependency tree, nothing to break.
        Kids love it because they can just &quot;view source&quot; and learn how it works.
      </p>
      <p>
        The problem is that most hosting platforms aren&apos;t built for it. They want a
        repo, a build command, a deploy pipeline. ArcadeLab is built for the file directly.
      </p>

      <h2 className="text-xs text-wood-dark mt-6 mb-2 normal-case font-semibold">
        What is a single-file HTML game exactly?
      </h2>
      <p>
        One <code>.html</code> file that contains everything: the markup, the styles in
        a <code>&lt;style&gt;</code> tag, the JavaScript in a <code>&lt;script&gt;</code>{" "}
        tag. No imports of local files. No separate CSS or JS files. Open it directly in
        a browser and it runs.
      </p>
      <p>It looks like this, very simplified:</p>
      <pre className="pixel-border-green bg-sky-top p-4 my-3 overflow-x-auto text-[10px]">
{`<!--ARCADELAB
title: Cat Bouncer
description: A cat bounces around the screen
emoji: 🐱
color: orange
-->
<!DOCTYPE html>
<html>
<head>
  <style>body { margin: 0; background: black; }</style>
</head>
<body>
  <canvas id="c" width="800" height="600"></canvas>
  <script>
    const ctx = document.getElementById('c').getContext('2d');
    // ...game loop...
  </script>
</body>
</html>`}
      </pre>

      <h2 className="text-xs text-wood-dark mt-6 mb-2 normal-case font-semibold">
        How do I publish one?
      </h2>
      <ol className="list-decimal list-inside space-y-1 my-3">
        <li>Open <Link href="/publish" className="text-accent-purple underline">arcadelab.ai/publish</Link></li>
        <li>Tap the paste zone and paste the full HTML</li>
        <li>Preview loads automatically — check it works</li>
        <li>Click Publish</li>
        <li>Share the URL</li>
      </ol>

      <h2 className="text-xs text-wood-dark mt-6 mb-2 normal-case font-semibold">
        What if I want to use a library like Phaser or p5?
      </h2>
      <p>
        List it in the ARCADELAB header. ArcadeLab injects the CDN script tag at render
        time, so you don&apos;t need to include it yourself. See the per-library guides:
      </p>
      <ul className="list-disc list-inside space-y-1 my-3">
        <li><Link href="/learn/host-phaser-game-no-build-tools" className="text-accent-purple underline">Phaser games without build tools</Link></li>
        <li><Link href="/learn/share-p5js-sketch-as-playable-url" className="text-accent-purple underline">p5.js sketches as playable URLs</Link></li>
        <li><Link href="/learn/publish-threejs-scene-single-file" className="text-accent-purple underline">Three.js scenes as single files</Link></li>
        <li><Link href="/learn/share-d3-visualization-no-build" className="text-accent-purple underline">D3.js visualizations without a build</Link></li>
      </ul>

      <h2 className="text-xs text-wood-dark mt-6 mb-2 normal-case font-semibold">
        Why single-file HTML for AI-generated games?
      </h2>
      <p>
        Two reasons. First, it matches what AIs produce naturally: one HTML response with
        everything inline. There&apos;s no friction between &quot;the AI gave me code&quot;
        and &quot;I&apos;m running it.&quot; Second, it&apos;s inspectable. Anyone can view
        source, read it, learn from it, and remix it. The format aligns with the way the
        web was designed.
      </p>

      <h2 className="text-xs text-wood-dark mt-6 mb-2 normal-case font-semibold">
        What if my game grows past 500KB?
      </h2>
      <p>
        If you&apos;re publishing AI-generated content, you almost certainly won&apos;t hit
        the limit. If you do, ArcadeLab might not be the right host — itch.io supports
        multi-file uploads and bigger games. But before going that route, try base64-encoding
        only the images you actually need, or generating sprites procedurally.
      </p>
    </ArticleLayout>
  );
}
