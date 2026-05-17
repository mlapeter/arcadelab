-- Anti-scam moderation + discovery-quality columns.
-- Every statement is additive and idempotent — no destructive operations.
-- Safe to run against production as-is.

-- == games: moderation state + ranking =====================================
-- status lifecycle:
--   'active'  — cleared, fully discoverable (unchanged default)
--   'pending' — published, playable by link, awaiting an automated check
--   'hidden'  — shadow-hidden: playable by link, removed from all discovery
--   'removed' — fully gone (render + play page 404)
-- 'active' stays the default, so existing publish behavior is unchanged.
ALTER TABLE games ADD COLUMN IF NOT EXISTS flag_reason TEXT;
ALTER TABLE games ADD COLUMN IF NOT EXISTS report_count INTEGER DEFAULT 0;
ALTER TABLE games ADD COLUMN IF NOT EXISTS quality_score REAL DEFAULT 0;
-- AI moderation verdict, e.g. { verdict, quality, confidence, checked_at, model }
ALTER TABLE games ADD COLUMN IF NOT EXISTS moderation JSONB;
-- Salted hash of the submitter IP — a clustering signal only, never a raw IP.
ALTER TABLE games ADD COLUMN IF NOT EXISTS submit_ip_hash TEXT;

-- == creators: trust tier ===================================================
-- 'new' (default) | 'trusted' (skips pending checks) | 'banned' (all hidden).
ALTER TABLE creators ADD COLUMN IF NOT EXISTS trust TEXT DEFAULT 'new';

-- == reports: turn the dormant table into a real workflow ===================
-- reporter_hash identifies the reporting session so one viewer can't pile on.
-- status: 'open' (default) | 'resolved'.
ALTER TABLE reports ADD COLUMN IF NOT EXISTS reporter_hash TEXT;
ALTER TABLE reports ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'open';

-- One report per game per reporting session. Partial index so legacy rows
-- with a NULL reporter_hash don't collide.
CREATE UNIQUE INDEX IF NOT EXISTS idx_reports_game_reporter
  ON reports (game_id, reporter_hash)
  WHERE reporter_hash IS NOT NULL;

-- == supporting indexes =====================================================
CREATE INDEX IF NOT EXISTS idx_games_status ON games (status);
CREATE INDEX IF NOT EXISTS idx_games_quality ON games (quality_score DESC);
CREATE INDEX IF NOT EXISTS idx_reports_status ON reports (status);
