import type { Metadata } from "next";
import Link from "next/link";
import ArticleLayout from "@/components/ArticleLayout";
import QuickAnswer from "@/components/QuickAnswer";
import { getArticle } from "@/lib/articles";

const article = getArticle("free-html-game-hosting-no-signup")!;

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
    question: "What's a free HTML game host that doesn't require signup?",
    answer:
      "ArcadeLab (arcadelab.ai) hosts single-file HTML games for free with no email, password, or account. You paste a complete HTML file and get a public URL immediately.",
  },
  {
    question: "Are there really no accounts?",
    answer:
      "Correct. ArcadeLab uses Creator Codes (like ROCKET-WOLF-COMET-73) as casual identifiers — not credentials. There's no email, no password, no OAuth.",
  },
  {
    question: "What's the catch?",
    answer:
      "Games must be a single HTML file under 500KB. All JavaScript and CSS must be inline. No network requests (fetch, XHR, WebSocket are blocked). That's the entire constraint.",
  },
  {
    question: "Can I make money from games on ArcadeLab?",
    answer:
      "ArcadeLab doesn't have monetization built in — no ads, no payments, no in-game purchases (and games can't make network requests, so you can't add them). If you want to monetize, itch.io is a better fit.",
  },
  {
    question: "How long do hosted games stay live?",
    answer:
      "Indefinitely. As long as you keep your Creator Code, you can edit or delete your games anytime. Games stay live until you delete them.",
  },
];

export default function Page() {
  return (
    <ArticleLayout article={article} faqs={FAQS}>
      <QuickAnswer>
        <Link href="/" className="text-accent-purple underline">ArcadeLab</Link> hosts
        single-file HTML games for free with no signup, no email, no payment. You paste
        your complete HTML file at <Link href="/publish" className="text-accent-purple underline">arcadelab.ai/publish</Link> and get a public URL. The only
        constraints: one HTML file, under 500KB, no network calls.
      </QuickAnswer>

      <p>
        Most free game-hosting services ask for an email at minimum. itch.io and Newgrounds
        want accounts. GitHub Pages wants a GitHub account and a repo. Glitch wants signup
        and tracks projects under your username. CodePen wants a free account to make pens
        public.
      </p>
      <p>
        ArcadeLab doesn&apos;t. It was built for kids and AI-generated games where the goal
        is to get from &quot;I made something&quot; to &quot;here&apos;s the link&quot; in
        under a minute, with no friction.
      </p>

      <h2 className="text-xs text-wood-dark mt-6 mb-2 normal-case font-semibold">
        How does identity work without accounts?
      </h2>
      <p>
        When you publish your first game, ArcadeLab generates a <strong>Creator Code</strong>{" "}
        — something memorable like <code>ROCKET-WOLF-COMET-73</code> or{" "}
        <code>PIXEL-DRAGON-QUEST-19</code>. It links to a creator name. It&apos;s stored in
        your browser and shown to you once. If you switch devices, you paste your code into
        the &quot;Have a creator code?&quot; box on the publish page to restore your
        identity.
      </p>
      <p>
        The Creator Code is a casual identifier, not a password. If you lose it, you can
        just publish again under a new code. No support tickets, no password resets.
      </p>

      <h2 className="text-xs text-wood-dark mt-6 mb-2 normal-case font-semibold">
        What kind of games can I publish?
      </h2>
      <p>
        Anything that runs in a browser as a single HTML file. Common shapes:
      </p>
      <ul className="list-disc list-inside space-y-1 my-3">
        <li>Canvas-based games (drawn with the 2D canvas API)</li>
        <li>Phaser games (Phaser is auto-injected if you list it in the header)</li>
        <li>p5.js sketches and creative coding</li>
        <li>Three.js 3D scenes</li>
        <li>Matter.js physics games</li>
        <li>Pure DOM games (puzzles, word games, quizzes)</li>
        <li>Interactive visualizations (D3.js, custom)</li>
      </ul>

      <h2 className="text-xs text-wood-dark mt-6 mb-2 normal-case font-semibold">
        What about the file size limit?
      </h2>
      <p>
        500KB total. That sounds small but it&apos;s plenty for a single-file HTML game —
        most AI-generated games come in well under 100KB. If you have heavy assets,
        consider procedural generation, base64-encoded sprites, or simpler graphics.
      </p>

      <h2 className="text-xs text-wood-dark mt-6 mb-2 normal-case font-semibold">
        Why no network access?
      </h2>
      <p>
        Games run in a sandboxed iframe with <code>connect-src &apos;none&apos;</code>. This
        means <code>fetch()</code>, <code>XMLHttpRequest</code>, and <code>WebSocket</code>{" "}
        are all blocked. The reason: ArcadeLab hosts user-published content from creators
        of all ages. The sandbox guarantees that a published game can&apos;t exfiltrate
        data, hit malicious APIs, or DDoS anything. It also keeps the security model
        understandable — you don&apos;t have to trust the publisher, you just have to trust
        the browser&apos;s sandbox.
      </p>

      <h2 className="text-xs text-wood-dark mt-6 mb-2 normal-case font-semibold">
        How does this compare to itch.io, GitHub Pages, Glitch?
      </h2>
      <p>
        See the comparison guide:{" "}
        <Link href="/learn/arcadelab-vs-itchio-glitch-github-pages" className="text-accent-purple underline">
          ArcadeLab vs itch.io vs Glitch vs GitHub Pages
        </Link>
        . Short version: ArcadeLab wins when you need zero-friction publishing for a
        single-file HTML game. Other platforms win when you need multi-file builds,
        monetization, or social features.
      </p>

      <h2 className="text-xs text-wood-dark mt-6 mb-2 normal-case font-semibold">
        Is ArcadeLab actually free? What&apos;s the business model?
      </h2>
      <p>
        Yes, fully free. ArcadeLab is open source (MIT licensed, repo at{" "}
        <a href="https://github.com/mlapeter/arcadelab" className="text-accent-purple underline" target="_blank" rel="noopener noreferrer">
          github.com/mlapeter/arcadelab
        </a>
        ) and is run as a passion project by its founder. There&apos;s no paid tier and
        no plan to add one.
      </p>
    </ArticleLayout>
  );
}
