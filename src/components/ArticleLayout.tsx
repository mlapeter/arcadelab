import { ReactNode } from "react";
import Link from "next/link";
import { ArticleMeta, getRelatedArticles } from "@/lib/articles";
import { getPrompt } from "@/lib/seo/prompts";
import { getLibraryMeta } from "@/lib/seo/libraries-meta";
import { articleSchema, breadcrumbSchema, organizationSchema, FaqEntry, faqPageSchema, howToSchema, HowToStep } from "@/lib/schema";
import JsonLd from "@/components/JsonLd";
import RelatedArticles from "@/components/RelatedArticles";
import ArticleCTA from "@/components/ArticleCTA";

interface Props {
  article: ArticleMeta;
  children: ReactNode;
  faqs?: FaqEntry[];
  howTo?: { name: string; description: string; steps: HowToStep[]; totalTimeMinutes?: number };
}

export default function ArticleLayout({ article, children, faqs, howTo }: Props) {
  const url = `https://arcadelab.ai/learn/${article.slug}`;
  const imageUrl = `https://arcadelab.ai/learn/${article.slug}/opengraph-image`;
  const related = getRelatedArticles(article.slug, 3);
  const relatedPrompt = article.relatedPromptSlug ? getPrompt(article.relatedPromptSlug) : undefined;
  const relatedLibrary = article.relatedLibrarySlug ? getLibraryMeta(article.relatedLibrarySlug) : undefined;

  const schemas: object[] = [
    organizationSchema(),
    articleSchema({
      headline: article.title,
      description: article.description,
      url,
      datePublished: article.publishedDate,
      imageUrl,
    }),
    breadcrumbSchema([
      { name: "ArcadeLab", url: "https://arcadelab.ai/" },
      { name: "Learn", url: "https://arcadelab.ai/learn" },
      { name: article.title, url },
    ]),
  ];
  if (faqs && faqs.length > 0) schemas.push(faqPageSchema(faqs));
  if (howTo) schemas.push(howToSchema(howTo));

  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <JsonLd data={schemas} />

      {/* Breadcrumb */}
      <nav className="text-[10px] text-parchment/50 mb-4 normal-case">
        <Link href="/" className="hover:text-accent-gold">ArcadeLab</Link>
        <span className="mx-2">/</span>
        <Link href="/learn" className="hover:text-accent-gold">Learn</Link>
      </nav>

      <article className="rpg-panel p-6">
        <header className="mb-4">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-3xl">{article.emoji}</span>
            <span className="text-[10px] text-wood-mid/60 normal-case">
              {new Date(article.publishedDate).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
            </span>
          </div>
          <h1 className="text-sm sm:text-base text-accent-gold leading-snug normal-case drop-shadow-[2px_2px_0_rgba(0,0,0,0.5)]">
            {article.title}
          </h1>
        </header>

        <div className="prose-arcade text-[11px] leading-relaxed text-wood-mid normal-case">
          {children}
        </div>

        {(relatedPrompt || relatedLibrary) && (
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {relatedPrompt && (
              <Link
                href={`/prompts/${relatedPrompt.slug}`}
                className="rpg-panel p-3 hover:bg-wood-mid/5 transition-colors"
              >
                <p className="text-[10px] text-wood-mid/60 normal-case mb-1">Prompt template</p>
                <p className="text-[10px] text-accent-purple normal-case">
                  <span className="mr-1">{relatedPrompt.emoji}</span>
                  {relatedPrompt.title}
                </p>
              </Link>
            )}
            {relatedLibrary && (
              <Link
                href={`/${relatedLibrary.slug}`}
                className="rpg-panel p-3 hover:bg-wood-mid/5 transition-colors"
              >
                <p className="text-[10px] text-wood-mid/60 normal-case mb-1">Library hub</p>
                <p className="text-[10px] text-accent-purple normal-case">
                  <span className="mr-1">{relatedLibrary.emoji}</span>
                  {relatedLibrary.longName} on ArcadeLab
                </p>
              </Link>
            )}
          </div>
        )}

        <ArticleCTA />
        <RelatedArticles articles={related} />
      </article>
    </main>
  );
}
