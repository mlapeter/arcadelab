import type { Metadata } from "next";
import { cache } from "react";
import { supabase } from "@/lib/supabase";
import LibraryLanding from "@/components/LibraryLanding";
import { getLibraryMeta } from "@/lib/seo/libraries-meta";

const meta = getLibraryMeta("phaser")!;

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: `Phaser games on ArcadeLab — single-file HTML, no build tools`,
  description: meta.description,
  alternates: { canonical: "https://arcadelab.ai/phaser" },
  openGraph: {
    images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
    title: `${meta.longName} on ArcadeLab`,
    description: meta.description,
    url: "https://arcadelab.ai/phaser",
    type: "website",
  },
};

const getGames = cache(async function getGamesUsingLibrary() {
  const { data: games } = await supabase
    .from("games")
    .select("id, slug, title, creator_id, play_count, like_count, emoji, color")
    .eq("status", "active")
    .contains("libraries", ["phaser"])
    .order("play_count", { ascending: false })
    .limit(24);

  if (!games || games.length === 0) return [];

  const creatorIds = [...new Set(games.map((g) => g.creator_id).filter(Boolean))];
  let creatorsMap: Record<string, string> = {};
  if (creatorIds.length > 0) {
    const { data: creators } = await supabase
      .from("creators")
      .select("id, display_name")
      .in("id", creatorIds);
    if (creators) {
      creatorsMap = Object.fromEntries(creators.map((c) => [c.id, c.display_name]));
    }
  }

  return games.map((g) => ({
    id: g.id,
    slug: g.slug,
    title: g.title,
    creator_name: creatorsMap[g.creator_id] || "Unknown",
    play_count: g.play_count,
    like_count: g.like_count,
    emoji: g.emoji,
    color: g.color,
  }));
});

export default async function PhaserPage() {
  const games = await getGames();
  return <LibraryLanding meta={meta} games={games} />;
}
