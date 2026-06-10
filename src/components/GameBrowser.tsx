"use client";

import { useEffect, useRef, useState } from "react";
import type { Game } from "@/lib/types";
import GameGrid from "@/components/GameGrid";

type SortOption = "best" | "newest" | "popular" | "liked";

const PAGE_SIZE = 40;

export default function GameBrowser({
  initialGames,
  initialTotal,
}: {
  initialGames: Game[];
  initialTotal: number;
}) {
  const [sort, setSort] = useState<SortOption>("best");
  const [search, setSearch] = useState("");
  const [games, setGames] = useState<Game[]>(initialGames);
  const [total, setTotal] = useState(initialTotal);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function buildUrl(s: SortOption, q: string, p: number) {
    const params = new URLSearchParams({ limit: String(PAGE_SIZE), sort: s, page: String(p) });
    if (q.trim()) params.set("q", q.trim());
    return `/api/games?${params}`;
  }

  function reload(s: SortOption, q: string) {
    setLoading(true);
    setPage(1);
    fetch(buildUrl(s, q, 1))
      .then((res) => res.json())
      .then((data) => {
        setGames(data.games || []);
        setTotal(data.total || 0);
      })
      .catch(() => setGames([]))
      .finally(() => setLoading(false));
  }

  function handleSort(key: SortOption) {
    if (key === sort) return;
    setSort(key);
    reload(key, search);
  }

  function handleSearch(value: string) {
    setSearch(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => reload(sort, value), 300);
  }

  function loadMore() {
    const next = page + 1;
    setLoadingMore(true);
    fetch(buildUrl(sort, search, next))
      .then((res) => res.json())
      .then((data) => {
        setGames((prev) => [...prev, ...(data.games || [])]);
        setTotal(data.total || 0);
        setPage(next);
      })
      .catch(() => {})
      .finally(() => setLoadingMore(false));
  }

  // Clear the pending debounce on unmount.
  useEffect(() => () => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
  }, []);

  const tabs: { key: SortOption; label: string; icon: string }[] = [
    { key: "best", label: "Best", icon: "🏆" },
    { key: "newest", label: "New", icon: "✨" },
    { key: "popular", label: "Popular", icon: "🔥" },
    { key: "liked", label: "Starred", icon: "⭐" },
  ];

  return (
    <>
      {/* Sort tabs in RPG panel */}
      <div className="rpg-panel inline-flex flex-wrap justify-center max-w-full mx-auto mb-4 p-1">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => handleSort(tab.key)}
            className={`px-4 py-2 text-[10px] transition-colors ${
              sort === tab.key
                ? "bg-wood-mid text-accent-gold"
                : "text-wood-dark/50 hover:text-wood-dark"
            }`}
          >
            <span className="mr-1">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Title search */}
      <div className="w-full max-w-xs mx-auto mb-8">
        <input
          type="search"
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="🔍 Search games..."
          aria-label="Search games by title"
          className="w-full border-4 border-wood-mid bg-parchment px-3 py-2 text-[10px] text-wood-dark placeholder:text-wood-mid/40 focus:outline-none focus:border-accent-purple normal-case"
        />
      </div>

      {loading ? (
        <div className="text-center py-20">
          <span className="text-4xl pixel-blink">⏳</span>
          <p className="mt-4 text-xs text-parchment/50">Loading...</p>
        </div>
      ) : games.length === 0 ? (
        <div className="text-center py-20">
          <span className="text-4xl">🔭</span>
          <p className="mt-4 text-xs text-parchment/50 normal-case">
            No games found{search ? ` for “${search}”` : ""} — try another search!
          </p>
        </div>
      ) : (
        <>
          <GameGrid games={games} />
          {games.length < total && (
            <button
              onClick={loadMore}
              disabled={loadingMore}
              className="rpg-btn rpg-btn-purple mx-auto mt-8 px-6 py-3 text-[10px] disabled:opacity-50"
            >
              {loadingMore ? "Loading..." : `▼ More games (${total - games.length} left)`}
            </button>
          )}
        </>
      )}
    </>
  );
}
