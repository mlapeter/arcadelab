import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { getLessons, consolidateMemory } from "@/lib/memory";
import { sendAdminEmail } from "@/lib/email";

// The weekly digest: one friendly email so the admin never has to remember to
// check /admin. Also the heartbeat of the memory system — it re-distills the
// lessons document from the week's cases before reporting on them.
// Triggered by Vercel cron (vercel.json) with the standard CRON_SECRET header.

export const maxDuration = 60; // consolidation makes one model call

const KIND_LABEL: Record<string, string> = {
  remove: "games removed",
  ban: "creators banned",
  hide: "games shadow-hidden",
  fingerprint_hide: "scam re-uploads auto-hidden (memory)",
  report_dismiss: "viewer reports auto-dismissed",
  merge_proposal: "merge proposals",
  merge: "accounts merged",
  ip_flag: "IP flags",
  appeal_resolve: "appeals resolved by the chat",
  appeal_escalation: "appeals escalated to you",
};

export async function GET(request: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    return NextResponse.json({ error: "CRON_SECRET not configured" }, { status: 503 });
  }
  if (request.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Consolidate first so the digest reports the fresh lessons document.
  const before = await getLessons();
  const after = await consolidateMemory();
  const lessonsChanged = !!after && after !== before;

  const since = new Date(Date.now() - 7 * 24 * 3600 * 1000).toISOString();
  const lines: string[] = ["Your ArcadeLab moderation week:", ""];

  try {
    const { data: decisions } = await supabase
      .from("moderation_decisions")
      .select("kind, status, data, created_at")
      .gte("created_at", since)
      .order("created_at", { ascending: false })
      .limit(500);

    const counts: Record<string, number> = {};
    let reversed = 0;
    for (const d of decisions || []) {
      counts[d.kind] = (counts[d.kind] || 0) + 1;
      if (d.status === "reversed") reversed++;
    }
    if (!decisions?.length) {
      lines.push("- A quiet week: no automatic moderation decisions.");
    } else {
      for (const [kind, n] of Object.entries(counts)) {
        lines.push(`- ${n} ${KIND_LABEL[kind] || kind}`);
      }
      if (reversed) {
        lines.push(`- ${reversed} decision${reversed === 1 ? "" : "s"} you reversed (the system learned from each one)`);
      }
    }

    const pending = (decisions || []).filter((d) => d.status === "pending");
    if (pending.length) {
      lines.push("", `⚠ ${pending.length} item${pending.length === 1 ? "" : "s"} still waiting on you:`);
      for (const d of pending.slice(0, 10)) {
        const reason = (d.data as { reason?: string })?.reason;
        lines.push(`  - ${KIND_LABEL[d.kind] || d.kind}${reason ? `: ${reason}` : ""}`);
      }
    }

    const { data: appeals } = await supabase
      .from("appeals")
      .select("status")
      .gte("created_at", since);
    if (appeals?.length) {
      const open = appeals.filter((a) => a.status === "open").length;
      lines.push("", `- ${appeals.length} appeal${appeals.length === 1 ? "" : "s"} filed (${open} still open)`);
    }
  } catch {
    lines.push("- (couldn't read the decisions feed this week)");
  }

  lines.push("");
  lines.push(
    lessonsChanged
      ? "The lessons document was re-distilled this week — current version:"
      : "Lessons document unchanged this week."
  );
  if (lessonsChanged && after) lines.push("", after);
  lines.push("", "Review anything: https://arcadelab.ai/admin");

  const body = lines.join("\n");
  const sent = await sendAdminEmail("ArcadeLab: your moderation week", body);
  return NextResponse.json({ success: true, sent, lessonsChanged, body });
}
