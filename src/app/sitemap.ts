import type { MetadataRoute } from "next";
import { supabase } from "@/lib/supabase";

const BASE_URL = "https://arcadelab.ai";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/`, lastModified: now, changeFrequency: "weekly", priority: 1.0 },
    { url: `${BASE_URL}/publish`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE_URL}/play`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE_URL}/for-ai`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/learn`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
  ];

  const [{ data: games }, { data: creators }] = await Promise.all([
    supabase
      .from("games")
      .select("slug, created_at, play_count")
      .eq("status", "active")
      .order("created_at", { ascending: false }),
    supabase
      .from("creators")
      .select("display_name, created_at")
      .order("created_at", { ascending: false }),
  ]);

  const gameRoutes: MetadataRoute.Sitemap = (games || []).flatMap((g) => [
    {
      url: `${BASE_URL}/play/${g.slug}`,
      lastModified: g.created_at ? new Date(g.created_at) : now,
      changeFrequency: "monthly" as const,
      priority: Math.min(0.8, 0.5 + Math.log10(Math.max(1, g.play_count || 1)) / 10),
    },
    {
      url: `${BASE_URL}/play/${g.slug}/source`,
      lastModified: g.created_at ? new Date(g.created_at) : now,
      changeFrequency: "monthly" as const,
      priority: 0.4,
    },
  ]);

  const creatorRoutes: MetadataRoute.Sitemap = (creators || []).map((c) => ({
    url: `${BASE_URL}/creators/${encodeURIComponent(c.display_name)}`,
    lastModified: c.created_at ? new Date(c.created_at) : now,
    changeFrequency: "weekly",
    priority: 0.5,
  }));

  return [...staticRoutes, ...gameRoutes, ...creatorRoutes];
}
