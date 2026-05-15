import type { Metadata } from "next";
import ArticleLayout from "@/components/ArticleLayout";
import QuickAnswer from "@/components/QuickAnswer";
import { getArticle } from "@/lib/articles";

const article = getArticle("cursor-bolt-claude-publishing-workflow")!;

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
    question: "Does it matter which AI tool I used to build the project?",
    answer:
      "Not for publishing. Cursor, Bolt, v0, Lovable, Claude, ChatGPT, and Gemini all produce either a single HTML file or a project folder. The publishing step depends on which of those two shapes you have, not on the tool that made it.",
  },
  {
    question: "My AI tool gave me several files. Can I still use ArcadeLab?",
    answer:
      "Ask the assistant to combine the project into one self-contained HTML file with all CSS and JavaScript inline. Many games and visualizations flatten cleanly. If the project genuinely needs multiple files or a backend, use a host like Vercel or Netlify instead.",
  },
  {
    question: "Do I need to install anything to publish?",
    answer:
      "No. Publishing a single HTML file to ArcadeLab happens entirely in the browser — no Node, no CLI, no build step. You copy the file and paste it.",
  },
  {
    question: "Where do I find the code my AI assistant wrote?",
    answer:
      "In a chat tool, it is the code block or artifact in the assistant's reply. In an editor like Cursor, it is the files in your project folder. Copy the complete contents, not a summary or a snippet.",
  },
  {
    question: "Can I update the project after publishing?",
    answer:
      "Yes. ArcadeLab gives you a Creator Code when you first publish. With it you can edit or replace the file later. There is no account or password involved.",
  },
];

const HOW_TO = {
  name: "Publish AI-generated code to a public URL",
  description:
    "Take output from an AI coding tool and turn it into a shareable link.",
  totalTimeMinutes: 2,
  steps: [
    {
      name: "Identify the shape of the output",
      text: "Check whether your AI tool produced one self-contained HTML file or a multi-file project folder.",
    },
    {
      name: "Get the complete file",
      text: "Copy the entire HTML document from the first character to the last, or ask the assistant to combine a multi-file project into one self-contained HTML file.",
    },
    {
      name: "Add the ArcadeLab header",
      text: "Paste a short ARCADELAB comment block at the top of the file with the title, description, and any libraries used.",
    },
    {
      name: "Paste and publish",
      text: "Open arcadelab.ai/publish, paste the file into the box, and click publish to get a permanent URL.",
    },
    {
      name: "Share or embed the link",
      text: "Copy the resulting arcadelab.ai/play URL to share it, or embed it in another site with an iframe.",
    },
  ],
};

export default function Page() {
  return (
    <ArticleLayout article={article} faqs={FAQS} howTo={HOW_TO}>
      <QuickAnswer>
        Copy the finished file out of your AI tool, paste it into a publishing
        destination that matches its shape, and share the URL. For a single HTML
        file, ArcadeLab does this in about 30 seconds with no signup. For a
        multi-file app, connect the project folder to a host like Vercel or
        Netlify. The workflow is the same no matter which AI tool you used to
        build it.
      </QuickAnswer>

      <p>
        Cursor, Bolt, v0, Lovable, Claude, ChatGPT — the list of tools that write
        code from a description keeps growing. They are good at the building
        step. None of them, on their own, hands a non-developer a clean public
        link. That last hop is what this guide covers.
      </p>

      <h2 className="text-xs text-wood-dark mt-6 mb-2 normal-case font-semibold">
        Why is publishing the hard part now?
      </h2>
      <p>
        Writing the code used to be the wall. Now the wall has moved. An AI
        assistant can produce a working game in a single reply, but the reply is
        text in a chat window — not something a friend can open. Turning that
        text into a URL still trips people up, because the answer depends on what
        the tool produced. Sort that out first and the rest is mechanical.
      </p>

      <h2 className="text-xs text-wood-dark mt-6 mb-2 normal-case font-semibold">
        Step 1 — Figure out what your tool produced
      </h2>
      <p>
        Chat-style tools — Claude, ChatGPT, Gemini — usually produce a single
        self-contained HTML file, shown as one code block or an artifact.
        Project-style tools — Cursor, Bolt, v0, Lovable — usually produce a
        folder of files with a build step. A few prompts in either kind of tool
        can go the other way, so look at the actual output rather than assuming.
      </p>

      <h2 className="text-xs text-wood-dark mt-6 mb-2 normal-case font-semibold">
        Step 2 — Get the complete, self-contained file
      </h2>
      <p>
        For a single-file project, copy the whole document — it should start with
        an optional comment header or with the doctype line and end with the
        closing html tag. Do not copy a trimmed snippet. If your tool gave you
        several files, ask it directly: &quot;Combine this into one self-contained
        HTML file with all CSS and JavaScript inline.&quot; Games, visualizations,
        and toys almost always flatten. Apps with a real backend do not — and
        those belong on a full host.
      </p>

      <h2 className="text-xs text-wood-dark mt-6 mb-2 normal-case font-semibold">
        Step 3 — Publish a single-file project
      </h2>
      <p>
        Open arcadelab.ai/publish, paste the file into the box, and click
        publish. You get a permanent URL — arcadelab.ai/play/your-project — with
        no account, no email, and no build step. If the file uses a library like
        Phaser or p5.js, name it in the ARCADELAB header comment and ArcadeLab
        injects it from a CDN. The whole step takes under a minute. For more on
        the format, see{" "}
        <a
          href="/learn/single-file-html-game-template"
          className="text-accent-purple hover:text-accent-gold transition-colors"
        >
          what a good single-file HTML game template looks like
        </a>
        .
      </p>

      <h2 className="text-xs text-wood-dark mt-6 mb-2 normal-case font-semibold">
        Step 4 — Publish a multi-file app
      </h2>
      <p>
        If the project genuinely needs multiple files, a server, or a database,
        push the folder to a git host and connect it to Vercel or Netlify, or
        deploy straight from Replit if you built it there. This path has more
        steps — a repo, a build configuration, environment variables — and that
        is the right amount of work for an app that needs all of it. The mistake
        to avoid is using this path for something that was only ever one file.
      </p>

      <h2 className="text-xs text-wood-dark mt-6 mb-2 normal-case font-semibold">
        Does the AI tool I used change anything?
      </h2>
      <p>
        No. The publishing workflow keys off the output, not the brand of
        assistant. A single HTML file from Cursor publishes exactly like a single
        HTML file from Claude. Pick your platform by the shape of the thing in
        front of you, and the tool that made it stops mattering.
      </p>
      <p>
        Have a single-file project ready? Publish it at arcadelab.ai/publish.
      </p>
    </ArticleLayout>
  );
}
