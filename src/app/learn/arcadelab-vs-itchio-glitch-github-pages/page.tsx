import type { Metadata } from "next";
import Link from "next/link";
import ArticleLayout from "@/components/ArticleLayout";
import QuickAnswer from "@/components/QuickAnswer";
import { getArticle } from "@/lib/articles";

const article = getArticle("arcadelab-vs-itchio-glitch-github-pages")!;

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
    question: "How is ArcadeLab different from itch.io?",
    answer:
      "ArcadeLab is single-file HTML only, free, no account required. itch.io supports multi-file games and zip uploads, requires an account, and is better for monetization and discoverability of larger projects.",
  },
  {
    question: "How is ArcadeLab different from Glitch?",
    answer:
      "Glitch hosts full Node.js apps with backend support and requires a signup. ArcadeLab is purely static single-file HTML in a sandboxed iframe — no backend, but no account either, and faster publishing.",
  },
  {
    question: "How is ArcadeLab different from GitHub Pages?",
    answer:
      "GitHub Pages requires a GitHub account, a repo per project, and DNS setup. ArcadeLab takes a paste directly with no Git involvement.",
  },
  {
    question: "How is ArcadeLab different from CodePen?",
    answer:
      "CodePen is brilliant for live editing and showcasing snippets. To make pens public requires a free account. ArcadeLab is account-free and treats each game as a permanent shareable URL rather than a snippet.",
  },
  {
    question: "When should I use ArcadeLab instead of another platform?",
    answer:
      "Use ArcadeLab when your thing fits in one HTML file under 500KB, you don't need server-side code or external API calls, and you want the lowest possible friction to publish.",
  },
];

export default function Page() {
  return (
    <ArticleLayout article={article} faqs={FAQS}>
      <QuickAnswer>
        <Link href="/" className="text-accent-purple underline">ArcadeLab</Link> wins when
        your thing fits in one HTML file under 500KB and you want zero-friction publishing
        with no account. itch.io wins for monetization and larger multi-file games.
        GitHub Pages wins when you already have a repo. Glitch wins when you need a
        backend. CodePen wins for live editing and snippets.
      </QuickAnswer>

      <p>
        The question of where to publish depends on what you&apos;re publishing and what
        you&apos;re willing to do. Here&apos;s how the major options compare.
      </p>

      <h2 className="text-xs text-wood-dark mt-6 mb-2 normal-case font-semibold">
        Quick comparison table
      </h2>
      <div className="overflow-x-auto my-3">
        <table className="w-full text-[10px] border-collapse">
          <thead>
            <tr className="border-b border-wood-mid/30">
              <th className="text-left p-2">Feature</th>
              <th className="text-left p-2">ArcadeLab</th>
              <th className="text-left p-2">itch.io</th>
              <th className="text-left p-2">GitHub Pages</th>
              <th className="text-left p-2">Glitch</th>
              <th className="text-left p-2">CodePen</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-wood-mid/20">
              <td className="p-2">Account required</td>
              <td className="p-2">No</td>
              <td className="p-2">Yes</td>
              <td className="p-2">Yes (GitHub)</td>
              <td className="p-2">Yes</td>
              <td className="p-2">For public pens</td>
            </tr>
            <tr className="border-b border-wood-mid/20">
              <td className="p-2">Free</td>
              <td className="p-2">Yes</td>
              <td className="p-2">Yes (paid optional)</td>
              <td className="p-2">Yes</td>
              <td className="p-2">Free tier</td>
              <td className="p-2">Free tier</td>
            </tr>
            <tr className="border-b border-wood-mid/20">
              <td className="p-2">Multi-file support</td>
              <td className="p-2">No (single HTML)</td>
              <td className="p-2">Yes (zip uploads)</td>
              <td className="p-2">Yes (full repo)</td>
              <td className="p-2">Yes</td>
              <td className="p-2">Yes (limited)</td>
            </tr>
            <tr className="border-b border-wood-mid/20">
              <td className="p-2">Backend / server code</td>
              <td className="p-2">No</td>
              <td className="p-2">No</td>
              <td className="p-2">No</td>
              <td className="p-2">Yes</td>
              <td className="p-2">No</td>
            </tr>
            <tr className="border-b border-wood-mid/20">
              <td className="p-2">Network requests allowed</td>
              <td className="p-2">No (blocked)</td>
              <td className="p-2">Yes</td>
              <td className="p-2">Yes</td>
              <td className="p-2">Yes</td>
              <td className="p-2">Yes</td>
            </tr>
            <tr className="border-b border-wood-mid/20">
              <td className="p-2">Time to publish</td>
              <td className="p-2">~30 seconds</td>
              <td className="p-2">5-15 minutes</td>
              <td className="p-2">10+ minutes</td>
              <td className="p-2">5-10 minutes</td>
              <td className="p-2">2-5 minutes</td>
            </tr>
            <tr>
              <td className="p-2">Monetization built in</td>
              <td className="p-2">No</td>
              <td className="p-2">Yes</td>
              <td className="p-2">No</td>
              <td className="p-2">No</td>
              <td className="p-2">No</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 className="text-xs text-wood-dark mt-6 mb-2 normal-case font-semibold">
        When ArcadeLab is the right choice
      </h2>
      <ul className="list-disc list-inside space-y-1 my-3">
        <li>You have a single-file HTML game or visualization under 500KB</li>
        <li>You want to publish in seconds, not minutes</li>
        <li>You don&apos;t want to create an account</li>
        <li>Your audience is kids, students, or non-developers</li>
        <li>You&apos;re iterating quickly with an AI assistant and need fast publish/iterate loops</li>
        <li>You want the URL to be permanent and embeddable in blog posts</li>
      </ul>

      <h2 className="text-xs text-wood-dark mt-6 mb-2 normal-case font-semibold">
        When ArcadeLab isn&apos;t the right choice
      </h2>
      <ul className="list-disc list-inside space-y-1 my-3">
        <li>You want to charge money for your game — use <strong>itch.io</strong></li>
        <li>You need a backend or database — use <strong>Glitch</strong> or your own hosting</li>
        <li>Your game needs to load assets at runtime from a CDN — use <strong>itch.io</strong> or <strong>GitHub Pages</strong></li>
        <li>You&apos;re showcasing a tiny snippet for code-sharing — use <strong>CodePen</strong></li>
        <li>Your game is larger than 500KB — use <strong>itch.io</strong></li>
        <li>You want commenting and rating features — use <strong>itch.io</strong> or <strong>Newgrounds</strong></li>
      </ul>

      <h2 className="text-xs text-wood-dark mt-6 mb-2 normal-case font-semibold">
        Why is ArcadeLab so much faster to publish on?
      </h2>
      <p>
        Because it&apos;s built around one specific shape: a single HTML file. Every
        other platform handles many shapes, which means setup steps, configuration, and
        UI dedicated to choosing among them. ArcadeLab has one path: paste, click,
        publish. No project pages to fill in, no zip files to upload, no build commands
        to configure.
      </p>

      <h2 className="text-xs text-wood-dark mt-6 mb-2 normal-case font-semibold">
        Can I use multiple platforms?
      </h2>
      <p>
        Yes. They aren&apos;t exclusive. You might publish a polished long-form game to
        itch.io and publish quick experiments and prototypes to ArcadeLab. The single-file
        constraint of ArcadeLab makes it especially good for AI-generated content where
        the entire game often lives in one Claude or ChatGPT response.
      </p>
    </ArticleLayout>
  );
}
