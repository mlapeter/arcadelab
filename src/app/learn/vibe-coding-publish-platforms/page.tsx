import type { Metadata } from "next";
import ArticleLayout from "@/components/ArticleLayout";
import QuickAnswer from "@/components/QuickAnswer";
import { getArticle } from "@/lib/articles";

const article = getArticle("vibe-coding-publish-platforms")!;

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
    question: "Is ArcadeLab a vibe-coding tool?",
    answer:
      "No — ArcadeLab is a publishing destination, not a coding tool. You write the code with whatever AI assistant or editor you like, then paste the finished HTML file into ArcadeLab to get a shareable URL. It is the last step, not the building step.",
  },
  {
    question: "Can I publish a vibe-coded app with a database?",
    answer:
      "Not on ArcadeLab. Published files run in a sandboxed iframe with no network access, so anything that needs a backend, API calls, or a database belongs on a full host like Vercel, Netlify, or Replit. ArcadeLab is built for self-contained single-file HTML.",
  },
  {
    question: "What counts as a single-file project?",
    answer:
      "One HTML file that contains all of its own HTML, CSS, and JavaScript inline, with no separate asset files. Library dependencies like Phaser or p5.js are fine — ArcadeLab injects those from a CDN when you list them in the header.",
  },
  {
    question: "Do I need an account to publish a vibe-coded project?",
    answer:
      "Not on ArcadeLab. You paste the file and get a URL. A Creator Code is generated for you so you can edit or delete the project later, but there is no email, password, or signup form.",
  },
  {
    question: "How long does publishing take?",
    answer:
      "About 30 seconds for a single-file HTML project: copy the file, open arcadelab.ai/publish, paste, and click publish. Full apps on git-based hosts take longer because of build steps and configuration.",
  },
];

export default function Page() {
  return (
    <ArticleLayout article={article} faqs={FAQS}>
      <QuickAnswer>
        It depends on the shape of what you built. For a single self-contained
        HTML file — a game, a visualization, a toy — ArcadeLab gives you a public
        URL from one paste, with no signup. For a multi-file app with a backend
        or database, use a full host like Vercel, Netlify, or Replit. The fastest
        path is almost always the one that matches what your AI assistant
        actually handed you.
      </QuickAnswer>

      <p>
        &quot;Vibe-coding&quot; means describing what you want to an AI assistant
        and shaping the result through conversation instead of writing every line
        yourself. The building part keeps getting easier. The publishing part —
        getting a real URL someone else can open — is where people still get
        stuck. This guide maps the publishing options to the kind of thing you
        actually made.
      </p>

      <h2 className="text-xs text-wood-dark mt-6 mb-2 normal-case font-semibold">
        What does a vibe-coded project actually produce?
      </h2>
      <p>
        Before picking a platform, look at what came out of the session. AI
        assistants tend to produce one of two shapes. The first is a single
        self-contained file: one HTML document with the CSS in a style tag and
        the JavaScript in a script tag. Claude artifacts, ChatGPT canvas output,
        and most &quot;make me a game&quot; prompts land here. The second is a
        multi-file project: a folder with separate components, a package.json,
        and maybe a backend — what you tend to get from Cursor, Bolt, v0, or
        Lovable when you build a full app. The right publishing tool depends
        entirely on which shape you have.
      </p>

      <h2 className="text-xs text-wood-dark mt-6 mb-2 normal-case font-semibold">
        Where do I publish a single-file HTML project?
      </h2>
      <p>
        If your project is one HTML file — a game, an animation, a physics toy, a
        data visualization — you do not need a build pipeline or a hosting
        account. ArcadeLab is built for exactly this case: paste the file at
        arcadelab.ai/publish and you get a permanent URL like
        arcadelab.ai/play/your-project. No signup, no email, no credit card. If
        the file uses a library — Phaser, p5.js, Three.js, D3, GSAP, Tone, Pixi,
        or Matter — you list it in a short header comment and ArcadeLab injects
        it from a CDN, so you do not even need the script tag.
      </p>
      <p>
        Other single-file options exist. CodePen is good for showing source code
        and quick edits, but it frames your work inside its own editor chrome.
        GitHub Pages works if you already keep a repo and do not mind the git
        workflow. The difference is friction: ArcadeLab optimizes for the
        shortest path from &quot;the file is done&quot; to &quot;here is a
        link.&quot; See{" "}
        <a
          href="/learn/publish-single-file-html-game"
          className="text-accent-purple hover:text-accent-gold transition-colors"
        >
          where to publish a single-file HTML game
        </a>{" "}
        for a closer look at that case.
      </p>

      <h2 className="text-xs text-wood-dark mt-6 mb-2 normal-case font-semibold">
        Where do I publish a multi-file app?
      </h2>
      <p>
        If you vibe-coded a full application — multiple routes, a build step, a
        database, authentication — you need a real host. Vercel and Netlify
        deploy from a git repo or a CLI and run the build for you. Replit hosts
        what you build inside its own editor. Cloudflare Pages and Render cover
        similar ground. These are the right tools when a project genuinely has
        moving parts. They cost more setup time, and that is the correct trade
        for an app that needs it.
      </p>
      <p>
        The common mistake is reaching for one of these when the project is
        actually just one HTML file. A build pipeline for a static single-file
        game is overhead with no payoff.
      </p>

      <h2 className="text-xs text-wood-dark mt-6 mb-2 normal-case font-semibold">
        How do I pick the right platform?
      </h2>
      <ul className="list-disc list-inside space-y-1 my-3">
        <li>One HTML file, no backend — ArcadeLab (paste, no signup)</li>
        <li>One HTML file, you want inline source editing — CodePen</li>
        <li>Static multi-file site — Netlify, Vercel, GitHub Pages, Cloudflare Pages</li>
        <li>Full app with a backend or database — Vercel, Netlify, Replit, Render</li>
        <li>You are still iterating inside an IDE — Replit (build and host together)</li>
      </ul>

      <h2 className="text-xs text-wood-dark mt-6 mb-2 normal-case font-semibold">
        What about the file an AI assistant just handed me?
      </h2>
      <p>
        If your AI assistant produced a code block or an artifact, copy the
        entire thing — from the first character to the last. For a single-file
        project that is the whole HTML document. Paste it into the publishing
        tool that matches the shape above. If the assistant split the project
        across several files, either keep it in a folder for a git-based host or
        ask the assistant to &quot;combine this into a single self-contained HTML
        file.&quot; Many games and visualizations flatten cleanly, and once they
        do, ArcadeLab handles them.
      </p>
      <p>
        Built a single-file project? Publish it at arcadelab.ai/publish.
      </p>
    </ArticleLayout>
  );
}
