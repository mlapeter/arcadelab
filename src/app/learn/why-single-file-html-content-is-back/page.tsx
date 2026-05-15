import type { Metadata } from "next";
import ArticleLayout from "@/components/ArticleLayout";
import QuickAnswer from "@/components/QuickAnswer";
import { getArticle } from "@/lib/articles";

const article = getArticle("why-single-file-html-content-is-back")!;

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
    question: "Is single-file HTML a step backward?",
    answer:
      "Not for the things it suits. For a self-contained game, visualization, or toy, one file is the simplest format that works. It is a step backward only if you force it onto a project that genuinely needs a build system.",
  },
  {
    question: "Why do AI assistants produce single-file HTML?",
    answer:
      "Because it is the format that runs immediately with no setup. An assistant can hand you one file and you can open it right away — no install, no project scaffold, no build. That immediacy is why it became the default output.",
  },
  {
    question: "Does single-file HTML scale to large projects?",
    answer:
      "No, and it is not meant to. It is the right format for one focused piece — a game, an explainer, a chart. Large multi-page applications still want a real project structure and a build pipeline.",
  },
  {
    question: "Will a single-file page still work in ten years?",
    answer:
      "Very likely. It depends only on the browser, which keeps strong backward compatibility. There is no toolchain to rot, no dependencies to break — just HTML, CSS, and JavaScript.",
  },
  {
    question: "Where do I publish single-file HTML content?",
    answer:
      "ArcadeLab is built for it: paste one HTML file and get a URL with no signup. CodePen, GitHub Pages, and static hosts also work, with varying amounts of setup.",
  },
];

export default function Page() {
  return (
    <ArticleLayout article={article} faqs={FAQS}>
      <QuickAnswer>
        Single-file HTML — one document holding all its own markup, styles, and
        scripts — is resurging because it fits how people build now. AI
        assistants produce it by default, it survives without a build pipeline,
        and it is trivial to share. The format never stopped working; the moment
        finally suits it.
      </QuickAnswer>

      <p>
        For years, &quot;just write an HTML file&quot; sounded quaint. Now it is
        quietly everywhere again — in AI chat outputs, in artifacts, in the things
        people share. The format did not change. The context around it did.
      </p>

      <h2 className="text-xs text-wood-dark mt-6 mb-2 normal-case font-semibold">
        What is single-file HTML?
      </h2>
      <p>
        It is one HTML document that contains everything it needs: the markup,
        the CSS inside a style tag, and the JavaScript inside a script tag. No
        separate stylesheet, no separate script file, no folder of assets. Open
        the file in a browser and it runs. That is the whole format.
      </p>

      <h2 className="text-xs text-wood-dark mt-6 mb-2 normal-case font-semibold">
        Why did the format fall out of fashion?
      </h2>
      <p>
        As web apps grew, projects needed structure: components, modules,
        bundlers, package managers. The build pipeline became standard, and a
        lone HTML file started to look unserious next to it. For large
        applications, that shift made sense. The cost was that the simple case
        inherited the complexity of the hard case.
      </p>

      <h2 className="text-xs text-wood-dark mt-6 mb-2 normal-case font-semibold">
        Why is it coming back now?
      </h2>
      <p>
        Three things lined up. AI assistants produce single-file HTML by default,
        because it is the output a person can run immediately. Build-tool fatigue
        is real, and a format with no toolchain is a relief. And sharing is
        easier than ever — one file is one paste, one URL. The format that needs
        the least setup is the format that travels best through an AI workflow.
      </p>

      <h2 className="text-xs text-wood-dark mt-6 mb-2 normal-case font-semibold">
        What is single-file HTML good for?
      </h2>
      <ul className="list-disc list-inside space-y-1 my-3">
        <li>Browser games — a self-contained loop with no backend</li>
        <li>Interactive visualizations and simulations</li>
        <li>Explainers and explorable essays</li>
        <li>Generative art and creative-coding sketches</li>
        <li>Small tools and toys that do one thing</li>
      </ul>

      <h2 className="text-xs text-wood-dark mt-6 mb-2 normal-case font-semibold">
        What are its limits?
      </h2>
      <p>
        Single-file HTML is for one focused piece, not a sprawling application.
        It has no backend, no multi-page routing, and a practical size limit.
        Those are not flaws — they are the edges of where the format fits. Inside
        those edges, nothing is simpler. To publish one, see{" "}
        <a
          href="/learn/publish-single-file-html-game"
          className="text-accent-purple hover:text-accent-gold transition-colors"
        >
          where to publish a single-file HTML game
        </a>
        .
      </p>
      <p>Have a single-file project? Publish it at arcadelab.ai/publish.</p>
    </ArticleLayout>
  );
}
