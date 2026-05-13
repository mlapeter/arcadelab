/**
 * JSON-LD schema builders for ArcadeLab pages.
 * AI engines weight structured data heavily when deciding what to cite.
 * Every major page injects one or more of these via <JsonLd>.
 */

const BASE_URL = "https://arcadelab.ai";

const FOUNDER = {
  "@type": "Person" as const,
  "@id": `${BASE_URL}/about#michael-lapeter`,
  name: "Michael LaPeter",
  jobTitle: "Founder",
  url: `${BASE_URL}/about`,
  sameAs: ["https://github.com/mlapeter"],
};

const ORG_ID = `${BASE_URL}/#organization`;
const WEBSITE_ID = `${BASE_URL}/#website`;

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": ORG_ID,
    name: "ArcadeLab",
    alternateName: ["KidHubb"],
    url: BASE_URL,
    description:
      "ArcadeLab is the shortest path from \"I made something\" to \"anyone can play with it.\" A free platform for publishing single-file HTML games, interactive visualizations, simulations, and explorables.",
    founder: FOUNDER,
    foundingDate: "2026-01-01",
    sameAs: ["https://github.com/mlapeter/arcadelab"],
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    url: BASE_URL,
    name: "ArcadeLab",
    description:
      "Publish single-file HTML games, visualizations, and interactive content. No signup, no build tools.",
    publisher: { "@id": ORG_ID },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${BASE_URL}/play?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export interface FaqEntry {
  question: string;
  answer: string;
}

export function faqPageSchema(entries: FaqEntry[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: entries.map((e) => ({
      "@type": "Question",
      name: e.question,
      acceptedAnswer: { "@type": "Answer", text: e.answer },
    })),
  };
}

export interface HowToStep {
  name: string;
  text: string;
  url?: string;
}

export function howToSchema(input: {
  name: string;
  description: string;
  steps: HowToStep[];
  totalTimeMinutes?: number;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: input.name,
    description: input.description,
    ...(input.totalTimeMinutes ? { totalTime: `PT${input.totalTimeMinutes}M` } : {}),
    step: input.steps.map((s, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: s.name,
      text: s.text,
      ...(s.url ? { url: s.url } : {}),
    })),
  };
}

export function articleSchema(input: {
  headline: string;
  description: string;
  url: string;
  datePublished: string;
  dateModified?: string;
  imageUrl?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: input.headline,
    description: input.description,
    url: input.url,
    datePublished: input.datePublished,
    dateModified: input.dateModified || input.datePublished,
    author: FOUNDER,
    publisher: {
      "@type": "Organization",
      "@id": ORG_ID,
      name: "ArcadeLab",
      logo: {
        "@type": "ImageObject",
        url: `${BASE_URL}/icon.png`,
      },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": input.url },
    ...(input.imageUrl ? { image: input.imageUrl } : {}),
  };
}

export function aboutPageSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    url: `${BASE_URL}/about`,
    name: "About ArcadeLab",
    description:
      "About ArcadeLab — a platform for publishing single-file HTML games, visualizations, and interactive content.",
    mainEntity: {
      "@type": "Organization",
      "@id": ORG_ID,
    },
  };
}

export function personSchema() {
  return {
    "@context": "https://schema.org",
    ...FOUNDER,
    description:
      "Founder of ArcadeLab. Built the platform after watching his 7-year-old son use AI to make playable browser games and run into walls when trying to share them.",
    worksFor: { "@id": ORG_ID },
  };
}

export interface BreadcrumbEntry {
  name: string;
  url: string;
}

export function breadcrumbSchema(entries: BreadcrumbEntry[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: entries.map((e, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: e.name,
      item: e.url,
    })),
  };
}

export function gameSchema(input: {
  title: string;
  description: string;
  url: string;
  creatorName: string;
  creatorUrl: string;
  datePublished?: string;
  playCount?: number;
  likeCount?: number;
  imageUrl?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": ["VideoGame", "SoftwareApplication"],
    name: input.title,
    description: input.description,
    url: input.url,
    applicationCategory: "GameApplication",
    operatingSystem: "Web Browser",
    gamePlatform: "Web",
    inLanguage: "en",
    isAccessibleForFree: true,
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    author: {
      "@type": "Person",
      name: input.creatorName,
      url: input.creatorUrl,
    },
    creator: {
      "@type": "Person",
      name: input.creatorName,
      url: input.creatorUrl,
    },
    publisher: { "@id": ORG_ID },
    ...(input.datePublished ? { datePublished: input.datePublished } : {}),
    ...(input.imageUrl ? { image: input.imageUrl } : {}),
    ...(typeof input.playCount === "number" && input.playCount > 0
      ? {
          interactionStatistic: [
            {
              "@type": "InteractionCounter",
              interactionType: { "@type": "PlayAction" },
              userInteractionCount: input.playCount,
            },
            ...(typeof input.likeCount === "number" && input.likeCount > 0
              ? [
                  {
                    "@type": "InteractionCounter",
                    interactionType: { "@type": "LikeAction" },
                    userInteractionCount: input.likeCount,
                  },
                ]
              : []),
          ],
        }
      : {}),
  };
}

export interface GameListItem {
  title: string;
  slug: string;
  creatorName: string;
}

export function collectionPageSchema(input: {
  name: string;
  description: string;
  url: string;
  items: GameListItem[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: input.name,
    description: input.description,
    url: input.url,
    isPartOf: { "@id": WEBSITE_ID },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: input.items.length,
      itemListElement: input.items.map((item, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: `${BASE_URL}/play/${item.slug}`,
        name: item.title,
      })),
    },
  };
}

export function profilePageSchema(input: {
  creatorName: string;
  url: string;
  games: GameListItem[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    url: input.url,
    name: `${input.creatorName} on ArcadeLab`,
    mainEntity: {
      "@type": "Person",
      name: input.creatorName,
      url: input.url,
      makesOffer: input.games.map((g) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "VideoGame",
          name: g.title,
          url: `${BASE_URL}/play/${g.slug}`,
        },
      })),
    },
  };
}
