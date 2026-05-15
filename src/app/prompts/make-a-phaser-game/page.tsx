import type { Metadata } from "next";
import PromptLayout from "@/components/PromptLayout";
import { getPrompt } from "@/lib/seo/prompts";

const prompt = getPrompt("make-a-phaser-game")!;

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
          question: "Which version of Phaser does ArcadeLab use?",
          answer:
            "Phaser 3.70.0, loaded from cdnjs. If your prompt produces code that references an older or newer version, ask the AI to target Phaser 3.70 specifically.",
        },
        {
          question: "Can the AI use Phaser plugins or extensions?",
          answer:
            "Only what comes with the Phaser 3.70 core. Plugins distributed as separate npm packages won't work in the single-file sandbox. If the AI suggests a plugin, ask it to inline the equivalent logic or use core Phaser features.",
        },
        {
          question: "Can the Phaser game load images?",
          answer:
            "Not from external URLs — the iframe sandbox blocks network requests. Either generate sprites procedurally with this.add.graphics() (recommended) or base64-encode small images inline and load them with this.textures.addBase64().",
        },
      ]}
    />
  );
}
