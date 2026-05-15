import type { Metadata } from "next";
import ArticleLayout from "@/components/ArticleLayout";
import QuickAnswer from "@/components/QuickAnswer";
import { getArticle } from "@/lib/articles";

const article = getArticle("classroom-friendly-game-publishing")!;

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
    question: "Do students need email addresses to publish?",
    answer:
      "No. ArcadeLab uses no email and no passwords. A student pastes their HTML file and gets a URL, along with a Creator Code they can keep to edit the game later. Nothing personal is collected.",
  },
  {
    question: "Are the published games safe for other students to play?",
    answer:
      "Yes. Every game runs in a sandboxed iframe with no network access, so a game cannot reach other pages, collect data, or call out to a server. Playing a classmate's game is as safe as playing any other.",
  },
  {
    question: "Can a teacher manage a whole class this way?",
    answer:
      "Yes. Because there are no accounts to provision, a class can start publishing immediately. Each student keeps their own Creator Code; the teacher does not need to administer logins.",
  },
  {
    question: "What ages does this suit?",
    answer:
      "Any age that can copy and paste. The publishing step is one paste and one click, with no form to fill out, so the platform does not gate on reading level or technical skill.",
  },
  {
    question: "Can students collect each other's games in one place?",
    answer:
      "Each student has a creator page that lists their games, and every game has its own URL. A teacher can gather those links into a class page or document so the whole set is easy to play through.",
  },
];

export default function Page() {
  return (
    <ArticleLayout article={article} faqs={FAQS}>
      <QuickAnswer>
        A classroom-friendly way to publish student games avoids accounts,
        emails, and passwords, and keeps every published game sandboxed so it is
        safe to play. ArcadeLab does this: a student pastes their HTML file, gets
        a URL, and keeps a Creator Code to edit it later. No personal data is
        collected from anyone.
      </QuickAnswer>

      <p>
        Publishing student work should be the easy part of a coding lesson. Too
        often it is the hard part — accounts to set up, emails to collect,
        permissions to chase. A classroom-friendly platform removes that friction
        without giving up safety.
      </p>

      <h2 className="text-xs text-wood-dark mt-6 mb-2 normal-case font-semibold">
        What makes game publishing classroom-friendly?
      </h2>
      <p>
        Three things. It works without accounts or emails, so no student data has
        to be collected or managed. It sandboxes every game, so a published game
        is safe for the whole class to play. And the publishing step is short
        enough that it does not eat the lesson. If any of those is missing, the
        platform is fighting the classroom instead of serving it.
      </p>

      <h2 className="text-xs text-wood-dark mt-6 mb-2 normal-case font-semibold">
        Why no-account publishing matters in a classroom
      </h2>
      <p>
        Every account is an email to collect, a password to reset, and a piece of
        student data to be responsible for. A platform that needs none of that is
        simpler for the teacher and safer by default — there is no personal
        information to protect because none was gathered. On ArcadeLab a student
        gets a Creator Code instead of an account: a casual identifier, not a
        credential tied to a real identity.
      </p>

      <h2 className="text-xs text-wood-dark mt-6 mb-2 normal-case font-semibold">
        Are the published games safe to play?
      </h2>
      <p>
        Yes. Each game runs inside a sandboxed iframe with network access
        switched off. A game cannot read the page around it, cannot send data
        anywhere, and cannot pull in anything from another site. That isolation
        is what makes it reasonable for a class to play each other&apos;s games
        freely.
      </p>

      <h2 className="text-xs text-wood-dark mt-6 mb-2 normal-case font-semibold">
        How does a class actually use it?
      </h2>
      <p>
        Students build a game — on their own or with an AI assistant — as a
        single HTML file. Each one pastes their file at the publish page and gets
        a URL back. The teacher collects the links into one document or page, and
        the class spends the last few minutes playing through everyone&apos;s
        work. The publishing step is small enough to fit inside a single session.
      </p>

      <h2 className="text-xs text-wood-dark mt-6 mb-2 normal-case font-semibold">
        What can students build?
      </h2>
      <p>
        Anything that fits in one HTML file: arcade games, quizzes, physics
        simulations, math visualizations, generative art. The format is broad
        enough to match almost any subject. For a parent-side view of the same
        idea, see{" "}
        <a
          href="/learn/help-kid-share-game-made-with-ai"
          className="text-accent-purple hover:text-accent-gold transition-colors"
        >
          how to help a kid share a game they made with AI
        </a>
        .
      </p>
      <p>Ready to publish a student game? Start at arcadelab.ai/publish.</p>
    </ArticleLayout>
  );
}
