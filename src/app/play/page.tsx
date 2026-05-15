export const dynamic = "force-dynamic";

import { supabase } from "@/lib/supabase";
import GameBrowser from "@/components/GameBrowser";
import JsonLd from "@/components/JsonLd";
import {
  collectionPageSchema,
  breadcrumbSchema,
  organizationSchema,
} from "@/lib/schema";

async function getGames() {
  const { data: games } = await supabase
    .from("games")
    .select("id, slug, title, creator_id, play_count, like_count, emoji, color, thumbnail_url, preview_url")
    .eq("status", "active")
    .order("created_at", { ascending: false })
    .limit(40);

  if (!games || games.length === 0) return [];

  // Fetch creator names
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

  return games.map((game) => ({
    id: game.id,
    slug: game.slug,
    title: game.title,
    creator_name: creatorsMap[game.creator_id] || "Unknown",
    play_count: game.play_count,
    like_count: game.like_count,
    emoji: game.emoji,
    color: game.color,
    thumbnail_url: game.thumbnail_url,
    preview_url: game.preview_url,
  }));
}

export const metadata = {
  title: "Play games and interactive things made on ArcadeLab",
  description:
    "Browse and play single-file HTML games, visualizations, and interactive content published by ArcadeLab creators.",
  alternates: { canonical: "https://arcadelab.ai/play" },
};

export default async function PlayPage() {
  const initialGames = await getGames();

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <JsonLd
        data={[
          organizationSchema(),
          collectionPageSchema({
            name: "All games and interactive content on ArcadeLab",
            description:
              "Browse single-file HTML games, visualizations, simulations, and interactive content.",
            url: "https://arcadelab.ai/play",
            items: initialGames.map((g) => ({
              title: g.title,
              slug: g.slug,
              creatorName: g.creator_name,
            })),
          }),
          breadcrumbSchema([
            { name: "ArcadeLab", url: "https://arcadelab.ai/" },
            { name: "Play", url: "https://arcadelab.ai/play" },
          ]),
        ]}
      />
      <h1 className="text-sm sm:text-base text-accent-gold text-center mb-6 drop-shadow-[2px_2px_0_rgba(0,0,0,0.5)]">
        👾 All Games
      </h1>
      <div className="flex flex-col items-center">
        <GameBrowser initialGames={initialGames} />
      </div>
    </main>
  );
}
