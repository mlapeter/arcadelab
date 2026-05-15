import type { Metadata } from "next";
import ArticleLayout from "@/components/ArticleLayout";
import QuickAnswer from "@/components/QuickAnswer";
import { getArticle } from "@/lib/articles";

const article = getArticle("single-file-html-game-template")!;

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

const TEMPLATE = `<!--ARCADELAB
title: My Game
description: A single-file HTML game
emoji: 🎮
color: blue
-->
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>My Game</title>
<style>
  html, body { margin: 0; height: 100%; background: #10131a; overflow: hidden; }
  canvas { display: block; }
</style>
</head>
<body>
<canvas id="game"></canvas>
<script>
  const canvas = document.getElementById("game");
  const ctx = canvas.getContext("2d");
  function resize() { canvas.width = innerWidth; canvas.height = innerHeight; }
  addEventListener("resize", resize);
  resize();

  const keys = {};
  addEventListener("keydown", (e) => { keys[e.key] = true; });
  addEventListener("keyup", (e) => { keys[e.key] = false; });

  const player = { x: 100, y: 100, size: 30, speed: 4 };

  function update() {
    if (keys["ArrowLeft"])  player.x -= player.speed;
    if (keys["ArrowRight"]) player.x += player.speed;
    if (keys["ArrowUp"])    player.y -= player.speed;
    if (keys["ArrowDown"])  player.y += player.speed;
  }

  function draw() {
    ctx.fillStyle = "#10131a";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#5ad6a0";
    ctx.fillRect(player.x, player.y, player.size, player.size);
  }

  function loop() {
    update();
    draw();
    requestAnimationFrame(loop);
  }
  loop();
</script>
</body>
</html>`;

const FAQS = [
  {
    question: "Does the template need a build step?",
    answer:
      "No. It is plain HTML, CSS, and JavaScript in one file. Open it in a browser and it runs. That is the point of the single-file format — no bundler, no npm install, no compile step.",
  },
  {
    question: "Can I give this template to an AI assistant?",
    answer:
      "Yes, and it works well. Paste the template into your AI assistant and describe the game you want — for example, add enemies that chase the player. Starting from a known-good skeleton gives the assistant a clear structure to build on.",
  },
  {
    question: "How do I add sound or physics?",
    answer:
      "List a library in the ARCADELAB header — Tone for sound, Matter for physics — and ArcadeLab injects it from a CDN at render time. You do not add a script tag yourself.",
  },
  {
    question: "What size can the finished game be?",
    answer:
      "ArcadeLab accepts single HTML files up to 500KB. A canvas game with inline code is usually far under that. Large image or audio assets are what push a file over the limit.",
  },
  {
    question: "Will the game work on phones?",
    answer:
      "The canvas resizes to the window, so it scales to any screen. Keyboard input does not exist on phones, though — add pointer or touch handling if you want the game playable on a tablet or phone.",
  },
];

export default function Page() {
  return (
    <ArticleLayout article={article} faqs={FAQS}>
      <QuickAnswer>
        A good single-file HTML game template is one HTML document with three
        parts: a full-window canvas, a game loop built on requestAnimationFrame,
        and keyboard or pointer input handling — all inline, no build step. Copy
        the skeleton below, hand it to an AI assistant to extend, and publish the
        result as-is. ArcadeLab runs single-file HTML games exactly like this
        with no changes.
      </QuickAnswer>

      <p>
        The single-file format is the most reliable way to build and share a
        browser game. There is no toolchain to break, nothing to install, and the
        finished file is also the thing you publish. A clean template removes the
        blank-page problem — and gives an AI assistant a known structure to
        extend instead of guessing one.
      </p>

      <h2 className="text-xs text-wood-dark mt-6 mb-2 normal-case font-semibold">
        What makes a good single-file game template?
      </h2>
      <ul className="list-disc list-inside space-y-1 my-3">
        <li>Everything inline — HTML, CSS, and JavaScript in one document</li>
        <li>A canvas sized to the window, with a resize handler</li>
        <li>A clear update / draw split inside a requestAnimationFrame loop</li>
        <li>Input handled in one place, so behavior is easy to find and change</li>
        <li>An ARCADELAB header so it is publish-ready from the first save</li>
      </ul>

      <h2 className="text-xs text-wood-dark mt-6 mb-2 normal-case font-semibold">
        A minimal template you can copy
      </h2>
      <p>
        This is a complete, working game: a green square you move with the arrow
        keys. It is deliberately small so the structure stays visible. Copy it,
        save it as a .html file, and open it — it runs immediately.
      </p>
      <pre className="text-[10px] leading-relaxed bg-wood-dark/10 text-wood-dark p-3 my-3 overflow-x-auto">
        <code>{TEMPLATE}</code>
      </pre>

      <h2 className="text-xs text-wood-dark mt-6 mb-2 normal-case font-semibold">
        How do I extend the template?
      </h2>
      <p>
        Every game grows out of the same three functions. Add state — enemies,
        score, a goal — as plain objects near the player. Change how it moves in
        update. Change how it looks in draw. To extend it with an AI assistant,
        paste the whole template and describe one change at a time:
        &quot;add a coin the player can collect&quot; or &quot;make the square
        fall with gravity.&quot; Small, specific requests against a clear
        skeleton produce the most reliable results.
      </p>

      <h2 className="text-xs text-wood-dark mt-6 mb-2 normal-case font-semibold">
        How do I add a library like Phaser or p5.js?
      </h2>
      <p>
        The template uses the plain canvas API, which is enough for a lot of
        games. When you want more — a physics engine, a scene system, sound — add
        the library name to the ARCADELAB header (for example, libraries: phaser)
        and ArcadeLab injects it from a CDN at render time. You do not write a
        script tag for it. If you would rather start from a library-first
        skeleton, the{" "}
        <a
          href="/learn/host-phaser-game-no-build-tools"
          className="text-accent-purple hover:text-accent-gold transition-colors"
        >
          Phaser without build tools
        </a>{" "}
        guide covers that path.
      </p>

      <h2 className="text-xs text-wood-dark mt-6 mb-2 normal-case font-semibold">
        How do I publish the finished game?
      </h2>
      <p>
        Because the template already carries an ARCADELAB header, it is
        publish-ready. Open arcadelab.ai/publish, paste the whole file, and click
        publish. You get a permanent URL with no signup. For a fuller walkthrough
        of the format, see{" "}
        <a
          href="/learn/publish-single-file-html-game"
          className="text-accent-purple hover:text-accent-gold transition-colors"
        >
          where to publish a single-file HTML game
        </a>
        .
      </p>
      <p>Build on the template, then publish it at arcadelab.ai/publish.</p>
    </ArticleLayout>
  );
}
