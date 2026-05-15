-- Thumbnail (static still) and preview (animated loop) media for game cards.
-- Both nullable: games without captured media fall back to the emoji/gradient card.
-- thumbnail_url already existed in production; IF NOT EXISTS keeps this idempotent.
ALTER TABLE games ADD COLUMN IF NOT EXISTS thumbnail_url TEXT;
ALTER TABLE games ADD COLUMN IF NOT EXISTS preview_url TEXT;
