import type { Metadata } from "next";
import ArticleLayout from "@/components/ArticleLayout";
import QuickAnswer from "@/components/QuickAnswer";
import { getArticle } from "@/lib/articles";

const article = getArticle("make-an-html-game-in-30-minutes-with-ai")!;

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

const HOW_TO = {
  name: "Make and publish an HTML game in 30 minutes with AI",
  description:
    "Go from a game idea to a published browser game in about half an hour.",
  totalTimeMinutes: 30,
  steps: [
    {
      name: "Pick a small idea",
      text: "Choose a game with one mechanic and one screen so it can realistically be finished in half an hour.",
    },
    {
      name: "Write the prompt",
      text: "Ask an AI assistant for the game as a single self-contained HTML file with all code inline and no external files.",
    },
    {
      name: "Build and iterate",
      text: "Run the assistant's output, describe what is wrong in plain words, and let it revise until the game plays correctly.",
    },
    {
      name: "Test in a browser",
      text: "Open the file directly, check that it resizes, responds to input, and shows no console errors.",
    },
    {
      name: "Publish for a URL",
      text: "Paste the finished file at arcadelab.ai/publish to get a permanent public link.",
    },
  ],
};

const FAQS = [
  {
    question: "Do I need any coding experience for this?",
    answer:
      "No. The AI assistant writes the code. Your job is to pick a small idea, describe it clearly, and tell the assistant in plain words what to fix when something is wrong.",
  },
  {
    question: "What tools do I need installed?",
    answer:
      "None. You need an AI assistant in a browser tab, a browser to test the file, and a publishing destination. There is no editor, no Node, and no command line in this path.",
  },
  {
    question: "Why 30 minutes and not longer?",
    answer:
      "The time box forces a small scope, and a small scope is what makes a game finishable at all. A tightly scoped game in 30 minutes beats an ambitious one that is never done.",
  },
  {
    question: "What if the game has a bug at minute 25?",
    answer:
      "Describe the symptom to the assistant and let it fix that one thing. Resist adding features in the last few minutes — a small game that works is the goal, not a bigger one that does not.",
  },
  {
    question: "Can I keep improving the game after I publish it?",
    answer:
      "Yes. Publishing is not final. ArcadeLab gives you a Creator Code so you can edit or replace the game later, so it is fine to publish a simple version now and improve it another night.",
  },
];

export default function Page() {
  return (
    <ArticleLayout article={article} faqs={FAQS} howTo={HOW_TO}>
      <QuickAnswer>
        Pick a game small enough to finish — one mechanic, one screen. Ask an AI
        assistant for it as a single self-contained HTML file. Test it in a
        browser, fix the one or two things that break, then paste it into a
        publisher like ArcadeLab for a public URL. With a tight scope, idea to
        shareable link takes about half an hour.
      </QuickAnswer>

      <p>
        Half an hour is enough time to build and publish a real browser game —
        as long as the game is small and the steps are clear. Here is a path that
        fits, broken into the minutes it actually takes.
      </p>

      <h2 className="text-xs text-wood-dark mt-6 mb-2 normal-case font-semibold">
        What kind of game fits in 30 minutes?
      </h2>
      <p>
        One mechanic, one screen, one ending. A dodging game, a one-button
        jumper, a memory match, a falling-blocks puzzle. No level select, no save
        files, no menus. If you cannot describe the game in two sentences, it is
        too big for the time box — cut it down until you can.
      </p>

      <h2 className="text-xs text-wood-dark mt-6 mb-2 normal-case font-semibold">
        Minutes 0-5 — Pick the idea and write the prompt
      </h2>
      <p>
        Choose the idea, then write a prompt that names the format and the
        constraints: a single self-contained HTML file, all code inline, canvas
        that resizes to the window, no external files, no network calls. Spending
        five honest minutes on the prompt saves more than five minutes of
        debugging later.
      </p>

      <h2 className="text-xs text-wood-dark mt-6 mb-2 normal-case font-semibold">
        Minutes 5-20 — Build and iterate
      </h2>
      <p>
        Send the prompt, then treat the first reply as a draft. Run it and change
        one thing at a time: speed, colors, the lose condition, the feel of the
        controls. Small, specific follow-ups keep a working game working. This is
        the longest stretch — and the most fun.
      </p>

      <h2 className="text-xs text-wood-dark mt-6 mb-2 normal-case font-semibold">
        Minutes 20-25 — Test the game
      </h2>
      <p>
        Save the file and open it directly in a browser. Play for a minute, watch
        the developer console for errors, resize the window, and check it at a
        phone-sized width. Fix anything that breaks now — not after publishing.
      </p>

      <h2 className="text-xs text-wood-dark mt-6 mb-2 normal-case font-semibold">
        Minutes 25-30 — Publish it
      </h2>
      <p>
        Open arcadelab.ai/publish, paste the whole file, and click publish. You
        get a permanent URL with no signup and no email. Send the link to whoever
        you made the game for — that moment is the entire point of the exercise.
      </p>

      <h2 className="text-xs text-wood-dark mt-6 mb-2 normal-case font-semibold">
        What if it is not done at 30 minutes?
      </h2>
      <p>
        Publish what you have. A simple game that someone can play beats a
        complicated one stuck in a chat window. You can edit it later with your
        Creator Code. If you want ideas scoped to fit this time box, see{" "}
        <a
          href="/learn/game-ideas-you-can-build-with-ai-tonight"
          className="text-accent-purple hover:text-accent-gold transition-colors"
        >
          game ideas you can build in one evening
        </a>
        .
      </p>
      <p>Finished early? Publish the game at arcadelab.ai/publish.</p>
    </ArticleLayout>
  );
}
