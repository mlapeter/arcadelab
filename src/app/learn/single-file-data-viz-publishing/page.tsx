import type { Metadata } from "next";
import ArticleLayout from "@/components/ArticleLayout";
import QuickAnswer from "@/components/QuickAnswer";
import { getArticle } from "@/lib/articles";

const article = getArticle("single-file-data-viz-publishing")!;

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
    question: "Can a data visualization really fit in one file?",
    answer:
      "Yes, for most cases. The chart code, the styling, and a few thousand rows of data fit comfortably in a single HTML file. Only very large datasets push past the practical limit.",
  },
  {
    question: "Where does the data go if I cannot fetch it?",
    answer:
      "Inline. Embed the dataset directly in the JavaScript as an array or object. The file then carries its own data and works without any network access.",
  },
  {
    question: "Which library is best for a single-file visualization?",
    answer:
      "D3 for bespoke and interactive charts, p5.js for generative or animated graphics, or plain canvas and SVG for simple charts. ArcadeLab injects D3 and p5.js from a CDN when you list them in the header.",
  },
  {
    question: "How big can the file be?",
    answer:
      "ArcadeLab accepts single HTML files up to 500KB. Chart code is small; the data is what grows. If a dataset is too large, summarize or sample it before embedding.",
  },
  {
    question: "Can I embed the visualization in an article?",
    answer:
      "Yes. Once it has its own URL, embed it with an iframe in a blog post, report, or documentation page. It stays sandboxed and self-contained.",
  },
];

export default function Page() {
  return (
    <ArticleLayout article={article} faqs={FAQS}>
      <QuickAnswer>
        A single-file data visualization holds the chart code, the styling, and
        the dataset all in one HTML file. Embed the data directly in the
        JavaScript so it needs no network access, draw with D3, p5.js, or plain
        canvas, and paste the file at arcadelab.ai/publish for a permanent URL —
        no build step, no signup.
      </QuickAnswer>

      <p>
        A good chart deserves a URL, not a screenshot. Publishing a data
        visualization as a single self-contained HTML file keeps it interactive,
        keeps it shareable, and keeps the whole thing in one place. The one
        question worth thinking about up front is where the data lives.
      </p>

      <h2 className="text-xs text-wood-dark mt-6 mb-2 normal-case font-semibold">
        What is a single-file data visualization?
      </h2>
      <p>
        It is one HTML document that contains everything: the markup, the CSS,
        the charting JavaScript, and the data itself. Open the file and the
        visualization runs. There is no separate data file to load and no server
        to call — which is exactly what makes it easy to publish and safe to
        sandbox.
      </p>

      <h2 className="text-xs text-wood-dark mt-6 mb-2 normal-case font-semibold">
        Where does the data live if there are no network calls?
      </h2>
      <p>
        Inline, inside the file. Instead of fetching a CSV or JSON file, embed
        the dataset directly in the JavaScript as an array of values. Published
        visualizations run in a sandbox with no network access, so a fetch call
        would fail — but inline data never has to travel anywhere. Ask your AI
        assistant to &quot;embed this data as a JavaScript array&quot; and the
        file becomes self-sufficient.
      </p>

      <h2 className="text-xs text-wood-dark mt-6 mb-2 normal-case font-semibold">
        Which library should I use?
      </h2>
      <p>
        D3 is the workhorse for custom, interactive charts. p5.js suits
        animated or generative visualizations. For a plain bar or line chart,
        the canvas and SVG APIs need no library at all. List D3 or p5.js in the
        ARCADELAB header and ArcadeLab injects it from a CDN — you do not add a
        script tag. For the D3-specific path, see{" "}
        <a
          href="/learn/share-d3-visualization-no-build"
          className="text-accent-purple hover:text-accent-gold transition-colors"
        >
          how to share a D3 visualization without a build step
        </a>
        .
      </p>

      <h2 className="text-xs text-wood-dark mt-6 mb-2 normal-case font-semibold">
        How do I publish the visualization?
      </h2>
      <p>
        Test the file in a browser, then paste it at arcadelab.ai/publish for a
        permanent URL. There is no signup and no build step. The result is a
        page you can link directly or embed with an iframe wherever the chart
        belongs.
      </p>

      <h2 className="text-xs text-wood-dark mt-6 mb-2 normal-case font-semibold">
        How do I keep the file under the size limit?
      </h2>
      <p>
        Chart code is small; data is what grows. If a dataset pushes the file
        past 500KB, sample it, round long decimals, or aggregate to the level the
        chart actually shows. A visualization rarely needs every raw row — it
        needs the shape of the data, and the shape compresses well.
      </p>
      <p>Have a visualization ready? Publish it at arcadelab.ai/publish.</p>
    </ArticleLayout>
  );
}
