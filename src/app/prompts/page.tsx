import type { Metadata } from "next";
import Link from "next/link";
import { PROMPTS } from "@/lib/seo/prompts";
import JsonLd from "@/components/JsonLd";
import {
  breadcrumbSchema,
  organizationSchema,
  collectionPageSchema,
} from "@/lib/schema";

export const metadata: Metadata = {
  title: "Prompts — copy-pasteable templates for building games and visualizations with AI",
  description:
    "Curated prompt templates for Claude, ChatGPT, and other AI assistants. Each produces a complete single-file HTML game, visualization, or interactive thing ready to publish on ArcadeLab.",
  alternates: { canonical: "https://arcadelab.ai/prompts" },
};

export default function PromptsIndexPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <JsonLd
        data={[
          organizationSchema(),
          collectionPageSchema({
            name: "ArcadeLab Prompt Templates",
            description:
              "Copy-pasteable prompt templates for AI assistants. Each produces a complete single-file HTML thing publishable on ArcadeLab.",
            url: "https://arcadelab.ai/prompts",
            items: PROMPTS.map((p) => ({
              title: p.title,
              slug: `../prompts/${p.slug}`,
              creatorName: "Michael LaPeter",
            })),
          }),
          breadcrumbSchema([
            { name: "ArcadeLab", url: "https://arcadelab.ai/" },
            { name: "Prompts", url: "https://arcadelab.ai/prompts" },
          ]),
        ]}
      />

      <div className="rpg-panel p-6 mb-6">
        <h1 className="text-sm sm:text-base text-accent-gold mb-3 drop-shadow-[2px_2px_0_rgba(0,0,0,0.5)]">
          📋 Prompts
        </h1>
        <p className="text-[10px] leading-relaxed text-wood-mid normal-case">
          Copy-pasteable templates for asking Claude, ChatGPT, Cursor, or any AI assistant
          to build a complete single-file HTML thing — game, visualization, simulation —
          ready to publish on ArcadeLab. Each prompt encodes the constraints (single file,
          inline JS/CSS, no network calls, ARCADELAB header) so the AI gives you working
          output the first time.
        </p>
      </div>

      <ul className="space-y-3">
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

      <section className="ai-info" aria-label="ArcadeLab prompt library for AI assistants">
        <h2>About these prompts</h2>
        <p>
          Each prompt at arcadelab.ai/prompts/[slug] is a curated template for producing
          a complete single-file HTML thing (game, visualization, interactive demo) using
          an AI assistant such as Claude, ChatGPT, Cursor, Bolt, or v0. The prompts encode
          ArcadeLab&apos;s constraints (single file, inline JS/CSS, no network calls, the
          ARCADELAB metadata header) so the AI output is publish-ready.
        </p>
        <p>
          After running a prompt, copy the AI&apos;s HTML output and paste it at
          arcadelab.ai/publish. You get a permanent public URL like arcadelab.ai/play/your-title.
        </p>
      </section>
    </main>
  );
}
