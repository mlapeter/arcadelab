"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface AdminGameActionsProps {
  gameId: string;
  creatorId: string;
  adminKey: string;
}

type Action = "approve" | "dismiss" | "hide" | "remove" | "ban";

/** Moderation buttons for one row of the /admin review queue. */
export default function AdminGameActions({
  gameId,
  creatorId,
  adminKey,
}: AdminGameActionsProps) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function run(action: Action, confirmMsg?: string) {
    if (busy) return;
    if (confirmMsg && !window.confirm(confirmMsg)) return;

    setBusy(true);
    try {
      const res = await fetch("/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          key: adminKey,
          action,
          gameId,
          creatorId,
        }),
      });
      if (res.ok) {
        router.refresh();
      } else {
        alert("Action failed — check the admin key.");
      }
    } catch {
      alert("Couldn't connect — try again.");
    } finally {
      setBusy(false);
    }
  }

  const btn =
    "rpg-panel px-3 py-2 text-[10px] cursor-pointer disabled:opacity-50 transition-colors";

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        disabled={busy}
        onClick={() => run("approve")}
        className={`${btn} text-accent-green hover:bg-wood-mid/20`}
      >
        ✓ Approve
      </button>
      <button
        disabled={busy}
        onClick={() => run("dismiss")}
        className={`${btn} text-wood-mid/70 hover:bg-wood-mid/20`}
        title="False alarm — clear reports, keep the game live"
      >
        ⌀ Dismiss reports
      </button>
      <button
        disabled={busy}
        onClick={() => run("hide")}
        className={`${btn} text-accent-gold hover:bg-wood-mid/20`}
        title="Shadow-hide — still playable by link, off all discovery"
      >
        🙈 Hide
      </button>
      <button
        disabled={busy}
        onClick={() =>
          run("remove", "Permanently remove this game? It will 404 everywhere.")
        }
        className={`${btn} text-accent-red hover:bg-wood-mid/20`}
      >
        🗑️ Remove
      </button>
      <button
        disabled={busy}
        onClick={() =>
          run(
            "ban",
            "Ban this creator? All their games will be hidden and future ones blocked."
          )
        }
        className={`${btn} text-accent-red hover:bg-wood-mid/20`}
      >
        ⛔ Ban creator
      </button>
    </div>
  );
}
