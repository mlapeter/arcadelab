"use client";

import { useState } from "react";

const MAX_CONTACT = 200;
const MAX_MESSAGE = 500;

export default function AppealForm() {
  const [contact, setContact] = useState("");
  const [message, setMessage] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "done">("idle");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (state !== "idle" || !contact.trim() || !message.trim()) return;
    setState("sending");
    setError("");
    try {
      const res = await fetch("/api/appeals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contact: contact.trim(), message: message.trim() }),
      });
      if (res.ok) {
        setState("done");
      } else {
        const data = await res.json().catch(() => null);
        setError(data?.error || "Something went wrong — try again in a minute!");
        setState("idle");
      }
    } catch {
      setError("Something went wrong — try again in a minute!");
      setState("idle");
    }
  }

  if (state === "done") {
    return (
      <div className="rpg-panel p-6 text-center space-y-3">
        <div className="text-4xl">💛</div>
        <p className="text-[10px] text-accent-green normal-case">
          Got it! A real human will read this soon.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="contact" className="block text-[10px] text-parchment/70 mb-2">
          Your game&apos;s link or your creator code
        </label>
        <input
          id="contact"
          name="contact"
          type="text"
          required
          maxLength={MAX_CONTACT}
          value={contact}
          onChange={(e) => setContact(e.target.value)}
          placeholder="arcadelab.ai/play/my-game or ROCKET-WOLF-COMET-73"
          className="w-full border-4 border-wood-mid bg-parchment px-4 py-3 text-xs text-wood-dark placeholder:text-wood-mid/40 focus:outline-none focus:border-accent-purple"
        />
      </div>

      <div>
        <label htmlFor="message" className="block text-[10px] text-parchment/70 mb-2">
          What happened?
        </label>
        <textarea
          id="message"
          name="message"
          required
          maxLength={MAX_MESSAGE}
          rows={5}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="My game disappeared and I don't know why..."
          className="w-full border-4 border-wood-mid bg-parchment px-4 py-3 text-xs text-wood-dark placeholder:text-wood-mid/40 focus:outline-none focus:border-accent-purple normal-case"
        />
        <p className="text-[10px] text-parchment/40 text-right mt-1">
          {message.length}/{MAX_MESSAGE}
        </p>
      </div>

      {error && (
        <div className="rpg-panel p-3">
          <p className="text-[10px] text-accent-red normal-case">{error}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={state === "sending"}
        className="rpg-btn rpg-btn-green w-full px-6 py-4 text-[10px] disabled:opacity-50"
      >
        {state === "sending" ? "Sending..." : "📨 Send it"}
      </button>
    </form>
  );
}
