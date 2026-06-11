-- Seamless identity + AI-first moderation.
-- Every statement is additive and idempotent — no destructive operations.
-- Safe to run against production as-is. All app code degrades gracefully
-- until this is applied (features quietly no-op, nothing breaks).

-- == appeals: a contact path a kid can find ================================
-- /appeal creates a row; it surfaces in the /admin decisions feed.
CREATE TABLE IF NOT EXISTS appeals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contact TEXT NOT NULL,            -- game URL or creator code, whatever the kid has
  message TEXT NOT NULL,            -- "what happened?" (max 500 chars, enforced in app)
  status TEXT DEFAULT 'open',       -- 'open' | 'resolved'
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_appeals_status ON appeals (status);

-- == moderation_decisions: the AI decisions feed ===========================
-- Every automatic action (removal, ban, hide, report dismissal, merge
-- proposal, fingerprint hide, IP flag) is logged here so /admin is a feed of
-- decisions to audit/reverse, not a queue of decisions to make.
-- kind: 'remove' | 'ban' | 'hide' | 'report_dismiss' | 'merge_proposal'
--       | 'merge' | 'ip_flag' | 'fingerprint_hide'
-- status: 'done' (acted, reversible) | 'pending' (needs admin) | 'reversed'
CREATE TABLE IF NOT EXISTS moderation_decisions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  kind TEXT NOT NULL,
  game_id UUID REFERENCES games(id) ON DELETE CASCADE,
  creator_id UUID REFERENCES creators(id) ON DELETE CASCADE,
  data JSONB DEFAULT '{}'::jsonb,   -- evidence, model notes, verdicts, moved game ids
  status TEXT DEFAULT 'done',
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_decisions_created ON moderation_decisions (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_decisions_status ON moderation_decisions (status);

-- == scam_fingerprints: confirmed scams never come back =====================
-- When the admin confirms a scam (remove/ban), a normalized content
-- fingerprint is stored; matching new submissions are auto-hidden pre-AI.
CREATE TABLE IF NOT EXISTS scam_fingerprints (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  fingerprint TEXT NOT NULL UNIQUE, -- sha256 of normalized html (digits/whitespace stripped)
  source_game_id UUID REFERENCES games(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- == creators: registration IP hash =========================================
-- Same keyed hash as games.submit_ip_hash. Lets /publish ask "Are you {name}?"
-- when the same device creates a second account within days — never auto-links.
ALTER TABLE creators ADD COLUMN IF NOT EXISTS register_ip_hash TEXT;
CREATE INDEX IF NOT EXISTS idx_creators_register_ip ON creators (register_ip_hash);
