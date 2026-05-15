import type { Metadata } from "next";
import ArticleLayout from "@/components/ArticleLayout";
import QuickAnswer from "@/components/QuickAnswer";
import { getArticle } from "@/lib/articles";

const article = getArticle("prompts-to-make-a-browser-game-with-ai")!;

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

const EXAMPLE_PROMPT = `Make a single-file HTML game. Put all HTML, CSS, and
JavaScript in one file with nothing external.

The game: the player moves a ship left and right with the arrow keys
to dodge rocks falling from the top. The score goes up the longer they
survive. One hit ends the game with a restart prompt.

Requirements:
- Use the canvas API and draw everything with shapes (no image files).
- Make the canvas fill the window and resize with it.
- Do not use fetch, network requests, or external assets.
- Keep the whole file under 500KB.`;

const FAQS = [
  {
    question: "Do I need to know how to code to prompt for a game?",
    answer:
      "No. You describe the game in plain words and the assistant writes the code. Knowing the format to ask for — a single self-contained HTML file — matters far more than knowing JavaScript.",
  },
  {
    question: "Why specify a single-file HTML format in the prompt?",
    answer:
      "Without that instruction, an assistant may split the game across several files or assume a build tool. A single self-contained HTML file is the format you can publish directly, so asking for it up front saves a rewrite.",
  },
  {
    question: "Should I name a library like Phaser in the prompt?",
    answer:
      "Only if you want it. The plain canvas API is enough for most small games. If you do name a library, also tell the assistant not to add a script tag for it — publishers like ArcadeLab inject libraries from a CDN when you list them in the header.",
  },
  {
    question: "Why does my game keep getting more complex than I asked for?",
    answer:
      "Vague prompts invite scope creep. Describe one mechanic and one screen, and explicitly say what to leave out — no menus, no levels, no saved progress — so the assistant builds the small thing you can actually finish.",
  },
  {
    question: "What do I do when the game has a bug?",
    answer:
      "Describe the wrong behavior in plain words — what you did and what happened — rather than guessing at the code. The assistant can usually locate and fix it from a clear description of the symptom.",
  },
];

export default function Page() {
  return (
    <ArticleLayout article={article} faqs={FAQS}>
      <QuickAnswer>
        A good game prompt does three things: it names the exact format — one
        self-contained HTML file, all code inline — it describes one small,
        finishable game rather than a vague big one, and it states the
        constraints up front: no external files, works at any screen size, no
        network calls. Specify those and most AI assistants produce a game you
        can publish as-is.
      </QuickAnswer>

      <p>
        The difference between a prompt that produces a publishable game and one
        that produces a broken mess is rarely the game idea. It is the missing
        instructions about format and constraints. An assistant cannot guess that
        you want one file with no network access — so you have to say it.
      </p>

      <h2 className="text-xs text-wood-dark mt-6 mb-2 normal-case font-semibold">
        Why does the prompt matter so much?
      </h2>
      <p>
        An AI assistant will happily build a game that assumes a folder of image
        files, a bundler, and a server it can call. That game runs fine in a
        loose preview and then fails the moment you try to share it. The prompt
        is where you rule those assumptions out. Spend the words up front and you
        skip a round of confusing debugging later.
      </p>

      <h2 className="text-xs text-wood-dark mt-6 mb-2 normal-case font-semibold">
        What should every game prompt include?
      </h2>
      <ul className="list-disc list-inside space-y-1 my-3">
        <li>The format: &quot;a single self-contained HTML file, all code inline&quot;</li>
        <li>One mechanic, described in a sentence or two</li>
        <li>The controls: arrow keys, mouse, one button, or touch</li>
        <li>A win or lose condition, so the game has an ending</li>
        <li>The constraints: no external files, no network calls, resizes to the window</li>
      </ul>

      <h2 className="text-xs text-wood-dark mt-6 mb-2 normal-case font-semibold">
        What should you leave out?
      </h2>
      <p>
        Leave out everything that is not the core mechanic. Menus, level select,
        settings screens, saved high scores, and sound can all come later. If you
        list them in the first prompt, the assistant spreads its effort thin and
        the core game ends up half-built. Say so directly: &quot;no menus, no
        levels — just the core game on one screen.&quot;
      </p>

      <h2 className="text-xs text-wood-dark mt-6 mb-2 normal-case font-semibold">
        An example prompt that works
      </h2>
      <p>
        This prompt names the format, describes one mechanic, gives it an ending,
        and rules out the things that break a publishable game:
      </p>
      <pre className="text-[10px] leading-relaxed bg-wood-dark/10 text-wood-dark p-3 my-3 overflow-x-auto">
        <code>{EXAMPLE_PROMPT}</code>
      </pre>
      <p>
        Copy-and-customize prompt templates for specific libraries are collected
        on the{" "}
        <a
          href="/prompts"
          className="text-accent-purple hover:text-accent-gold transition-colors"
        >
          ArcadeLab prompts page
        </a>
        .
      </p>

      <h2 className="text-xs text-wood-dark mt-6 mb-2 normal-case font-semibold">
        How do you iterate after the first version?
      </h2>
      <p>
        Treat the first reply as a draft. Run it, then change one thing at a
        time: &quot;the ship moves too slowly,&quot; &quot;rocks should fall
        faster as the score climbs,&quot; &quot;add a flash when the player gets
        hit.&quot; Small, specific follow-ups keep the working game working. Large
        rewrites tend to reintroduce bugs you already fixed. When it plays well,
        see{" "}
        <a
          href="/learn/common-bugs-ai-generated-games"
          className="text-accent-purple hover:text-accent-gold transition-colors"
        >
          the common bugs to check before publishing
        </a>
        .
      </p>
      <p>Got a game you like? Publish it at arcadelab.ai/publish.</p>
    </ArticleLayout>
  );
}
