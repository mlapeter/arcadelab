import type { Metadata } from "next";
import ArticleLayout from "@/components/ArticleLayout";
import QuickAnswer from "@/components/QuickAnswer";
import { getArticle } from "@/lib/articles";

const article = getArticle("sandboxed-iframe-game-embed-explained")!;

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
    question: "Is a sandboxed iframe safe to embed on my site?",
    answer:
      "Yes — that is the point of it. The sandbox attribute strips the embedded content's permissions, so it can run its own code but cannot reach the page that embeds it. A sandboxed game embed is one of the safer things you can put on a site.",
  },
  {
    question: "What is the difference between allow-scripts and allow-same-origin?",
    answer:
      "allow-scripts lets the embedded page run JavaScript. allow-same-origin lets it act as though it shares the host's origin. Granting only allow-scripts lets a game run while keeping it isolated; granting both together weakens the sandbox.",
  },
  {
    question: "Why serve the game from a different domain?",
    answer:
      "A separate origin means the browser's same-origin policy keeps the game and the host site apart by default. Even if the sandbox were misconfigured, the origin boundary is a second layer of isolation.",
  },
  {
    question: "Can a sandboxed game still save high scores?",
    answer:
      "It can keep scores in memory for the session. Persisting them across visits needs storage or a server, and a strict sandbox limits both. Most single-file games keep score in a variable and that is enough.",
  },
  {
    question: "How do I embed an ArcadeLab game?",
    answer:
      "Use an iframe pointing at the play.arcadelab.ai render URL for the game. ArcadeLab serves games from that separate origin with the correct sandbox permissions already set.",
  },
];

export default function Page() {
  return (
    <ArticleLayout article={article} faqs={FAQS}>
      <QuickAnswer>
        A sandboxed iframe runs an embedded game in a restricted box: the sandbox
        attribute strips permissions, and the host grants back only what is
        needed — usually just allow-scripts. Serving the game from a separate
        origin keeps it isolated from the host page. The result is an embedded
        game that can run but cannot reach the page around it.
      </QuickAnswer>

      <p>
        Embedding a game someone else wrote means running untrusted code on your
        page. A sandboxed iframe is how the web makes that safe. Here is what the
        pieces do.
      </p>

      <h2 className="text-xs text-wood-dark mt-6 mb-2 normal-case font-semibold">
        What is a sandboxed iframe?
      </h2>
      <p>
        An iframe embeds one web page inside another. Adding the sandbox
        attribute strips that embedded page of nearly every permission — scripts,
        forms, popups, and more are all switched off. The host then adds back
        only the specific permissions the embed genuinely needs. It is a
        deny-by-default box.
      </p>

      <h2 className="text-xs text-wood-dark mt-6 mb-2 normal-case font-semibold">
        Why do game platforms sandbox embeds?
      </h2>
      <p>
        A published game is code written by someone else. Without a sandbox, that
        code could read the host page, redirect the visitor, or interfere with
        other content. The sandbox removes those abilities up front, so a game
        platform can host thousands of games from many creators without auditing
        every line. The isolation is what makes open publishing practical.
      </p>

      <h2 className="text-xs text-wood-dark mt-6 mb-2 normal-case font-semibold">
        What does allow-scripts actually permit?
      </h2>
      <p>
        A game needs to run JavaScript, so the host grants allow-scripts — and,
        for most single-file games, nothing else. The game can draw, animate, and
        respond to input. It cannot navigate the top window, submit forms to the
        host, or treat itself as same-origin with the embedding site. One
        permission in, everything else stays off.
      </p>

      <h2 className="text-xs text-wood-dark mt-6 mb-2 normal-case font-semibold">
        Why serve the game from a separate origin?
      </h2>
      <p>
        Sandboxing is stronger when the embedded game also lives on its own
        domain. ArcadeLab renders games from play.arcadelab.ai, separate from the
        main arcadelab.ai site. The browser&apos;s same-origin policy then keeps
        the two apart by default, so the origin boundary backs up the sandbox
        attribute rather than relying on it alone.
      </p>

      <h2 className="text-xs text-wood-dark mt-6 mb-2 normal-case font-semibold">
        How do I embed a sandboxed game in my site?
      </h2>
      <p>
        Point an iframe at the game&apos;s render URL on play.arcadelab.ai. The
        sandbox permissions are already set correctly, so the embed is safe to
        drop into a blog, a class page, or a portfolio. The network restrictions
        that pair with this are covered in{" "}
        <a
          href="/learn/connect-src-none-iframe-csp"
          className="text-accent-purple hover:text-accent-gold transition-colors"
        >
          what connect-src none does in an iframe CSP
        </a>
        .
      </p>
      <p>Have a game to embed? Publish it first at arcadelab.ai/publish.</p>
    </ArticleLayout>
  );
}
