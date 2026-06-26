// Re-distill the moderation lessons document from recent cases.
// Thin client for the one real implementation (consolidateMemory in
// src/lib/memory.ts, exposed as the admin 'consolidate' action) so a cron or
// a terminal can trigger it: npm run consolidate-moderation
//
// Env: BASE_URL (default http://localhost:3005), ADMIN_SECRET (or in .env.local).
import { readFileSync } from "fs";

const env = { ...process.env };
try {
  for (const line of readFileSync(".env.local", "utf8").split("\n")) {
    const m = line.match(/^([A-Z_0-9]+)=(.*)$/);
    if (m && !env[m[1]]) env[m[1]] = m[2];
  }
} catch {
  // No .env.local (e.g. CI) — rely on real env vars.
}

const base = env.BASE_URL || "http://localhost:3005";
if (!env.ADMIN_SECRET) {
  console.error("ADMIN_SECRET is not set (env or .env.local)");
  process.exit(1);
}

const res = await fetch(`${base}/api/admin`, {
  method: "POST",
  headers: { "content-type": "application/json" },
  body: JSON.stringify({ key: env.ADMIN_SECRET, action: "consolidate" }),
});
const data = await res.json().catch(() => ({}));
if (!res.ok || !data.lessons) {
  console.error(`Consolidation failed: ${data.error || res.status}`);
  process.exit(1);
}
console.log("Lessons document regenerated:\n");
console.log(data.lessons);
