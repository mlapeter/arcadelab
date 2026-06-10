export function generateSlug(title: string, displayName: string): string {
  const titleSlug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 40);

  const nameSlug = displayName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 20);

  // Non-Latin titles (Arabic, Hebrew, CJK...) slugify to nothing — fall back
  // to "game" so the URL stays friendly instead of starting with a dash.
  return `${titleSlug || "game"}-${nameSlug}`;
}
