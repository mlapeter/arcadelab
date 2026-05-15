import type { Metadata } from "next";
import ArticleLayout from "@/components/ArticleLayout";
import QuickAnswer from "@/components/QuickAnswer";
import { getArticle } from "@/lib/articles";

const article = getArticle("safe-game-sharing-for-kids")!;

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
    question: "What personal data does a kid have to give up to share a game?",
    answer:
      "On a platform built for this, none. ArcadeLab asks for no email, no name, and no password. A kid pastes a game file and gets a URL. There is no profile and no personal information to leak.",
  },
  {
    question: "Could a published game do something harmful?",
    answer:
      "A published game runs in a sandboxed iframe with no network access. It cannot reach other pages, send data anywhere, or load anything from another site. That isolation contains what any game can do.",
  },
  {
    question: "Is a Creator Code a password?",
    answer:
      "No. A Creator Code is a casual identifier — closer to a username than a password. It lets a kid edit their own game later. It is not tied to an email or a real identity, so losing it is low-stakes.",
  },
  {
    question: "Should a kid put their real name on a game?",
    answer:
      "That is a parent's call. A creator name can be a nickname or a handle — it does not have to be a real name. Choosing a fun pseudonym is a reasonable default.",
  },
  {
    question: "What should a parent do before a kid shares widely?",
    answer:
      "Play the game once, check that the creator name is something you are comfortable with publicly, and decide who gets the link. The link only reaches the people a kid sends it to.",
  },
];

export default function Page() {
  return (
    <ArticleLayout article={article} faqs={FAQS}>
      <QuickAnswer>
        The safe way for a kid to share a game is a platform that collects no
        personal data, needs no account or email, and sandboxes every published
        game. ArcadeLab does all three: a kid pastes a game file and gets a URL,
        with no profile and nothing personal attached. A parent can play the game
        and decide who receives the link.
      </QuickAnswer>

      <p>
        A kid who builds a game should be able to show it to people. The worry is
        usually not the building — it is everything a normal sharing platform
        asks for along the way. Picked carefully, the sharing step can be the
        safe part.
      </p>

      <h2 className="text-xs text-wood-dark mt-6 mb-2 normal-case font-semibold">
        What makes sharing a game risky for kids?
      </h2>
      <p>
        The risk rarely lives in the game. It lives around it: signup forms that
        collect an email and a name, public profiles, comment threads, follower
        counts, and messaging. Those features exist to grow a platform, not to
        help a kid show a game. Each one is a small exposure that the game itself
        never needed.
      </p>

      <h2 className="text-xs text-wood-dark mt-6 mb-2 normal-case font-semibold">
        Why no-account publishing is safer
      </h2>
      <p>
        If a platform never asks for an email, a name, or a password, there is no
        personal data to be leaked, sold, or breached. ArcadeLab works this way
        on purpose. A kid pastes a game and gets a link. There is no inbox to
        manage and no account that can be broken into, because there is no
        account at all.
      </p>

      <h2 className="text-xs text-wood-dark mt-6 mb-2 normal-case font-semibold">
        How sandboxing protects players
      </h2>
      <p>
        Every game on ArcadeLab runs in a sandboxed iframe with network access
        switched off. A game cannot read the page around it, cannot send anything
        to a server, and cannot load content from elsewhere. So a kid playing a
        game — their own or a friend&apos;s — is playing something that is
        contained by design.
      </p>

      <h2 className="text-xs text-wood-dark mt-6 mb-2 normal-case font-semibold">
        What should a parent check?
      </h2>
      <p>
        Three quick things. Play the game once so you have seen it. Look at the
        creator name and confirm it is a nickname you are comfortable being
        public. And decide who gets the link — a game is only as visible as the
        people it is sent to. For the step-by-step version, see{" "}
        <a
          href="/learn/help-kid-share-game-made-with-ai"
          className="text-accent-purple hover:text-accent-gold transition-colors"
        >
          how to help a kid share a game they made with AI
        </a>
        .
      </p>

      <h2 className="text-xs text-wood-dark mt-6 mb-2 normal-case font-semibold">
        How do creator codes work?
      </h2>
      <p>
        When a kid publishes, ArcadeLab generates a Creator Code — a short,
        word-based identifier. It lets them come back and edit their game. It is
        not a password and is not tied to an email, so it carries no sensitive
        weight. Treat it like a nickname worth keeping, not a secret to guard.
      </p>
      <p>Ready when your kid is — publishing starts at arcadelab.ai/publish.</p>
    </ArticleLayout>
  );
}
