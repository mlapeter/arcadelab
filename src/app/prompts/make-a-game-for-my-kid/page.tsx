import type { Metadata } from "next";
import PromptLayout from "@/components/PromptLayout";
import { getPrompt } from "@/lib/seo/prompts";

const prompt = getPrompt("make-a-game-for-my-kid")!;

export const metadata: Metadata = {
  title: prompt.title,
  description: prompt.description,
  alternates: { canonical: `https://arcadelab.ai/prompts/${prompt.slug}` },
  openGraph: {
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
          question: "Is ArcadeLab safe for kids?",
          answer:
            "ArcadeLab doesn't collect emails, real names, or personal data. Published games run in a sandboxed iframe with no network access, so they can't exfiltrate anything or load tracking. As parent you can preview a game before publishing.",
        },
        {
          question: "What ages is this good for?",
          answer:
            "Kids who can read simple instructions and use a tablet — usually around 6 and up. Younger kids can participate by describing the game they want; the AI does the typing.",
        },
        {
          question: "What if my kid wants to share their game?",
          answer:
            "Every published game gets a URL like arcadelab.ai/play/your-title. Share it via iMessage, email, Discord, wherever. The receiver clicks and plays — no install, no account.",
        },
      ]}
    />
  );
}
