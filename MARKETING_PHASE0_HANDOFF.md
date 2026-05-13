# Phase 0 Handoff — actions only you can take

Everything in this list requires logging into a dashboard or applying a DNS record. The agent prepped all the underlying artifacts; you just need to flip the switches.

**Do these in roughly this order. Total time: ~15-25 minutes.**

---

## 1. Deploy the current changes

Before any of the verification stuff works, the new files (`robots.txt`, `llms.txt`, `sitemap.xml`, the IndexNow key file, `/about`, `/learn/*`) need to be live on production.

```bash
git status         # review what's staged
git add -A         # stage everything
git commit -m "..."  # or commit in logical chunks
git push origin main
```

Vercel auto-deploys on push to main. Verify after deploy:
- `https://arcadelab.ai/robots.txt`
- `https://arcadelab.ai/llms.txt`
- `https://arcadelab.ai/sitemap.xml`
- `https://arcadelab.ai/about`
- `https://arcadelab.ai/learn`
- `https://arcadelab.ai/04f4a892a97411b949cedc59bfc3b4d0.txt` — the IndexNow key file

---

## 2. Enable Vercel Analytics in the dashboard

The package and `<Analytics />` component are wired up in `layout.tsx`, but you need to enable it in the Vercel dashboard for data to flow.

1. Go to https://vercel.com/dashboard
2. Click into the `arcadelab` project
3. Click **Analytics** in the left sidebar
4. Click **Enable** (it's a one-click toggle on the free tier)

Done. Data starts collecting on the next page view.

---

## 3. Set up Google Search Console

This is the highest-leverage thing on the list. GSC data drives the entire weekly content loop (Phase 4 in `MARKETING.md`).

1. Go to https://search.google.com/search-console
2. Click **Add property** → choose **Domain** (not URL prefix — Domain is cleaner)
3. Enter `arcadelab.ai`
4. Google gives you a TXT record to add to DNS. It looks like:
   - **Host/Name:** `@` (or blank, or `arcadelab.ai` — depends on the registrar UI)
   - **Type:** `TXT`
   - **Value:** `google-site-verification=...long string...`
5. Go to https://vercel.com/dashboard → `arcadelab` project → **Settings** → **Domains** → `arcadelab.ai` → **DNS Records**
6. Click **Add** → Type **TXT**, paste the value, save
7. Wait ~5 minutes for DNS propagation, then click **Verify** in GSC
8. Once verified, submit the sitemap: **Sitemaps** in left nav → enter `sitemap.xml` → Submit

---

## 4. Set up Bing Webmaster Tools

Bing now powers ChatGPT browsing, so this is essentially non-optional for AI visibility.

1. Go to https://www.bing.com/webmasters
2. Sign in with a Microsoft account
3. Click **Add a Site** → **Import from Google Search Console** (easiest — pulls config including the sitemap)
   - Or **Add manually**: enter `arcadelab.ai` and verify via DNS TXT (same pattern as GSC)
4. Once verified, submit the sitemap if it didn't auto-import

---

## 5. Submit your URLs to IndexNow (optional but free)

The IndexNow key is already deployed at `https://arcadelab.ai/04f4a892a97411b949cedc59bfc3b4d0.txt`.

The agent will use this in the Phase 4 weekly loop. Nothing for you to do now — just keep the key file in `/public/` and don't delete it.

If you want to manually ping IndexNow about your new pages right now:

```bash
curl -X POST 'https://api.indexnow.org/indexnow' \
  -H 'Content-Type: application/json' \
  -d '{
    "host": "arcadelab.ai",
    "key": "04f4a892a97411b949cedc59bfc3b4d0",
    "keyLocation": "https://arcadelab.ai/04f4a892a97411b949cedc59bfc3b4d0.txt",
    "urlList": [
      "https://arcadelab.ai/",
      "https://arcadelab.ai/about",
      "https://arcadelab.ai/for-ai",
      "https://arcadelab.ai/publish",
      "https://arcadelab.ai/play",
      "https://arcadelab.ai/learn",
      "https://arcadelab.ai/learn/share-interactive-thing-made-with-ai",
      "https://arcadelab.ai/learn/free-html-game-hosting-no-signup",
      "https://arcadelab.ai/learn/publish-single-file-html-game",
      "https://arcadelab.ai/learn/publish-interactive-visualization-online",
      "https://arcadelab.ai/learn/host-phaser-game-no-build-tools",
      "https://arcadelab.ai/learn/share-p5js-sketch-as-playable-url",
      "https://arcadelab.ai/learn/publish-threejs-scene-single-file",
      "https://arcadelab.ai/learn/share-d3-visualization-no-build",
      "https://arcadelab.ai/learn/help-kid-share-game-made-with-ai",
      "https://arcadelab.ai/learn/arcadelab-vs-itchio-glitch-github-pages"
    ]
  }'
```

You can run this from your terminal after deploy. It tells Bing (and any other engine that uses IndexNow) about the new URLs immediately, instead of waiting for them to crawl.

---

## 6. Validate the structured data

After deploy, sanity-check that the JSON-LD is being served correctly:

- https://search.google.com/test/rich-results — paste in `https://arcadelab.ai/` and `https://arcadelab.ai/about` and `https://arcadelab.ai/learn/share-interactive-thing-made-with-ai`. All should show valid structured data with no errors.
- https://validator.schema.org/ — same idea, more permissive validator.

---

## What I (the agent) cannot do for you

| Action | Why I can't | What you do |
|---|---|---|
| Add DNS TXT record to Vercel | Requires Vercel dashboard auth | Apply the GSC + Bing verification records |
| Enable Vercel Analytics | Dashboard toggle, not code | One-click in Vercel dashboard |
| Submit sitemap to GSC | Authenticated UI action | Submit `sitemap.xml` after verification |
| Submit sitemap to Bing | Same | Same |
| Validate rich results in browser | Requires the live URL post-deploy | Run the URLs through the validators |

---

After all of that is done, ping the agent again and we move into Phase 4 (the weekly GSC loop — though it'll have minimal data for ~2-3 weeks) and start drafting the P2.5 narrative piece for HN.
