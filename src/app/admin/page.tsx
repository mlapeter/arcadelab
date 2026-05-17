import Link from "next/link";
import type { Metadata } from "next";
import { supabase } from "@/lib/supabase";
import AdminGameActions from "@/components/AdminGameActions";

// The review queue must never be indexed or crawled.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

interface Props {
  searchParams: Promise<{ key?: string }>;
}

const STATUS_STYLE: Record<string, string> = {
  pending: "text-accent-gold",
  hidden: "text-accent-red",
  active: "text-accent-green",
  removed: "text-wood-mid/50",
};

export default async function AdminPage({ searchParams }: Props) {
  const { key } = await searchParams;
  const secret = process.env.ADMIN_SECRET;

  if (!secret) {
    return (
      <main className="mx-auto max-w-2xl px-4 py-12">
        <div className="rpg-panel p-6">
          <p className="text-[11px] text-accent-red normal-case">
            ADMIN_SECRET is not configured. Set it in the environment to use the
            review queue.
          </p>
        </div>
      </main>
    );
  }

  // Wrong/missing key — show a bare key prompt, reveal nothing else.
  if (key !== secret) {
    return (
      <main className="mx-auto max-w-2xl px-4 py-12">
        <div className="rpg-panel p-6">
          <h1 className="text-[11px] text-wood-dark mb-3">Moderation queue</h1>
          <form method="get" className="flex flex-col gap-3">
            <label className="text-[10px] text-wood-mid normal-case" htmlFor="key">
              Admin key
            </label>
            <input
              id="key"
              name="key"
              type="password"
              className="pixel-border-green bg-sky-top p-2 text-[10px]"
            />
            <button
              type="submit"
              className="rpg-btn rpg-btn-green px-4 py-2 text-[10px] self-start"
            >
              Unlock
            </button>
          </form>
        </div>
      </main>
    );
  }

  // --- Authorized: build the queue --------------------------------------
  // Games that are pending, hidden, reported, or auto-removed by the AI as a
  // scam (the last so an owner can audit / reverse an auto-removal).
  const { data: games } = await supabase
    .from("games")
    .select(
      "id, slug, title, creator_id, status, report_count, flag_reason, moderation, thumbnail_url, created_at"
    )
    .or("status.in.(pending,hidden),report_count.gt.0,and(status.eq.removed,flag_reason.like.ai*)")
    .order("report_count", { ascending: false })
    .order("created_at", { ascending: false });

  const queue = games || [];

  // Creator names + ban state.
  const creatorIds = [...new Set(queue.map((g) => g.creator_id).filter(Boolean))];
  const creatorMap: Record<string, { name: string; trust: string }> = {};
  if (creatorIds.length) {
    const { data: creators } = await supabase
      .from("creators")
      .select("id, display_name, trust")
      .in("id", creatorIds);
    for (const c of creators || []) {
      creatorMap[c.id] = { name: c.display_name, trust: c.trust || "new" };
    }
  }

  // Open report reasons, grouped by game.
  const reasonsByGame: Record<string, string[]> = {};
  if (queue.length) {
    const { data: reports } = await supabase
      .from("reports")
      .select("game_id, reason")
      .in(
        "game_id",
        queue.map((g) => g.id)
      )
      .eq("status", "open");
    for (const r of reports || []) {
      if (!reasonsByGame[r.game_id]) reasonsByGame[r.game_id] = [];
      if (r.reason) reasonsByGame[r.game_id].push(r.reason);
    }
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-8">
      <div className="rpg-panel p-5 mb-6">
        <h1 className="text-[11px] text-wood-dark mb-1">Moderation queue</h1>
        <p className="text-[10px] text-wood-mid normal-case">
          {queue.length} game{queue.length === 1 ? "" : "s"} need a look —
          pending checks, shadow-hidden, reported by viewers, or auto-removed
          as scams. Approving a banned creator&apos;s game also un-bans them.
        </p>
      </div>

      {queue.length === 0 && (
        <div className="rpg-panel p-6 text-center">
          <p className="text-[11px] text-accent-green normal-case">
            Queue is empty — nothing to review. 🎉
          </p>
        </div>
      )}

      <div className="space-y-4">
        {queue.map((game) => {
          const creator = creatorMap[game.creator_id];
          const reasons = reasonsByGame[game.id] || [];
          const mod = game.moderation as
            | { verdict?: string; quality?: string; confidence?: number }
            | null;
          return (
            <div key={game.id} className="rpg-panel p-4">
              <div className="flex gap-4">
                {/* Thumbnail for instant visual triage */}
                <div className="w-40 shrink-0 aspect-video bg-wood-mid/10 overflow-hidden flex items-center justify-center">
                  {game.thumbnail_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={game.thumbnail_url}
                      alt={game.title}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="text-[10px] text-wood-mid/40 normal-case">
                      no thumbnail
                    </span>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <Link
                      href={`/play/${game.slug}`}
                      className="text-[10px] text-accent-purple hover:text-accent-gold transition-colors truncate"
                    >
                      {game.title}
                    </Link>
                    <span
                      className={`text-[10px] ${
                        STATUS_STYLE[game.status] || "text-wood-mid"
                      }`}
                    >
                      [{game.status}]
                    </span>
                  </div>

                  <p className="text-[10px] text-wood-mid/70 normal-case">
                    by {creator?.name || "Unknown"}
                    {creator?.trust === "banned" && (
                      <span className="text-accent-red"> · BANNED</span>
                    )}
                    {creator?.trust === "trusted" && (
                      <span className="text-accent-green"> · trusted</span>
                    )}
                  </p>

                  <p className="text-[10px] text-wood-mid/70 normal-case mt-1">
                    🚩 {game.report_count || 0} report
                    {(game.report_count || 0) === 1 ? "" : "s"}
                    {game.flag_reason && ` · flagged: ${game.flag_reason}`}
                  </p>

                  {mod?.verdict && (
                    <p className="text-[10px] text-wood-mid/70 normal-case mt-1">
                      🤖 AI: {mod.verdict}
                      {mod.quality && ` · quality: ${mod.quality}`}
                      {typeof mod.confidence === "number" &&
                        ` · ${Math.round(mod.confidence * 100)}%`}
                    </p>
                  )}

                  {reasons.length > 0 && (
                    <ul className="text-[10px] text-wood-mid normal-case mt-1 list-disc list-inside">
                      {reasons.slice(0, 5).map((r, i) => (
                        <li key={i}>{r}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

              <div className="mt-3">
                <AdminGameActions
                  gameId={game.id}
                  creatorId={game.creator_id}
                  adminKey={secret}
                />
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}
