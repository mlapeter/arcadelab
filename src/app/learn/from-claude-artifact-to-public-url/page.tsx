import type { Metadata } from "next";
import ArticleLayout from "@/components/ArticleLayout";
import QuickAnswer from "@/components/QuickAnswer";
import { getArticle } from "@/lib/articles";

const article = getArticle("from-claude-artifact-to-public-url")!;

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

const HOW_TO = {
  name: "Turn a Claude artifact into a public URL",
  description:
    "Publish an interactive Claude artifact as a permanent public web page.",
  totalTimeMinutes: 2,
  steps: [
    {
      name: "Open the artifact source",
      text: "In the artifact panel, switch to the code view so you can see the full HTML source.",
    },
    {
      name: "Copy the full file",
      text: "Select and copy everything, from the doctype line to the closing html tag.",
    },
    {
      name: "Confirm it is self-contained",
      text: "Check that all CSS and JavaScript is inline and that the artifact makes no network calls.",
    },
    {
      name: "Paste into a publisher",
      text: "Open arcadelab.ai/publish and paste the artifact code into the box.",
    },
    {
      name: "Publish and share",
      text: "Click publish to get a permanent arcadelab.ai/play URL anyone can open.",
    },
  ],
};

const FAQS = [
  {
    question: "Can I just send someone the Claude conversation link?",
    answer:
      "A shared conversation shows the chat, not a clean playable page, and it requires the viewer to load Claude. A published URL opens the artifact directly as its own web page — no account and no chat around it.",
  },
  {
    question: "What if the artifact is a React component, not plain HTML?",
    answer:
      "Ask Claude to convert it into a single self-contained HTML file with all code inline. Most interactive artifacts convert cleanly. Once it is one HTML file, it publishes like any other.",
  },
  {
    question: "Will the artifact still work after publishing?",
    answer:
      "Yes, as long as it is self-contained and makes no network calls. Artifacts are already sandboxed, so most are written exactly the way a publishing host needs — one file, everything inline.",
  },
  {
    question: "Do I need a Claude account to publish the artifact?",
    answer:
      "You need Claude to create the artifact. You do not need any account to publish it — ArcadeLab takes the pasted code with no signup, no email, and no password.",
  },
  {
    question: "Can I publish artifacts that are visualizations, not games?",
    answer:
      "Yes. Simulations, charts, animated explainers, and interactive toys all publish the same way as games. If it is a single self-contained HTML file, the format does not care what it is.",
  },
];

export default function Page() {
  return (
    <ArticleLayout article={article} faqs={FAQS} howTo={HOW_TO}>
      <QuickAnswer>
        A Claude artifact runs inside the Claude conversation and is not a public
        web page. To share one, copy the artifact&apos;s full HTML source, then
        paste it into a host that serves single-file HTML. ArcadeLab does this
        with no signup — paste the artifact code at arcadelab.ai/publish and get
        a permanent public URL in about 30 seconds.
      </QuickAnswer>

      <p>
        Claude artifacts are genuinely interactive — games, visualizations, and
        tools that run right there in the chat. The catch: they live inside the
        conversation. To put one in front of other people, you need to lift it
        out and give it a URL of its own.
      </p>

      <h2 className="text-xs text-wood-dark mt-6 mb-2 normal-case font-semibold">
        What is a Claude artifact, and why is it not already a URL?
      </h2>
      <p>
        An artifact is a self-contained piece of content Claude renders in a side
        panel — usually a single HTML document. It runs for you because the
        conversation is rendering it. It is not, on its own, a page on the open
        web: there is no public address a friend can type in. Publishing is the
        step that turns the artifact into a real, linkable page.
      </p>

      <h2 className="text-xs text-wood-dark mt-6 mb-2 normal-case font-semibold">
        Step 1 — Get the artifact&apos;s full source
      </h2>
      <p>
        In the artifact panel, switch to the code or source view. Select the
        entire document — from the first line to the last — and copy it. You want
        the whole file, not a fragment. If the panel only shows a rendered
        preview, ask Claude to &quot;show the full HTML source of this
        artifact.&quot;
      </p>

      <h2 className="text-xs text-wood-dark mt-6 mb-2 normal-case font-semibold">
        Step 2 — Make sure it is self-contained
      </h2>
      <p>
        The file should carry everything it needs: CSS in a style tag,
        JavaScript in a script tag, no separate asset files, and no network
        calls. Most artifacts already meet this bar because the artifact
        environment is itself sandboxed. If yours is a React-style artifact, ask
        Claude to &quot;convert this into one self-contained HTML file with all
        code inline&quot; and use that version.
      </p>

      <h2 className="text-xs text-wood-dark mt-6 mb-2 normal-case font-semibold">
        Step 3 — Publish it for a public URL
      </h2>
      <p>
        Open arcadelab.ai/publish, paste the artifact code into the box, and
        click publish. You get a permanent URL — arcadelab.ai/play/your-thing —
        with no account required. If the artifact uses a library like p5.js or
        Three.js, name it in the ARCADELAB header and ArcadeLab injects it for
        you. The whole step takes under a minute.
      </p>

      <h2 className="text-xs text-wood-dark mt-6 mb-2 normal-case font-semibold">
        What kinds of artifacts work?
      </h2>
      <p>
        Anything that is a single self-contained HTML document: games, physics
        simulations, data visualizations, animated explainers, generative art,
        and small interactive tools. The publishing format does not distinguish
        between them. For the broader picture, see{" "}
        <a
          href="/learn/share-interactive-thing-made-with-ai"
          className="text-accent-purple hover:text-accent-gold transition-colors"
        >
          how to share an interactive thing you made with AI
        </a>
        .
      </p>
      <p>Have an artifact ready? Publish it at arcadelab.ai/publish.</p>
    </ArticleLayout>
  );
}
