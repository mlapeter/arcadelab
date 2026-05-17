"use client";

import { useState } from "react";

interface ReportButtonProps {
  gameId: string;
}

/**
 * Lets any viewer flag a game as a scam or inappropriate — no login, same
 * low-friction pattern as StarButton. Enough distinct reports auto-hides the
 * game pending owner review. Kept quiet visually so it never invites trolling.
 */
export default function ReportButton({ gameId }: ReportButtonProps) {
  const [state, setState] = useState<"idle" | "sending" | "done">("idle");

  async function handleReport() {
    if (state !== "idle") return;

    const ok = window.confirm(
      "Report this game as a scam or inappropriate?\n\n" +
        "Our team will take a look. Thanks for helping keep ArcadeLab safe!"
    );
    if (!ok) return;

    setState("sending");
    try {
      const reason = window.prompt(
        "Optional: what's wrong with it? (you can leave this blank)"
      );
      await fetch(`/api/games/${gameId}/report`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason: reason || "" }),
      });
      setState("done");
    } catch {
      setState("idle");
    }
  }

  return (
    <button
      onClick={handleReport}
      disabled={state !== "idle"}
      className={`rpg-panel inline-flex items-center gap-2 px-4 py-2 text-[10px] transition-colors ${
        state === "done"
          ? "text-accent-green cursor-default"
          : "text-wood-mid/40 hover:text-accent-red cursor-pointer"
      }`}
      title="Report a scam or inappropriate game"
    >
      {state === "done" ? <span>✓ Reported — thanks!</span> : <span>🚩 Report</span>}
    </button>
  );
}
