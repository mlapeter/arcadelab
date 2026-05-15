/**
 * Capture a static thumbnail + a short looping preview video for each game,
 * upload them to the `game-media` Supabase Storage bucket, and fill in
 * games.thumbnail_url / games.preview_url.
 *
 * The /play grid shows the static thumbnail (light, fast). On desktop hover,
 * GameCard plays the preview video. Games with no media fall back to the
 * emoji/gradient card, so this can run incrementally.
 *
 * Usage:
 *   node scripts/capture-thumbnails.mjs              # games missing media
 *   node scripts/capture-thumbnails.mjs --all        # recapture every game
 *   node scripts/capture-thumbnails.mjs slug-a slug-b  # specific slugs
 *
 * Requires the `playwright` devDependency with chromium installed:
 *   npx playwright install chromium
 */
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { chromium } from "playwright";
import { createClient } from "@supabase/supabase-js";

// --- env (standalone scripts don't get Next.js's .env.local loading) -------
for (const line of fs.readFileSync(new URL("../.env.local", import.meta.url), "utf8").split("\n")) {
  const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2].trim();
}
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error("Missing Supabase env vars in .env.local");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY);
const BUCKET = "game-media";
const RENDER_BASE = "https://play.arcadelab.ai/render";

// A misbehaving game (e.g. a stray dialog) shouldn't kill the whole batch.
process.on("unhandledRejection", (e) => {
  console.warn(`  ! unhandled: ${e?.message || e}`);
});

const args = process.argv.slice(2);
const recaptureAll = args.includes("--all");
const explicitSlugs = args.filter((a) => !a.startsWith("--"));

/** Returns the slugs to capture this run. */
async function gamesToCapture() {
  let query = supabase
    .from("games")
    .select("slug, thumbnail_url, preview_url")
    .eq("status", "active");
  if (explicitSlugs.length) query = query.in("slug", explicitSlugs);
  const { data, error } = await query;
  if (error) throw error;
  if (recaptureAll || explicitSlugs.length) return data.map((g) => g.slug);
  return data.filter((g) => !g.thumbnail_url || !g.preview_url).map((g) => g.slug);
}

/** Loads a game in headless chromium; returns { still, video } buffers. */
async function capture(browser, slug) {
  const videoDir = fs.mkdtempSync(path.join(os.tmpdir(), "arcadelab-vid-"));
  const context = await browser.newContext({
    viewport: { width: 1000, height: 625 },
    recordVideo: { dir: videoDir, size: { width: 640, height: 400 } },
  });
  const page = await context.newPage();
  // Some games call alert()/confirm() on load; dismiss so capture can proceed.
  page.on("dialog", (d) => d.dismiss().catch(() => {}));
  const video = page.video();
  let still;
  try {
    await page.goto(`${RENDER_BASE}/${slug}`, { waitUntil: "load", timeout: 25000 });
    await page.waitForTimeout(2500); // let the game draw something
    still = await page.screenshot({ type: "jpeg", quality: 82 });
    await page.waitForTimeout(2000); // ~4.5s of recorded video total
  } finally {
    await context.close(); // finalizes the .webm
  }
  const videoPath = await video.path();
  const videoBuf = fs.readFileSync(videoPath);
  fs.rmSync(videoDir, { recursive: true, force: true });
  return { still, video: videoBuf };
}

/** Uploads the two assets and records their public URLs on the game row. */
async function publish(slug, still, video) {
  const thumbPath = `${slug}/thumb.jpg`;
  const previewPath = `${slug}/preview.webm`;
  const store = supabase.storage.from(BUCKET);
  const a = await store.upload(thumbPath, still, { contentType: "image/jpeg", upsert: true });
  if (a.error) throw a.error;
  const b = await store.upload(previewPath, video, { contentType: "video/webm", upsert: true });
  if (b.error) throw b.error;
  const base = `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}`;
  const { error } = await supabase
    .from("games")
    .update({ thumbnail_url: `${base}/${thumbPath}`, preview_url: `${base}/${previewPath}` })
    .eq("slug", slug);
  if (error) throw error;
}

const slugs = await gamesToCapture();
console.log(`Capturing ${slugs.length} game(s)...`);
const browser = await chromium.launch();
let ok = 0;
let fail = 0;
for (const slug of slugs) {
  try {
    const { still, video } = await capture(browser, slug);
    await publish(slug, still, video);
    ok++;
    console.log(`  ✓ ${slug}`);
  } catch (e) {
    fail++;
    console.log(`  ✗ ${slug} — ${e?.message || e}`);
  }
}
await browser.close();
console.log(`Done. ${ok} captured, ${fail} failed.`);
