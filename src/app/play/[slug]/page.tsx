import { cache } from "react";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { LIBRARY_MAP } from "@/lib/libraries";
import GamePlayer from "@/components/GamePlayer";
import CreatorBadge from "@/components/CreatorBadge";
import StarButton from "@/components/StarButton";
import RemixButton from "@/components/RemixButton";
import GameOwnerActions from "@/components/GameOwnerActions";
import JsonLd from "@/components/JsonLd";
import { gameSchema, breadcrumbSchema, learningResourceSchema, faqPageSchema } from "@/lib/schema";
import { getGameOverride } from "@/lib/seo/game-overrides";
import { getArticle } from "@/lib/articles";
import { getPrompt } from "@/lib/seo/prompts";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

const getGame = cache(async function getGame(slug: string) {
  const { data: game } = await supabase
    .from("games")
    .select("id, slug, title, description, creator_id, play_count, like_count, forked_from, libraries, status, created_at")
    .eq("slug", slug)
    .eq("status", "active")
    .single();

  if (!game) return null;

  const { data: creator } = await supabase
    .from("creators")
    .select("display_name")
    .eq("id", game.creator_id)
    .single();

  return {
    ...game,
    creator_name: creator?.display_name || "Unknown",
  };
});

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const game = await getGame(slug);

  if (!game) return { title: "Game Not Found" };

  const url = `https://arcadelab.ai/play/${game.slug}`;
  const ogImage = `https://arcadelab.ai/play/${game.slug}/opengraph-image`;
  const override = getGameOverride(game.slug);
  // Prefer the curated long description for showcase games, fall back to the
  // creator's own description, then to a generic fallback. Truncate to ~200 chars for meta.
  const longDesc = override?.longDescription || game.description;
  const description = longDesc
    ? longDesc.length > 200 ? longDesc.substring(0, 197) + "..." : longDesc
    : `Play ${game.title} by ${game.creator_name} on ArcadeLab — a single-file HTML game.`;

  return {
    title: `${game.title} by ${game.creator_name}`,
    description,
    keywords: override?.educationalTopics,
    alternates: { canonical: url },
    openGraph: {
      title: `${game.title} by ${game.creator_name}`,
      description,
      url,
      siteName: "ArcadeLab",
      images: [{ url: ogImage, width: 1200, height: 630 }],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${game.title} by ${game.creator_name}`,
      description,
      images: [ogImage],
    },
  };
}

export default async function PlayPage({ params }: Props) {
  const { slug } = await params;
  const game = await getGame(slug);

  if (!game) notFound();

  // Check ownership
  let serverIsOwner = false;
  try {
    const cookieStore = await cookies();
    const raw = cookieStore.get("arcadelab_identity")?.value
      || cookieStore.get("kidhubb_identity")?.value;
    if (raw) {
      const parsed = JSON.parse(decodeURIComponent(raw));
      serverIsOwner = parsed.creator_id === game.creator_id;
    }
  } catch {
    // cookie missing or malformed
  }

  // Fetch remix provenance and remix count in parallel
  const [remixSource, { count: remixCount }] = await Promise.all([
    // Remix provenance (if this game is a remix)
    (async () => {
      if (!game.forked_from) return null;
      const { data: original } = await supabase
        .from("games")
        .select("slug, title, creator_id")
        .eq("id", game.forked_from)
        .single();
      if (!original) return null;
      const { data: origCreator } = await supabase
        .from("creators")
        .select("display_name")
        .eq("id", original.creator_id)
        .single();
      return {
        slug: original.slug,
        title: original.title,
        creator_name: origCreator?.display_name || "Unknown",
      };
    })(),
    // Remix count (how many games are remixes of this one)
    supabase
      .from("games")
      .select("id", { count: "exact", head: true })
      .eq("forked_from", game.id)
      .eq("status", "active"),
  ]);

  const gameUrl = `https://arcadelab.ai/play/${game.slug}`;
  const creatorUrl = `https://arcadelab.ai/creators/${encodeURIComponent(game.creator_name)}`;
  const ogImage = `https://arcadelab.ai/play/${game.slug}/opengraph-image`;
  const override = getGameOverride(game.slug);
  const primaryLibrary =
    override?.primaryLibrary || (game.libraries && game.libraries[0]);

  // Build schemas — always include Game + Breadcrumb. For showcase games with
  // overrides, also include LearningResource (so AI engines see this as an
  // interactive demo of a specific topic) and FAQPage (so the topical Q&A
  // surfaces in search and citation contexts).
  const schemas: object[] = [
    gameSchema({
      title: game.title,
      description:
        override?.longDescription ||
        game.description ||
        `${game.title} by ${game.creator_name} — a single-file HTML game on ArcadeLab.`,
      url: gameUrl,
      creatorName: game.creator_name,
      creatorUrl,
      datePublished: game.created_at,
      playCount: game.play_count,
      likeCount: game.like_count,
      imageUrl: ogImage,
    }),
    breadcrumbSchema([
      { name: "ArcadeLab", url: "https://arcadelab.ai/" },
      { name: "Play", url: "https://arcadelab.ai/play" },
      { name: game.title, url: gameUrl },
    ]),
  ];
  if (override?.learningResourceType && override.educationalTopics) {
    schemas.push(
      learningResourceSchema({
        name: game.title,
        description: override.longDescription || game.description || game.title,
        url: gameUrl,
        learningResourceType: override.learningResourceType,
        teaches: override.educationalTopics,
        educationalLevel: override.educationalLevel,
        creatorName: game.creator_name,
        creatorUrl,
        imageUrl: ogImage,
        datePublished: game.created_at,
      })
    );
  }
  if (override?.faqs && override.faqs.length > 0) {
    schemas.push(faqPageSchema(override.faqs));
  }

  // Resolve related article + prompt cross-links for the "Explore more" section.
  const relatedArticles = (override?.relatedArticleSlugs || [])
    .map((slug) => getArticle(slug))
    .filter((a): a is NonNullable<typeof a> => Boolean(a));
  const relatedPrompts = (override?.relatedPromptSlugs || [])
    .map((slug) => getPrompt(slug))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  return (
    <main className="mx-auto max-w-5xl px-4 py-4">
      <JsonLd data={schemas} />
      {/* Remix provenance */}
      {game.forked_from && (
        <div className="mb-2 text-[10px] text-parchment/50">
          {remixSource ? (
            <span>
              🔀 Remixed from{" "}
              <Link href={`/play/${remixSource.slug}`} className="text-accent-purple hover:text-accent-gold transition-colors">
                {remixSource.title}
              </Link>{" "}
              by {remixSource.creator_name}
            </span>
          ) : (
            <span>🔀 Remixed from a game that&apos;s no longer available</span>
          )}
        </div>
      )}

      {/* Game header — title + creator on one line */}
      <div className="mb-2 flex items-baseline gap-3 flex-wrap">
        <h1 className="text-sm sm:text-base text-accent-gold drop-shadow-[2px_2px_0_rgba(0,0,0,0.5)]">
          {game.title}
        </h1>
        <CreatorBadge name={game.creator_name} />
      </div>

      {/* Game iframe — front and center, the reason users came here */}
      <GamePlayer slug={game.slug} title={game.title} />

      {/* Stats bar */}
      <div className="mt-2 flex items-center gap-3 flex-wrap">
        <StarButton gameId={game.id} initialCount={game.like_count} />
        <div className="rpg-panel inline-flex items-center gap-2 px-4 py-2 text-[10px] text-accent-green">
          <span>▶ {game.play_count} {game.play_count === 1 ? "play" : "plays"}</span>
        </div>
        <Link
          href={`/play/${game.slug}/source`}
          className="rpg-panel inline-flex px-4 py-2 text-[10px] text-wood-mid/70 hover:text-accent-purple transition-colors"
        >
          &lt;/&gt; Source
        </Link>
        <RemixButton gameId={game.id} gameTitle={game.title} gameSlug={game.slug} />
        <GameOwnerActions slug={game.slug} gameId={game.id} creatorId={game.creator_id} serverIsOwner={serverIsOwner} />
      </div>

      {/* Library badges */}
      {game.libraries?.length > 0 && (
        <div className="mt-2 flex items-center gap-2 flex-wrap">
          {game.libraries.map((lib: string) => (
            <span key={lib} className="rpg-panel inline-flex px-3 py-1 text-[10px] text-wood-mid/70">
              🛠️ {LIBRARY_MAP[lib]?.label || lib}
            </span>
          ))}
        </div>
      )}

      {/* Remix count */}
      {(remixCount ?? 0) > 0 && (
        <div className="mt-2 text-[10px] text-parchment/50">
          🔀 {remixCount} {remixCount === 1 ? "remix" : "remixes"}
        </div>
      )}

      {/* Curated long description — shown below the game for showcase pages.
          Below the iframe so the game is the first thing users see, but still
          on-page for AI crawlers and SEO snippet extraction. */}
      {override?.longDescription && (
        <section className="mt-6 rpg-panel p-5">
          <p className="text-[11px] text-wood-mid leading-relaxed normal-case">
            {override.longDescription}
          </p>
        </section>
      )}

      {/* Curated FAQ (only present for showcase games) */}
      {override?.faqs && override.faqs.length > 0 && (
        <section className="mt-8 rpg-panel p-5">
          <h2 className="text-[11px] text-wood-dark mb-3">Frequently asked</h2>
          <div className="space-y-3">
            {override.faqs.map((faq, i) => (
              <div key={i}>
                <h3 className="text-[10px] text-wood-dark mb-1 normal-case font-semibold">
                  {faq.question}
                </h3>
                <p className="text-[10px] text-wood-mid leading-relaxed normal-case">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Explore more — related articles, prompts, library page */}
      {(relatedArticles.length > 0 || relatedPrompts.length > 0 || primaryLibrary) && (
        <section className="mt-6 rpg-panel p-5">
          <h2 className="text-[11px] text-wood-dark mb-3">Explore more</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {relatedArticles.length > 0 && (
              <div>
                <h3 className="text-[10px] text-wood-dark mb-2 normal-case font-semibold">Guides</h3>
                <ul className="space-y-1">
                  {relatedArticles.map((a) => (
                    <li key={a.slug} className="text-[10px] normal-case leading-relaxed">
                      <Link href={`/learn/${a.slug}`} className="text-accent-purple hover:text-accent-gold transition-colors">
                        <span className="mr-1">{a.emoji}</span>{a.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {relatedPrompts.length > 0 && (
              <div>
                <h3 className="text-[10px] text-wood-dark mb-2 normal-case font-semibold">Prompts</h3>
                <ul className="space-y-1">
                  {relatedPrompts.map((p) => (
                    <li key={p.slug} className="text-[10px] normal-case leading-relaxed">
                      <Link href={`/prompts/${p.slug}`} className="text-accent-purple hover:text-accent-gold transition-colors">
                        <span className="mr-1">{p.emoji}</span>{p.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {primaryLibrary && LIBRARY_MAP[primaryLibrary] && (
              <div>
                <h3 className="text-[10px] text-wood-dark mb-2 normal-case font-semibold">Built with</h3>
                <Link
                  href={`/${primaryLibrary}`}
                  className="text-[10px] text-accent-purple hover:text-accent-gold transition-colors normal-case"
                >
                  More {LIBRARY_MAP[primaryLibrary].label} on ArcadeLab →
                </Link>
              </div>
            )}
          </div>
        </section>
      )}
    </main>
  );
}
