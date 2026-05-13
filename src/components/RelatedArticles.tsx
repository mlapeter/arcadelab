import Link from "next/link";
import { ArticleMeta } from "@/lib/articles";

interface Props {
  articles: ArticleMeta[];
}

export default function RelatedArticles({ articles }: Props) {
  if (articles.length === 0) return null;
  return (
    <section className="my-8">
      <h2 className="text-[11px] text-wood-dark mb-3">Related guides</h2>
      <ul className="space-y-2">
        {articles.map((a) => (
          <li key={a.slug} className="text-[10px] leading-relaxed normal-case">
            <Link href={`/learn/${a.slug}`} className="text-accent-purple hover:text-accent-gold transition-colors">
              <span className="mr-2">{a.emoji}</span>
              {a.title}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
