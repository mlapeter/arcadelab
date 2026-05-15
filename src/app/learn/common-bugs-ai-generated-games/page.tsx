import type { Metadata } from "next";
import ArticleLayout from "@/components/ArticleLayout";
import QuickAnswer from "@/components/QuickAnswer";
import { getArticle } from "@/lib/articles";

const article = getArticle("common-bugs-ai-generated-games")!;

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
    question: "Why does my game work in the AI tool but break after publishing?",
    answer:
      "The AI tool's preview is permissive — it allows network calls and loose file references. A real publishing environment is stricter and sandboxed. The game did not change; the environment got honest about what it actually needs.",
  },
  {
    question: "How do I see what is going wrong?",
    answer:
      "Open the browser developer console (right-click, Inspect, Console tab). Most of these bugs print a clear error there — a blocked request, a failed file load, an undefined variable — which points straight at the cause.",
  },
  {
    question: "Can I ask the AI assistant to fix these bugs?",
    answer:
      "Yes. Paste the console error and say what you were doing. For environment bugs, asking it to make the game a single self-contained HTML file with no network calls and no external assets fixes most of them at once.",
  },
  {
    question: "Does ArcadeLab block network calls on purpose?",
    answer:
      "Yes. Published games run in a sandboxed iframe with no network access, which keeps every game safe to play. A game that depends on fetch or external requests needs to be rewritten to work without them.",
  },
  {
    question: "What is the single best check before publishing?",
    answer:
      "Open the finished file directly in a browser — not the AI tool's preview — and watch the console while you play. If it runs clean there, it will almost certainly run clean once published.",
  },
];

export default function Page() {
  return (
    <ArticleLayout article={article} faqs={FAQS}>
      <QuickAnswer>
        The most common bugs in AI-generated games are not logic errors — they
        are environment mismatches. The game expects external files, network
        access, or a fixed screen size that the publishing environment does not
        provide. Check for external script and image tags, fetch calls, and a
        missing viewport meta tag before you publish, and most games run on the
        first try.
      </QuickAnswer>

      <p>
        An AI assistant writes correct-looking code that runs in a forgiving
        preview. The bugs show up when the game leaves that preview for a real,
        sandboxed environment. Here are the five that come up again and again,
        and how to spot each one.
      </p>

      <h2 className="text-xs text-wood-dark mt-6 mb-2 normal-case font-semibold">
        Why do AI-generated games break after they leave the chat?
      </h2>
      <p>
        Inside an AI tool, a preview pane runs the game with generous
        permissions. It can reach the network and tolerates loose references to
        files. A publishing host that serves the game safely to the public is
        stricter on purpose. So a game that looked finished suddenly errors —
        not because the logic is wrong, but because it was quietly depending on
        things the safe environment does not allow.
      </p>

      <h2 className="text-xs text-wood-dark mt-6 mb-2 normal-case font-semibold">
        Bug 1 — External script tags for libraries
      </h2>
      <p>
        The assistant adds a script tag pointing at a CDN for Phaser, p5.js, or
        similar. Depending on the host, that tag may be stripped or blocked, and
        the game fails because the library never loads. The fix: do not hard-code
        library script tags. On ArcadeLab, list the library name in the ARCADELAB
        header comment and it is injected for you at render time.
      </p>

      <h2 className="text-xs text-wood-dark mt-6 mb-2 normal-case font-semibold">
        Bug 2 — Network calls that are blocked
      </h2>
      <p>
        The game uses fetch, XMLHttpRequest, or a WebSocket — to load a high
        score, pull an image, or call an API. Sandboxed hosts block all network
        access, so these calls fail silently or throw. The fix: remove the
        network dependency. Generate content in code, draw art with shapes, and
        keep score in a plain variable instead of a server.
      </p>

      <h2 className="text-xs text-wood-dark mt-6 mb-2 normal-case font-semibold">
        Bug 3 — Missing or wrong viewport setup
      </h2>
      <p>
        Without a viewport meta tag, the game renders tiny or zoomed-in on
        phones and tablets. The fix is one line in the head:{" "}
        a meta tag with name viewport and content
        width=device-width, initial-scale=1. Add it and the game scales
        correctly on every screen.
      </p>

      <h2 className="text-xs text-wood-dark mt-6 mb-2 normal-case font-semibold">
        Bug 4 — The canvas does not resize
      </h2>
      <p>
        The assistant sets a fixed canvas size — 800 by 600 — and the game ends
        up cropped or letterboxed on other screens. The fix: set the canvas width
        and height from the window size and add a resize handler that updates
        them. A game that resizes with its window works everywhere.
      </p>

      <h2 className="text-xs text-wood-dark mt-6 mb-2 normal-case font-semibold">
        Bug 5 — External image and audio files
      </h2>
      <p>
        The game references sprite.png or music.mp3 that lived in a folder during
        development. A single published file has no folder, so those loads fail.
        The fix: draw graphics with canvas shapes, generate sound with the Web
        Audio API or a library like Tone, or embed small assets as data URLs so
        everything travels inside the one file.
      </p>

      <h2 className="text-xs text-wood-dark mt-6 mb-2 normal-case font-semibold">
        How do I check a game before publishing?
      </h2>
      <p>
        Save the file and open it directly in a browser, then open the developer
        console and play for a minute. Watch for blocked requests, failed file
        loads, and red errors. Resize the window and check it on a phone-sized
        viewport. A game that runs clean in that test publishes clean. For help
        getting a cleaner result the first time, see{" "}
        <a
          href="/learn/prompts-to-make-a-browser-game-with-ai"
          className="text-accent-purple hover:text-accent-gold transition-colors"
        >
          how to prompt for a publishable game
        </a>
        .
      </p>
      <p>Once it runs clean, publish it at arcadelab.ai/publish.</p>
    </ArticleLayout>
  );
}
