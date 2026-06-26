import { supabase } from "@/lib/supabase";

// The decisions feed: every automatic moderation action gets a row here so the
// admin audits what the AI already did (one-click reverse) instead of being
// asked to decide. Logging is an audit layer, never a blocker — if the table
// doesn't exist yet (migration not applied) the action still happens, silently
// unlogged.

export type DecisionKind =
  | "remove" // game removed + creator banned (AI, double-checked)
  | "ban" // creator banned
  | "hide" // game shadow-hidden
  | "report_dismiss" // viewer report auto-dismissed as safe
  | "merge_proposal" // AI proposes moving games between same-kid accounts (pending)
  | "merge" // admin-approved merge (logs moved game ids for unmerge)
  | "ip_flag" // creator shares an IP with a confirmed scammer (review, never auto-ban)
  | "fingerprint_hide" // content matched a confirmed-scam fingerprint
  | "appeal_resolve" // appeals chat restored/unbanned on its own (reversible)
  | "appeal_escalation"; // appeals chat punted to the admin (pending)

export interface DecisionInput {
  gameId?: string | null;
  creatorId?: string | null;
  /** Evidence and the model's note — whatever the admin needs to audit it. */
  data?: Record<string, unknown>;
  /** "done" = already acted on (reversible); "pending" = needs the admin. */
  status?: "done" | "pending";
}

export async function logDecision(kind: DecisionKind, input: DecisionInput = {}) {
  try {
    await supabase.from("moderation_decisions").insert({
      kind,
      game_id: input.gameId ?? null,
      creator_id: input.creatorId ?? null,
      data: input.data ?? {},
      status: input.status ?? "done",
    });
  } catch {
    // Table missing or transient error — the underlying action already happened.
  }
}

/**
 * After a publish: if another recent account shares this submit IP hash and
 * both accounts have games, propose a merge for the admin to one-click — the
 * same kid on the same device, split across two accounts. A proposal only:
 * games never move without the admin.
 */
export async function maybeProposeMerge(creatorId: string, ipHash: string) {
  try {
    const since = new Date(Date.now() - 7 * 24 * 3600 * 1000).toISOString();
    const { data: shared } = await supabase
      .from("games")
      .select("creator_id")
      .eq("submit_ip_hash", ipHash)
      .neq("creator_id", creatorId)
      .gte("created_at", since)
      .limit(50);
    const otherIds = [...new Set((shared || []).map((g) => g.creator_id))];
    if (otherIds.length === 0) return;

    const { data: creators } = await supabase
      .from("creators")
      .select("id, display_name, trust")
      .in("id", [creatorId, ...otherIds]);
    const byId = new Map((creators || []).map((c) => [c.id, c]));
    const me = byId.get(creatorId);
    if (!me || me.trust === "banned") return;

    for (const otherId of otherIds) {
      const other = byId.get(otherId);
      if (!other || other.trust === "banned") continue;

      // One pending proposal per pair is plenty.
      const { data: existing } = await supabase
        .from("moderation_decisions")
        .select("id, creator_id, data")
        .eq("kind", "merge_proposal")
        .eq("status", "pending")
        .in("creator_id", [creatorId, otherId]);
      if (
        (existing || []).some(
          (d) =>
            d.creator_id === creatorId ||
            (d.data as { other_creator_id?: string })?.other_creator_id === creatorId
        )
      ) {
        continue;
      }

      const titlesFor = async (id: string) => {
        const { data } = await supabase
          .from("games")
          .select("title")
          .eq("creator_id", id)
          .neq("status", "removed")
          .order("created_at", { ascending: false })
          .limit(5);
        return (data || []).map((g) => g.title);
      };

      await logDecision("merge_proposal", {
        creatorId,
        status: "pending",
        data: {
          other_creator_id: otherId,
          from_name: me.display_name,
          to_name: other.display_name,
          evidence: {
            shared_ip_hash: true,
            window_days: 7,
            from_recent_titles: await titlesFor(creatorId),
            to_recent_titles: await titlesFor(otherId),
          },
        },
      });
    }
  } catch {
    // Best-effort signal — never let it touch the publish path.
  }
}
