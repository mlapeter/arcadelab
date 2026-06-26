import type { Metadata } from "next";
import AppealForm from "@/components/AppealForm";

export const metadata: Metadata = {
  title: "Think we made a mistake? — ArcadeLab",
  description:
    "Game taken down or can't publish? Tell us what happened and a real human will take a look. No email needed.",
  alternates: { canonical: "https://arcadelab.ai/appeal" },
};

interface Props {
  searchParams: Promise<{ contact?: string; chat?: string }>;
}

export default async function AppealPage({ searchParams }: Props) {
  // The friendly ban panel on /publish links here with the kid's code
  // prefilled and chat=1 so the helper opens right after they hit send.
  const { contact, chat } = await searchParams;
  return (
    <main className="mx-auto max-w-lg px-4 py-8 space-y-6">
      <div className="text-center space-y-3">
        <h1 className="text-sm sm:text-base text-accent-gold drop-shadow-[2px_2px_0_rgba(0,0,0,0.5)]">
          Think we made a mistake?
        </h1>
        <p className="text-[10px] text-parchment/60 normal-case">
          Tell us what happened and a human will take a look.
        </p>
      </div>
      <AppealForm
        initialContact={(contact || "").slice(0, 200)}
        autoChat={chat === "1"}
      />
    </main>
  );
}
