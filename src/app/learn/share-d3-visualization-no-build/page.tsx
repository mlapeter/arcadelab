import type { Metadata } from "next";
import Link from "next/link";
import ArticleLayout from "@/components/ArticleLayout";
import QuickAnswer from "@/components/QuickAnswer";
import { getArticle } from "@/lib/articles";

const article = getArticle("share-d3-visualization-no-build")!;

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
    question: "How do I share a D3.js visualization without a build step?",
    answer:
      "Write your D3 visualization as a single HTML file with all JavaScript and data inline. Add an ARCADELAB header with 'libraries: d3'. Paste at arcadelab.ai/publish to get a permanent URL.",
  },
  {
    question: "Does ArcadeLab load D3 automatically?",
    answer:
      "Yes. List 'd3' in the ARCADELAB header and ArcadeLab injects the D3.js v7 CDN script. Don't include your own script tag.",
  },
  {
    question: "Can my D3 viz fetch data from an API?",
    answer:
      "No. ArcadeLab blocks network requests. Embed your data inline as a JavaScript array or JSON constant. For most explainers and one-off charts this is fine; for live dashboards, ArcadeLab isn't the right host.",
  },
  {
    question: "What version of D3 does ArcadeLab use?",
    answer:
      "D3 v7.8.5, loaded from cdnjs. This is the modular v7 series — all submodules are bundled into the global d3 namespace.",
  },
  {
    question: "Can I use Observable Plot instead of D3?",
    answer:
      "Observable Plot isn't currently in ArcadeLab's auto-injected library list. You can inline the Plot library in your HTML if you have space, but it's heavy. For most static visualizations, raw D3 is the cleaner fit.",
  },
];

export default function Page() {
  return (
    <ArticleLayout article={article} faqs={FAQS}>
      <QuickAnswer>
        Write your D3 visualization as a single HTML file with data inline. Add an
        ARCADELAB header with <code>libraries: d3</code>. Paste at{" "}
        <Link href="/publish" className="text-accent-purple underline">arcadelab.ai/publish</Link>{" "}
        and get a shareable URL. No build, no bundler, no Observable account.
      </QuickAnswer>

      <p>
        D3 visualizations are a perfect fit for single-file HTML. The library&apos;s API
        works directly against the DOM and SVG, you bring your own data, and the output
        is a self-contained interactive document. The only friction was always: where do
        you put it so people can see it without forking a Gist?
      </p>

      <h2 className="text-xs text-wood-dark mt-6 mb-2 normal-case font-semibold">
        What does a minimal D3 viz on ArcadeLab look like?
      </h2>
      <pre className="pixel-border-green bg-sky-top p-4 my-3 overflow-x-auto text-[10px]">
{`<!--ARCADELAB
title: Quarterly Revenue
description: Bar chart of quarterly revenue
libraries: d3
emoji: 📊
color: teal
-->
<!DOCTYPE html>
<html>
<body>
  <svg width="640" height="400" id="chart"></svg>
  <script>
    const data = [
      { quarter: 'Q1', value: 30 },
      { quarter: 'Q2', value: 80 },
      { quarter: 'Q3', value: 45 },
      { quarter: 'Q4', value: 60 },
    ];
    const svg = d3.select('#chart');
    const x = d3.scaleBand()
      .domain(data.map(d => d.quarter))
      .range([40, 600]).padding(0.1);
    const y = d3.scaleLinear()
      .domain([0, 100])
      .range([360, 40]);
    svg.selectAll('rect').data(data).join('rect')
      .attr('x', d => x(d.quarter))
      .attr('y', d => y(d.value))
      .attr('width', x.bandwidth())
      .attr('height', d => 360 - y(d.value))
      .attr('fill', '#4dd4c5');
  </script>
</body>
</html>`}
      </pre>

      <h2 className="text-xs text-wood-dark mt-6 mb-2 normal-case font-semibold">
        How do I include data without network requests?
      </h2>
      <p>
        Inline the data as a JavaScript constant. For small to medium datasets (up to a
        few thousand rows), this is fine and keeps the file self-contained. For larger
        datasets, you might pre-aggregate the data first.
      </p>
      <p>
        If you have CSV data, convert it to a JS array of objects before embedding.
        ArcadeLab&apos;s file size limit is 500KB total, so most plain-text datasets fit
        easily.
      </p>

      <h2 className="text-xs text-wood-dark mt-6 mb-2 normal-case font-semibold">
        Can my D3 viz be interactive?
      </h2>
      <p>
        Yes. All standard D3 patterns work: tooltips on hover, brushing, zooming, animated
        transitions, scrubbable timelines. The iframe sandbox blocks network requests, not
        user interaction.
      </p>

      <h2 className="text-xs text-wood-dark mt-6 mb-2 normal-case font-semibold">
        How does this compare to publishing on Observable?
      </h2>
      <p>
        Observable is purpose-built for D3 and has a brilliant notebook UX for development.
        It also requires an account, and embeds are tied to your notebook&apos;s runtime.
        ArcadeLab is simpler if you just want a permanent, embeddable URL with no
        Observable account dependency — and if you&apos;ve generated the viz with an AI,
        ArcadeLab is the faster path from output to shareable link.
      </p>

      <h2 className="text-xs text-wood-dark mt-6 mb-2 normal-case font-semibold">
        Where can I see an example interactive viz on ArcadeLab?
      </h2>
      <p>
        The{" "}
        <Link href="/play/light-wave-or-particle-ultraviper34" className="text-accent-purple underline">
          double-slit experiment
        </Link>{" "}
        is an interactive physics visualization (built without D3 specifically, but in the
        same spirit). It demonstrates what a polished single-file viz can look like.
      </p>

      <h2 className="text-xs text-wood-dark mt-6 mb-2 normal-case font-semibold">
        How do I prompt Claude or ChatGPT for a D3 viz on ArcadeLab?
      </h2>
      <blockquote className="border-l-4 border-accent-purple pl-4 my-3 italic">
        &quot;Make a D3.js visualization as a single self-contained HTML file. Don&apos;t
        include the D3 CDN — ArcadeLab loads it. Put an <code>&lt;!--ARCADELAB&gt;</code>{" "}
        header at the top with <code>libraries: d3</code>. Embed any data inline as a JS
        constant — no fetch calls, network requests are blocked.&quot;
      </blockquote>
    </ArticleLayout>
  );
}
