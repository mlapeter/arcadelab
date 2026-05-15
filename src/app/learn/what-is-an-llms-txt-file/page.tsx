import type { Metadata } from "next";
import ArticleLayout from "@/components/ArticleLayout";
import QuickAnswer from "@/components/QuickAnswer";
import { getArticle } from "@/lib/articles";

const article = getArticle("what-is-an-llms-txt-file")!;

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
    question: "Where does an llms.txt file live?",
    answer:
      "At the root of a domain — for example, arcadelab.ai/llms.txt. Placing it at a predictable path means an AI assistant or a person can find it without guessing.",
  },
  {
    question: "Is llms.txt an official standard?",
    answer:
      "It is an emerging convention rather than a formal web standard. It was proposed publicly, documented at llmstxt.org, and adopted by a growing number of sites. There is no governing body enforcing it.",
  },
  {
    question: "Does adding llms.txt guarantee an AI will read it?",
    answer:
      "No. It is an offer, not a command. Whether a given assistant fetches and uses the file is up to that assistant. The file simply makes a clear summary available for the ones that do.",
  },
  {
    question: "What is the difference between llms.txt and a sitemap?",
    answer:
      "A sitemap lists every URL for crawlers to index. An llms.txt file is a short, human-readable summary of what the site is and which pages matter most. One is a directory; the other is an introduction.",
  },
  {
    question: "Should every website have one?",
    answer:
      "It helps most for sites with a clear purpose an assistant might need to explain or act on — a tool, a platform, a documentation set. A file that concisely says what the site is and how to use it is the useful case.",
  },
];

export default function Page() {
  return (
    <ArticleLayout article={article} faqs={FAQS}>
      <QuickAnswer>
        An llms.txt file is a plain-text file at the root of a website that tells
        AI assistants what the site is, what it does, and which pages matter
        most. Think of it as a README written for language models. It is an
        emerging convention, documented at llmstxt.org, and a site adds one so AI
        assistants can describe and use it accurately.
      </QuickAnswer>

      <p>
        AI assistants increasingly read websites on a person&apos;s behalf — to
        answer a question, to explain a tool, to act inside a workflow. An
        llms.txt file is a website&apos;s way of introducing itself clearly to
        those assistants instead of leaving them to infer everything from raw
        pages.
      </p>

      <h2 className="text-xs text-wood-dark mt-6 mb-2 normal-case font-semibold">
        What is an llms.txt file?
      </h2>
      <p>
        It is a single plain-text file, placed at a predictable path like
        /llms.txt, that summarizes a website in language a model can absorb
        quickly. It is short, structured, and written to be read in one pass. The
        idea borrows the spirit of robots.txt — a small file at a known location
        — but its job is explanation rather than crawl rules.
      </p>

      <h2 className="text-xs text-wood-dark mt-6 mb-2 normal-case font-semibold">
        What goes in an llms.txt file?
      </h2>
      <ul className="list-disc list-inside space-y-1 my-3">
        <li>A short description of what the site is and who it is for</li>
        <li>The key URLs, each with a one-line summary</li>
        <li>Any rules or formats someone needs to know to use the site</li>
        <li>A pointer to a longer document for assistants that want more detail</li>
      </ul>

      <h2 className="text-xs text-wood-dark mt-6 mb-2 normal-case font-semibold">
        How is it different from robots.txt?
      </h2>
      <p>
        robots.txt tells crawlers which paths they may and may not visit. It
        controls access. llms.txt does not control anything — it explains. One is
        a gate; the other is a guide. A site can, and often does, have both, and
        they do not overlap in purpose.
      </p>

      <h2 className="text-xs text-wood-dark mt-6 mb-2 normal-case font-semibold">
        Why would a website add one?
      </h2>
      <p>
        When an AI assistant understands a site accurately, it describes that
        site accurately to the person asking. A clear llms.txt reduces the chance
        of a wrong summary and makes it more likely the assistant points someone
        to the right page. For a site whose whole purpose is to be used mid-task,
        that accuracy is worth a short file.
      </p>

      <h2 className="text-xs text-wood-dark mt-6 mb-2 normal-case font-semibold">
        How does ArcadeLab use llms.txt?
      </h2>
      <p>
        ArcadeLab serves a file at arcadelab.ai/llms.txt that explains the
        platform, lists the key pages, and describes the publishing format,
        plus a longer companion document for assistants that want the full
        briefing. It is part of treating AI assistants as a real audience — the
        same thinking behind{" "}
        <a
          href="/learn/building-ai-friendly-websites"
          className="text-accent-purple hover:text-accent-gold transition-colors"
        >
          building an AI-friendly website
        </a>
        .
      </p>
      <p>Curious what a publishing platform looks like? See arcadelab.ai/publish.</p>
    </ArticleLayout>
  );
}
