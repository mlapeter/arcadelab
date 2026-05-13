import type { Metadata } from "next";
import Link from "next/link";
import ArticleLayout from "@/components/ArticleLayout";
import QuickAnswer from "@/components/QuickAnswer";
import { getArticle } from "@/lib/articles";

const article = getArticle("share-p5js-sketch-as-playable-url")!;

export const metadata: Metadata = {
  title: article.title,
  description: article.description,
  alternates: { canonical: `https://arcadelab.ai/learn/${article.slug}` },
  openGraph: {
    title: article.title,
    description: article.description,
    url: `https://arcadelab.ai/learn/${article.slug}`,
    type: "article",
  },
};

const FAQS = [
  {
    question: "How do I share a p5.js sketch as a playable URL?",
    answer:
      "Wrap your p5 sketch in a single HTML file with all JS inline. Add the ARCADELAB header listing 'p5' as a library. Publish at arcadelab.ai/publish to get a public URL.",
  },
  {
    question: "Do I need the p5.js editor account?",
    answer:
      "No. ArcadeLab doesn't require an account. The p5 editor is great for development but requires login to share. ArcadeLab lets you publish without one.",
  },
  {
    question: "Does ArcadeLab load p5.js automatically?",
    answer:
      "Yes. List 'p5' in the ARCADELAB header and ArcadeLab injects the CDN script tag (p5 1.9.0). Don't include your own.",
  },
  {
    question: "Can I use p5.sound or other p5 add-ons?",
    answer:
      "Currently only the p5.js core library is auto-injected. If you need p5.sound or other add-ons, those would need to be inlined as part of your HTML — but they may exceed the 500KB limit.",
  },
  {
    question: "Can my p5 sketch load images?",
    answer:
      "Only as base64-encoded data URIs in the HTML. Network requests are blocked in the iframe sandbox.",
  },
];

export default function Page() {
  return (
    <ArticleLayout article={article} faqs={FAQS}>
      <QuickAnswer>
        Wrap your p5 sketch in a single HTML file with the sketch JS inline. Add an
        ARCADELAB header with <code>libraries: p5</code>. Paste at{" "}
        <Link href="/publish" className="text-accent-purple underline">arcadelab.ai/publish</Link>{" "}
        and you get a permanent URL. No p5.js editor account needed.
      </QuickAnswer>

      <p>
        p5.js sketches are pure single-file HTML by nature — the entire sketch lives in
        a <code>setup()</code> and <code>draw()</code> function inside a script tag.
        That makes them a perfect fit for ArcadeLab.
      </p>

      <h2 className="text-xs text-wood-dark mt-6 mb-2 normal-case font-semibold">
        What does a minimal p5 sketch on ArcadeLab look like?
      </h2>
      <pre className="pixel-border-green bg-sky-top p-4 my-3 overflow-x-auto text-[10px]">
{`<!--ARCADELAB
title: My Sketch
description: An interactive p5.js sketch
libraries: p5
emoji: 🎨
color: pink
-->
<!DOCTYPE html>
<html>
<head>
  <style>body { margin: 0; }</style>
</head>
<body>
  <script>
    function setup() { createCanvas(800, 600); }
    function draw() {
      background(20);
      fill(255, 100, 150);
      circle(mouseX, mouseY, 50);
    }
  </script>
</body>
</html>`}
      </pre>
      <p>
        That&apos;s it. Note there is no <code>&lt;script src=&quot;p5.min.js&quot;&gt;</code>{" "}
        — ArcadeLab loads it because you listed <code>p5</code> in the header.
      </p>

      <h2 className="text-xs text-wood-dark mt-6 mb-2 normal-case font-semibold">
        How do I convert an existing p5 editor sketch?
      </h2>
      <p>
        In the p5 editor, your sketch is split into <code>index.html</code>,{" "}
        <code>sketch.js</code>, and sometimes <code>style.css</code>. Inline all of them:
      </p>
      <ol className="list-decimal list-inside space-y-1 my-3">
        <li>Copy the contents of <code>sketch.js</code> into a <code>&lt;script&gt;</code> tag</li>
        <li>Copy <code>style.css</code> into a <code>&lt;style&gt;</code> tag</li>
        <li>Remove the <code>&lt;script src=&quot;p5.min.js&quot;&gt;</code> line</li>
        <li>Remove the <code>&lt;script src=&quot;sketch.js&quot;&gt;</code> line</li>
        <li>Add the ARCADELAB header with <code>libraries: p5</code></li>
      </ol>
      <p>If you have any asset files (images, fonts), those would need to be base64-encoded inline.</p>

      <h2 className="text-xs text-wood-dark mt-6 mb-2 normal-case font-semibold">
        Can I ask Claude or ChatGPT to make a p5 sketch for ArcadeLab?
      </h2>
      <p>Yes. Try this prompt:</p>
      <blockquote className="border-l-4 border-accent-purple pl-4 my-3 italic">
        &quot;Make a p5.js sketch as a single self-contained HTML file. Don&apos;t include
        the p5 CDN — ArcadeLab loads it. Put an{" "}
        <code>&lt;!--ARCADELAB&gt;</code> header at the top with <code>libraries: p5</code>.
        All JS inline. No fetch, no external files. Generate any visuals procedurally.&quot;
      </blockquote>
      <p>
        Or just share <Link href="/for-ai" className="text-accent-purple underline">arcadelab.ai/for-ai</Link>{" "}
        with your AI and tell it &quot;make a p5 sketch.&quot;
      </p>

      <h2 className="text-xs text-wood-dark mt-6 mb-2 normal-case font-semibold">
        Why use ArcadeLab instead of OpenProcessing or the p5 editor?
      </h2>
      <p>
        Both are excellent. OpenProcessing has a great community for p5 sketches
        specifically. The p5 editor is unbeatable for live editing. ArcadeLab&apos;s
        strength is friction: no account, no editor, just paste and share. Use whichever
        fits the moment — they aren&apos;t mutually exclusive.
      </p>
    </ArticleLayout>
  );
}
