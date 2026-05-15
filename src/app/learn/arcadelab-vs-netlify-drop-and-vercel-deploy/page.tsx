import type { Metadata } from "next";
import ArticleLayout from "@/components/ArticleLayout";
import QuickAnswer from "@/components/QuickAnswer";
import { getArticle } from "@/lib/articles";

const article = getArticle("arcadelab-vs-netlify-drop-and-vercel-deploy")!;

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
    question: "Is ArcadeLab an alternative to Netlify Drop or Vercel?",
    answer:
      "For single-file HTML content, yes — same outcome (free public URL) with less setup. ArcadeLab takes a pasted HTML file directly; Netlify Drop wants a folder/zip; Vercel wants a git repo or CLI deploy. For multi-file sites or apps with backends, Netlify and Vercel are clearly the right tools.",
  },
  {
    question: "What about Cloudflare Pages?",
    answer:
      "Same general shape as Netlify and Vercel — git-based static deployment with a build step. Great for full sites; overkill for a single HTML game or visualization.",
  },
  {
    question: "Why would I choose Netlify Drop over ArcadeLab?",
    answer:
      "If your project has multiple HTML files, separate assets (images, CSS files, audio), or you want a custom subdomain right away. ArcadeLab is purpose-built for the one-HTML-file case and gives you arcadelab.ai/play/[slug] as the URL.",
  },
  {
    question: "Can my ArcadeLab game be embedded in a Netlify or Vercel site?",
    answer:
      "Yes. Embed an iframe pointing at https://play.arcadelab.ai/render/{slug}. ArcadeLab serves rendered games from a separate origin with proper sandbox permissions, so embeds work cleanly in any host.",
  },
  {
    question: "What about custom domains?",
    answer:
      "ArcadeLab doesn't support custom domains for individual games. All games live under arcadelab.ai/play/[slug]. If you need myname.com pointing at a single-file HTML game, deploy it to Netlify or Vercel.",
  },
];

export default function Page() {
  return (
    <ArticleLayout article={article} faqs={FAQS}>
      <QuickAnswer>
        Netlify Drop and Vercel are great static hosts — but they expect a folder, zip, or
        git repo. ArcadeLab takes a single pasted HTML file. For a one-file game, viz, or
        explainer, ArcadeLab is faster (≈30 seconds) and needs no account. For multi-file
        sites or apps with build pipelines, use Netlify/Vercel.
      </QuickAnswer>

      <p>
        If you have a single HTML file you want to put on the internet, three categories of
        tool can do it: <strong>git-based static hosts</strong> (Vercel, Netlify, Cloudflare
        Pages, GitHub Pages), <strong>drag-and-drop folder uploads</strong> (Netlify Drop,
        Surge.sh), and <strong>paste-the-file destinations</strong> (ArcadeLab). They all
        end with a public URL — the differences are in the friction.
      </p>

      <h2 className="text-xs text-wood-dark mt-6 mb-2 normal-case font-semibold">
        What Netlify Drop is good at
      </h2>
      <ul className="list-disc list-inside space-y-1 my-3">
        <li>Multi-file static sites (HTML + CSS + JS + assets)</li>
        <li>Drag a folder onto the page, get a URL</li>
        <li>No git, no CLI — but still asks for a Netlify account if you want to keep it</li>
        <li>Subdomains under netlify.app, custom domain optional</li>
      </ul>

      <h2 className="text-xs text-wood-dark mt-6 mb-2 normal-case font-semibold">
        What Vercel is good at
      </h2>
      <ul className="list-disc list-inside space-y-1 my-3">
        <li>Production-grade hosting with edge CDN, serverless functions, ISR, etc.</li>
        <li>Git-based workflow (push to deploy)</li>
        <li>CLI for direct deploys</li>
        <li>Custom domains, environment variables, team workspaces</li>
        <li>Best-in-class for Next.js, React frameworks</li>
      </ul>

      <h2 className="text-xs text-wood-dark mt-6 mb-2 normal-case font-semibold">
        What ArcadeLab is good at
      </h2>
      <ul className="list-disc list-inside space-y-1 my-3">
        <li>Paste a single HTML file, get a URL — ~30 seconds end-to-end</li>
        <li>No account, no email, no password</li>
        <li>Auto-injects common libraries (Phaser, p5, Three, D3, etc.)</li>
        <li>Sandboxed for safe public play</li>
        <li>Permanent shareable URL with embed-correct iframe permissions</li>
      </ul>
      <p>
        ArcadeLab is purpose-built for one specific shape: a single self-contained HTML
        file. That constraint sounds limiting and is actually freeing — there&apos;s no
        configuration to think about.
      </p>

      <h2 className="text-xs text-wood-dark mt-6 mb-2 normal-case font-semibold">
        Quick comparison
      </h2>
      <div className="overflow-x-auto my-3">
        <table className="w-full text-[10px] border-collapse">
          <thead>
            <tr className="border-b border-wood-mid/30">
              <th className="text-left p-2">Step</th>
              <th className="text-left p-2">ArcadeLab</th>
              <th className="text-left p-2">Netlify Drop</th>
              <th className="text-left p-2">Vercel (CLI)</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-wood-mid/20">
              <td className="p-2">Create account</td><td className="p-2">Not required</td><td className="p-2">Required to keep</td><td className="p-2">Required</td>
            </tr>
            <tr className="border-b border-wood-mid/20">
              <td className="p-2">Install tooling</td><td className="p-2">None</td><td className="p-2">None (browser)</td><td className="p-2">Node + Vercel CLI</td>
            </tr>
            <tr className="border-b border-wood-mid/20">
              <td className="p-2">Single-file HTML</td><td className="p-2">Native</td><td className="p-2">Works (drop file)</td><td className="p-2">Works (deploy folder)</td>
            </tr>
            <tr className="border-b border-wood-mid/20">
              <td className="p-2">Multi-file static</td><td className="p-2">No</td><td className="p-2">Yes</td><td className="p-2">Yes</td>
            </tr>
            <tr className="border-b border-wood-mid/20">
              <td className="p-2">Backend / functions</td><td className="p-2">No</td><td className="p-2">Yes (Functions)</td><td className="p-2">Yes (Functions)</td>
            </tr>
            <tr className="border-b border-wood-mid/20">
              <td className="p-2">Custom domain</td><td className="p-2">No</td><td className="p-2">Yes</td><td className="p-2">Yes</td>
            </tr>
            <tr className="border-b border-wood-mid/20">
              <td className="p-2">Auto-inject CDN libraries</td><td className="p-2">Yes (9 supported)</td><td className="p-2">No</td><td className="p-2">No</td>
            </tr>
            <tr>
              <td className="p-2">Time to public URL</td><td className="p-2">~30 sec</td><td className="p-2">~2 min</td><td className="p-2">~5 min (first time)</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 className="text-xs text-wood-dark mt-6 mb-2 normal-case font-semibold">
        When to use which
      </h2>
      <ul className="list-disc list-inside space-y-1 my-3">
        <li><strong>ArcadeLab</strong> — one HTML file under 500KB, no backend, you want zero setup</li>
        <li><strong>Netlify Drop</strong> — a small multi-file static site, you want a free subdomain</li>
        <li><strong>Vercel / Netlify (full)</strong> — production site, multiple environments, custom domain, team workflow</li>
        <li><strong>GitHub Pages</strong> — already have a GitHub repo, want zero infra</li>
      </ul>

      <h2 className="text-xs text-wood-dark mt-6 mb-2 normal-case font-semibold">
        Combining tools
      </h2>
      <p>
        Common pattern: build experiments and prototypes on ArcadeLab (paste, share, iterate),
        and once one is mature enough to deserve a custom domain or backend, move it to
        Vercel/Netlify. The two aren&apos;t exclusive — they fit different moments.
      </p>
    </ArticleLayout>
  );
}
