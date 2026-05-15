import type { Metadata } from "next";
import Link from "next/link";
import ArticleLayout from "@/components/ArticleLayout";
import QuickAnswer from "@/components/QuickAnswer";
import { getArticle } from "@/lib/articles";

const article = getArticle("host-phaser-game-no-build-tools")!;

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
    question: "How do I host a Phaser game without build tools?",
    answer:
      "Write your Phaser game as a single HTML file with all JavaScript inline. Publish at arcadelab.ai/publish — list 'phaser' in the ARCADELAB header and ArcadeLab loads the Phaser CDN script automatically.",
  },
  {
    question: "Do I need to include the Phaser CDN script tag?",
    answer:
      "No. ArcadeLab injects it for you when you list 'phaser' in the ARCADELAB header. Including your own script tag will cause double-loading.",
  },
  {
    question: "Which version of Phaser does ArcadeLab use?",
    answer:
      "Phaser 3.70.0, loaded from cdnjs. If you need a specific older or newer version for compatibility, ArcadeLab might not be the right host.",
  },
  {
    question: "Can my Phaser game load images or audio?",
    answer:
      "Only as inline base64-encoded data URIs. ArcadeLab blocks all network requests including image loads from external URLs. Pack assets as base64 in your HTML or generate them procedurally.",
  },
  {
    question: "What's the size limit for a Phaser game on ArcadeLab?",
    answer:
      "500KB for the HTML file. Phaser itself is loaded separately from CDN — it doesn't count toward your file size. Asset-heavy games may need to use base64-encoded sprites carefully.",
  },
];

export default function Page() {
  return (
    <ArticleLayout article={article} faqs={FAQS}>
      <QuickAnswer>
        Write your Phaser game as a single HTML file with all JavaScript inline. Add the
        ARCADELAB header at the top with <code>libraries: phaser</code>. Paste at{" "}
        <Link href="/publish" className="text-accent-purple underline">arcadelab.ai/publish</Link>.
        ArcadeLab injects the Phaser CDN script automatically.
      </QuickAnswer>

      <p>
        Phaser is built for single-file HTML games. You can drop the CDN script tag in
        any page and write your game inline. The official Phaser tutorials use this
        pattern. The friction has always been hosting — most platforms want a repo and a
        deploy pipeline. ArcadeLab takes the file directly.
      </p>

      <h2 className="text-xs text-wood-dark mt-6 mb-2 normal-case font-semibold">
        What does the minimal setup look like?
      </h2>
      <p>Here&apos;s a complete, publishable Phaser game in one HTML file:</p>
      <pre className="pixel-border-green bg-sky-top p-4 my-3 overflow-x-auto text-[10px]">
{`<!--ARCADELAB
title: Phaser Demo
description: A minimal Phaser scene
libraries: phaser
emoji: 🟣
color: purple
-->
<!DOCTYPE html>
<html>
<head>
  <style>body { margin: 0; background: #000; }</style>
</head>
<body>
  <script>
    const config = {
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      scene: {
        create() {
          this.add.text(400, 300, 'Hello Phaser', { color: '#fff' })
            .setOrigin(0.5);
        }
      }
    };
    new Phaser.Game(config);
  </script>
</body>
</html>`}
      </pre>
      <p>
        That&apos;s the entire game. Note: <strong>no</strong>{" "}
        <code>&lt;script src=&quot;https://...phaser.min.js&quot;&gt;</code>. ArcadeLab
        injects it for you because you listed <code>phaser</code> in the header.
      </p>

      <h2 className="text-xs text-wood-dark mt-6 mb-2 normal-case font-semibold">
        How do I add assets like sprites and audio?
      </h2>
      <p>
        ArcadeLab&apos;s sandbox blocks network requests, so you can&apos;t load images
        or audio from external URLs. Two options:
      </p>
      <ul className="list-disc list-inside space-y-1 my-3">
        <li>
          <strong>Generate procedurally:</strong> use Phaser&apos;s <code>add.graphics()</code>{" "}
          to draw shapes at runtime, or build sprites with code.
        </li>
        <li>
          <strong>Inline as base64 data URIs:</strong> encode small PNGs or audio clips as
          base64 and load them with <code>this.textures.addBase64()</code>.
        </li>
      </ul>
      <p>
        For AI-generated games, procedural assets are usually easier. Ask the AI to draw
        sprites with primitives instead of asking for image files.
      </p>

      <h2 className="text-xs text-wood-dark mt-6 mb-2 normal-case font-semibold">
        How do I tell my AI assistant to make a Phaser game for ArcadeLab?
      </h2>
      <p>
        Share this with your AI:
      </p>
      <blockquote className="border-l-4 border-accent-purple pl-4 my-3 italic">
        &quot;Make a Phaser game as a single self-contained HTML file. Don&apos;t include
        the Phaser CDN script tag — ArcadeLab loads it. Put an <code>&lt;!--ARCADELAB&gt;</code>{" "}
        header at the top with <code>libraries: phaser</code>. All JS inline. No fetch, no
        external assets. Generate sprites procedurally. Keep it under 500KB.&quot;
      </blockquote>
      <p>
        Or just point the AI at{" "}
        <Link href="/for-ai" className="text-accent-purple underline">
          arcadelab.ai/for-ai
        </Link>{" "}
        — that page is a complete briefing.
      </p>

      <h2 className="text-xs text-wood-dark mt-6 mb-2 normal-case font-semibold">
        Why not just use itch.io or GitHub Pages?
      </h2>
      <p>
        You can. itch.io supports HTML5 games well, but requires an account, a project
        page setup, and uploading a zip. GitHub Pages needs a repo and DNS. ArcadeLab is
        the fastest path: paste the file, get a URL. See{" "}
        <Link href="/learn/arcadelab-vs-itchio-glitch-github-pages" className="text-accent-purple underline">
          ArcadeLab vs itch.io vs Glitch vs GitHub Pages
        </Link>
        .
      </p>
    </ArticleLayout>
  );
}
