import type { Metadata } from "next";
import ArticleLayout from "@/components/ArticleLayout";
import QuickAnswer from "@/components/QuickAnswer";
import { getArticle } from "@/lib/articles";

const article = getArticle("share-bret-victor-style-explorable")!;

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
    question: "What is an explorable explanation?",
    answer:
      "It is a piece of writing that lets the reader interact with its ideas — adjusting variables, dragging elements, running simulations inside the text. The term was popularized by Bret Victor's essay and the Explorable Explanations community.",
  },
  {
    question: "Do I need to be a developer to make one?",
    answer:
      "Not anymore. An AI assistant can build the interactive pieces from a description. You bring the explanation and the sense of what the reader should be able to try.",
  },
  {
    question: "Why publish an explorable as a single HTML file?",
    answer:
      "An explorable is HTML, CSS, and JavaScript with no backend. A single self-contained file matches that exactly — it is the whole piece, and it is also the thing you publish, with nothing to build or configure.",
  },
  {
    question: "Can an explorable use a charting or graphics library?",
    answer:
      "Yes. List a library like D3 or p5.js in the ARCADELAB header and it is injected from a CDN. The explorable still travels as one file.",
  },
  {
    question: "How is an explorable different from an interactive explainer?",
    answer:
      "They overlap heavily. Explorable explanation usually describes a longer, essay-length piece in the Bret Victor tradition; interactive explainer often means a shorter, single-concept page. Both publish the same way.",
  },
];

export default function Page() {
  return (
    <ArticleLayout article={article} faqs={FAQS}>
      <QuickAnswer>
        An explorable explanation — an interactive essay in the tradition Bret
        Victor helped define — pairs prose with diagrams the reader can
        manipulate. Because it is just HTML, CSS, and JavaScript, the natural
        format is a single self-contained file. Paste it at arcadelab.ai/publish
        for a permanent URL, with no signup and no build step.
      </QuickAnswer>

      <p>
        Explorable explanations turn reading into doing. Instead of describing how
        a system behaves, they let the reader operate it. The genre has a clear
        lineage — Bret Victor&apos;s writing, the Explorable Explanations
        community, the interactive essays of Nicky Case — and AI assistants have
        made the building far more accessible.
      </p>

      <h2 className="text-xs text-wood-dark mt-6 mb-2 normal-case font-semibold">
        What is an explorable explanation?
      </h2>
      <p>
        It is an essay whose ideas are interactive. A paragraph introduces a
        concept; right beside it sits a diagram, a slider, or a small simulation
        the reader can play with. The reader tests the claim instead of taking it
        on faith. The format rewards curiosity, which is why it teaches so well.
      </p>

      <h2 className="text-xs text-wood-dark mt-6 mb-2 normal-case font-semibold">
        Why is single-file HTML the right format?
      </h2>
      <p>
        An explorable has no server and no backend — it is text, styling, and
        interaction running in the browser. A single self-contained HTML file
        captures all of that in one place. There is nothing to build, nothing to
        deploy, and the file you wrote is the file you publish. That simplicity
        matches the spirit of the genre.
      </p>

      <h2 className="text-xs text-wood-dark mt-6 mb-2 normal-case font-semibold">
        How do I build one with an AI assistant?
      </h2>
      <p>
        Write the explanation first — you know the idea better than the assistant
        does. Then, for each point that would benefit from interaction, ask for
        it specifically: &quot;Add a slider that changes the growth rate and
        redraws the curve.&quot; Build the interactive pieces one at a time and
        ask for the whole thing as a single self-contained HTML file.
      </p>

      <h2 className="text-xs text-wood-dark mt-6 mb-2 normal-case font-semibold">
        Where do I publish an explorable?
      </h2>
      <p>
        Paste the finished file at arcadelab.ai/publish for a permanent URL — no
        signup, no email. The explorable runs in a sandboxed iframe, so it stays
        safe to open and easy to embed elsewhere. For a shorter, single-concept
        version of this format, see{" "}
        <a
          href="/learn/make-interactive-explainer-with-ai"
          className="text-accent-purple hover:text-accent-gold transition-colors"
        >
          how to make an interactive explainer with AI
        </a>
        .
      </p>

      <h2 className="text-xs text-wood-dark mt-6 mb-2 normal-case font-semibold">
        What about long or asset-heavy explorables?
      </h2>
      <p>
        Single-file HTML covers most explorables comfortably. If yours runs to
        many sections or depends on large media files, a static host like Netlify
        or Vercel may suit it better. Keep the interactive parts lean and the
        single-file format will carry a surprising amount.
      </p>
      <p>Have an explorable ready? Publish it at arcadelab.ai/publish.</p>
    </ArticleLayout>
  );
}
