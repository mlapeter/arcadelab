import type { Metadata } from "next";
import Link from "next/link";
import ArticleLayout from "@/components/ArticleLayout";
import QuickAnswer from "@/components/QuickAnswer";
import { getArticle } from "@/lib/articles";

const article = getArticle("share-interactive-thing-made-with-ai")!;

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
    question: "How do I share something I made with Claude or another AI?",
    answer:
      "Save the AI's output as a single HTML file, then paste it at arcadelab.ai/publish. You get a public URL like arcadelab.ai/play/your-title that you can share with anyone.",
  },
  {
    question: "Does the AI need to be Claude specifically?",
    answer:
      "No. ArcadeLab is AI-agnostic. Whatever assistant produced the HTML — Claude, ChatGPT, Gemini, Cursor, Bolt, v0 — works the same way. ArcadeLab hosts the output, not the AI.",
  },
  {
    question: "Does my thing have to be a game?",
    answer:
      "No. ArcadeLab hosts any single-file HTML interactive content: games, physics simulations, data visualizations, interactive explainers, generative art, and toys.",
  },
  {
    question: "Do I need an account?",
    answer:
      "No email, no password, no OAuth. The first time you publish, ArcadeLab assigns you a Creator Code (like ROCKET-WOLF-COMET-73) that links to your creator name.",
  },
  {
    question: "Is it free?",
    answer: "Yes. Publishing, hosting, and playing are all free. No paid tiers.",
  },
];

const HOW_TO = {
  name: "Share an AI-made interactive thing in three steps",
  description:
    "Publish a game, visualization, or interactive page made with an AI assistant on ArcadeLab.",
  totalTimeMinutes: 1,
  steps: [
    {
      name: "Get one complete HTML file from your AI",
      text:
        "Ask the AI for a single self-contained HTML file with all JavaScript and CSS inline. Tell it the file size limit is 500KB. Tell it that fetch, XHR, and WebSocket are blocked, so it should not call external APIs.",
    },
    {
      name: "Add the ARCADELAB header at the top",
      text:
        "Paste the ARCADELAB comment block at the very top of the HTML, before <!DOCTYPE html>. List the title, description, libraries (if any), emoji, and color.",
    },
    {
      name: "Paste at arcadelab.ai/publish",
      text:
        "Open arcadelab.ai/publish, paste the full HTML, and click Publish. You get a permanent URL like arcadelab.ai/play/your-title.",
      url: "https://arcadelab.ai/publish",
    },
  ],
};

export default function Page() {
  return (
    <ArticleLayout article={article} faqs={FAQS} howTo={HOW_TO}>
      <QuickAnswer>
        Save the AI&apos;s code as a single HTML file, paste it at{" "}
        <Link href="/publish" className="text-accent-purple underline">
          arcadelab.ai/publish
        </Link>
        , and you get a public URL anyone can play with. No signup, no build tools, no account.
        Works for games, visualizations, simulations, or any single-file interactive HTML.
      </QuickAnswer>

      <p>
        You asked an AI to build you something — a game, a physics demo, an interactive chart,
        whatever it is — and it gave you a wall of HTML, JavaScript, and CSS. Now you want a
        friend, a kid, a coworker, or the internet to play with it. This is how.
      </p>

      <h2 className="text-xs text-wood-dark mt-6 mb-2 normal-case font-semibold">
        What counts as a thing you can share?
      </h2>
      <p>
        Anything that runs in a browser as a single self-contained HTML file. That includes:
      </p>
      <ul className="list-disc list-inside space-y-1 my-3">
        <li>Games (platformers, shooters, puzzle games, RPGs)</li>
        <li>Physics simulations and interactive demos</li>
        <li>Data visualizations (D3, raw canvas, anything)</li>
        <li>Generative art and creative coding sketches</li>
        <li>Animated explainers and interactive lessons</li>
        <li>Toys, art, music makers — anything playful</li>
      </ul>
      <p>
        If it&apos;s one HTML file under 500KB that doesn&apos;t need to call an external API,
        it works.
      </p>

      <h2 className="text-xs text-wood-dark mt-6 mb-2 normal-case font-semibold">
        How do I get one HTML file out of an AI?
      </h2>
      <p>
        Most AI assistants will give you a complete HTML file if you ask for one. The exact
        prompt matters less than what you tell it not to do. Say:
      </p>
      <blockquote className="border-l-4 border-accent-purple pl-4 my-3 italic">
        &quot;Give me a single self-contained HTML file. All JavaScript and CSS should be
        inline. Don&apos;t use fetch, XHR, or WebSocket — the page can&apos;t make network
        requests. Keep the whole file under 500KB.&quot;
      </blockquote>
      <p>
        If the AI gives you something that imports external files or makes API calls, ask it
        to rewrite as a single self-contained file.
      </p>

      <h2 className="text-xs text-wood-dark mt-6 mb-2 normal-case font-semibold">
        What is the ARCADELAB header?
      </h2>
      <p>
        ArcadeLab uses a small comment block at the top of the HTML to know your title,
        description, and which libraries to load. It looks like this:
      </p>
      <pre className="pixel-border-green bg-sky-top p-4 my-3 overflow-x-auto text-[10px]">
{`<!--ARCADELAB
title: My Game
description: A short one-sentence description
libraries: phaser
emoji: 🚀
color: blue
-->`}
      </pre>
      <p>
        Put it before <code>&lt;!DOCTYPE html&gt;</code>. If you list a library name
        (phaser, p5, three, gsap, tone, pixi, matter, d3, react), ArcadeLab loads it
        automatically — don&apos;t add your own CDN script tags.
      </p>

      <h2 className="text-xs text-wood-dark mt-6 mb-2 normal-case font-semibold">
        Do I need to know how to code?
      </h2>
      <p>
        No. The AI does the coding. You just need to copy the output, paste it, and click
        Publish. If you&apos;re reading this and have never opened a code editor, you can
        still do this.
      </p>

      <h2 className="text-xs text-wood-dark mt-6 mb-2 normal-case font-semibold">
        What if the AI&apos;s code has errors?
      </h2>
      <p>
        ArcadeLab shows a preview before you publish. If it doesn&apos;t work, copy the
        error message back to your AI and ask it to fix it. This loop usually takes one
        or two tries.
      </p>

      <h2 className="text-xs text-wood-dark mt-6 mb-2 normal-case font-semibold">
        Can I update my thing later?
      </h2>
      <p>
        Yes. ArcadeLab remembers your Creator Code in the browser. When you visit your
        own game, you&apos;ll see Edit and Delete buttons. Updating replaces the HTML
        while keeping the same URL.
      </p>

      <h2 className="text-xs text-wood-dark mt-6 mb-2 normal-case font-semibold">
        What does my final URL look like?
      </h2>
      <p>
        It looks like <code>arcadelab.ai/play/your-title-creatorname</code>. Share that
        link anywhere — Discord, iMessage, email, Reddit. People click and play
        immediately, no install needed.
      </p>

      <p className="mt-6">
        For a longer briefing aimed at AI assistants (which you can share with your
        Claude or ChatGPT chat), see{" "}
        <Link href="/for-ai" className="text-accent-purple underline">
          arcadelab.ai/for-ai
        </Link>
        .
      </p>
    </ArticleLayout>
  );
}
