import type { Metadata } from "next";
import ArticleLayout from "@/components/ArticleLayout";
import QuickAnswer from "@/components/QuickAnswer";
import { getArticle } from "@/lib/articles";

const article = getArticle("single-file-html-with-cdn-libraries")!;

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
    question: "Can a single-file HTML page use a library at all?",
    answer:
      "Yes. Using a library does not break the single-file format — your code still lives in one document. The library itself is loaded separately, either by a CDN script tag or by a host that injects it.",
  },
  {
    question: "What is wrong with a hard-coded CDN script tag?",
    answer:
      "Nothing, in general. But a strict sandboxed host may block script sources it has not approved, so a hard-coded tag can fail. Letting the host inject an approved library avoids that.",
  },
  {
    question: "Does library injection bloat my file?",
    answer:
      "No. The library is added at render time, not stored in your file. Your saved HTML stays small and clean — it just names the library instead of containing it.",
  },
  {
    question: "What if I need a library that is not supported?",
    answer:
      "If the library is small, you can paste its code directly into your file so it travels inline. For large libraries, check the supported list first — the common game and visualization libraries are usually covered.",
  },
  {
    question: "Do I still write code against the library normally?",
    answer:
      "Yes. Once the library is available, you call its functions exactly as its documentation describes. Injection only changes how the library loads, not how you use it.",
  },
];

export default function Page() {
  return (
    <ArticleLayout article={article} faqs={FAQS}>
      <QuickAnswer>
        A single-file HTML page can still use libraries like Phaser or p5.js. The
        usual way is a CDN script tag — but sandboxed hosts may block or strip
        those. ArcadeLab solves it differently: list the library name in a header
        comment and it is injected at render time, so your file stays clean and
        the library still loads.
      </QuickAnswer>

      <p>
        &quot;Single-file&quot; does not mean &quot;no libraries.&quot; It means
        your code lives in one document. How the library gets loaded is a
        separate question — and the answer affects whether your page runs once it
        is published.
      </p>

      <h2 className="text-xs text-wood-dark mt-6 mb-2 normal-case font-semibold">
        Can a single-file HTML page use libraries?
      </h2>
      <p>
        Yes. The single-file format is about keeping your HTML, CSS, and
        JavaScript in one document — not about avoiding libraries. A canvas game
        might pull in Phaser; a visualization might pull in D3. Your code is still
        one file. The library is the one thing that comes from outside it.
      </p>

      <h2 className="text-xs text-wood-dark mt-6 mb-2 normal-case font-semibold">
        What is the CDN script tag approach?
      </h2>
      <p>
        The traditional way is a script tag in the head pointing at a content
        delivery network — a public URL that serves the library. The browser
        fetches it, and the library becomes available to your code. It works, and
        it is what most tutorials show.
      </p>

      <h2 className="text-xs text-wood-dark mt-6 mb-2 normal-case font-semibold">
        Why hard-coded script tags can be a problem
      </h2>
      <p>
        A platform that hosts untrusted games applies a Content Security Policy
        that restricts where scripts may come from. A hard-coded CDN tag pointing
        at a source the host has not approved can be blocked, and the library
        never loads. The game then fails for a reason that has nothing to do with
        your code.
      </p>

      <h2 className="text-xs text-wood-dark mt-6 mb-2 normal-case font-semibold">
        How does library injection work?
      </h2>
      <p>
        Instead of a script tag, you declare the library by name. On ArcadeLab,
        the ARCADELAB header comment at the top of your file has a libraries
        line — for example, libraries: phaser, p5. At render time, ArcadeLab adds
        the approved library from a known-good source. Your file names the
        dependency; the host satisfies it. Your saved HTML stays small, and the
        library always loads from a source the policy allows.
      </p>

      <h2 className="text-xs text-wood-dark mt-6 mb-2 normal-case font-semibold">
        Which libraries are supported?
      </h2>
      <p>
        ArcadeLab injects the common game and visualization libraries: Phaser,
        p5.js, Three.js, D3, GSAP, Tone, Pixi, and Matter. List the ones you use
        in the header and leave the script tags out. For the format itself, see{" "}
        <a
          href="/learn/single-file-html-game-template"
          className="text-accent-purple hover:text-accent-gold transition-colors"
        >
          what a good single-file HTML game template looks like
        </a>
        .
      </p>
      <p>Ready to publish? Paste your file at arcadelab.ai/publish.</p>
    </ArticleLayout>
  );
}
