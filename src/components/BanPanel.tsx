"use client";

import { useState } from "react";
import AppealChat from "@/components/AppealChat";

/**
 * The friendly ban state: shown when a publish hits the 403 for a paused
 * account. Kind and non-shaming — being paused by the safety robot is a
 * fixable mix-up, not a verdict on the kid. One tap files the appeal;
 * the chat helper can often sort it out on the spot.
 */
export default function BanPanel({ creatorCode }: { creatorCode?: string }) {
  const [note, setNote] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "sent">("idle");
  const [appealId, setAppealId] = useState<string | undefined>(undefined);
  const [chatting, setChatting] = useState(false);

  const contact = creatorCode || "";

  async function sendAppeal() {
    if (state !== "idle") return;
    setState("sending");
    try {
      const res = await fetch("/api/appeals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contact: contact || "banned creator (no code on this device)",
          message:
            note.trim() || "My account was paused and I think it's a mistake.",
        }),
      });
      const data = await res.json().catch(() => null);
      if (typeof data?.appealId === "string") setAppealId(data.appealId);
    } catch {
      // The panel still moves on — the chat itself can capture the story.
    }
    setState("sent");
  }

  return (
    <div className="space-y-4">
      <div className="rpg-panel p-4 space-y-3">
        <p className="text-[10px] text-wood-dark">🛟 Your account is paused</p>
        <p className="text-[10px] text-wood-mid normal-case leading-relaxed">
          Our safety robot paused your account. It&apos;s careful, but sometimes
          it makes mistakes — if this seems wrong, it&apos;s easy to fix and
          you&apos;re not in trouble.
        </p>

        {state === "sent" ? (
          <div className="space-y-3 text-center">
            <p className="text-[10px] text-accent-green normal-case">
              Got it! A human will take a look. 💛
            </p>
            {!chatting && (
              <button
                type="button"
                onClick={() => setChatting(true)}
                className="rpg-btn rpg-btn-gold px-5 py-3 text-[10px]"
              >
                💬 Try to fix it right now
              </button>
            )}
          </div>
        ) : (
          <>
            <label htmlFor="ban-note" className="block text-[10px] text-wood-mid/70 normal-case">
              Want to tell us what happened? (optional)
            </label>
            <textarea
              id="ban-note"
              rows={2}
              maxLength={500}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="I was just sharing my own game..."
              className="w-full border-4 border-wood-mid bg-parchment px-3 py-2 text-xs text-wood-dark placeholder:text-wood-mid/40 focus:outline-none focus:border-accent-purple normal-case"
            />
            <button
              type="button"
              onClick={sendAppeal}
              disabled={state === "sending"}
              className="rpg-btn rpg-btn-green w-full px-5 py-3 text-[10px] disabled:opacity-50"
            >
              {state === "sending" ? "Sending..." : "🛟 This seems wrong — fix it"}
            </button>
          </>
        )}
      </div>

      {chatting && <AppealChat contact={contact} appealId={appealId} />}
    </div>
  );
}
