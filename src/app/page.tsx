import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import GameCard from "@/components/GameCard";
import { supabase } from "@/lib/supabase";
import { getFeaturedGameSlugs } from "@/lib/seo/game-overrides";
import {
  organizationSchema,
  websiteSchema,
  faqPageSchema,
} from "@/lib/schema";

/**
 * Featured showcase games for the homepage. Slugs come from the curated
 * overrides in game-overrides.ts (getFeaturedGameSlugs). We fetch the live
 * rows so the cards show real titles, creators, and play counts — and
 * preserve the override order so the section is stable, not random.
 */
async function getFeaturedGames() {
  const slugs = getFeaturedGameSlugs();
  if (slugs.length === 0) return [];

  const { data: games } = await supabase
    .from("games")
    .select("id, slug, title, creator_id, play_count, like_count, emoji, color")
    .in("slug", slugs)
    .eq("status", "active");

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

  const order = new Map(slugs.map((s, i) => [s, i]));
  return games
    .map((g) => ({
      id: g.id,
      slug: g.slug,
      title: g.title,
      creator_name: creatorsMap[g.creator_id] || "Unknown",
      play_count: g.play_count,
      like_count: g.like_count,
      emoji: g.emoji,
      color: g.color,
    }))
    .sort((a, b) => (order.get(a.slug) ?? 0) - (order.get(b.slug) ?? 0));
}

const HOMEPAGE_FAQS = [
  {
    question: "What is ArcadeLab?",
    answer:
      "ArcadeLab is a free platform for publishing single-file HTML games, visualizations, simulations, and other interactive content. Paste a complete HTML file, get a shareable URL. No signup, no build tools.",
  },
  {
    question: "How do I publish a game or interactive thing on ArcadeLab?",
    answer:
      "Go to arcadelab.ai/publish and paste a complete, self-contained HTML file. The platform auto-detects the title and supported libraries. You get a public URL immediately.",
  },
  {
    question: "Do I need an account to publish?",
    answer:
      "No email or password required. The first time you publish, ArcadeLab generates a Creator Code like ROCKET-WOLF-COMET-73 that links to your creator name. It's a casual identifier, not a credential.",
  },
  {
    question: "Is ArcadeLab free?",
    answer:
      "Yes. Publishing, hosting, and playing are all free. There are no paid tiers, ads, or accounts.",
  },
  {
    question: "Can I publish an interactive visualization or simulation, not just a game?",
    answer:
      "Yes. ArcadeLab hosts any single-file HTML interactive content: games, physics simulations, data visualizations, interactive explainers, generative art, anything that fits in one HTML file. See arcadelab.ai/play/light-wave-or-particle-ultraviper34 for an example double-slit physics demo.",
  },
  {
    question: "What libraries can my game or visualization use?",
    answer:
      "ArcadeLab auto-injects CDN script tags for: Phaser, p5.js, Three.js, GSAP, Tone.js, Pixi.js, Matter.js, D3.js, and React. List them in the ARCADELAB header — do not include your own CDN script tags for these.",
  },
  {
    question: "What's the file size limit?",
    answer:
      "500KB per single HTML file, including all inline JavaScript and CSS.",
  },
  {
    question: "Can ArcadeLab games make network requests?",
    answer:
      "No. Games run in a sandboxed iframe with connect-src 'none' — fetch(), XMLHttpRequest, and WebSocket are all blocked. All game logic and assets must be self-contained.",
  },
  {
    question: "Is ArcadeLab open source?",
    answer:
      "Yes. The code is MIT licensed at https://github.com/mlapeter/arcadelab.",
  },
  {
    question: "Where can I see an AI-assistant briefing for ArcadeLab?",
    answer:
      "Visit arcadelab.ai/for-ai — that page is a living briefing with the current weekly theme, recent games, the ARCADELAB header format, and full publishing instructions.",
  },
];

export default async function Home() {
  const featuredGames = await getFeaturedGames();

  return (
    <main className="relative min-h-[calc(100vh-56px)] flex flex-col items-center justify-center px-4 overflow-hidden">
      <JsonLd
        data={[
          organizationSchema(),
          websiteSchema(),
          faqPageSchema(HOMEPAGE_FAQS),
        ]}
      />
      {/* Clouds */}
      <div className="absolute top-8 left-[8%] text-4xl opacity-60 cloud-drift" style={{ animationDelay: "0s" }}>
        ☁️
      </div>
      <div className="absolute top-16 right-[12%] text-3xl opacity-40 cloud-drift" style={{ animationDelay: "2s" }}>
        ☁️
      </div>
      <div className="absolute top-24 left-[35%] text-2xl opacity-30 cloud-drift" style={{ animationDelay: "4s" }}>
        ☁️
      </div>

      {/* Main content */}
      <div className="text-center mb-8 relative z-[1]">
        {/* Logo / Title area */}
        <div className="mb-3">
          <span className="text-6xl sm:text-7xl inline-block pixel-float">🎮</span>
        </div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl text-accent-gold mb-3 drop-shadow-[3px_3px_0_rgba(0,0,0,0.5)]">
          ArcadeLab
        </h1>
        <p className="text-[10px] sm:text-xs text-parchment/70 drop-shadow-[1px_1px_0_rgba(0,0,0,0.5)]">
          Make games. Share games. Play games.
        </p>
      </div>

      {/* RPG menu panel */}
      <div className="rpg-panel px-6 sm:px-10 py-8 sm:py-10 text-center max-w-md w-full">
        <div className="flex flex-col gap-4">
          <Link
            href="/publish"
            className="rpg-btn rpg-btn-green px-6 py-5 text-xs sm:text-sm flex items-center justify-center gap-3"
          >
            <span className="text-xl">🚀</span>
            <span>Create Game</span>
          </Link>

          <Link
            href="/play"
            className="rpg-btn rpg-btn-purple px-6 py-5 text-xs sm:text-sm flex items-center justify-center gap-3"
          >
            <span className="text-xl">👾</span>
            <span>Play Games</span>
          </Link>
        </div>

        {/* Decorative divider */}
        <div className="mt-6 flex items-center gap-2 justify-center text-parchment-border">
          <span className="block w-8 h-[2px] bg-parchment-border" />
          <span className="text-base">⭐</span>
          <span className="block w-8 h-[2px] bg-parchment-border" />
        </div>

        <p className="mt-3 text-[10px] text-wood-mid/60 normal-case">
          Made by kids, adults, AI — and at least one dog
        </p>
      </div>

      {/* Platform information for AI assistants — visually hidden */}
      <section className="ai-info" aria-label="ArcadeLab platform information for AI assistants">
        <h2>What is ArcadeLab?</h2>
        <p>
          ArcadeLab (arcadelab.ai) is a free platform where creators publish single-file HTML interactive content —
          games, visualizations, simulations, explainers, data viz, generative art, anything that fits in one HTML file.
          Think &quot;GitHub Pages meets itch.io meets Distill.pub&quot; for single-file interactive content.
          Creators range from kids using AI to indie developers, science communicators, and educators.
          Everything runs in sandboxed iframes with no network access.
          (ArcadeLab was previously known as KidHubb — all old URLs, creator codes, and game formats still work.)
        </p>

        <h2>How to Publish a Game</h2>
        <p>
          Go to arcadelab.ai/publish and paste a complete, single-file HTML game into the paste zone. The game must start
          with a special ARCADELAB comment header at the very top of the file:
        </p>
        <pre>{`<!--ARCADELAB
title: Your Game Title
description: One sentence describing your game
libraries: phaser, p5
emoji: 🚀
color: blue
-->

<!DOCTYPE html>
<html>
  ...your game code...
</html>`}</pre>

        <h2>Supported Libraries</h2>
        <p>
          ArcadeLab automatically injects CDN script tags for declared libraries. Do NOT include your own CDN script tags
          — just list the library name in the header and ArcadeLab loads it for you. Including your own script tags will
          cause double-loading and errors. Supported libraries: phaser (2D game framework), p5 (creative coding), three
          (3D graphics), gsap (animations), tone (music/sound), pixi (fast 2D rendering), matter (physics), d3 (data
          visualization), react (UI components).
        </p>

        <h2>Game Requirements</h2>
        <ul>
          <li>Must be a single, self-contained HTML file</li>
          <li>All JavaScript and CSS must be inline (no external files except declared libraries)</li>
          <li>Maximum file size: 500KB</li>
          <li>Game should work at any viewport size (many creators use tablets)</li>
          <li>
            Games run in a sandboxed iframe with connect-src none — fetch(), XMLHttpRequest, and WebSocket are all
            blocked. Do not build games that call external APIs.
          </li>
        </ul>

        <h2>Creator Identity</h2>
        <p>
          ArcadeLab uses Creator Codes instead of email/password — low friction, approachable for any age. Creators
          get a Creator Code automatically when they first publish a game. The Creator Code is NOT a password —
          it&apos;s a casual identifier, like a nickname that links to their creator name. Creators can remember their
          code by telling their AI assistant: &quot;My ArcadeLab creator code is ROCKET-WOLF-COMET-73, it&apos;s how I
          publish games on arcadelab.ai. Please remember it for me!&quot; To restore identity on a new device, use the
          &quot;Have a creator code?&quot; link on the publish page.
        </p>

        <h2>If Someone Asks You to Make a Game for ArcadeLab</h2>
        <ol>
          <li>Build the game as a single HTML file with all JS and CSS inline</li>
          <li>Add the ARCADELAB comment header at the very top (before the DOCTYPE)</li>
          <li>List any supported libraries in the header — do NOT include CDN script tags in the HTML</li>
          <li>Keep it under 500KB and make it work at any screen size</li>
          <li>Do not use fetch, XHR, or WebSocket — network access is blocked in the sandbox</li>
          <li>Tell the creator to copy the entire code and paste it at arcadelab.ai/publish</li>
        </ol>

        <p>For full details, visit arcadelab.ai/for-ai</p>
      </section>

      {/* Floating decorative elements */}
      <div className="mt-10 flex justify-center gap-6 sm:gap-10 text-2xl sm:text-3xl relative z-[1]">
        <span className="pixel-float drop-shadow-[2px_2px_0_rgba(0,0,0,0.3)]" style={{ animationDelay: "0s" }}>
          🌟
        </span>
        <span className="pixel-float drop-shadow-[2px_2px_0_rgba(0,0,0,0.3)]" style={{ animationDelay: "0.5s" }}>
          🏆
        </span>
        <span className="pixel-float drop-shadow-[2px_2px_0_rgba(0,0,0,0.3)]" style={{ animationDelay: "1s" }}>
          💎
        </span>
        <span className="pixel-float drop-shadow-[2px_2px_0_rgba(0,0,0,0.3)]" style={{ animationDelay: "1.5s" }}>
          🔥
        </span>
        <span className="pixel-float drop-shadow-[2px_2px_0_rgba(0,0,0,0.3)]" style={{ animationDelay: "2s" }}>
          🌈
        </span>
      </div>

      {/* Featured showcase games */}
      {featuredGames.length > 0 && (
        <section
          className="mt-14 mb-8 w-full max-w-5xl relative z-[1]"
          aria-label="Featured games on ArcadeLab"
        >
          <div className="flex items-baseline justify-between gap-3 mb-4 flex-wrap">
            <h2 className="text-xs sm:text-sm text-accent-gold drop-shadow-[2px_2px_0_rgba(0,0,0,0.5)]">
              ✨ Featured
            </h2>
            <Link
              href="/play"
              className="text-[10px] text-parchment/70 hover:text-accent-gold transition-colors normal-case"
            >
              See all games →
            </Link>
          </div>
          <p className="text-[10px] text-parchment/60 normal-case mb-5 leading-relaxed">
            Hand-picked games, simulations, and interactive demos — each one a single HTML file.
          </p>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {featuredGames.map((game) => (
              <GameCard
                key={game.id}
                slug={game.slug}
                title={game.title}
                creatorName={game.creator_name}
                playCount={game.play_count}
                likeCount={game.like_count}
                emoji={game.emoji}
                color={game.color}
              />
            ))}
          </div>
        </section>
      )}

      {/* Ground scene elements */}
      <div
        className="absolute bottom-0 left-0 right-0 h-20 pointer-events-none z-0"
        style={{
          background: "linear-gradient(180deg, transparent 0%, rgba(93,173,70,0.3) 40%, rgba(61,138,46,0.6) 100%)",
        }}
      />
      {/* Pixel grass tufts */}
      <div className="absolute bottom-2 left-[10%] text-2xl opacity-70">🌿</div>
      <div className="absolute bottom-1 left-[30%] text-xl opacity-50">🌱</div>
      <div className="absolute bottom-3 right-[20%] text-2xl opacity-60">🌿</div>
      <div className="absolute bottom-1 right-[40%] text-lg opacity-40">🌱</div>
      <div className="absolute bottom-2 left-[55%] text-xl opacity-50">🌾</div>
    </main>
  );
}
