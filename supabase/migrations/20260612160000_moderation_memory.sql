-- Moderation memory: the system learns from its mistakes.
-- Every statement is additive and idempotent — no destructive operations.
-- Safe to run against production as-is. All app code degrades gracefully
-- until this is applied (memory features quietly no-op, nothing breaks).

-- == moderation_memory: one table, three kinds ==============================
-- 'case'        — ground truth: what the AI decided vs. what the human did
--                 (admin reversals and appeal outcomes write these).
-- 'fingerprint' — a confirmed scam's distinguishing features (the hash lives
--                 in scam_fingerprints; this row is what makes it teachable).
-- 'lesson'      — the current distilled lessons document (~1500 tokens max),
--                 regenerated from cases by consolidation. Newest row wins;
--                 history stays for audit.
CREATE TABLE IF NOT EXISTS moderation_memory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  kind TEXT NOT NULL,               -- 'fingerprint' | 'lesson' | 'case'
  content JSONB NOT NULL DEFAULT '{}'::jsonb,
  source TEXT NOT NULL,             -- 'admin-reversal' | 'appeal-outcome' | 'consolidation'
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_memory_kind_created
  ON moderation_memory (kind, created_at DESC);

-- == Seed: start smart ======================================================
-- The system starts with real production history (June 2026): the known
-- false-positive ban reversals as the first 'case' rows, and the confirmed
-- scams as the first 'fingerprint' rows (plus a backfill of the empty
-- scam_fingerprints table). Those seeds describe detection patterns, so they
-- do NOT live in this public file — apply the companion private file
-- MARKETING_PRIVATE/seed-moderation-memory.sql right after this migration.
-- (It is idempotent: it only seeds while moderation_memory is empty.)
