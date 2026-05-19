"use client";

import { useState } from "react";

interface StarButtonProps {
  gameId: string;
  initialCount: number;
}

/**
 * Upvote control for a game. The star is a vote — the copy and styling make
 * that obvious to a first-time visitor: a raised, clearly-clickable button
 * before voting, a flat gold confirmation panel after.
 */
export default function StarButton({ gameId, initialCount }: StarButtonProps) {
  const [count, setCount] = useState(initialCount);
  const [starred, setStarred] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleStar() {
    if (starred || loading) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/games/${gameId}/like`, { method: "POST" });

      if (res.status === 201) {
        setCount((c) => c + 1);
        setStarred(true);
      } else if (res.status === 409) {
        setStarred(true);
      }
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="group relative inline-block">
      <button
        onClick={handleStar}
        disabled={starred || loading}
        aria-label={
          starred
            ? `You starred this game. ${count} ${count === 1 ? "star" : "stars"} total.`
            : `Star this game to upvote it. ${count} ${count === 1 ? "star" : "stars"} so far.`
        }
        className={
          starred
            ? "rpg-panel inline-flex min-h-[44px] cursor-default items-center gap-2 px-4 text-[10px] text-accent-gold"
            : "rpg-btn inline-flex min-h-[44px] items-center gap-2 px-4 text-[10px]"
        }
      >
        <span
          aria-hidden="true"
          className={`text-sm leading-none ${starred ? "pixel-pulse" : ""}`}
        >
          {starred ? "⭐" : loading ? "⏳" : "☆"}
        </span>
        <span>{starred ? "Starred!" : "Star this game"}</span>
        <span
          className={`rounded px-1.5 py-0.5 leading-none ${
            starred ? "bg-accent-gold/25" : "bg-wood-dark/20"
          }`}
        >
          {count}
        </span>
      </button>

      {/* Hover / focus hint — spells out that the star is an upvote */}
      {!starred && (
        <span
          role="tooltip"
          className="pointer-events-none absolute -top-1 left-1/2 z-10 -translate-x-1/2 -translate-y-full whitespace-nowrap rounded border-2 border-wood-dark bg-parchment px-2 py-1 text-[8px] text-wood-dark opacity-0 shadow-[2px_2px_0_rgba(0,0,0,0.4)] transition-opacity duration-150 group-hover:opacity-100 group-focus-within:opacity-100"
        >
          👍 Tap to upvote this game!
        </span>
      )}
    </div>
  );
}
