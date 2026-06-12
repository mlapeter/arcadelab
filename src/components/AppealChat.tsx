"use client";

import { useEffect, useRef, useState } from "react";

const MAX_MESSAGE = 500;

interface Msg {
  role: "user" | "assistant";
  content: string;
}

/**
 * The appeals chat: sort out a moderation mistake right now instead of
 * waiting for a human. The server keeps no session — each reply carries an
 * HMAC-signed transcript we hold here and send back with the next message.
 */
export default function AppealChat({
  contact,
  appealId,
}: {
  contact?: string;
  appealId?: string;
}) {
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "assistant",
      content:
        "Hi! I'm the ArcadeLab helper. 👋 Tell me what happened — and if you have it, share your game's link or your creator code so I can look it up.",
    },
  ]);
  const [input, setInput] = useState("");
  const [session, setSession] = useState<{ state: string; sig: string } | null>(null);
  const [sending, setSending] = useState(false);
  const [ended, setEnded] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [messages]);

  async function send(e: React.FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text || sending || ended) return;
    setMessages((m) => [...m, { role: "user", content: text }]);
    setInput("");
    setSending(true);
    try {
      const res = await fetch("/api/appeals/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          contact,
          appealId,
          state: session?.state,
          sig: session?.sig,
        }),
      });
      const data = await res.json().catch(() => null);
      if (data?.fallback) {
        setMessages((m) => [...m, { role: "assistant", content: data.message }]);
        setEnded(true);
      } else if (data?.reply) {
        setMessages((m) => [...m, { role: "assistant", content: data.reply }]);
        if (data.state && data.sig) setSession({ state: data.state, sig: data.sig });
        if (data.resolved) setEnded(true);
      } else {
        setMessages((m) => [
          ...m,
          {
            role: "assistant",
            content:
              data?.error ||
              "Hmm, I hiccuped — but your appeal is saved and a human will see it. 💛",
          },
        ]);
      }
    } catch {
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          content: "I lost my connection — but your appeal is saved and a human will see it. 💛",
        },
      ]);
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="rpg-panel p-4 space-y-3">
      <div className="space-y-2 max-h-80 overflow-y-auto" aria-live="polite">
        {messages.map((m, i) => (
          <div key={i} className={m.role === "user" ? "flex justify-end" : "flex"}>
            <p
              className={`max-w-[85%] px-3 py-2 text-[10px] normal-case leading-relaxed ${
                m.role === "user"
                  ? "bg-accent-purple/20 text-parchment border-2 border-accent-purple/40"
                  : "bg-parchment text-wood-dark border-2 border-wood-mid"
              }`}
            >
              {m.content}
            </p>
          </div>
        ))}
        {sending && (
          <p className="text-[10px] text-parchment/50 normal-case">helper is thinking…</p>
        )}
        <div ref={bottomRef} />
      </div>

      {ended ? (
        <p className="text-[10px] text-parchment/60 normal-case text-center">
          This chat is wrapped up — a human sees every conversation too. 💛
        </p>
      ) : (
        <form onSubmit={send} className="flex gap-2">
          <label htmlFor="chat-message" className="sr-only">
            Your message
          </label>
          <input
            id="chat-message"
            type="text"
            value={input}
            maxLength={MAX_MESSAGE}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type here…"
            className="min-w-0 flex-1 border-4 border-wood-mid bg-parchment px-3 py-2 text-xs text-wood-dark placeholder:text-wood-mid/40 focus:outline-none focus:border-accent-purple normal-case"
          />
          <button
            type="submit"
            disabled={sending || !input.trim()}
            className="rpg-btn rpg-btn-green px-4 py-2 text-[10px] disabled:opacity-50 shrink-0"
          >
            Send
          </button>
        </form>
      )}
    </div>
  );
}
