"use client";

import { useState } from "react";

/**
 * What the moderation system has learned: the current distilled lessons
 * document, with a one-click regenerate (re-runs consolidation over recent
 * cases). Admin-only.
 */
export default function AdminLessonsPanel({
  adminKey,
  lessons,
  caseCount,
  fingerprintCount,
}: {
  adminKey: string;
  lessons: string | null;
  caseCount: number;
  fingerprintCount: number;
}) {
  const [text, setText] = useState(lessons);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function regenerate() {
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: adminKey, action: "consolidate" }),
      });
      const data = await res.json().catch(() => null);
      if (data?.lessons) setText(data.lessons);
      else setError(data?.error || "Consolidation failed");
    } catch {
      setError("Consolidation failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="rpg-panel p-4 mb-8">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
        <p className="text-[10px] text-wood-dark">
          🧠 What the system has learned
          <span className="text-wood-mid/50 normal-case">
            {" "}
            · {caseCount} case{caseCount === 1 ? "" : "s"}, {fingerprintCount}{" "}
            fingerprint{fingerprintCount === 1 ? "" : "s"}
          </span>
        </p>
        <button
          onClick={regenerate}
          disabled={busy}
          className="rpg-btn rpg-btn-gold px-3 py-1.5 text-[10px] disabled:opacity-50"
        >
          {busy ? "Distilling..." : "↻ Regenerate"}
        </button>
      </div>
      {error && <p className="text-[10px] text-accent-red normal-case mb-2">{error}</p>}
      {text ? (
        <pre className="text-[10px] text-wood-mid normal-case whitespace-pre-wrap font-[inherit] leading-relaxed">
          {text}
        </pre>
      ) : (
        <p className="text-[10px] text-wood-mid/60 normal-case">
          No lessons yet — they get distilled from your reversals and appeal
          outcomes (or hit Regenerate once there are cases).
        </p>
      )}
    </div>
  );
}
