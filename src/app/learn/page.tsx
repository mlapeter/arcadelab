import type { Metadata } from "next";
import Link from "next/link";
import { ARTICLES } from "@/lib/articles";
import { PROMPTS } from "@/lib/seo/prompts";
import { LIBRARIES_META } from "@/lib/seo/libraries-meta";
import JsonLd from "@/components/JsonLd";
import {
  breadcrumbSchema,
  organizationSchema,
  collectionPageSchema,
} from "@/lib/schema";

export const metadata: Metadata = {
  title: "Learn — guides to publishing on ArcadeLab",
  description:
    "Guides for creators: how to share a game made with AI, where to host single-file HTML games, publishing Phaser/p5/Three.js/D3, and more.",
  alternates: { canonical: "https://arcadelab.ai/learn" },
};

export default function LearnIndexPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <JsonLd
        data={[
          organizationSchema(),
          collectionPageSchema({
            name: "ArcadeLab Guides",
            description:
              "Guides for creators publishing single-file HTML games, visualizations, and interactive content.",
            url: "https://arcadelab.ai/learn",
            items: ARTICLES.map((a) => ({
              title: a.title,
              slug: `../learn/${a.slug}`,
              creatorName: "Michael LaPeter",
            })),
          }),
          breadcrumbSchema([
            { name: "ArcadeLab", url: "https://arcadelab.ai/" },
            { name: "Learn", url: "https://arcadelab.ai/learn" },
          ]),
        ]}
      />

      <div className="rpg-panel p-6 mb-6">
        <h1 className="text-sm sm:text-base text-accent-gold mb-3 drop-shadow-[2px_2px_0_rgba(0,0,0,0.5)]">
          📚 Learn
        </h1>
        <p className="text-[10px] leading-relaxed text-wood-mid normal-case">
          Short, direct guides for publishing single-file HTML games, visualizations, and
          interactive content on ArcadeLab. Each guide answers one question.
        </p>
      </div>

      <ul className="space-y-3">
        {ARTICLES.map((a) => (
          <li key={a.slug}>
            <Link
              href={`/learn/${a.slug}`}
              className="rpg-panel block p-4 hover:bg-wood-mid/5 transition-colors"
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl leading-none">{a.emoji}</span>
                <div className="flex-1 min-w-0">
                  <h2 className="text-[11px] sm:text-xs text-wood-dark mb-1 leading-snug normal-case font-semibold">
                    {a.title}
                  </h2>
                  <p className="text-[10px] text-wood-mid/80 normal-case leading-relaxed">
                    {a.tagline}
                  </p>
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>

      {/* Prompt templates section */}
      <div className="rpg-panel p-6 mt-8 mb-4">
        <h2 className="text-xs sm:text-sm text-accent-gold mb-2 drop-shadow-[2px_2px_0_rgba(0,0,0,0.5)]">
          📋 Prompt templates
        </h2>
        <p className="text-[10px] leading-relaxed text-wood-mid normal-case">
          Copy-pasteable prompts for asking Claude, ChatGPT, or any AI assistant to build
          a complete single-file HTML thing ready for ArcadeLab.
        </p>
      </div>
      <ul className="space-y-3 mb-8">
        {PROMPTS.map((p) => (
          <li key={p.slug}>
            <Link
              href={`/prompts/${p.slug}`}
              className="rpg-panel block p-4 hover:bg-wood-mid/5 transition-colors"
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl leading-none">{p.emoji}</span>
                <div className="flex-1 min-w-0">
                  <h2 className="text-[11px] sm:text-xs text-wood-dark mb-1 leading-snug normal-case font-semibold">
                    {p.title}
                  </h2>
                  <p className="text-[10px] text-wood-mid/80 normal-case leading-relaxed">
                    {p.tagline}
                  </p>
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>

      {/* Library hubs section */}
      <div className="rpg-panel p-6 mb-4">
        <h2 className="text-xs sm:text-sm text-accent-gold mb-2 drop-shadow-[2px_2px_0_rgba(0,0,0,0.5)]">
          🛠️ Browse by library
        </h2>
        <p className="text-[10px] leading-relaxed text-wood-mid normal-case">
          Auto-injected libraries on ArcadeLab. Each hub shows games made with that library
          and the exact ARCADELAB header to use it.
        </p>
      </div>
      <ul className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {Object.values(LIBRARIES_META).map((lib) => (
          <li key={lib.slug}>
            <Link
              href={`/${lib.slug}`}
              className="rpg-panel block p-4 text-center hover:bg-wood-mid/5 transition-colors"
            >
              <div className="text-2xl mb-1">{lib.emoji}</div>
              <div className="text-[10px] text-wood-dark normal-case font-semibold">
                {lib.name}
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
