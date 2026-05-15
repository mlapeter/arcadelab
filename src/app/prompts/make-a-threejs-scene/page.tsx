import type { Metadata } from "next";
import PromptLayout from "@/components/PromptLayout";
import { getPrompt } from "@/lib/seo/prompts";

const prompt = getPrompt("make-a-threejs-scene")!;

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
          question: "Which Three.js version does ArcadeLab load?",
          answer:
            "Three.js r128 from cdnjs — the last version before Three.js moved to ES modules as the primary distribution. The global THREE namespace is available without imports.",
        },
        {
          question: "Can I use GLTFLoader or OBJLoader?",
          answer:
            "Not for external models — the sandbox blocks network requests. Either build geometry procedurally with Three.js primitives or base64-encode a small model inline.",
        },
        {
          question: "Can I use react-three-fiber?",
          answer:
            "Not directly. R3F is distributed as ES modules that need bundling. For ArcadeLab, write directly against the imperative Three.js API.",
        },
      ]}
    />
  );
}
