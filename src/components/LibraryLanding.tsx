import Link from "next/link";
import { LibraryMeta } from "@/lib/seo/libraries-meta";
import { getArticle } from "@/lib/articles";
import { getPrompt } from "@/lib/seo/prompts";
import {
  organizationSchema,
  breadcrumbSchema,
  faqPageSchema,
  collectionPageSchema,
  type GameListItem,
} from "@/lib/schema";
import JsonLd from "@/components/JsonLd";
import GameCard from "@/components/GameCard";

interface GameRow {
  id: string;
  slug: string;
  title: string;
  creator_name: string;
  play_count: number;
  like_count: number;
  emoji?: string | null;
  color?: string | null;
}

interface Props {
  meta: LibraryMeta;
  games: GameRow[];
}

export default function LibraryLanding({ meta, games }: Props) {
  const url = `https://arcadelab.ai/${meta.slug}`;
  const article = getArticle(meta.articleSlug);
  const prompt = getPrompt(meta.promptSlug);
  const gameItems: GameListItem[] = games.map((g) => ({
    title: g.title,
    slug: g.slug,
    creatorName: g.creator_name,
  }));

  return (
    <main className="mx-auto max-w-4xl px-4 py-8">
      <JsonLd
        data={[
          organizationSchema(),
          collectionPageSchema({
            name: `${meta.name} on ArcadeLab`,
            description: meta.description,
            url,
            items: gameItems,
          }),
          faqPageSchema(meta.faqs),
          breadcrumbSchema([
            { name: "ArcadeLab", url: "https://arcadelab.ai/" },
            { name: meta.name, url },
          ]),
        ]}
      />

      {/* Hero */}
      <div className="rpg-panel p-6 mb-6">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-3xl">{meta.emoji}</span>
          <h1 className="text-sm sm:text-base text-accent-gold drop-shadow-[2px_2px_0_rgba(0,0,0,0.5)]">
            {meta.longName}
          </h1>
        </div>
        <p className="text-[11px] leading-relaxed text-wood-mid mb-3 normal-case">
          {meta.description}
        </p>
        <p className="text-[10px] text-wood-mid/60 normal-case">
          Version loaded: <strong>{meta.version}</strong>
        </p>
      </div>

      {/* Header example */}
      <section className="rpg-panel p-5 mb-6">
        <h2 className="text-[11px] text-wood-dark mb-2 normal-case font-semibold">
          ARCADELAB header for {meta.name}
        </h2>
        <p className="text-[10px] text-wood-mid mb-3 normal-case">
          Put this at the very top of your HTML file (before <code>&lt;!DOCTYPE html&gt;</code>).
          ArcadeLab will auto-inject the {meta.name} CDN — do <strong>not</strong> include your own script tag.
        </p>
        <pre className="pixel-border-green bg-sky-top p-4 overflow-x-auto text-[10px] leading-relaxed">
{meta.headerExample}
        </pre>
      </section>

      {/* Good for */}
      <section className="rpg-panel p-5 mb-6">
        <h2 className="text-[11px] text-wood-dark mb-2 normal-case font-semibold">
          Good fits for {meta.name} on ArcadeLab
        </h2>
        <ul className="text-[10px] leading-loose text-wood-mid list-disc list-inside normal-case">
          {meta.goodFor.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      </section>

      {/* Related guide + prompt */}
      <section className="mb-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
        {article && (
          <Link
            href={`/learn/${article.slug}`}
            className="rpg-panel p-4 hover:bg-wood-mid/5 transition-colors"
          >
            <p className="text-[10px] text-wood-mid/60 normal-case mb-1">Full guide</p>
            <p className="text-[10px] text-accent-purple normal-case">
              <span className="mr-1">{article.emoji}</span>
              {article.title}
            </p>
          </Link>
        )}
        {prompt && (
          <Link
            href={`/prompts/${prompt.slug}`}
            className="rpg-panel p-4 hover:bg-wood-mid/5 transition-colors"
          >
            <p className="text-[10px] text-wood-mid/60 normal-case mb-1">Prompt template</p>
            <p className="text-[10px] text-accent-purple normal-case">
              <span className="mr-1">{prompt.emoji}</span>
              {prompt.title}
            </p>
          </Link>
        )}
      </section>

      {/* Games using this library */}
      {games.length > 0 && (
        <section className="mb-6">
          <h2 className="text-[11px] text-wood-dark mb-3 normal-case font-semibold">
            {meta.name} games on ArcadeLab
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
            {games.map((g) => (
              <GameCard
                key={g.id}
                slug={g.slug}
                title={g.title}
                creatorName={g.creator_name}
                playCount={g.play_count}
                likeCount={g.like_count}
                emoji={g.emoji}
                color={g.color}
              />
            ))}
          </div>
        </section>
      )}

      {/* FAQ */}
      <section className="rpg-panel p-5 mb-6">
        <h2 className="text-[11px] text-wood-dark mb-3 normal-case font-semibold">Frequently asked</h2>
        <div className="space-y-3">
          {meta.faqs.map((faq, i) => (
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

      {/* CTA */}
      <div className="rpg-panel p-6 text-center">
        <p className="text-[11px] leading-relaxed text-wood-mid mb-4 normal-case">
          Ready to publish a {meta.name} thing? Paste your HTML file and get a URL.
        </p>
        <Link
          href="/publish"
          className="rpg-btn rpg-btn-green inline-flex items-center gap-2 px-6 py-3 text-[10px]"
        >
          <span className="text-base">🚀</span>
          <span>Publish on ArcadeLab</span>
        </Link>
      </div>
    </main>
  );
}
