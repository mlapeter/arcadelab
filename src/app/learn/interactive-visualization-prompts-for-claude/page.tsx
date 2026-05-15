import type { Metadata } from "next";
import ArticleLayout from "@/components/ArticleLayout";
import QuickAnswer from "@/components/QuickAnswer";
import { getArticle } from "@/lib/articles";

const article = getArticle("interactive-visualization-prompts-for-claude")!;

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

const EXAMPLE_PROMPT = `Make a single-file HTML interactive visualization. Put
all HTML, CSS, and JavaScript in one file with nothing external.

Visualize how a population grows over time under different birth rates.
Show a line chart that redraws as the reader drags a slider for the
birth rate.

Requirements:
- Embed the data directly in the JavaScript as an array. Do not fetch it.
- Use SVG or the canvas API; if you use a library, use D3.
- Make the chart resize to fit the window.
- Label the axes and the slider clearly.
- Keep the whole file under 500KB.`;

const FAQS = [
  {
    question: "How is a visualization prompt different from a game prompt?",
    answer:
      "A game prompt centers on a mechanic and controls. A visualization prompt centers on data and what the reader can change about how it is shown. Both still need the single-file HTML format stated up front.",
  },
  {
    question: "Should I give the AI assistant my real data?",
    answer:
      "Yes, if you have it. Paste the dataset and ask the assistant to embed it inline. If you do not have data yet, ask it to generate a realistic sample so you can see the visualization working.",
  },
  {
    question: "Do I need to name a charting library?",
    answer:
      "Only if you have a preference. D3 gives the most control for custom charts. If you do not name one, the assistant will usually choose SVG or canvas, which is fine for straightforward charts.",
  },
  {
    question: "Why does my visualization try to load an external file?",
    answer:
      "The assistant defaulted to fetching a data file. Tell it explicitly to embed the data inline as a JavaScript array — published visualizations run sandboxed with no network access, so fetched files fail.",
  },
  {
    question: "Where are ready-made prompt templates?",
    answer:
      "The ArcadeLab prompts page has copy-and-customize templates, including one for interactive visualizations that already encodes the single-file format and the constraints.",
  },
];

export default function Page() {
  return (
    <ArticleLayout article={article} faqs={FAQS}>
      <QuickAnswer>
        A good visualization prompt names the single-file HTML format, describes
        the data and what it should reveal, specifies what the reader can change,
        and rules out network calls. Tell the assistant to embed the data inline
        rather than fetch it, and most produce a visualization you can publish
        as-is.
      </QuickAnswer>

      <p>
        Prompting for an interactive visualization is its own skill. The
        instructions that matter are different from the ones a game needs — and
        getting them right means the difference between a publishable file and
        one that breaks the moment it leaves the chat.
      </p>

      <h2 className="text-xs text-wood-dark mt-6 mb-2 normal-case font-semibold">
        Why visualization prompts differ from game prompts
      </h2>
      <p>
        A game is built around a mechanic: the prompt describes how the player
        acts and what happens. A visualization is built around data: the prompt
        describes what the data is, what relationship it should reveal, and what
        the reader can adjust to explore it. Same single-file format, different
        center of gravity. For the game side, see{" "}
        <a
          href="/learn/prompts-to-make-a-browser-game-with-ai"
          className="text-accent-purple hover:text-accent-gold transition-colors"
        >
          what prompts make a good browser game
        </a>
        .
      </p>

      <h2 className="text-xs text-wood-dark mt-6 mb-2 normal-case font-semibold">
        What should a visualization prompt include?
      </h2>
      <ul className="list-disc list-inside space-y-1 my-3">
        <li>The format: a single self-contained HTML file, all code inline</li>
        <li>The data: what it represents, and the actual values if you have them</li>
        <li>The relationship the chart should make visible</li>
        <li>The control: what the reader changes — a slider, a toggle, a dragged point</li>
        <li>The constraint: embed data inline, no fetch, resizes to the window</li>
      </ul>

      <h2 className="text-xs text-wood-dark mt-6 mb-2 normal-case font-semibold">
        An example prompt that works
      </h2>
      <pre className="text-[10px] leading-relaxed bg-wood-dark/10 text-wood-dark p-3 my-3 overflow-x-auto">
        <code>{EXAMPLE_PROMPT}</code>
      </pre>
      <p>
        The{" "}
        <a
          href="/prompts/make-an-interactive-visualization"
          className="text-accent-purple hover:text-accent-gold transition-colors"
        >
          interactive visualization prompt template
        </a>{" "}
        on ArcadeLab is a ready-made version you can copy and adapt.
      </p>

      <h2 className="text-xs text-wood-dark mt-6 mb-2 normal-case font-semibold">
        How do I prompt for the data?
      </h2>
      <p>
        If you have real data, paste it and say &quot;embed this inline as a
        JavaScript array.&quot; If you do not, ask the assistant to generate a
        realistic sample so the visualization has something to draw. Either way,
        the instruction that prevents the most bugs is the explicit one: do not
        fetch a data file.
      </p>

      <h2 className="text-xs text-wood-dark mt-6 mb-2 normal-case font-semibold">
        How do I iterate on a visualization?
      </h2>
      <p>
        Treat the first result as a draft and refine one thing at a time: the
        axis labels, the color scale, the slider range, the redraw smoothness.
        Specific, narrow follow-ups keep a working chart working. When it reads
        clearly, paste the file at arcadelab.ai/publish for a URL.
      </p>
      <p>Built a visualization? Publish it at arcadelab.ai/publish.</p>
    </ArticleLayout>
  );
}
