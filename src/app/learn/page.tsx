import type { Metadata } from "next";
import Link from "next/link";
import { ARTICLES } from "@/lib/articles";
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
    </main>
  );
}
