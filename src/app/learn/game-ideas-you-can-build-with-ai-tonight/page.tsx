import type { Metadata } from "next";
import ArticleLayout from "@/components/ArticleLayout";
import QuickAnswer from "@/components/QuickAnswer";
import { getArticle } from "@/lib/articles";

const article = getArticle("game-ideas-you-can-build-with-ai-tonight")!;

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
    question: "Are these ideas good for beginners?",
    answer:
      "Yes. Each one has a single mechanic, which keeps both the build and the prompt simple. They are also good for experienced developers who want something finished tonight rather than started tonight.",
  },
  {
    question: "How long does one of these take to build?",
    answer:
      "With an AI assistant, a single-mechanic game like these is usually an evening — often under an hour once the scope is clear. The dodge and reaction games are the fastest; the maze and asteroid games take a little longer.",
  },
  {
    question: "Can I combine two ideas?",
    answer:
      "You can, but finish one first. A single clear mechanic is what makes a game finishable in a night. Ship the simple version, then remix it another evening if you want more.",
  },
  {
    question: "Do these need images or sound files?",
    answer:
      "No. Every idea here can be drawn with canvas shapes and, if you want audio, generated with the Web Audio API. Keeping assets out of the file is what lets it publish as a single self-contained HTML document.",
  },
  {
    question: "Where do I publish the game when it is done?",
    answer:
      "Paste the finished HTML file at arcadelab.ai/publish for a permanent public URL — no signup, no build step. Send the link to a friend the same night you built it.",
  },
];

export default function Page() {
  return (
    <ArticleLayout article={article} faqs={FAQS}>
      <QuickAnswer>
        The best one-evening games have a single mechanic and a single screen —
        no levels, no menus, no saved progress. Think a dodging game, a one-button
        jumper, a memory match, or a falling-blocks puzzle. Below are ten ideas
        scoped to finish in a night and publish as one HTML file.
      </QuickAnswer>

      <p>
        The hardest part of building a game is not the code anymore — it is
        choosing something small enough to actually finish. Every idea here is
        deliberately tiny. Pick one, describe it to an AI assistant, and you can
        have a playable link before bed.
      </p>

      <h2 className="text-xs text-wood-dark mt-6 mb-2 normal-case font-semibold">
        What makes a game finishable in one evening?
      </h2>
      <p>
        One mechanic. One screen. One ending. The moment a game needs a menu
        system, multiple levels, or saved high scores, it stops being an evening
        project. Finishable games trade scope for completion — and a finished
        small game is far more satisfying than an unfinished big one.
      </p>

      <h2 className="text-xs text-wood-dark mt-6 mb-2 normal-case font-semibold">
        Ten game ideas scoped for tonight
      </h2>
      <ul className="list-disc list-inside space-y-1 my-3">
        <li><strong>Falling dodge</strong> — move left and right to avoid blocks falling from the top; survive as long as you can.</li>
        <li><strong>One-button jumper</strong> — the player auto-runs; tap once to jump over gaps.</li>
        <li><strong>Memory match</strong> — flip cards two at a time to find matching pairs against a timer.</li>
        <li><strong>Reaction tester</strong> — click the instant the screen changes color; the game scores your speed.</li>
        <li><strong>Snake</strong> — the classic: grid movement, a growing tail, do not hit yourself.</li>
        <li><strong>Breakout</strong> — a paddle, a bouncing ball, a wall of bricks to clear.</li>
        <li><strong>Asteroid shooter</strong> — rotate, thrust, and shoot drifting rocks before they hit you.</li>
        <li><strong>Color sort</strong> — drag colored items into the matching bins before time runs out.</li>
        <li><strong>Typing race</strong> — type the falling words before they reach the ground.</li>
        <li><strong>Maze runner</strong> — navigate a randomly drawn maze from the start to the exit.</li>
      </ul>

      <h2 className="text-xs text-wood-dark mt-6 mb-2 normal-case font-semibold">
        How do I keep the scope small?
      </h2>
      <p>
        Write the whole game as two sentences before you prompt. If it does not
        fit, cut features until it does. Tell the assistant explicitly what to
        leave out — &quot;no menus, no levels, just the core game&quot; — so it
        does not quietly grow the project. The constraint is the feature here.
      </p>

      <h2 className="text-xs text-wood-dark mt-6 mb-2 normal-case font-semibold">
        How do I publish what I build?
      </h2>
      <p>
        Ask the assistant for the game as a single self-contained HTML file, test
        it in a browser, and paste it at arcadelab.ai/publish for a public URL.
        For a minute-by-minute version of this, see{" "}
        <a
          href="/learn/make-an-html-game-in-30-minutes-with-ai"
          className="text-accent-purple hover:text-accent-gold transition-colors"
        >
          how to make an HTML game in 30 minutes
        </a>
        .
      </p>
      <p>Built something tonight? Publish it at arcadelab.ai/publish.</p>
    </ArticleLayout>
  );
}
