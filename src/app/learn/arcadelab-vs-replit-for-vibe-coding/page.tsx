import type { Metadata } from "next";
import Link from "next/link";
import ArticleLayout from "@/components/ArticleLayout";
import QuickAnswer from "@/components/QuickAnswer";
import { getArticle } from "@/lib/articles";

const article = getArticle("arcadelab-vs-replit-for-vibe-coding")!;

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
    question: "Is ArcadeLab a Replit alternative?",
    answer:
      "Partially. Replit is a full vibe-coding IDE with built-in AI assistance, multi-file projects, package management, and hosting. ArcadeLab is purpose-built for the single-file HTML output you get after vibe coding. The two fit at different stages of the workflow.",
  },
  {
    question: "Which is free?",
    answer:
      "Both have free tiers. Replit's free tier limits compute and sleeps unused projects. ArcadeLab is fully free with no tier — but only hosts single-file HTML up to 500KB, no backend.",
  },
  {
    question: "Can I use Replit to build, then publish to ArcadeLab?",
    answer:
      "Yes — that's a natural combo. Use Replit (or any vibe-coding IDE) to develop and iterate, then once you have a stable single-file HTML version, paste it into ArcadeLab for a permanent, embeddable URL with no IDE dependency.",
  },
  {
    question: "When should I just stay in Replit?",
    answer:
      "If your project needs a backend, database, multi-file structure, or live collaboration — stay in Replit. ArcadeLab won't fit those shapes.",
  },
  {
    question: "When should I move to ArcadeLab?",
    answer:
      "When your project is a single-file HTML thing (game, viz, demo), you want a permanent URL with no IDE runtime dependency, and you want zero account friction for the people you're sharing it with.",
  },
];

export default function Page() {
  return (
    <ArticleLayout article={article} faqs={FAQS}>
      <QuickAnswer>
        Replit is a full vibe-coding IDE plus hosting. ArcadeLab is paste-and-publish for
        single-file HTML output. They&apos;re different shapes, not competitors — use
        Replit (or Cursor, Bolt, v0, etc.) to <em>build</em>, then{" "}
        <Link href="/publish" className="text-accent-purple underline">paste at arcadelab.ai/publish</Link>{" "}
        when you have a finished single-file thing you want to share permanently.
      </QuickAnswer>

      <p>
        A lot of vibe coders ask whether ArcadeLab competes with Replit. It doesn&apos;t —
        not really. The two fit at different points in the workflow.
      </p>

      <h2 className="text-xs text-wood-dark mt-6 mb-2 normal-case font-semibold">
        What Replit does well
      </h2>
      <ul className="list-disc list-inside space-y-1 my-3">
        <li>Full vibe-coding IDE with AI agent built in (&quot;Agent&quot;)</li>
        <li>Multi-file projects, package management, environment variables</li>
        <li>Backend code (Node, Python, Go, etc.) with persistent compute</li>
        <li>Built-in databases (Replit DB)</li>
        <li>Live collaboration on code</li>
        <li>One-click deploy to a Replit URL</li>
      </ul>
      <p>
        Replit shines when you&apos;re iterating on a complex project, want live AI help
        while coding, or need a backend. The Replit URL is fine for sharing — but it&apos;s
        a Replit-runtime URL, which means the project depends on Replit staying up,
        configured, and not sleeping.
      </p>

      <h2 className="text-xs text-wood-dark mt-6 mb-2 normal-case font-semibold">
        What ArcadeLab does well
      </h2>
      <ul className="list-disc list-inside space-y-1 my-3">
        <li>Paste-and-publish — no IDE, no account creation, no project setup</li>
        <li>Permanent URL that doesn&apos;t depend on any runtime sleeping</li>
        <li>Embed-friendly (separate origin, sandbox-correct iframe permissions)</li>
        <li>Zero friction for the recipient — they click the URL and the thing runs</li>
        <li>Auto-injects common libraries (Phaser, p5, Three, D3, GSAP, Tone, Pixi, Matter, React)</li>
        <li>Open source (MIT)</li>
      </ul>
      <p>
        ArcadeLab is the right shape when the work is finished (or finished-enough) and the
        goal is durable sharing.
      </p>

      <h2 className="text-xs text-wood-dark mt-6 mb-2 normal-case font-semibold">
        The combined workflow
      </h2>
      <ol className="list-decimal list-inside space-y-1 my-3">
        <li>Vibe-code your thing in Replit, Cursor, Bolt, v0, ChatGPT, Claude — whatever fits</li>
        <li>Once it&apos;s a stable single-file HTML version, copy the whole file</li>
        <li>Add an ARCADELAB header (see <Link href="/learn/share-interactive-thing-made-with-ai" className="text-accent-purple underline">how to share an AI-made thing</Link>)</li>
        <li>Paste at <Link href="/publish" className="text-accent-purple underline">arcadelab.ai/publish</Link></li>
        <li>Share the permanent URL</li>
      </ol>

      <h2 className="text-xs text-wood-dark mt-6 mb-2 normal-case font-semibold">
        Comparison at a glance
      </h2>
      <div className="overflow-x-auto my-3">
        <table className="w-full text-[10px] border-collapse">
          <thead>
            <tr className="border-b border-wood-mid/30">
              <th className="text-left p-2">Capability</th>
              <th className="text-left p-2">Replit</th>
              <th className="text-left p-2">ArcadeLab</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-wood-mid/20">
              <td className="p-2">IDE with AI agent</td><td className="p-2">Yes</td><td className="p-2">No (you bring your own)</td>
            </tr>
            <tr className="border-b border-wood-mid/20">
              <td className="p-2">Account required</td><td className="p-2">Yes</td><td className="p-2">No</td>
            </tr>
            <tr className="border-b border-wood-mid/20">
              <td className="p-2">Multi-file projects</td><td className="p-2">Yes</td><td className="p-2">No (single HTML)</td>
            </tr>
            <tr className="border-b border-wood-mid/20">
              <td className="p-2">Backend code</td><td className="p-2">Yes</td><td className="p-2">No (sandbox)</td>
            </tr>
            <tr className="border-b border-wood-mid/20">
              <td className="p-2">Persistent URL</td><td className="p-2">Yes (active deployments)</td><td className="p-2">Yes (permanent)</td>
            </tr>
            <tr className="border-b border-wood-mid/20">
              <td className="p-2">Time from finished code to public URL</td><td className="p-2">2-5 min</td><td className="p-2">~30 seconds</td>
            </tr>
            <tr>
              <td className="p-2">Embed-friendly iframe</td><td className="p-2">Mixed</td><td className="p-2">Yes (purpose-built)</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 className="text-xs text-wood-dark mt-6 mb-2 normal-case font-semibold">
        TL;DR
      </h2>
      <ul className="list-disc list-inside space-y-1 my-3">
        <li>If you&apos;re still building: <strong>Replit</strong> (or Cursor, Bolt, v0)</li>
        <li>If you&apos;re done and want to share: <strong>ArcadeLab</strong></li>
        <li>If you need a backend or database: <strong>Replit</strong></li>
        <li>If it&apos;s a single HTML file: <strong>ArcadeLab</strong></li>
        <li>If the people receiving the link have no patience for sign-ups, IDE runtimes, or anything resembling a developer interface: <strong>ArcadeLab</strong></li>
      </ul>
    </ArticleLayout>
  );
}
