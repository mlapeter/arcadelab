import type { Metadata } from "next";
import Link from "next/link";
import ArticleLayout from "@/components/ArticleLayout";
import QuickAnswer from "@/components/QuickAnswer";
import { getArticle } from "@/lib/articles";

const article = getArticle("help-kid-share-game-made-with-ai")!;

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
    question: "How can I help my kid share a game they made with AI?",
    answer:
      "Save the AI's HTML output as a file or copy it directly, then paste it at arcadelab.ai/publish. ArcadeLab is a free no-account platform designed for low-friction publishing of single-file HTML games.",
  },
  {
    question: "Does my kid need an email or account?",
    answer:
      "No. ArcadeLab uses Creator Codes (like ROCKET-WOLF-COMET-73) instead of email and password. The code is a casual identifier you can save anywhere — including by telling your AI assistant to remember it.",
  },
  {
    question: "Is it safe?",
    answer:
      "Games run in a sandboxed iframe with no network access — fetch, XHR, and WebSocket are all blocked. Published games cannot collect data, hit external services, or interact with the parent page. The platform also doesn't collect emails or personal data.",
  },
  {
    question: "Can my kid edit their game later?",
    answer:
      "Yes. As long as the browser remembers the Creator Code (or the kid types it back in), they can update or delete their games anytime.",
  },
  {
    question: "What kind of games are appropriate for ArcadeLab?",
    answer:
      "Anything a kid would make with an AI assistant: dodge games, platformers, art toys, math games, story games, physics demos. As parent, you can preview a game before publishing using ArcadeLab's preview pane.",
  },
];

export default function Page() {
  return (
    <ArticleLayout article={article} faqs={FAQS}>
      <QuickAnswer>
        Save the AI&apos;s HTML output, then paste it at{" "}
        <Link href="/publish" className="text-accent-purple underline">arcadelab.ai/publish</Link>.
        You get a public URL to share with the kid&apos;s friends or family. No account,
        no email, no signup. ArcadeLab was built specifically for this — its founder&apos;s
        7-year-old uses it.
      </QuickAnswer>

      <p>
        Kids are making real, playable games with AI assistants right now. They voice-chat
        with Claude or ChatGPT, describe what they want (&quot;a meteor shower game where
        the player dodges asteroids&quot;), and the AI writes the code. The kid copies it,
        and… then what? Most hosting platforms require email accounts kids can&apos;t
        legally have, app installs, or developer knowledge nobody in the room has.
      </p>
      <p>
        ArcadeLab exists because the founder ran into this exact problem with his own
        7-year-old. The publishing flow is one paste, one click.
      </p>

      <h2 className="text-xs text-wood-dark mt-6 mb-2 normal-case font-semibold">
        How does the workflow look in practice?
      </h2>
      <ol className="list-decimal list-inside space-y-2 my-3">
        <li>
          Your kid&apos;s AI gives them a chunk of HTML code (one big block).
        </li>
        <li>
          The kid copies all of it (you can help with this if needed — &quot;tap and hold
          to select all&quot;).
        </li>
        <li>
          On any device — iPad, laptop, phone — open <Link href="/publish" className="text-accent-purple underline">arcadelab.ai/publish</Link>.
        </li>
        <li>
          Tap the paste zone. The game preview loads automatically.
        </li>
        <li>
          Tap Publish. ArcadeLab generates a Creator Code if it&apos;s their first time.
        </li>
        <li>
          Share the URL with grandparents, friends, classmates.
        </li>
      </ol>

      <h2 className="text-xs text-wood-dark mt-6 mb-2 normal-case font-semibold">
        Is it safe?
      </h2>
      <p>The security model is built around three things:</p>
      <ul className="list-disc list-inside space-y-1 my-3">
        <li>
          <strong>No network access in published games.</strong> Every game runs in a
          sandboxed iframe with <code>connect-src &apos;none&apos;</code>. fetch, XHR,
          and WebSocket are all blocked. A game can&apos;t exfiltrate data, hit malicious
          URLs, or load tracking pixels.
        </li>
        <li>
          <strong>No personal data collected.</strong> ArcadeLab doesn&apos;t ask for
          email, real name, or location. The Creator Code is the only identifier.
        </li>
        <li>
          <strong>Preview before publish.</strong> Every game shows a preview before it
          goes public, so you can spot anything off.
        </li>
      </ul>
      <p>
        That said: ArcadeLab is open to the internet. Published games are public.
        You&apos;ll want to skim any game your kid is about to publish, the same way
        you&apos;d skim a drawing they were about to put on a fridge that everyone could
        see.
      </p>

      <h2 className="text-xs text-wood-dark mt-6 mb-2 normal-case font-semibold">
        How does the Creator Code work?
      </h2>
      <p>
        First publish, ArcadeLab generates something like <code>ROCKET-WOLF-COMET-73</code>.
        It links to a creator display name (also auto-generated, something like
        &quot;PixelKoala12&quot;). The code is stored in the browser. To use it on another
        device, type it into the &quot;Have a creator code?&quot; box on the publish page.
      </p>
      <p>
        Kids can also memorize the code or ask their AI to remember it: &quot;My ArcadeLab
        creator code is ROCKET-WOLF-COMET-73, please remember it for me!&quot; The next
        time they ask the AI to help make a game, the AI can prompt them to use the same
        code.
      </p>

      <h2 className="text-xs text-wood-dark mt-6 mb-2 normal-case font-semibold">
        What if my kid&apos;s game has a bug or doesn&apos;t work?
      </h2>
      <p>
        Common path: the preview shows an error or the game doesn&apos;t do what was
        intended. Copy the error message back to the AI and ask it to fix. The loop is
        usually one or two iterations. If a library is loading wrong, double-check that
        the AI didn&apos;t include its own CDN script tag — ArcadeLab injects those
        automatically and including your own causes double-loading.
      </p>

      <h2 className="text-xs text-wood-dark mt-6 mb-2 normal-case font-semibold">
        What can my kid build with this?
      </h2>
      <p>
        Anything that fits in a browser. Looking at games currently published on
        ArcadeLab: dodge games, platformers, zombie shooters, math quizzes, art toys,
        word games, tower defense, mini-Minecraft clones, story games. The current
        creator base ranges from 7-year-olds to adults — kids tend to publish a lot.
      </p>

      <h2 className="text-xs text-wood-dark mt-6 mb-2 normal-case font-semibold">
        Anything I should keep in mind as a parent?
      </h2>
      <p>
        ArcadeLab won&apos;t collect anything about your kid. But the AI tools they&apos;re
        using to build games often have age requirements you should be aware of. ArcadeLab
        itself is AI-agnostic — it just hosts the output — so you have flexibility about
        how the game gets made (kid working alone, kid working with you, kid working with
        an AI, you working with the kid).
      </p>
    </ArticleLayout>
  );
}
