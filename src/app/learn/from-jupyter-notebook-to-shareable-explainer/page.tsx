import type { Metadata } from "next";
import ArticleLayout from "@/components/ArticleLayout";
import QuickAnswer from "@/components/QuickAnswer";
import { getArticle } from "@/lib/articles";

const article = getArticle("from-jupyter-notebook-to-shareable-explainer")!;

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
    question: "Can I publish a Jupyter notebook file directly?",
    answer:
      "Not as an interactive page. A notebook file needs a Python kernel to run. To make it shareable to a general audience, rebuild the key result as a single self-contained HTML file that runs in any browser.",
  },
  {
    question: "Do I have to rebuild the whole notebook?",
    answer:
      "No. A notebook holds a lot of exploratory work. Pick the one result worth sharing — usually a chart or a finding — and rebuild only that as an interactive explainer.",
  },
  {
    question: "How does the data get into the HTML file?",
    answer:
      "Export the relevant rows from the notebook and embed them inline in the JavaScript as an array. The explainer then carries its own data and needs no Python and no network access.",
  },
  {
    question: "Can an AI assistant do the conversion?",
    answer:
      "Yes. Paste the relevant notebook cells and the data, and ask for a single self-contained HTML file that reproduces the chart with a control the reader can adjust. The assistant handles the translation from Python to browser JavaScript.",
  },
  {
    question: "Why turn a static chart into an interactive one?",
    answer:
      "A notebook chart shows one run of the analysis. An interactive explainer lets the reader change an input and see the result, which communicates the finding far better to someone who was not in the notebook with you.",
  },
];

export default function Page() {
  return (
    <ArticleLayout article={article} faqs={FAQS}>
      <QuickAnswer>
        A Jupyter notebook needs a Python kernel, so it cannot be shared as a
        live page to a general audience. Instead, pick the one result worth
        sharing, export its data, and rebuild it as a single self-contained HTML
        file — an interactive explainer that runs in any browser. Paste that file
        at arcadelab.ai/publish for a URL anyone can open.
      </QuickAnswer>

      <p>
        A Jupyter notebook is an excellent place to do analysis and a poor place
        to share a result. The fix is not to publish the notebook — it is to lift
        the finding out and rebuild it as something anyone can open.
      </p>

      <h2 className="text-xs text-wood-dark mt-6 mb-2 normal-case font-semibold">
        Why is a Jupyter notebook hard to share?
      </h2>
      <p>
        A notebook runs on a Python kernel. To open one interactively, a viewer
        needs that environment — or you need a hosted service to provide it. A
        static export loses the interactivity. Neither path gives a non-technical
        reader a link they can simply click. That gap is the problem worth
        solving.
      </p>

      <h2 className="text-xs text-wood-dark mt-6 mb-2 normal-case font-semibold">
        What should make the jump from notebook to explainer?
      </h2>
      <p>
        Not everything. A notebook is full of exploratory dead ends, intermediate
        steps, and scratch work. Choose the single result that is worth an
        audience — the chart that tells the story, the relationship that
        surprised you — and plan to rebuild only that.
      </p>

      <h2 className="text-xs text-wood-dark mt-6 mb-2 normal-case font-semibold">
        How do I rebuild the result as single-file HTML?
      </h2>
      <p>
        Hand an AI assistant the relevant cells and describe the explainer you
        want: &quot;Rebuild this chart as a single self-contained HTML file, and
        add a slider so the reader can change the assumption I varied here.&quot;
        The assistant translates the Python logic into browser JavaScript. You
        end up with an interactive explainer instead of a static export.
      </p>

      <h2 className="text-xs text-wood-dark mt-6 mb-2 normal-case font-semibold">
        How do I move the data across?
      </h2>
      <p>
        Export the rows the explainer actually needs — often a summarized or
        sampled version, not the full dataset — and embed them inline in the
        JavaScript. The published explainer runs sandboxed with no network
        access, so inline data is what keeps it self-sufficient. For more on this,
        see{" "}
        <a
          href="/learn/single-file-data-viz-publishing"
          className="text-accent-purple hover:text-accent-gold transition-colors"
        >
          how to publish a single-file data visualization
        </a>
        .
      </p>

      <h2 className="text-xs text-wood-dark mt-6 mb-2 normal-case font-semibold">
        Where do I publish the explainer?
      </h2>
      <p>
        Test the HTML file in a browser, then paste it at arcadelab.ai/publish
        for a permanent URL. The result is a page a colleague, a class, or a
        reader can open with one click — no Python, no install, no account.
      </p>
      <p>Have a result worth sharing? Publish it at arcadelab.ai/publish.</p>
    </ArticleLayout>
  );
}
