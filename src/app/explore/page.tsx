export const dynamic = "force-dynamic";

import { supabase } from "@/lib/supabase";
import GameCard from "@/components/GameCard";
import JsonLd from "@/components/JsonLd";
import { GAME_OVERRIDES } from "@/lib/seo/game-overrides";
import {
  collectionPageSchema,
  breadcrumbSchema,
  organizationSchema,
} from "@/lib/schema";

const SITE = "https://arcadelab.ai";

/**
 * Curated sections, ordered. Keyed by the `learningResourceType` set on each
 * game's entry in game-overrides.ts. Anything without a matching type falls
 * into the catch-all section at the end.
 */
const SECTIONS: { type: string; heading: string; blurb: string }[] = [
  {
    type: "Simulation",
    heading: "Science Simulations",
    blurb:
      "Hands-on physics and science you can poke, drag, and run yourself — gravity, gears, circuits, and more.",
  },
  {
    type: "Interactive Demo",
    heading: "Interactive Demos",
    blurb:
      "Bite-sized interactive explainers, each built to make one big idea click.",
  },
  {
    type: "Game",
    heading: "Games",
    blurb: "Playable browser games — quick to learn, satisfying to solve.",
  },
  {
    type: "Explorable",
    heading: "Explorables & Stories",
    blurb:
      "Branching stories and worlds that read differently with every choice you make.",
  },
  {
    type: "Generative Art",
    heading: "Generative Art",
    blurb: "Living, code-made art that never paints the same picture twice.",
  },
];

const CATCH_ALL = {
  heading: "More to Explore",
  blurb: "More handpicked interactive things worth a look.",
};

interface ExploreGame {
  slug: string;
  title: string;
  creatorName: string;
  playCount: number;
  likeCount: number;
  thumbnailUrl: string | null;
  previewUrl: string | null;
  resourceType: string | null;
}

async function getCuratedGames(): Promise<ExploreGame[]> {
  const slugs = Object.keys(GAME_OVERRIDES);
  if (slugs.length === 0) return [];

  const { data: games } = await supabase
    .from("games")
    .select(
      "slug, title, creator_id, play_count, like_count, thumbnail_url, preview_url"
    )
    .in("slug", slugs)
    .eq("status", "active");

  if (!games || games.length === 0) return [];

  // Resolve creator display names.
  const creatorIds = [...new Set(games.map((g) => g.creator_id).filter(Boolean))];
  let creatorsMap: Record<string, string> = {};
  if (creatorIds.length > 0) {
    const { data: creators } = await supabase
      .from("creators")
      .select("id, display_name")
      .in("id", creatorIds);
    if (creators) {
      creatorsMap = Object.fromEntries(
        creators.map((c) => [c.id, c.display_name])
      );
    }
  }

  return games.map((g) => ({
    slug: g.slug,
    title: g.title,
    creatorName: creatorsMap[g.creator_id] || "Unknown",
    playCount: g.play_count ?? 0,
    likeCount: g.like_count ?? 0,
    thumbnailUrl: g.thumbnail_url ?? null,
    previewUrl: g.preview_url ?? null,
    resourceType: GAME_OVERRIDES[g.slug]?.learningResourceType ?? null,
  }));
}

export const metadata = {
  title: "Explore ArcadeLab — curated science simulations, demos & games for kids",
  description:
    "A handpicked, category-grouped showcase of the best interactive content on ArcadeLab — science simulations, interactive demos, games, explorables, and generative art for parents, teachers, and homeschoolers.",
  alternates: { canonical: `${SITE}/explore` },
};

export default async function ExplorePage() {
  const games = await getCuratedGames();

  // Group games into their sections; preserve a stable, popularity-led order.
  const sorted = [...games].sort(
    (a, b) => b.likeCount - a.likeCount || b.playCount - a.playCount
  );
  const grouped = new Map<string, ExploreGame[]>();
  for (const game of sorted) {
    const section = SECTIONS.find((s) => s.type === game.resourceType);
    const key = section ? section.type : "__catch_all__";
    if (!grouped.has(key)) grouped.set(key, []);
    grouped.get(key)!.push(game);
  }

  const renderedSections = [
    ...SECTIONS.filter((s) => grouped.has(s.type)).map((s) => ({
      heading: s.heading,
      blurb: s.blurb,
      games: grouped.get(s.type)!,
    })),
    ...(grouped.has("__catch_all__")
      ? [{ ...CATCH_ALL, games: grouped.get("__catch_all__")! }]
      : []),
  ];

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <JsonLd
        data={[
          organizationSchema(),
          collectionPageSchema({
            name: "Explore ArcadeLab — curated interactive content",
            description:
              "A handpicked, category-grouped showcase of science simulations, interactive demos, games, explorables, and generative art on ArcadeLab.",
            url: `${SITE}/explore`,
            items: games.map((g) => ({
              title: g.title,
              slug: g.slug,
              creatorName: g.creatorName,
            })),
          }),
          breadcrumbSchema([
            { name: "ArcadeLab", url: `${SITE}/` },
            { name: "Explore", url: `${SITE}/explore` },
          ]),
        ]}
      />

      {/* Intro — frames the page for educators and homeschoolers */}
      <header className="mb-8 text-center">
        <h1 className="mb-4 text-sm text-accent-gold drop-shadow-[2px_2px_0_rgba(0,0,0,0.5)] sm:text-base">
          🧭 Explore the Best of ArcadeLab
        </h1>
        <p className="mx-auto max-w-2xl text-[10px] leading-relaxed text-parchment/80 normal-case">
          A handpicked tour of our favorite interactive content — sorted by
          subject so parents, teachers, and homeschoolers can find a good fit
          fast. Every item runs right in the browser with no install, no
          signup, and no ads. Tap any card to play, then peek at the source to
          see how it was made.
        </p>
      </header>

      {renderedSections.length === 0 ? (
        <p className="text-center text-[10px] text-parchment/60">
          Nothing to explore just yet — check back soon!
        </p>
      ) : (
        <div className="flex flex-col gap-12">
          {renderedSections.map((section) => (
            <section key={section.heading}>
              <h2 className="text-xs text-accent-gold drop-shadow-[2px_2px_0_rgba(0,0,0,0.5)] sm:text-sm">
                {section.heading}
              </h2>
              <p className="mt-2 mb-4 text-[10px] leading-relaxed text-parchment/70 normal-case">
                {section.blurb}
              </p>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                {section.games.map((game) => (
                  <GameCard
                    key={game.slug}
                    slug={game.slug}
                    title={game.title}
                    creatorName={game.creatorName}
                    playCount={game.playCount}
                    likeCount={game.likeCount}
                    thumbnailUrl={game.thumbnailUrl}
                    previewUrl={game.previewUrl}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </main>
  );
}
