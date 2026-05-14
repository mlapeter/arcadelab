import { ReactNode } from "react";
import Link from "next/link";
import { PromptMeta, getRelatedPrompts } from "@/lib/seo/prompts";
import { getArticle } from "@/lib/articles";
import { LIBRARY_MAP } from "@/lib/libraries";
import {
  articleSchema,
  breadcrumbSchema,
  organizationSchema,
  howToSchema,
  FaqEntry,
  faqPageSchema,
} from "@/lib/schema";
import JsonLd from "@/components/JsonLd";
import CopyPromptButton from "@/components/CopyPromptButton";
import ArticleCTA from "@/components/ArticleCTA";

interface Props {
  prompt: PromptMeta;
  extraFaqs?: FaqEntry[];
  children?: ReactNode;
}

export default function PromptLayout({ prompt, extraFaqs, children }: Props) {
  const url = `https://arcadelab.ai/prompts/${prompt.slug}`;
  const relatedArticle = prompt.relatedArticleSlug ? getArticle(prompt.relatedArticleSlug) : undefined;
  const related = getRelatedPrompts(prompt.slug, 3);
  const library = prompt.primaryLibrary ? LIBRARY_MAP[prompt.primaryLibrary] : undefined;

  // Default FAQs every prompt page benefits from. Pages can append more via extraFaqs.
  const baseFaqs: FaqEntry[] = [
    {
      question: "How do I use this prompt?",
      answer:
        "Copy the prompt block, paste it into Claude, ChatGPT, Cursor, or any other AI assistant. Replace the bracketed sections with what you want to build. The AI will output a complete HTML file you can paste at arcadelab.ai/publish.",
    },
    {
      question: "Do I need an account to publish what the AI builds?",
      answer:
        "No. ArcadeLab uses Creator Codes (like ROCKET-WOLF-COMET-73) instead of email and password. First time you publish, ArcadeLab generates a code for you automatically.",
    },
    {
      question: "What if the AI's output doesn't work?",
      answer:
        "Paste the error or describe what's broken back to the AI and ask it to fix. The loop usually takes one or two iterations. ArcadeLab shows a live preview before you publish, so you'll see what's wrong before going live.",
    },
  ];

  const schemas: object[] = [
    organizationSchema(),
    articleSchema({
      headline: prompt.title,
      description: prompt.description,
      url,
      datePublished: prompt.publishedDate,
      imageUrl: `https://arcadelab.ai/icon.png`,
    }),
    howToSchema({
      name: prompt.title,
      description: prompt.description,
      totalTimeMinutes: prompt.estimatedTimeMinutes,
      steps: [
        {
          name: "Copy the prompt below",
          text: "Copy the full prompt template from this page.",
        },
        {
          name: "Paste it into your AI assistant",
          text: "Paste into Claude, ChatGPT, Cursor, or any AI coding assistant. Replace the bracketed sections with what you want to build.",
        },
        {
          name: "Copy the AI's HTML output",
          text: "The AI will produce a complete single-file HTML document. Copy all of it.",
        },
        {
          name: "Paste at arcadelab.ai/publish",
          text: "Open arcadelab.ai/publish, paste the HTML, and click Publish. You get a permanent shareable URL.",
          url: "https://arcadelab.ai/publish",
        },
      ],
    }),
    faqPageSchema([...baseFaqs, ...(extraFaqs || [])]),
    breadcrumbSchema([
      { name: "ArcadeLab", url: "https://arcadelab.ai/" },
      { name: "Prompts", url: "https://arcadelab.ai/prompts" },
      { name: prompt.title, url },
    ]),
  ];

  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <JsonLd data={schemas} />

      {/* Breadcrumb */}
      <nav className="text-[10px] text-parchment/50 mb-4 normal-case">
        <Link href="/" className="hover:text-accent-gold">ArcadeLab</Link>
        <span className="mx-2">/</span>
        <Link href="/prompts" className="hover:text-accent-gold">Prompts</Link>
      </nav>

      <article className="rpg-panel p-6">
        <header className="mb-4">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-3xl">{prompt.emoji}</span>
            <span className="text-[10px] text-wood-mid/60 normal-case">
              ~{prompt.estimatedTimeMinutes} min from prompt to published URL
            </span>
          </div>
          <h1 className="text-sm sm:text-base text-accent-gold leading-snug normal-case drop-shadow-[2px_2px_0_rgba(0,0,0,0.5)]">
            {prompt.title}
          </h1>
        </header>

        <div className="prose-arcade text-[11px] leading-relaxed text-wood-mid normal-case">
          <p>{prompt.intro}</p>

          <div className="my-4">
            <CopyPromptButton text={prompt.prompt} />
          </div>
          <pre className="pixel-border-green bg-sky-top p-4 overflow-x-auto text-[10px] leading-relaxed whitespace-pre-wrap">
            {prompt.prompt}
          </pre>

          {prompt.notes && (
            <p className="mt-4 text-[10px] text-wood-mid/80 italic">
              <strong className="text-accent-purple normal-case">Notes:</strong> {prompt.notes}
            </p>
          )}

          {children}

          {/* Related links */}
          {(relatedArticle || library) && (
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {relatedArticle && (
                <div className="rpg-panel p-3">
                  <p className="text-[10px] text-wood-mid/60 normal-case mb-1">Related guide</p>
                  <Link
                    href={`/learn/${relatedArticle.slug}`}
                    className="text-[10px] text-accent-purple hover:text-accent-gold transition-colors normal-case"
                  >
                    <span className="mr-1">{relatedArticle.emoji}</span>
                    {relatedArticle.title}
                  </Link>
                </div>
              )}
              {library && prompt.primaryLibrary && (
                <div className="rpg-panel p-3">
                  <p className="text-[10px] text-wood-mid/60 normal-case mb-1">Library page</p>
                  <Link
                    href={`/${prompt.primaryLibrary}`}
                    className="text-[10px] text-accent-purple hover:text-accent-gold transition-colors normal-case"
                  >
                    🛠️ {library.label} on ArcadeLab →
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>

        <ArticleCTA />

        {/* Related prompts */}
        {related.length > 0 && (
          <section className="my-8">
            <h2 className="text-[11px] text-wood-dark mb-3">Other prompts</h2>
            <ul className="space-y-2">
              {related.map((p) => (
                <li key={p.slug} className="text-[10px] leading-relaxed normal-case">
                  <Link
                    href={`/prompts/${p.slug}`}
                    className="text-accent-purple hover:text-accent-gold transition-colors"
                  >
                    <span className="mr-2">{p.emoji}</span>
                    {p.title}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </article>
    </main>
  );
}
