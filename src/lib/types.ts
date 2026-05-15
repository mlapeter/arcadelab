export interface Game {
  id: string;
  slug: string;
  title: string;
  creator_name: string;
  play_count: number;
  like_count: number;
  emoji?: string | null;
  color?: string | null;
  /** Captured still + preview video for the card; absent → emoji/gradient fallback. */
  thumbnail_url?: string | null;
  preview_url?: string | null;
}
