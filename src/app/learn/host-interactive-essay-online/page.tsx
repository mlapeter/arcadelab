import type { Metadata } from "next";
import ArticleLayout from "@/components/ArticleLayout";
import QuickAnswer from "@/components/QuickAnswer";
import { getArticle } from "@/lib/articles";

const article = getArticle("host-interactive-essay-online")!;

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
    question: "What is an interactive essay?",
    answer:
      "It is a piece of writing where prose is woven together with live diagrams, charts, or controls the reader can operate. Data journalism pieces and scrollytelling articles are common examples.",
  },
  {
    question: "Can I host an interactive essay for free?",
    answer:
      "Yes. ArcadeLab publishes a single-file interactive essay for free with no signup. GitHub Pages, Netlify, and Vercel also have free tiers for multi-file versions.",
  },
  {
    question: "Does an interactive essay need a server?",
    answer:
      "Usually not. If the interactivity runs in the browser — and most of it does — the essay is static files and needs no backend. A server is only required if the essay pulls live data on each visit.",
  },
  {
    question: "How do I put an interactive essay on my own site?",
    answer:
      "Publish it once to get its own URL, then embed it in your site with an iframe. The essay stays sandboxed and self-contained, so it drops cleanly into a blog, newsletter, or documentation page.",
  },
  {
    question: "What is the difference between this and a blog post?",
    answer:
      "A blog post is read top to bottom. An interactive essay asks the reader to do something — drag, toggle, scrub a timeline — and changes in response. The interaction is the point, not decoration.",
  },
];

export default function Page() {
  return (
    <ArticleLayout article={article} faqs={FAQS}>
      <QuickAnswer>
        An interactive essay weaves prose together with live diagrams, charts,
        and controls. Hosted as a single self-contained HTML file, it needs no
        build pipeline and no server. ArcadeLab publishes one from a single paste
        with no signup; for multi-page or asset-heavy essays, a static host like
        Netlify or Vercel fits better.
      </QuickAnswer>

      <p>
        An interactive essay is one of the most engaging things you can put on
        the web — and one of the most awkward to host, if you reach for the wrong
        tool. The good news is that most interactive essays are simpler to host
        than they look.
      </p>

      <h2 className="text-xs text-wood-dark mt-6 mb-2 normal-case font-semibold">
        What counts as an interactive essay?
      </h2>
      <p>
        Prose plus interaction. A data-journalism piece where the chart responds
        to your region. A science article where you scrub a timeline. A tutorial
        where a diagram updates as you change a value. The writing carries the
        argument; the interaction lets the reader test it.
      </p>

      <h2 className="text-xs text-wood-dark mt-6 mb-2 normal-case font-semibold">
        What are the hosting options?
      </h2>
      <ul className="list-disc list-inside space-y-1 my-3">
        <li><strong>ArcadeLab</strong> — paste a single HTML file, get a URL, no signup</li>
        <li><strong>GitHub Pages</strong> — good if the essay is already a repo</li>
        <li><strong>Netlify / Vercel</strong> — for multi-file essays with a build step</li>
        <li><strong>Your own site</strong> — embed a published essay with an iframe</li>
      </ul>

      <h2 className="text-xs text-wood-dark mt-6 mb-2 normal-case font-semibold">
        Why single-file HTML works for most essays
      </h2>
      <p>
        If the interactivity runs in the browser, an interactive essay is just
        HTML, CSS, and JavaScript. A single self-contained file holds all of it
        with no separate assets to manage. Pasting that one file is the whole
        publishing step — no repo, no build configuration, no deployment
        pipeline. For most essays, that is all the hosting they need.
      </p>

      <h2 className="text-xs text-wood-dark mt-6 mb-2 normal-case font-semibold">
        When do you need a full static host instead?
      </h2>
      <p>
        Reach for Netlify, Vercel, or GitHub Pages when the essay spans multiple
        pages, depends on large image or video files, or needs a custom domain of
        its own. Those are real reasons to take on a build step. A single-section
        essay with browser-side interactivity is not one of them.
      </p>

      <h2 className="text-xs text-wood-dark mt-6 mb-2 normal-case font-semibold">
        How do I publish a single-file interactive essay?
      </h2>
      <p>
        Build the essay as one HTML file with everything inline, test it in a
        browser, and paste it at arcadelab.ai/publish for a permanent URL. If you
        want to build the interactive pieces with an AI assistant, see{" "}
        <a
          href="/learn/make-interactive-explainer-with-ai"
          className="text-accent-purple hover:text-accent-gold transition-colors"
        >
          how to make an interactive explainer with AI
        </a>
        .
      </p>
      <p>Have an essay ready? Publish it at arcadelab.ai/publish.</p>
    </ArticleLayout>
  );
}
