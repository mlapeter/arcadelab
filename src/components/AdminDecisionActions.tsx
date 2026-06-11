"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export interface DecisionButton {
  label: string;
  action: string;
  /** Extra fields merged into the POST body (decisionId, creatorId, …). */
  payload?: Record<string, string>;
  confirm?: string;
  tone?: "green" | "red" | "gold" | "muted";
}

const TONE: Record<string, string> = {
  green: "text-accent-green",
  red: "text-accent-red",
  gold: "text-accent-gold",
  muted: "text-wood-mid/70",
};

/** Generic one-click action buttons for /admin decision and appeal rows. */
export default function AdminDecisionActions({
  adminKey,
  buttons,
}: {
  adminKey: string;
  buttons: DecisionButton[];
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function run(b: DecisionButton) {
    if (busy) return;
    if (b.confirm && !window.confirm(b.confirm)) return;

    setBusy(true);
    try {
      const res = await fetch("/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: adminKey, action: b.action, ...b.payload }),
      });
      if (res.ok) {
        router.refresh();
      } else {
        const data = await res.json().catch(() => null);
        alert(data?.error || "Action failed — check the admin key.");
      }
    } catch {
      alert("Couldn't connect — try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {buttons.map((b) => (
        <button
          key={b.label}
          disabled={busy}
          onClick={() => run(b)}
          className={`rpg-panel px-3 py-2 text-[10px] cursor-pointer disabled:opacity-50 transition-colors hover:bg-wood-mid/20 ${
            TONE[b.tone || "muted"]
          }`}
        >
          {b.label}
        </button>
      ))}
    </div>
  );
}
