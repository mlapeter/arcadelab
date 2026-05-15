import type { Metadata } from "next";
import ArticleLayout from "@/components/ArticleLayout";
import QuickAnswer from "@/components/QuickAnswer";
import { getArticle } from "@/lib/articles";

const article = getArticle("connect-src-none-iframe-csp")!;

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
    question: "Does connect-src none block loading a library?",
    answer:
      "No. connect-src governs script-initiated connections like fetch and WebSocket. Loading a script file is governed by script-src. A host can block network calls while still allowing approved libraries to load.",
  },
  {
    question: "Will my game throw an error if it uses fetch?",
    answer:
      "The fetch call will be blocked and will fail. Depending on how the code handles it, that surfaces as a rejected promise or a console error. The fix is to remove the network dependency, not to catch the error.",
  },
  {
    question: "Can I still use localStorage with connect-src none?",
    answer:
      "connect-src does not control localStorage — that is storage, not a network connection. Whether storage is available depends on the iframe sandbox settings, separately from the CSP.",
  },
  {
    question: "Why not just allow trusted network calls?",
    answer:
      "Allowing any network access means reviewing where each game connects and trusting it not to change. Blocking all of it with connect-src none removes that burden entirely, which is what lets a platform host open submissions safely.",
  },
  {
    question: "How do I know if my game needs the network?",
    answer:
      "Search the code for fetch, XMLHttpRequest, WebSocket, and EventSource. If none appear, the game is already compatible. If they do, replace what they did with inline data or in-code generation.",
  },
];

export default function Page() {
  return (
    <ArticleLayout article={article} faqs={FAQS}>
      <QuickAnswer>
        connect-src &apos;none&apos; is a Content Security Policy directive that
        blocks every kind of network connection a page can make — fetch,
        XMLHttpRequest, WebSocket, and EventSource. Game hosts apply it so a
        published game cannot call out to any server. For creators it means one
        rule: build games that need no network access.
      </QuickAnswer>

      <p>
        If you have published a game and wondered why its fetch call quietly
        fails, this directive is usually the reason. It is a deliberate, useful
        restriction — and easy to design around once you know it is there.
      </p>

      <h2 className="text-xs text-wood-dark mt-6 mb-2 normal-case font-semibold">
        What is connect-src in a Content Security Policy?
      </h2>
      <p>
        A Content Security Policy is a set of rules a page sends to the browser
        about what it is allowed to do. connect-src is the rule that governs
        outgoing connections made from script — the requests a page opens to talk
        to a server. Each CSP directive covers one category of behavior, and
        connect-src covers the network.
      </p>

      <h2 className="text-xs text-wood-dark mt-6 mb-2 normal-case font-semibold">
        What does the &apos;none&apos; value block?
      </h2>
      <p>
        Setting connect-src to &apos;none&apos; means no outgoing connections of
        any kind. That covers fetch and XMLHttpRequest for API calls,
        WebSocket for live connections, and EventSource for server-sent events.
        The browser refuses all of them before they leave the page. There is no
        allowed destination, because the list of allowed destinations is empty.
      </p>

      <h2 className="text-xs text-wood-dark mt-6 mb-2 normal-case font-semibold">
        Why do game hosts set connect-src to none?
      </h2>
      <p>
        A platform that accepts open submissions cannot review every game for
        where it sends data. Blocking all network access removes the question
        entirely: a game with no way to connect out cannot leak data, cannot
        phone home, and cannot pull in something unexpected. Paired with a
        sandboxed iframe, it is what makes hosting untrusted games safe.
      </p>

      <h2 className="text-xs text-wood-dark mt-6 mb-2 normal-case font-semibold">
        What does this mean for me as a creator?
      </h2>
      <p>
        Your game runs entirely on its own. It cannot load a remote leaderboard,
        call a weather API, or fetch an image from another site. In practice this
        is a small constraint — most browser games never needed the network — and
        it is a fixed rule, so you design with it rather than around it.
      </p>

      <h2 className="text-xs text-wood-dark mt-6 mb-2 normal-case font-semibold">
        How do I build a game that needs no network?
      </h2>
      <p>
        Embed any data the game needs directly in the file. Draw graphics with
        canvas shapes instead of fetching images. Generate sound with the Web
        Audio API. Keep score in a variable for the session. A self-contained
        game is the goal anyway — see{" "}
        <a
          href="/learn/common-bugs-ai-generated-games"
          className="text-accent-purple hover:text-accent-gold transition-colors"
        >
          the common bugs in AI-generated games
        </a>{" "}
        for the blocked-network case in context.
      </p>
      <p>Built a self-contained game? Publish it at arcadelab.ai/publish.</p>
    </ArticleLayout>
  );
}
