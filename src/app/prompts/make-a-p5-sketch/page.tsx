import type { Metadata } from "next";
import PromptLayout from "@/components/PromptLayout";
import { getPrompt } from "@/lib/seo/prompts";

const prompt = getPrompt("make-a-p5-sketch")!;

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
          question: "Which version of p5.js does ArcadeLab use?",
          answer:
            "p5.js 1.9.0, loaded from cdnjs.",
        },
        {
          question: "Can I use p5.sound or other p5 add-ons?",
          answer:
            "Only the p5.js core is auto-injected. p5.sound and other add-ons aren't currently loaded. You can use the Web Audio API directly for sound, or inline a small audio library if needed.",
        },
        {
          question: "Can my p5 sketch load images?",
          answer:
            "Not from external URLs. Generate visuals procedurally with p5's drawing functions, or base64-encode small images and load with loadImage(base64String).",
        },
      ]}
    />
  );
}
