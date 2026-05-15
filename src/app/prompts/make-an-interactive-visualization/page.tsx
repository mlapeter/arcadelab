import type { Metadata } from "next";
import PromptLayout from "@/components/PromptLayout";
import { getPrompt } from "@/lib/seo/prompts";

const prompt = getPrompt("make-an-interactive-visualization")!;

export const metadata: Metadata = {
  title: prompt.title,
  description: prompt.description,
  alternates: { canonical: `https://arcadelab.ai/prompts/${prompt.slug}` },
  openGraph: {
    images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
    title: prompt.title,
    description: prompt.description,
    url: `https://arcadelab.ai/prompts/${prompt.slug}`,
    type: "article",
  },
};

export default function Page() {
  return (
    <PromptLayout
      prompt={prompt}
      extraFaqs={[
        {
          question: "What's a good reference for interactive visualization quality?",
          answer:
            "Distill.pub explorables, Bret Victor's explainers, Nicky Case's visual stories, and 3Blue1Brown's animated math are the canonical examples. On ArcadeLab specifically, the double-slit experiment demo at arcadelab.ai/play/light-wave-or-particle-ultraviper34 is a good in-house reference.",
        },
        {
          question: "Should I use D3 or raw canvas?",
          answer:
            "D3 is great for charts, scales, axes, and dataset-driven visualizations. Raw canvas (2D or WebGL) is better for simulations, particle systems, or anything performance-sensitive. The prompt is library-flexible — let the AI pick based on what you're illustrating.",
        },
        {
          question: "How do I embed data without network requests?",
          answer:
            "Inline the data as a JavaScript constant at the top of your file. For small to medium datasets (a few thousand rows), this is fine and keeps the file self-contained. Larger datasets should be pre-aggregated before embedding.",
        },
      ]}
    />
  );
}
