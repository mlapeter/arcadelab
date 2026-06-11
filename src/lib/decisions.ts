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
  | "fingerprint_hide"; // content matched a confirmed-scam fingerprint

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
