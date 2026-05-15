import type { Metadata } from "next";
import ArticleLayout from "@/components/ArticleLayout";
import QuickAnswer from "@/components/QuickAnswer";
import { getArticle } from "@/lib/articles";

const article = getArticle("building-ai-friendly-websites")!;

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
    question: "Is an AI-friendly website different from an SEO-friendly one?",
    answer:
      "They overlap heavily. Clear structure, fast pages, and good metadata help both search engines and AI assistants. AI-friendly adds an emphasis on plain answers and machine-readable summaries that an assistant can quote directly.",
  },
  {
    question: "Do I need to block or allow AI crawlers?",
    answer:
      "If you want AI assistants to find and cite your site, allow them in robots.txt. Many sites block AI crawlers by default; an AI-friendly site explicitly permits the ones it wants to reach.",
  },
  {
    question: "What is structured data?",
    answer:
      "Structured data is machine-readable markup — usually JSON-LD — that labels what a page contains: an article, an FAQ, an organization, a product. It lets a machine read meaning rather than guess from layout.",
  },
  {
    question: "Will making a site AI-friendly hurt human readers?",
    answer:
      "No. The same changes — clear headings, direct answers, fast pages, honest summaries — make a site better for people too. AI-friendly is mostly just clear, and clear serves everyone.",
  },
  {
    question: "How do I know if it is working?",
    answer:
      "Ask AI assistants questions your site should answer and see whether they cite or describe it accurately. Track referral traffic from AI tools. Both signals tell you whether assistants are finding and trusting the site.",
  },
];

export default function Page() {
  return (
    <ArticleLayout article={article} faqs={FAQS}>
      <QuickAnswer>
        An AI-friendly website is one an AI assistant can read, understand, and
        describe accurately. The practical steps are clear structured data,
        content written as direct answers, an llms.txt summary, and robots rules
        that welcome AI crawlers. None of it is exotic — it is mostly the same
        clarity that helps human readers, made explicit.
      </QuickAnswer>

      <p>
        People increasingly meet a website through an AI assistant before they
        ever visit it directly. That makes the assistant an audience worth
        designing for. An AI-friendly site is simply one that is easy for that
        audience to read correctly.
      </p>

      <h2 className="text-xs text-wood-dark mt-6 mb-2 normal-case font-semibold">
        What does AI-friendly actually mean?
      </h2>
      <p>
        It means an assistant can land on the site, work out what it is and what
        it does, and pass that on without guessing. The goal is accuracy: when
        someone asks an AI about your topic, you want the answer to reflect your
        site as it really is. Everything below serves that one goal.
      </p>

      <h2 className="text-xs text-wood-dark mt-6 mb-2 normal-case font-semibold">
        Add structured data
      </h2>
      <p>
        Structured data — typically JSON-LD embedded in the page — labels what a
        page contains: an article, an FAQ, an organization, a person. It turns a
        layout a machine has to interpret into facts a machine can read directly.
        Mark up the page types that match your content and keep the markup honest
        about what is actually there.
      </p>

      <h2 className="text-xs text-wood-dark mt-6 mb-2 normal-case font-semibold">
        Write content as clear answers
      </h2>
      <p>
        Lead with the answer. Phrase headings as the questions a reader would
        ask, and answer each one in the first sentence or two beneath it. An
        assistant quoting your page should be able to lift a clean, correct
        sentence without untangling it from preamble. This article and every
        other guide on ArcadeLab is written this way on purpose.
      </p>

      <h2 className="text-xs text-wood-dark mt-6 mb-2 normal-case font-semibold">
        Add an llms.txt file
      </h2>
      <p>
        An llms.txt file is a short plain-text summary of the site, placed at a
        known path, written for assistants to read in one pass. It states what
        the site is, lists the pages that matter, and links to a fuller briefing.
        For the details, see{" "}
        <a
          href="/learn/what-is-an-llms-txt-file"
          className="text-accent-purple hover:text-accent-gold transition-colors"
        >
          what an llms.txt file is
        </a>
        .
      </p>

      <h2 className="text-xs text-wood-dark mt-6 mb-2 normal-case font-semibold">
        Let AI crawlers in
      </h2>
      <p>
        An assistant can only cite a page it is allowed to read. Many sites block
        AI crawlers by default in robots.txt. If you want assistants to find your
        site, permit the crawlers you care about explicitly, and keep a sitemap
        current so there is a clean list of pages to discover.
      </p>

      <h2 className="text-xs text-wood-dark mt-6 mb-2 normal-case font-semibold">
        Why this matters now
      </h2>
      <p>
        A growing share of discovery happens inside an AI conversation. A site
        that an assistant can read clearly gets described and recommended
        accurately; a site that an assistant struggles with gets summarized
        vaguely or skipped. The work is modest and the same clarity serves human
        readers — which makes it an easy investment.
      </p>
      <p>Building something to publish? Start at arcadelab.ai/publish.</p>
    </ArticleLayout>
  );
}
