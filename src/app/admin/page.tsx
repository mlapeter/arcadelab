import Link from "next/link";
import type { Metadata } from "next";
import { supabase } from "@/lib/supabase";
import AdminGameActions from "@/components/AdminGameActions";
import AdminDecisionActions from "@/components/AdminDecisionActions";

// The moderation feed must never be indexed or crawled.
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

interface DecisionRow {
  id: string;
  kind: string;
  game_id: string | null;
  creator_id: string | null;
  data: Record<string, unknown>;
  status: string;
  created_at: string;
}

interface MergeProposalData {
  other_creator_id?: string;
  from_name?: string;
  to_name?: string;
  evidence?: {
    from_recent_titles?: string[];
    to_recent_titles?: string[];
    shared_ip_hash?: boolean;
    window_days?: number;
  };
}

const KIND_LABEL: Record<string, string> = {
  remove: "Removed game",
  ban: "Banned creator",
  hide: "Hid game",
  fingerprint_hide: "Hid game (scam fingerprint)",
  report_dismiss: "Dismissed reports",
  merge: "Merged accounts",
  merge_proposal: "Merge proposal",
  ip_flag: "IP flag",
};

// Per-kind one-click reverse. Kinds not listed (e.g. an accepted
// merge_proposal — its 'merge' row carries the unmerge) get no button.
const REVERSE_BUTTON: Record<string, string> = {
  remove: "↩ Restore game + un-ban",
  ban: "↩ Un-ban creator",
  ip_flag: "↩ Un-ban creator",
  hide: "↩ Un-hide game",
  fingerprint_hide: "↩ Un-hide game",
  report_dismiss: "↩ Reopen reports",
  merge: "↩ Unmerge",
};

function when(iso: string) {
  return new Date(iso).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

/** One audit line: what the model saw and said, per decision kind. */
function decisionWhy(kind: string, data: Record<string, unknown>): string {
  const parts: string[] = [];
  if (kind === "merge" && data.from_name && data.to_name) {
    const moved = (data.moved_game_ids as string[] | undefined)?.length || 0;
    parts.push(`${data.from_name} → ${data.to_name} (${moved} game${moved === 1 ? "" : "s"})`);
  }
  if (kind === "merge_proposal" && data.from_name && data.to_name) {
    parts.push(`${data.from_name} → ${data.to_name}`);
  }
  if (kind === "ip_flag" && data.creator_name) {
    parts.push(`${data.creator_name} shares an IP with ${data.shares_ip_with || "a confirmed scammer"}`);
  }
  if (data.verdict) {
    const conf =
      typeof data.confidence === "number" ? ` ${Math.round(data.confidence * 100)}%` : "";
    parts.push(`AI: ${data.verdict}${conf}`);
  }
  const second = data.second_opinion as
    | { verdict?: string; confidence?: number }
    | undefined;
  if (second?.verdict) {
    const conf =
      typeof second.confidence === "number" ? ` ${Math.round(second.confidence * 100)}%` : "";
    parts.push(`2nd opinion: ${second.verdict}${conf}`);
  }
  if (data.overridden) parts.push(`override: ${data.overridden}`);
  if (data.reason) parts.push(`report: "${data.reason}"`);
  if (data.note) parts.push(String(data.note));
  return parts.join(" · ");
}

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

  // --- Authorized: load everything ---------------------------------------
  // The decisions/appeals tables may not exist yet (migration not applied) —
  // those queries return an error + null data, which renders as empty sections.

  // Pinned human-input items: merge proposals + IP flags awaiting the admin.
  const { data: pendingData } = await supabase
    .from("moderation_decisions")
    .select("id, kind, game_id, creator_id, data, status, created_at")
    .eq("status", "pending")
    .in("kind", ["merge_proposal", "ip_flag"])
    .order("created_at", { ascending: false });
  const pending = (pendingData || []) as DecisionRow[];
  const mergeProposals = pending.filter((d) => d.kind === "merge_proposal");
  const ipFlags = pending.filter((d) => d.kind === "ip_flag");

  const { data: appealsData } = await supabase
    .from("appeals")
    .select("id, contact, message, created_at")
    .eq("status", "open")
    .order("created_at", { ascending: false });
  const appeals = appealsData || [];

  // The review queue: low-confidence cases the AI chose not to decide —
  // pending, shadow-hidden, reported, or auto-removed (auditable).
  const { data: games } = await supabase
    .from("games")
    .select(
      "id, slug, title, creator_id, status, report_count, flag_reason, moderation, thumbnail_url, created_at"
    )
    .or("status.in.(pending,hidden),report_count.gt.0,and(status.eq.removed,flag_reason.like.ai*)")
    .order("report_count", { ascending: false })
    .order("created_at", { ascending: false });
  const queue = games || [];

  // The decisions feed: everything the AI already acted on, newest first.
  const { data: feedData } = await supabase
    .from("moderation_decisions")
    .select("id, kind, game_id, creator_id, data, status, created_at")
    .in("status", ["done", "reversed"])
    .order("created_at", { ascending: false })
    .limit(50);
  const feed = (feedData || []) as DecisionRow[];

  // Creator names + ban state for queue and feed rows.
  const creatorIds = [
    ...new Set(
      [...queue.map((g) => g.creator_id), ...feed.map((d) => d.creator_id)].filter(
        Boolean
      ) as string[]
    ),
  ];
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

  // Game titles for feed rows.
  const feedGameIds = [...new Set(feed.map((d) => d.game_id).filter(Boolean) as string[])];
  const gameMap: Record<string, { title: string; slug: string }> = {};
  if (feedGameIds.length) {
    const { data: feedGames } = await supabase
      .from("games")
      .select("id, title, slug")
      .in("id", feedGameIds);
    for (const g of feedGames || []) {
      gameMap[g.id] = { title: g.title, slug: g.slug };
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

  const needsYou = mergeProposals.length + ipFlags.length + appeals.length + queue.length;

  return (
    <main className="mx-auto max-w-4xl px-4 py-8">
      <div className="rpg-panel p-5 mb-6">
        <h1 className="text-[11px] text-wood-dark mb-1">Moderation</h1>
        <p className="text-[10px] text-wood-mid normal-case">
          {needsYou} thing{needsYou === 1 ? "" : "s"} need{needsYou === 1 ? "s" : ""} you.
          Everything else was decided automatically — spot-check the feed below
          and reverse mistakes with one click.
        </p>
      </div>

      {/* ===== Needs you: the only human-input items ===== */}
      <h2 className="text-[11px] text-wood-dark mb-3">Needs you</h2>

      {needsYou === 0 && (
        <div className="rpg-panel p-6 text-center mb-6">
          <p className="text-[11px] text-accent-green normal-case">
            Nothing needs you — the robots have it covered. 🎉
          </p>
        </div>
      )}

      <div className="space-y-4 mb-8">
        {mergeProposals.map((d) => {
          const data = d.data as MergeProposalData;
          const ev = data.evidence || {};
          return (
            <div key={d.id} className="rpg-panel p-4">
              <p className="text-[10px] text-wood-dark mb-1">
                🔀 Merge proposal: {data.from_name} → {data.to_name}
              </p>
              <p className="text-[10px] text-wood-mid/70 normal-case mb-2">
                Same device published to both accounts within {ev.window_days ?? 7} days
                {ev.shared_ip_hash ? " (shared IP)" : ""}. · {when(d.created_at)}
              </p>
              {!!ev.from_recent_titles?.length && (
                <p className="text-[10px] text-wood-mid normal-case">
                  {data.from_name}: {ev.from_recent_titles.join(", ")}
                </p>
              )}
              {!!ev.to_recent_titles?.length && (
                <p className="text-[10px] text-wood-mid normal-case">
                  {data.to_name}: {ev.to_recent_titles.join(", ")}
                </p>
              )}
              {d.creator_id && data.other_creator_id && (
                <div className="mt-3">
                  <AdminDecisionActions
                    adminKey={secret}
                    buttons={[
                      {
                        label: `✓ Merge ${data.from_name} into ${data.to_name}`,
                        action: "merge",
                        tone: "green",
                        confirm: `Move all of ${data.from_name}'s games to ${data.to_name}? One-click unmerge stays available in the feed.`,
                        payload: {
                          fromCreatorId: d.creator_id,
                          toCreatorId: data.other_creator_id,
                          decisionId: d.id,
                        },
                      },
                      {
                        label: "✗ Not the same kid",
                        action: "dismiss_decision",
                        payload: { decisionId: d.id },
                      },
                    ]}
                  />
                </div>
              )}
            </div>
          );
        })}

        {ipFlags.map((d) => (
          <div key={d.id} className="rpg-panel p-4">
            <p className="text-[10px] text-wood-dark mb-1">
              🕵️ IP flag: {String(d.data.creator_name || "Unknown")}
            </p>
            <p className="text-[10px] text-wood-mid/70 normal-case mb-2">
              Shares an IP with {String(d.data.shares_ip_with || "a confirmed scammer")}
              {typeof d.data.shared_hash_count === "number" &&
                ` (${d.data.shared_hash_count} shared hash${d.data.shared_hash_count === 1 ? "" : "es"})`}
              . · {when(d.created_at)}
            </p>
            {d.creator_id && (
              <AdminDecisionActions
                adminKey={secret}
                buttons={[
                  {
                    label: "✓ Looks fine",
                    action: "dismiss_decision",
                    tone: "green",
                    payload: { decisionId: d.id },
                  },
                  {
                    label: "⛔ Ban creator",
                    action: "ban",
                    tone: "red",
                    confirm:
                      "Ban this creator? All their games will be hidden and future ones blocked.",
                    payload: { creatorId: d.creator_id, decisionId: d.id },
                  },
                ]}
              />
            )}
          </div>
        ))}

        {appeals.map((a) => (
          <div key={a.id} className="rpg-panel p-4">
            <p className="text-[10px] text-wood-dark mb-1">
              📨 Appeal from {a.contact}
            </p>
            <p className="text-[10px] text-wood-mid/70 normal-case mb-2">
              {when(a.created_at)} — act via the queue below if a ban/removal was wrong.
            </p>
            <p className="text-[10px] text-wood-mid normal-case mb-3">
              &ldquo;{a.message}&rdquo;
            </p>
            <AdminDecisionActions
              adminKey={secret}
              buttons={[
                {
                  label: "✓ Resolve",
                  action: "resolve_appeal",
                  tone: "green",
                  payload: { appealId: a.id },
                },
              ]}
            />
          </div>
        ))}

        {/* Review queue: low-confidence cases the AI chose not to decide. */}
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
                <div className="w-28 shrink-0 aspect-video bg-wood-mid/10 overflow-hidden flex items-center justify-center">
                  {game.thumbnail_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={game.thumbnail_url}
                      alt={game.title}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="text-[10px] text-wood-mid/40 normal-case">
                      no thumb
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
                    {" · "}🚩 {game.report_count || 0} report
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

      {/* ===== AI decisions: audit + one-click reverse ===== */}
      <h2 className="text-[11px] text-wood-dark mb-1">AI decisions</h2>
      <p className="text-[10px] text-wood-mid normal-case mb-3">
        The AI already acted on these — your job is to spot-check and reverse
        mistakes, not to approve them.
      </p>

      {feed.length === 0 && (
        <div className="rpg-panel p-6 text-center">
          <p className="text-[11px] text-wood-mid normal-case">
            No automatic decisions yet — they&apos;ll show up here as games come in.
          </p>
        </div>
      )}

      <div className="space-y-2">
        {feed.map((d) => {
          const reversed = d.status === "reversed";
          const game = d.game_id ? gameMap[d.game_id] : null;
          const creator = d.creator_id ? creatorMap[d.creator_id] : null;
          const why = decisionWhy(d.kind, d.data);
          const reverseLabel = REVERSE_BUTTON[d.kind];
          return (
            <div
              key={d.id}
              className={`rpg-panel p-3 ${reversed ? "opacity-50" : ""}`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className={`min-w-0 ${reversed ? "line-through" : ""}`}>
                  <p className="text-[10px] text-wood-dark">
                    {KIND_LABEL[d.kind] || d.kind}
                    {game && (
                      <>
                        {" · "}
                        <Link
                          href={`/play/${game.slug}`}
                          className="text-accent-purple hover:text-accent-gold transition-colors"
                        >
                          {game.title}
                        </Link>
                      </>
                    )}
                    {creator && ` · ${creator.name}`}
                    <span className="text-wood-mid/50"> · {when(d.created_at)}</span>
                    {reversed && (
                      <span className="text-wood-mid/50 normal-case"> · reversed</span>
                    )}
                  </p>
                  {why && (
                    <p className="text-[10px] text-wood-mid/70 normal-case mt-1">
                      {why}
                    </p>
                  )}
                </div>
                {!reversed && reverseLabel && (
                  <AdminDecisionActions
                    adminKey={secret}
                    buttons={[
                      {
                        label: reverseLabel,
                        action: "reverse_decision",
                        tone: "gold",
                        payload: { decisionId: d.id },
                      },
                    ]}
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}
