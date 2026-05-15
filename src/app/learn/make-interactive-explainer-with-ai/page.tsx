import type { Metadata } from "next";
import ArticleLayout from "@/components/ArticleLayout";
import QuickAnswer from "@/components/QuickAnswer";
import { getArticle } from "@/lib/articles";

const article = getArticle("make-interactive-explainer-with-ai")!;

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
    question: "What is the difference between an explainer and a slideshow?",
    answer:
      "A slideshow shows the reader fixed steps. An interactive explainer lets the reader change a variable and see the effect themselves. The reader drives it, which is what makes the idea stick.",
  },
  {
    question: "Do I need design skills to make a good explainer?",
    answer:
      "No. Clear beats fancy. One well-labeled control next to a diagram that responds to it teaches more than an elaborate layout. Describe the behavior you want and let the assistant handle the rest.",
  },
  {
    question: "How long should an interactive explainer be?",
    answer:
      "Short. One concept, one or two interactive pieces. If you are explaining several ideas, make several small explainers and link them rather than one long page.",
  },
  {
    question: "Can I embed an explainer in a blog or newsletter?",
    answer:
      "Yes. Once it is published as a single HTML file with its own URL, you can embed it with an iframe in most blogs, course pages, and documentation sites.",
  },
  {
    question: "What topics work well as interactive explainers?",
    answer:
      "Anything with a cause-and-effect relationship: compound interest, supply and demand, wave interference, sorting algorithms, probability. If changing an input changes an output, it works as an explainer.",
  },
];

export default function Page() {
  return (
    <ArticleLayout article={article} faqs={FAQS}>
      <QuickAnswer>
        An interactive explainer teaches a concept by letting the reader change
        something and see the result — a slider, a draggable point, a play
        button. Ask an AI assistant to build one as a single self-contained HTML
        file, pairing short text with a live diagram. Publish it as one file for
        a URL. The interaction is what makes the idea stick.
      </QuickAnswer>

      <p>
        Some ideas resist being explained in prose. They have moving parts, or a
        relationship between inputs and outputs that a reader has to feel rather
        than read. An interactive explainer lets the reader poke at the idea
        directly — and an AI assistant can build one quickly.
      </p>

      <h2 className="text-xs text-wood-dark mt-6 mb-2 normal-case font-semibold">
        What is an interactive explainer?
      </h2>
      <p>
        It is a small web page that pairs a short explanation with something the
        reader can manipulate. A diagram with a slider. A chart that updates as
        you drag a point. An animation you can pause and step through. The reader
        does not just read the explanation — they operate it.
      </p>

      <h2 className="text-xs text-wood-dark mt-6 mb-2 normal-case font-semibold">
        Why does interactivity beat static text?
      </h2>
      <p>
        A static diagram shows one case. An interactive one shows every case the
        reader cares to try. When someone moves a slider and watches the result
        change, they are running their own small experiments, and the
        understanding that comes from that sticks far better than a paragraph
        describing the same relationship.
      </p>

      <h2 className="text-xs text-wood-dark mt-6 mb-2 normal-case font-semibold">
        How do I prompt for one?
      </h2>
      <p>
        Describe the concept, the control, and the format in one request: &quot;A
        single self-contained HTML file that explains compound interest, with a
        slider for the interest rate and a chart that updates as the slider
        moves.&quot; Be specific about what the reader changes and what they see
        change in response. That cause-and-effect pair is the whole explainer.
      </p>

      <h2 className="text-xs text-wood-dark mt-6 mb-2 normal-case font-semibold">
        How should the explainer be structured?
      </h2>
      <p>
        Lead with one or two sentences of context. Put the interactive piece next
        to the text, not buried below it. Label every control. End with a line
        that tells the reader what to notice. Resist adding a second concept —
        when an explainer covers two ideas, it usually teaches neither well.
      </p>

      <h2 className="text-xs text-wood-dark mt-6 mb-2 normal-case font-semibold">
        How do I publish it?
      </h2>
      <p>
        Test the file in a browser, then paste it at arcadelab.ai/publish for a
        permanent URL with no signup. You can share that link directly or embed
        the explainer in a blog or course page with an iframe. For the explorable
        tradition this style comes from, see{" "}
        <a
          href="/learn/share-bret-victor-style-explorable"
          className="text-accent-purple hover:text-accent-gold transition-colors"
        >
          how to share a Bret Victor-style explorable
        </a>
        .
      </p>
      <p>Made an explainer? Publish it at arcadelab.ai/publish.</p>
    </ArticleLayout>
  );
}
