import type { Metadata } from "next";
import ArticleLayout from "@/components/ArticleLayout";
import QuickAnswer from "@/components/QuickAnswer";
import { getArticle } from "@/lib/articles";

const article = getArticle("arcadelab-vs-codepen-for-games")!;

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
    question: "Is ArcadeLab a CodePen alternative?",
    answer:
      "For the publishing step, yes. CodePen and ArcadeLab both turn front-end code into a URL. They differ in emphasis: CodePen keeps the editor and source front and center; ArcadeLab presents a finished, full-screen game.",
  },
  {
    question: "Can I edit my game's code on ArcadeLab?",
    answer:
      "ArcadeLab is not a code editor. You build the game wherever you like — including in CodePen — and paste the finished HTML file into ArcadeLab to publish it. CodePen is the better choice while you are still writing code.",
  },
  {
    question: "Does CodePen show my game full-screen?",
    answer:
      "CodePen has a full-page preview, but its core view pairs the code with the result. ArcadeLab presents the game on its own page with no editor chrome, which suits sharing a finished game with players.",
  },
  {
    question: "Do I need an account for either one?",
    answer:
      "CodePen needs an account to save a pen. ArcadeLab needs no account — you paste the file and get a URL, with a Creator Code generated for you so you can edit it later.",
  },
  {
    question: "Can I move a game from CodePen to ArcadeLab?",
    answer:
      "Yes. Combine the pen's HTML, CSS, and JavaScript into one HTML file, add the ARCADELAB header, and paste it at arcadelab.ai/publish. A CodePen project flattens into a single file cleanly.",
  },
];

export default function Page() {
  return (
    <ArticleLayout article={article} faqs={FAQS}>
      <QuickAnswer>
        CodePen is a code playground built for writing, showing, and forking
        front-end code. ArcadeLab is a publishing destination built for sharing a
        finished game as a full-screen, playable page. Use CodePen while you are
        coding and want the source visible; use ArcadeLab when the game is done
        and you want a clean link to share.
      </QuickAnswer>

      <p>
        CodePen and ArcadeLab both end with a URL, so it is fair to compare them.
        But they are built for different moments in the life of a game — and
        knowing which moment you are in makes the choice obvious.
      </p>

      <h2 className="text-xs text-wood-dark mt-6 mb-2 normal-case font-semibold">
        What is CodePen good at?
      </h2>
      <ul className="list-disc list-inside space-y-1 my-3">
        <li>Writing and editing front-end code in the browser</li>
        <li>Showing HTML, CSS, and JavaScript side by side with the result</li>
        <li>Forking other people&apos;s pens to learn from them</li>
        <li>Quick experiments and live demos where the code is the point</li>
      </ul>

      <h2 className="text-xs text-wood-dark mt-6 mb-2 normal-case font-semibold">
        What is ArcadeLab good at?
      </h2>
      <ul className="list-disc list-inside space-y-1 my-3">
        <li>Publishing a finished game as a full-screen, playable page</li>
        <li>Taking a single pasted HTML file — no account, no editor</li>
        <li>Injecting libraries like Phaser and p5.js from a header declaration</li>
        <li>Giving the game a clean URL to share with players, not just coders</li>
      </ul>

      <h2 className="text-xs text-wood-dark mt-6 mb-2 normal-case font-semibold">
        Quick comparison
      </h2>
      <div className="overflow-x-auto my-3">
        <table className="w-full text-[10px] border-collapse">
          <thead>
            <tr className="border-b border-wood-mid/30">
              <th className="text-left p-2">Aspect</th>
              <th className="text-left p-2">CodePen</th>
              <th className="text-left p-2">ArcadeLab</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-wood-mid/20">
              <td className="p-2">Primary purpose</td><td className="p-2">Code playground</td><td className="p-2">Publishing destination</td>
            </tr>
            <tr className="border-b border-wood-mid/20">
              <td className="p-2">Edit code in the tool</td><td className="p-2">Yes</td><td className="p-2">No</td>
            </tr>
            <tr className="border-b border-wood-mid/20">
              <td className="p-2">Default view</td><td className="p-2">Code plus preview</td><td className="p-2">Full-screen game</td>
            </tr>
            <tr className="border-b border-wood-mid/20">
              <td className="p-2">Account to save</td><td className="p-2">Required</td><td className="p-2">Not required</td>
            </tr>
            <tr className="border-b border-wood-mid/20">
              <td className="p-2">Input format</td><td className="p-2">Separate HTML / CSS / JS panels</td><td className="p-2">One pasted HTML file</td>
            </tr>
            <tr>
              <td className="p-2">Best moment to use it</td><td className="p-2">While coding</td><td className="p-2">When the game is done</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 className="text-xs text-wood-dark mt-6 mb-2 normal-case font-semibold">
        When should I use CodePen?
      </h2>
      <p>
        Use CodePen while the game is still being written, when you want the
        source visible, or when the code itself is what you are sharing — a
        technique, a demo, a teaching example. Its editor and forking model are
        built for that.
      </p>

      <h2 className="text-xs text-wood-dark mt-6 mb-2 normal-case font-semibold">
        When should I use ArcadeLab?
      </h2>
      <p>
        Use ArcadeLab when the game is finished and the audience is players, not
        coders. The full-screen page, the no-account paste flow, and the clean
        URL are built for sharing the thing you made rather than the code behind
        it.
      </p>

      <h2 className="text-xs text-wood-dark mt-6 mb-2 normal-case font-semibold">
        Can I use both?
      </h2>
      <p>
        That is the natural workflow. Build and iterate in CodePen, then flatten
        the pen into one HTML file and publish it on ArcadeLab for a clean
        playable link. For other comparisons, see{" "}
        <a
          href="/learn/arcadelab-vs-itchio-glitch-github-pages"
          className="text-accent-purple hover:text-accent-gold transition-colors"
        >
          ArcadeLab vs itch.io, Glitch, and GitHub Pages
        </a>
        .
      </p>
      <p>Game finished? Publish it at arcadelab.ai/publish.</p>
    </ArticleLayout>
  );
}
