import type { Metadata } from "next";
import ArticleLayout from "@/components/ArticleLayout";
import QuickAnswer from "@/components/QuickAnswer";
import { getArticle } from "@/lib/articles";

const article = getArticle("homeschool-coding-projects-with-ai")!;

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
    question: "Does a homeschooler need to know how to code first?",
    answer:
      "No. A learner can start by describing what they want to an AI assistant and reading the result. Understanding the code grows from changing it and seeing what happens — the project itself is the lesson.",
  },
  {
    question: "What subjects can a coding project cover?",
    answer:
      "More than computer science. A physics simulation covers science, a fractal explorer covers math, a timeline covers history, a vocabulary game covers language. A browser project can be the medium for almost any subject.",
  },
  {
    question: "How long should a project take?",
    answer:
      "Keep early projects to a single sitting — one mechanic, one screen. A finished small project teaches more than an ambitious one that stalls. Longer projects can come once the workflow is familiar.",
  },
  {
    question: "Is it safe to publish a homeschooler's project?",
    answer:
      "Yes, on a platform that needs no account and no email and sandboxes every game. ArcadeLab collects no personal data — a learner pastes a file and gets a URL, with a Creator Code to edit it later.",
  },
  {
    question: "What does the learner get out of publishing it?",
    answer:
      "A real link to a real thing they made. Sharing the result with family or friends turns an exercise into an accomplishment, and that is a strong motivator to build the next one.",
  },
];

export default function Page() {
  return (
    <ArticleLayout article={article} faqs={FAQS}>
      <QuickAnswer>
        A homeschooler can build browser games, simulations, and visualizations
        with an AI assistant, then publish each one as a shareable link.
        Single-file HTML projects suit home learning: they are small, finish in
        one sitting, and cover any subject. ArcadeLab publishes them with no
        account and no personal data collected.
      </QuickAnswer>

      <p>
        Coding projects fit homeschool learning unusually well. They are
        self-paced, they produce something real, and with an AI assistant a
        learner can attempt projects that would once have needed years of
        groundwork. The key is choosing projects the right size.
      </p>

      <h2 className="text-xs text-wood-dark mt-6 mb-2 normal-case font-semibold">
        Why coding projects suit homeschool learning
      </h2>
      <p>
        A homeschool schedule has room for project work that a class period
        does not. A learner can sit with one idea, follow where it leads, and
        finish it on their own clock. A browser project gives that work a clear
        endpoint — a thing that runs — and a clear way to show it.
      </p>

      <h2 className="text-xs text-wood-dark mt-6 mb-2 normal-case font-semibold">
        What kinds of projects work?
      </h2>
      <ul className="list-disc list-inside space-y-1 my-3">
        <li>A small arcade game — practice with logic and rules</li>
        <li>A physics or biology simulation — science made visible</li>
        <li>A math visualization — fractals, graphs, geometry</li>
        <li>A history timeline or map — research turned interactive</li>
        <li>A quiz or vocabulary game — any subject, made playable</li>
      </ul>

      <h2 className="text-xs text-wood-dark mt-6 mb-2 normal-case font-semibold">
        How does an AI assistant fit in?
      </h2>
      <p>
        The assistant is a building partner, not a replacement for thinking. A
        learner describes what they want, reads what comes back, and decides what
        to change. The learning is in that loop — forming a clear request,
        judging the result, and steering the next step. The assistant lowers the
        starting wall so the thinking can begin sooner.
      </p>

      <h2 className="text-xs text-wood-dark mt-6 mb-2 normal-case font-semibold">
        How do students share what they build?
      </h2>
      <p>
        Build the project as a single HTML file and paste it at
        arcadelab.ai/publish. The learner gets a URL to send to grandparents, a
        co-op, or friends — no account, no email, nothing personal collected. For
        the safety details, see{" "}
        <a
          href="/learn/safe-game-sharing-for-kids"
          className="text-accent-purple hover:text-accent-gold transition-colors"
        >
          what makes game sharing safe for kids
        </a>
        .
      </p>

      <h2 className="text-xs text-wood-dark mt-6 mb-2 normal-case font-semibold">
        How do I keep projects the right size?
      </h2>
      <p>
        Start small. One mechanic, one screen, one sitting. A finished simple
        project builds confidence and a working habit; an over-ambitious one
        stalls and discourages. Scope up only once finishing has become routine.
      </p>
      <p>Built a project? Publish it at arcadelab.ai/publish.</p>
    </ArticleLayout>
  );
}
