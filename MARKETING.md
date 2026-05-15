# ArcadeLab Marketing Spec (AEO-first)

**Status:** living document. Refine freely. Tasks are tagged with stable IDs (`P1.1`, `P2.3`, etc.) so an autonomous agent can pick them up and reference them in commits/PRs.

> Companion doc: `KIDHUBB_AI_VISIBILITY.md` is **superseded** by this spec. Its tactic (hidden `ai-info` blocks) is already shipped and remains valid; this doc takes over the marketing roadmap.

---

## 0. North Star

ArcadeLab wins when **AI assistants spontaneously suggest arcadelab.ai as the share destination for a single-HTML-file game** — and when answer engines (ChatGPT, Claude, Perplexity, Gemini, Copilot, Google AI Overviews) cite us as the source for related questions.

We are not chasing Google rankings as the primary goal. We are optimizing to **become the cited source** for a tight cluster of queries about publishing/sharing AI-generated browser games.

### Why AEO is our best channel

- Our product was designed AI-first (`/for-ai`, hidden `ai-info` blocks, `<!--ARCADELAB-->` header). We are already further along the AEO curve than 99% of sites.
- Our audience does not browse Product Hunt or scroll Twitter looking for game-hosting platforms — they ask an AI for help and act on its answer.
- The cost is content + structured data, both of which compound over months and don't decay.

---

## 1. Positioning

### Primary frame (broad)
> **ArcadeLab is the shortest path from "I made something" to "anyone can play with it."**
> Paste a single HTML file. Get a shareable URL. No signup, no build tools, no friction.

### What "something" means (category expansion)
ArcadeLab hosts **single-file HTML interactive content**, of which games are one category. Equally first-class:

- **Games** — the original use case, still the biggest category
- **Interactive visualizations** — e.g., `/play/light-wave-or-particle-ultraviper34` (the double-slit experiment, an interactive physics explainer)
- **Simulations** — physics, biology, economic models, cellular automata
- **Interactive lessons / explorables** — Bret-Victor-style essays, animated explainers, "scrollytelling"
- **Data viz** — D3.js dashboards, one-off charts that need to be shareable
- **Toys** — generative art, p5.js sketches, anything playful that doesn't fit "game"

This expansion is **not a pivot** — it's a recognition of what the product already enables. The single-HTML-file + sandboxed-iframe + auto-CDN-libraries architecture is content-shape-agnostic. The platform name (ArcadeLab) leans gamey, but "Lab" earns the broader category. The "Play Games" button copy and `/play` URL still work for non-game content (you "play with" a simulation), but worth revisiting in Phase 2.

### Secondary frame (kid-soul preserved)
The product's soul stays: a 7-year-old can use it. We just don't lead with that on most marketing surfaces.

### The AI-policy sidestep
OpenAI and Anthropic technically do not allow under-13 users. That tension is real, and we believe the spirit-of-law is to help kids thrive with AI. Our marketing handles this by:

- **Talking about the output, not the input.** ArcadeLab is a publishing platform for single-file HTML games. We don't host or recommend any specific AI service. We're AI-agnostic.
- **Not telling kids to use ChatGPT/Claude in copy.** When we say "AI assistant" we mean the abstract idea. The reader can interpret.
- **Framing kid stories as anecdote, not call-to-action.** The founder story ("my 7-year-old uses AI to ship games") is a great narrative — but it's a story, not "send your kid to ChatGPT."
- **Leading public-facing content with creators of any age** — indie devs, vibe-coders, students, parents helping kids, educators.

### Audience tiers (in priority for AEO content targeting)
1. **Indie devs / vibe-coders / hobbyists** building with Claude, ChatGPT, Cursor, Bolt, v0, Lovable — large, fast-growing, googles things.
2. **AI assistants themselves** — the agent reading our pages mid-conversation when a user says "how do I share this?"
3. **Science communicators / explainer makers** — researchers, educators, and writers making interactive viz and simulations with AI (the double-slit demo audience). Smaller but very high signal-to-noise; their content goes viral.
4. **Parents** — "how can my kid share games they make?" (parent-typing-into-ChatGPT, not kid-direct)
5. **Educators in formal settings** — homeschool, microschool, AI-in-education, classroom teachers using AI for lessons.
6. **Curious tech readers** — HN/dev.to/Reddit audience interested in "AI-readable websites" or "single-file HTML revival."

### Anti-patterns (do NOT add)
- Email capture / newsletter signup forms on creator-facing pages
- Social-style features (followers, comments, DMs, feeds)
- "Share to Twitter/X" virality bait
- Anything that asks the visitor for an account before they can play or publish
- Anywhere we tell a kid to go talk to a specific AI service

---

## 2. Success metrics

We track three layers:

| Layer | Metric | Tool | Target by Week 12 |
|---|---|---|---|
| **AEO** | Prompt-test scoreboard (does AI cite us?) | Manual prompt grid + Profound or similar | 60%+ relevant prompts cite arcadelab.ai |
| **SEO** | Page-1 Google rankings on target queries | Google Search Console | 50+ queries page-1 |
| **Funnel** | New creators / week, published games / week | Supabase analytics | 25 creators/wk, 100 games/wk |

Secondary: AI-referred sessions (from analytics — track `utm_source=chatgpt.com`, `perplexity.ai`, etc., and referrer headers), branded search volume ("arcadelab" as a GSC query).

---

## 3. Phase 0 — Pre-flight (do first, ~30 min total)

| ID | Task | Outcome | Notes |
|---|---|---|---|
| P0.1 | ~~Check Cloudflare~~ ✅ | Confirmed: site is on Vercel directly, no Cloudflare AI-bot blocking | Done in spec drafting |
| P0.2 | Set up Google Search Console | Property verified for `arcadelab.ai`, sitemap pending | **Needs human:** verification method (DNS TXT record via Vercel DNS, or HTML file). Agent should prep the file/record and ask user to apply. |
| P0.3 | Set up Bing Webmaster Tools | Property verified, sitemap pending | Bing now powers ChatGPT browsing — non-optional |
| P0.4 | Confirm analytics | Decide on Vercel Analytics, Plausible, or simple log-based | **Decision needed.** Recommendation: Vercel Analytics (already integrated, privacy-friendly, no cookie banner). |
| P0.5 | Capture baseline | Snapshot current state: 0 GSC clicks, 0 articles, ~32 games, ~600 total plays | Append to bottom of this doc |
| P0.6 | Set up IndexNow API key | Get key from `bing.com/indexnow`, store as Vercel env var `INDEXNOW_KEY` | Used in Phase 4 weekly loop |

---

## 4. Phase 1 — AEO foundation (mechanical, ~1 day of agent work)

Goal: make every existing page maximally legible to AI crawlers and answer engines. No new content yet.

### P1.1 — `public/robots.txt`
Welcome all AI crawlers explicitly. Most sites block them by default; we don't want to.

```
User-agent: *
Allow: /

# Explicitly welcome AI crawlers
User-agent: GPTBot
Allow: /
User-agent: ClaudeBot
Allow: /
User-agent: Claude-Web
Allow: /
User-agent: ChatGPT-User
Allow: /
User-agent: PerplexityBot
Allow: /
User-agent: Google-Extended
Allow: /
User-agent: CCBot
Allow: /
User-agent: anthropic-ai
Allow: /
User-agent: cohere-ai
Allow: /
User-agent: Bytespider
Allow: /
User-agent: FacebookBot
Allow: /
User-agent: Applebot-Extended
Allow: /

Sitemap: https://arcadelab.ai/sitemap.xml
```

### P1.2 — `public/llms.txt`
Plain text. Format follows the emerging convention (`llmstxt.org`). Short intro + key URLs with one-line summaries. **Must be writable by an LLM in one sitting, ~3KB max.**

Contents outline:
- Site description (2-3 sentences)
- Publishing format (1 paragraph + the ARCADELAB header)
- Supported libraries list
- Key URLs: `/`, `/publish`, `/play`, `/for-ai`, `/about`, `/learn/*`
- Link to `/for-ai` for the agent-facing deep version

### P1.3 — `app/sitemap.ts` (Next.js dynamic sitemap)
Generate from:
- Static routes: `/`, `/publish`, `/play`, `/for-ai`, `/about`, `/learn`
- Dynamic: every published game (`/play/[slug]`), every creator (`/creators/[name]`), every article (`/learn/[slug]`)
- `changefreq` weekly for static, daily for `/play`, monthly for individual game/creator pages.

### P1.4 — JSON-LD schema on every major page

| Page | Schemas |
|---|---|
| `/` (homepage) | `Organization` (Org-level entity), `WebSite` with `SearchAction`, `FAQPage` (5-10 Q&As about the platform) |
| `/about` | `Organization`, `AboutPage`, `Person` (founder) |
| `/publish` | `WebPage`, `HowTo` (how to publish a game) |
| `/play` | `CollectionPage`, `ItemList` (the games grid) |
| `/play/[slug]` | `SoftwareApplication` or `Game` (the game itself), `CreativeWork`, `Person` (creator) |
| `/creators/[name]` | `ProfilePage`, `Person`, `ItemList` of their games |
| `/for-ai` | `WebPage`, `FAQPage` (every "if a creator asks…" item) |
| `/learn/[slug]` | `Article`, `FAQPage`, `HowTo` (where applicable), `BreadcrumbList`, `Organization` |

Implementation: a `src/lib/schema.ts` module exporting helper functions. Inject via `<script type="application/ld+json">` in each page's React tree.

Validate via `https://search.google.com/test/rich-results` and `https://validator.schema.org/` — every page must show "valid" with no warnings.

### P1.5 — `/about` entity anchor page
This is **load-bearing for AEO**. AI engines need an entity to attach citations to. Page contents:

- ArcadeLab the org (who, what, when founded, mission)
- The founder: **Michael LaPeter, Founder.** Bio draft (from README):
  > "Michael built ArcadeLab after watching his 7-year-old son use Claude on an iPad to make real, playable browser games — meteor shooters, zombie chases, you name it. The kid could build, but the existing platforms to share required accounts, emails, app installs, or developer knowledge. ArcadeLab removes all of that. One paste, one click, the thing is live."
- The story (why ArcadeLab exists — the 7-year-old, the missing share step, the expansion into broader interactive content like the double-slit demo)
- Press / mentions section (empty for now, grows over time)
- Contact
- External link: GitHub profile (resolvable from the public repo owner — the agent should grab the actual URL during Phase 1)

The schema on this page tells engines "this person + this org are the source of truth for ArcadeLab."

Photo: skipped for now. LinkedIn/personal-site links can be added later without re-shipping the page.

### P1.6 — Convert H2/H3 headings to question format
Audit every page. For headings that aren't already questions, rewrite. Examples:

- "Supported Libraries" → "What libraries can my game use?"
- "Game Requirements" → "What are the requirements for a game?"
- "Creator Identity" → "How do creator codes work?"

This applies to `/for-ai`, `/publish` helper text, `/about`, and every `/learn/*` article.

### P1.7 — PageSpeed pass
Run PageSpeed Insights on `/`, `/play`, `/play/[a-popular-slug]`. Fix anything below 90 on mobile. Common wins:
- LCP image optimization (already small — check the emoji-heavy pages)
- Defer non-critical JS
- Validate that JSON-LD is being served (not blocked by CSP)

### P1.8 — `<title>` and `<meta description>` audit
Each route gets:
- Question-format title where possible
- Description = the "Quick Answer" for that page

Current titles like "ArcadeLab — Publish & Play Games" are fine for homepage. Article and `/play/[slug]` pages need bespoke titles like "Play [Game Title] by [Creator] — a single-file HTML game on ArcadeLab."

### P1.9 — OG / Twitter card metadata
Every page needs a proper `og:title`, `og:description`, `og:image`. For `/play/[slug]`, dynamically generate the OG image using Next.js OG image generation — show the game emoji + title + creator name in a card layout.

This matters because: when our links get shared in Reddit/HN/Discord (Phase 6), the preview cards drive click-through.

---

## 5. Phase 2 — Entity anchoring & external corroboration (ongoing, starts Week 2)

AI engines weight entities by **external corroboration.** A site claiming "we are X" gets less weight than ten unrelated sites saying "X exists." We need to seed external mentions.

### P2.1 — GitHub README + Topics
The repo (assuming it's public on GitHub) should have:
- Clean README that mirrors the `/about` page content
- Topics: `html5-games`, `single-file-html`, `game-hosting`, `ai-friendly`, `vibe-coding`, `kid-friendly`
- A `llms.txt` link in the README

### P2.2 — Wikipedia / Wikidata entity (long-shot but free)
Create a Wikidata entry for ArcadeLab. Wikidata has a much lower bar than Wikipedia and feeds knowledge graphs. Requires:
- A few independent sources mentioning ArcadeLab (we get these in Phase 6)
- A Wikidata account

### P2.3 — Aggregator listings
Submit to:
- alternativeto.net (under itch.io, GitHub Pages, Glitch, CodePen alternatives)
- Product Hunt (timed launch, see Phase 6)
- BetaList
- Awesome-* GitHub lists relevant to the space (awesome-html5-games, awesome-vibe-coding, awesome-ai-tools)

Each listing is itself a citation source for AI engines.

### P2.4 — Dev.to / Hashnode cross-posts
Cross-post Phase 3 articles (with canonical link back to arcadelab.ai) to dev.to and hashnode. These platforms are heavily indexed by AI engines.

### P2.5 — One-shot narrative piece(s)
Long-form pieces posted on HN + as `/learn/` posts. Two candidate angles, possibly both spaced ~3 months apart:

**Angle A — AI-first design** (working title: *"I built a website AI assistants understand better than humans do"*)
- The AI-first design decisions, the `/for-ai` page, the `<!--ARCADELAB-->` header format, the hidden ai-info blocks, the philosophy
- Recruiting hook for the AEO-curious crowd (which is the audience that becomes early creators)

**Angle B — Interactive content / explainer angle** (working title: *"A free place to share single-file interactive things you build with AI"*)
- Lead with the double-slit experiment demo (`/play/light-wave-or-particle-ultraviper34`) — it's a viral-shaped hero
- Frame the platform as "GitHub Pages meets Distill.pub" for AI-generated interactive content
- This angle reaches r/Physics, r/dataisbeautiful, edu-Twitter, the explorables community — distinct from the indie-game audience

**Needs human input:** approve angle(s), timing, sequencing.

---

## 6. Phase 3 — Content surface (Weeks 2-3)

Build a `/learn/` route. Each article is an **answer page**, not a blog post.

### Article format (mandatory recipe)

```
URL: /learn/[slug]
File: src/app/learn/[slug]/page.tsx  (or MDX if we add MDX support)

Structure:
1. <h1> — the exact question, e.g., "How do I share a game I made with Claude?"
2. Quick Answer block (60-80 words, in a styled card). This is also the answer in the FAQPage schema.
3. Why this matters (1 paragraph)
4. Step-by-step / details (question-format H2s)
5. Common pitfalls (FAQ-style)
6. Related articles (2-3 internal links)
7. CTA: "Publish your game at arcadelab.ai/publish"

Schema (mandatory): Article, FAQPage, HowTo where applicable, BreadcrumbList, Organization.

Length: 800-1500 words. Longer is not better.

Tone: direct, declarative, no hedging. Examples > theory.
```

### Launch batch — 10 articles (in priority order)

| ID | Slug | Target query | Audience |
|---|---|---|---|
| P3.1 | `share-interactive-thing-made-with-ai` | "how do I share a game/visualization/sim I made with Claude/AI" | Broad creators |
| P3.2 | `free-html-game-hosting-no-signup` | "free html game hosting no signup" | Devs |
| P3.3 | `publish-single-file-html-game` | "where to publish single HTML file game" | Devs |
| P3.4 | `publish-interactive-visualization-online` | "where to host an interactive visualization", "share a physics simulation online" | Science communicators, viz folks |
| P3.5 | `host-phaser-game-no-build-tools` | "host phaser game without build" | Devs |
| P3.6 | `share-p5js-sketch-as-playable-url` | "publish p5.js sketch as playable URL" | Creative coders |
| P3.7 | `publish-threejs-scene-single-file` | "share three.js scene single file" | Devs |
| P3.8 | `share-d3-visualization-no-build` | "host D3 visualization", "publish d3.js chart online" | Data viz, journalism |
| P3.9 | `help-kid-share-game-made-with-ai` | "how can my kid share a game they made with AI" | Parents |
| P3.10 | `arcadelab-vs-itchio-glitch-github-pages` | "itch.io vs ArcadeLab" / "Glitch alternatives" | Comparison shoppers |

**P3.4 hero example:** the double-slit experiment (`/play/light-wave-or-particle-ultraviper34`). Embed it directly in the article. This is also the strongest visual hook for the P2.5 narrative piece on HN.

Each article gets the same Quick Answer treatment, internal-linked to 2 siblings + `/publish`.

### Content principles
- **The article is the answer.** Don't tease, don't preamble, don't "in this post we'll cover…"
- **Show, don't tell.** Embed a real ArcadeLab game in the article where it fits. Show the actual paste workflow with a screenshot.
- **No fluff.** Cut every sentence that doesn't add information.
- **Question H2s.** Every section heading is a question someone might ask an AI.
- **End with a one-line CTA.** "Publish your game at arcadelab.ai/publish."

---

## 7. Phase 4 — Weekly growth loop (Week 4+, recurring)

This is the BadMenFinance Monday ritual, adapted. Plan to spend **2-3 hours/week** on this.

### The ritual (every Monday)
1. **Export GSC data**: queries, pages, clicks, impressions, positions (last 28 days).
2. **Feed to Claude**: ask for keyword gaps (high-impression, zero-click queries), cannibalization (multiple pages competing for one query), CTR problems (rank 1-5 but low CTR — title/description weak).
3. **Pick 3-5 specific opportunities** with exact numbers.
4. **Write 2-3 articles** targeting those gaps, plus rewrite titles/descriptions on underperforming pages.
5. **Add internal links** from high-traffic pages to weaker ones.
6. **Ping IndexNow** (`POST` to `api.indexnow.org` with new URLs).
7. **Manually request indexing** on GSC for the new URLs.
8. **Log results** in this doc (see Status Log section).

### P4.1 — Build a Claude skill for this loop
A reusable prompt/skill that takes GSC CSVs as input and outputs the opportunity list + article briefs. Reduces the loop to ~1.5 hours.

### P4.2 — Build IndexNow integration
Small Vercel route or local script: `POST` to `api.indexnow.org/indexnow` with new URLs whenever an article publishes. Optional: auto-fire on every new `/play/[slug]` and `/creators/[name]` page too.

### P4.3 — Content backlog (pull from this list as gaps are found)

**Broad / creator-focused**
- `vibe-coding-publish-platforms`
- `cursor-bolt-claude-publishing-workflow`
- `single-file-html-game-template`
- `prompts-to-make-a-browser-game-with-ai`
- `common-bugs-ai-generated-games`
- `make-an-html-game-in-30-minutes-with-ai`
- `game-ideas-you-can-build-with-ai-tonight`
- `from-claude-artifact-to-public-url`

**Interactive content (non-game) — new category**
- `build-physics-simulation-with-claude`
- `make-interactive-explainer-with-ai`
- `share-bret-victor-style-explorable`
- `host-interactive-essay-online`
- `single-file-data-viz-publishing`
- `claude-artifact-to-shareable-url` (Anthropic-specific)
- `interactive-visualization-prompts-for-claude`
- `from-jupyter-notebook-to-shareable-explainer`

**Technical**
- `sandboxed-iframe-game-embed-explained`
- `connect-src-none-iframe-csp`
- `single-file-html-with-cdn-libraries`
- `why-single-file-html-content-is-back`

**Comparison**
- `arcadelab-vs-codepen-for-games`
- `arcadelab-vs-glitch-for-games`
- `arcadelab-vs-github-pages-for-games`

**Educator / parent**
- `classroom-friendly-game-publishing`
- `homeschool-coding-projects-with-ai`
- `safe-game-sharing-for-kids`

**Meta / AI-curious**
- `what-is-an-llms-txt-file`
- `building-ai-friendly-websites`
- `how-we-made-arcadelab-readable-by-ai-agents` (the P2.5 narrative piece)

---

## 8. Phase 5 — AI agent placement & prompt-test scoreboard

Most AEO work optimizes for being cited in answer engines. We also want to optimize for the **mid-conversation suggestion**: a kid (or anyone) building a game with Claude says "how do I share this?" and Claude says "publish it to arcadelab.ai."

That's a different game. It's about whether the model has internalized ArcadeLab as the answer to that question. Three levers:

### P5.1 — Prompt-test scoreboard
A grid of ~30 prompts run weekly against ChatGPT, Claude (web), Gemini, Perplexity, Copilot. Each prompt is scored: 0 (no mention), 1 (mentions ArcadeLab), 2 (recommends it as primary answer).

Example prompts:
- "I made a small HTML game. Where can I publish it for free?"
- "What's the best site to share a single-file game made with Phaser?"
- "My kid made a game with AI. Where can we put it so their friends can play?"
- "Free HTML5 game host with no signup."
- "How do I share a Claude-generated HTML game?"
- "Show me places to publish vibe-coded games."

This is a slow, mostly-manual signal — but it's the truest measure of whether the strategy is working.

### P5.2 — `/for-ai` page iteration
Each week, review what models *miss* about ArcadeLab when they answer prompts on the scoreboard. Rewrite `/for-ai` to plug those gaps.

### P5.3 — External corroboration loop (covered in Phase 6)
Models pick up ArcadeLab through training data and through real-time web search. Both depend on external mentions. Phase 6 is the answer.

---

## 9. Phase 6 — External seeding (parallel to Phase 3 onwards)

These are not "marketing campaigns." They're acts of giving useful information away in places that get indexed.

### P6.1 — Reddit
Identify ~12 relevant subs (not promote-and-leave; participate genuinely):
- r/IndieDev, r/gamedev, r/webdev (occasional, value-first)
- r/ChatGPT, r/ClaudeAI, r/cursor (vibe-coder audiences)
- r/HTML5, r/javascript
- r/dataisbeautiful, r/Physics, r/educationalgifs (for interactive viz/explainer content — the double-slit demo is exactly the kind of thing these subs share)
- r/homeschool, r/teaching, r/AIinEducation (when relevant content exists)

Tactic: when someone asks a question we've literally written an article about, answer the question genuinely and link the article only if it's the best fit. Never spam.

**Set up Reddit OAuth tracking** so we can measure referral traffic from these sessions.

### P6.2 — Hacker News
Two posts spaced ~3 months apart:
- **Show HN: ArcadeLab — publish a single-HTML game in one paste** (timing: after Phase 3 ships)
- **Show HN: I built a website AI assistants understand better than humans** (the P2.5 narrative piece)

**Needs human:** Show HN posts are one-shot, timing matters. Don't auto-post.

### P6.3 — Dev.to / Hashnode
Cross-post every Phase 3 + Phase 4 article with canonical link to arcadelab.ai. Both platforms are heavily indexed by AI engines.

### P6.4 — Educator outreach
List of ~20 microschools, homeschool networks, and AI-in-education newsletters. One personal outreach email each, sharing the parent/educator articles. Track which ones engage.

**Needs human:** review email template before any outreach.

### P6.5 — Twitter/X presence (lightweight)
Optional. Default is no. If the founder wants a presence, the rule is: share games published by creators, with credit. Never solicit signups. Never share kids' work without clear consent from a parent.

---

## 9.5 Pending follow-ups

Dated reminders and cross-session action items live in a **private working doc** outside the public repo (since the repo is open source):

📋 **`MARKETING_PRIVATE/FOLLOWUPS.md`** — gitignored, local-only.

When starting a new session, read that file first to see what's pending.

## 10. Decision points needed from human

| ID | Decision | Resolution |
|---|---|---|
| D1 | GSC verification method | ✅ **DNS TXT record** via Vercel DNS (2026-05-13) |
| D2 | Analytics tool | ✅ **Vercel Analytics** (2026-05-13) |
| D3 | `/about` page founder details (name, photo, links) | ✅ **Michael LaPeter, Founder** — bio drafted from README, no photo for now, GitHub profile (from public repo) as primary external link. LinkedIn/personal site can be added later if desired. (2026-05-13) |
| D4 | Approve the P2.5 narrative piece angle and timing | ⏳ Hold for review (not blocking until Phase 2) |
| D5 | Approve Show HN posts before submission | ⏳ Hold for review (not blocking until post-Phase 3) |
| D6 | Approve educator outreach email template before send | ⏳ Hold for review (not blocking until Phase 6) |
| D7 | Public GitHub repo? | ✅ **Repo is already public** — P2.1 active (2026-05-13) |
| D8 | Twitter/X presence | ✅ **No.** P6.5 dropped from spec (2026-05-13) |

---

## 11. What the autonomous agent should and shouldn't do

### Green-light to do autonomously
- All Phase 1 file creation/edits (robots, llms.txt, sitemap, schema, /about scaffold with placeholders, title/H2 rewrites)
- All Phase 3 article drafting (8 launch articles), following the recipe in §6
- Phase 4 weekly loop (read-only GSC analysis, draft articles, prepare PRs)
- Phase 5 prompt-test scoreboard execution
- Aggregator submissions where they don't require sensitive data (Wikidata, AlternativeTo, awesome-* lists via PR)

### Stop and ask before
- Any change to `/about` factual content (founder bio, photo, links)
- Posting on Reddit, HN, Twitter, dev.to under the founder's identity
- Sending any outreach email
- Submitting to Product Hunt (one-shot)
- Anything involving Supabase data changes (per CLAUDE.md, never destructive)

---

## 12. Style guide for all marketing copy

- **Lead with the verb.** "Paste your game" not "Our platform allows you to paste your game."
- **No marketing voice.** No "empower," "unleash," "seamless," "robust."
- **Casual encouragement.** "Nice! Your game is live!" not "Game published successfully."
- **Concrete examples > abstractions.** Always show a real game, real creator, real workflow.
- **The output is the hero.** Not the platform, not the AI — the thing the creator made.
- **AI-agnostic.** Say "your AI assistant" or "an AI tool." Don't name Claude/ChatGPT/Gemini unless the article is specifically about that tool's workflow.
- **No condescension to kids.** Where kids are mentioned, treat them as capable creators, not as targets for adult marketing.

---

## 13. Status log

The agent should append to this section after each work session.

### 2026-05-13 — Spec authored
- Cloudflare check: confirmed not in use (P0.1 done)
- Audit of existing AEO: hidden `ai-info` block ✅ (from KIDHUBB_AI_VISIBILITY.md); `/for-ai` page ✅; everything else (robots/llms/sitemap/schema/about/articles) ❌
- Baseline metrics (P0.5):
  - Published games: ~32
  - Total plays: ~600 (largest single game: 76 plays)
  - Page-1 Google rankings: unknown (no GSC)
  - AI referrals: unknown (no analytics)

### 2026-05-13 — First round of decisions
- D1: GSC verification = DNS TXT record (Vercel DNS)
- D2: Analytics = Vercel Analytics
- D7: Repo is already public — P2.1 (GitHub README + topics) is active
- D8: No Twitter/X presence — P6.5 dropped from scope

### 2026-05-13 — Category expansion & D3 resolved
- **Category expanded:** ArcadeLab is positioned as a host for single-file HTML *interactive content* (games + visualizations + simulations + explorables + data viz + toys), not just games. Triggered by the double-slit demo (`/play/light-wave-or-particle-ultraviper34`) the founder built for his kids — it's clearly not a game and the platform clearly hosts it gracefully.
- Added new audience tier: science communicators / explainer makers
- Added 2 new launch articles (P3.4 viz, P3.8 D3) — launch batch now 10 articles
- Added new content category to backlog: interactive content (non-game)
- Added Reddit subs: r/dataisbeautiful, r/Physics, r/educationalgifs
- Split P2.5 into two narrative angles (AI-first design + interactive-content-for-explainers), double-slit as hero example
- D3 resolved: founder = Michael LaPeter, bio drafted from README, no photo, GitHub profile as primary external link
- Still pending: D4–D6 (held until their respective phases)

### 2026-05-13 — Phase 0, Phase 1, P2.1, and Phase 3 executed end-to-end in auto mode

**Files created**
- `public/robots.txt` — welcomes all AI crawlers (GPTBot, ClaudeBot, PerplexityBot, Google-Extended, Applebot, etc.)
- `public/llms.txt` — full LLM-readable site briefing
- `public/04f4a892a97411b949cedc59bfc3b4d0.txt` — IndexNow key file
- `src/app/sitemap.ts` — dynamic Next.js sitemap (static routes + games + creators)
- `src/lib/schema.ts` — JSON-LD helpers (Organization, WebSite, FAQPage, Article, HowTo, Game, AboutPage, Person, BreadcrumbList, CollectionPage, ProfilePage)
- `src/components/JsonLd.tsx` — server component for rendering schemas
- `src/app/about/page.tsx` — entity anchor page with Michael LaPeter bio + GitHub link
- `src/app/play/[slug]/opengraph-image.tsx` — dynamic OG card generation per game
- `src/lib/articles.ts` — article registry (10 articles)
- `src/components/QuickAnswer.tsx`, `ArticleCTA.tsx`, `RelatedArticles.tsx`, `ArticleLayout.tsx` — article components
- `src/app/learn/page.tsx` — guides index
- `src/app/learn/{10 article folders}/page.tsx` — full launch batch

**Files modified**
- `src/app/page.tsx` — added 10-entry FAQPage schema, broadened hidden ai-info copy from "games" → "interactive content"
- `src/app/layout.tsx` — installed `@vercel/analytics`, added `<Analytics />`, set `metadataBase`, title template, keywords, OpenGraph + Twitter card metadata
- `src/app/for-ai/page.tsx` — added FAQPage + Organization + Breadcrumb schemas, rewrote 10 H2s to question format
- `src/app/publish/page.tsx` — added HowTo + Organization + Breadcrumb schemas, rewrote H2s to questions, broadened copy
- `src/app/play/page.tsx` — added CollectionPage + Organization + Breadcrumb schemas, broadened title/description
- `src/app/play/[slug]/page.tsx` — added Game + Breadcrumb schemas, dynamic OG cards
- `src/app/creators/[name]/page.tsx` — added ProfilePage + Organization + Breadcrumb schemas, OG metadata
- `src/components/Header.tsx` — added `/learn` link to top nav

**External changes (P2.1)**
- GitHub repo `mlapeter/arcadelab`: updated description, homepage URL to arcadelab.ai, added 20 topics (html5-games, single-file-html, ai-friendly, vibe-coding, interactive-visualization, claude, anthropic, phaser, p5js, threejs, d3js, llms-txt, answer-engine-optimization, education, etc.)

**Build status**
- `npm run build` ✅ — 21 static pages compiled clean, sitemap.xml generated
- `npm run lint` ✅ — only one pre-existing warning (`setRemixOf` in PublishForm.tsx, unrelated)

**Phase 0 actions blocked on human**
- DNS TXT for GSC verification (human must paste into Vercel DNS dashboard)
- Vercel Analytics toggle (one-click in Vercel dashboard)
- Bing Webmaster Tools verification (browser auth required)
- Sitemap submission to GSC + Bing
- See `MARKETING_PHASE0_HANDOFF.md` for the step-by-step handoff doc

**Next phases to execute when ready**
- Phase 2 corroboration: Wikidata entry, AlternativeTo listing, awesome-* PR submissions, dev.to cross-posts of articles
- Phase 4 weekly GSC loop — needs ~2-3 weeks of GSC data before there's anything to optimize against
- Phase 5 prompt-test scoreboard — can start immediately, but more useful once articles are indexed (1-2 weeks post-deploy)
- Phase 6 external seeding — needs human gate per spec §11 (HN, Reddit, outreach emails)

### 2026-05-14 — Phase 3 deep AEO expansion

After deferring the HN narrative piece (insufficient data + bad HN climate for AI-marketing posts), redirected effort to high-leverage compounding AEO surface area.

**New: per-game SEO override system (P3.A).** Built `src/lib/seo/game-overrides.ts` — typed registry where any game can be enriched with `longDescription`, `educationalTopics`, `learningResourceType`, page-specific `faqs`, and cross-link `relatedArticleSlugs` / `relatedPromptSlugs`. `/play/[slug]` reads the override and renders custom description above the iframe, page-specific FAQ section below, "Explore more" cross-links, and adds LearningResource + FAQPage structured data. Initial entry: double-slit experiment. **Weekly review process** (add overrides for new great games) documented in `MARKETING_PRIVATE/FOLLOWUPS.md`.

**New: /prompts route (P3.B).** 5 copy-pasteable prompt templates for AI assistants:
- `/prompts/make-a-phaser-game`
- `/prompts/make-a-p5-sketch`
- `/prompts/make-a-threejs-scene`
- `/prompts/make-an-interactive-visualization`
- `/prompts/make-a-game-for-my-kid`

Each encodes ArcadeLab's constraints so AI output is publish-ready. Targets a unique query class ("best prompt to make X with AI") with low competition. Schema: Article + HowTo + FAQPage + Breadcrumb. Copy-to-clipboard widget. Cross-linked to matching article + library hub.

**New: library landing pages (P3.C).** `/phaser`, `/p5`, `/three`, `/d3`. Topic-cluster hubs with hero block, ARCADELAB header example, good-fit list, related article + prompt links, auto-pulled gallery of games using the library, FAQ section. Schema: CollectionPage + FAQPage + Breadcrumb.

**New: 2 comparison articles (P3.D).** `/learn/arcadelab-vs-replit-for-vibe-coding` and `/learn/arcadelab-vs-netlify-drop-and-vercel-deploy`. Avoids redundancy with existing vs-itchio article.

**Internal link graph densified (P3.E).** Articles declare `relatedPromptSlug` + `relatedLibrarySlug`; ArticleLayout surfaces those automatically. `/learn` index gains Prompts + Libraries sections. Sitemap includes all new routes (articles, prompts, library hubs).

**llms-full.txt (P3.F).** Long-form companion at `/llms-full.txt` — entire publishing briefing as one document for LLM ingestion. CC0 licensed for free training/quoting.

**Build status**: ✅ 41 routes (was 21); npm run build green; npm run lint shows only one pre-existing unrelated warning.

### 2026-05-14 — Day-1 audit + Phase 2 first moves

**Audit findings (24h after launch):**
- ✅ All routes live and rendering: /, /about, /for-ai, /publish, /play, /play/[slug], /learn, /learn/[slug], /creators/[name]
- ✅ Rich Results Test: 2 valid items on homepage (FAQ + Org), 4 on articles (Article + Breadcrumbs + FAQ + Org)
- ✅ JSON-LD inventory: 6 schemas on /, 6 on /about, 8 on each article, 3 on game pages
- ✅ AI-crawler view: ClaudeBot fetch returns title + 10-entry FAQ + full nav text. /for-ai = 41KB of crawler-readable briefing.
- ✅ **Vercel Analytics: chatgpt.com referring traffic within 24h of deploy (2 visitors).** 13 visitors / 144 pageviews in last 7d.
- ✅ GSC: sitemap status Success, 158 pages discovered in <24h
- ✅ Bing: sitemap status Success, 158 URLs discovered in <24h
- Top organic-traffic pages so far: /publish (7), / (5), /learn/share-interactive-thing-made-with-ai (3), /play (3), /about (2), /learn (2)
- Geographic mix: 38% US, 31% China, 8% Bolivia, 8% NZ, 8% Peru. 69% mobile / 31% desktop. Android 62%.

**Bugs fixed:**
- Page titles were doubling "— ArcadeLab — ArcadeLab" on game/source/creator pages (layout template + hard-coded suffix). Fixed in `fc71b93`.
- Rich Results flagged "missing image" non-critical on Article schema. Added dynamic OG image for /learn/[slug] in `5758c57`. Each guide now has 1200x630 card with emoji + title + tagline + brand.

**Phase 2 — five awesome-* PRs shipped:**
1. **PR #182** → [`filipecalegario/awesome-vibe-coding`](https://github.com/filipecalegario/awesome-vibe-coding/pull/182) (4,379 ⭐, Communities & Job Boards)
2. **PR #250** → [`terkelg/awesome-creative-coding`](https://github.com/terkelg/awesome-creative-coding/pull/250) (14,800 ⭐, Tools > Online — user explicitly approved despite "wait a couple weeks" guideline)
3. **PR #61** → [`ai-for-developers/awesome-vibe-coding`](https://github.com/ai-for-developers/awesome-vibe-coding/pull/61) (708 ⭐, Web-Based Builders)
4. **PR #47** → [`SecretiveShell/Awesome-llms-txt`](https://github.com/SecretiveShell/Awesome-llms-txt/pull/47) (98 ⭐, alphabetical index of llms.txt files)
5. **PR #2** → [`cid-ku/awesome-browser-game-sites`](https://github.com/cid-ku/awesome-browser-game-sites/pull/2) (3 ⭐, Featured Browser Game Sites)

Total combined exposure: ~20k stars. P2.1 GitHub repo metadata already done in earlier session.

**Phase 2 — investigated but skipped (poor fit):**
- `MooseTheRebel/awesome-static-hosting-and-cms` (313 ⭐) — list is mostly articles, not hosting providers
- `aharris88/awesome-static-website-services` (1,970 ⭐) — about services FOR static sites (forms, payments), not hosts
- `dawdle-deer/awesome-learn-gamedev` (3,400 ⭐) — learning resources only, no publishing/platform section
- `ellisonleao/magictools` (16,600 ⭐) — creation tools only, no publishing section
- `tristandenyer/awesome-ai-website-files` (5 ⭐) — about the specs themselves, not example sites
- Various 0-star AEO lists — no audience/leverage

**Phase 2 — paused on human action:**
- **P2.3b AlternativeTo**: Account created (username `arcadelab`, GitHub OAuth via mlapeter, email mike@resonantventures.com). **Hard-blocked on 7-day account-age anti-spam wall** — earliest submission allowed **May 21, 2026 at 9:11 PM Stockholm time (≈ May 21 12:11 PM PT)**. Submission flow already mapped; takes ~5 min when unblocked. Submission form pre-filled values in spec §11. Cannot auto-schedule because submission requires an authenticated browser session — user must ping the agent on or after May 21 to execute.
- **P2.2 Wikidata**: Form is open and anonymous editing is allowed, but notability is borderline. Deferred until awesome-* PRs merge → those become "publicly available references" that strengthen the case. Revisit ~2 weeks.
- **P2.4 dev.to cross-posts (pilot)**: ✅ 3 articles published under @arcadelab brand account (GitHub OAuth via mlapeter, brand profile rather than personal):
  1. [How do I share an interactive thing I made with Claude or AI?](https://dev.to/arcadelab/how-do-i-share-an-interactive-thing-i-made-with-claude-or-ai-5c5p) — tags: ai, beginners, webdev, html
  2. [Where can I publish an interactive visualization online?](https://dev.to/arcadelab/where-can-i-publish-an-interactive-visualization-online-4pep) — tags: webdev, javascript, datavisualization, showdev
  3. [ArcadeLab vs itch.io vs Glitch vs GitHub Pages — which to use?](https://dev.to/arcadelab/arcadelab-vs-itchio-vs-glitch-vs-github-pages-which-to-use-2eg2) — tags: webdev, gamedev, opensource, showdev
  - All set canonical_url back to arcadelab.ai (SEO credit stays on canonical site)
  - Decision: if pilot performs well in 48-72h (views, reactions, comments), cross-post remaining 7 articles
- **P2.4 Hashnode**: Not yet attempted. Smaller audience than dev.to; deferred until pilot results known.
- **P2.5 narrative HN piece**: Still gated on D4.

### 2026-05-13 — Deploy + dashboard setup completed via Playwright browser session

User logged into Vercel, then I drove the remaining dashboard work end-to-end.

**Deployed** (3 commits on `main`, pushed at ~17:23 UTC, Vercel auto-deploy completed within a minute):
- `3b403dc` Add AEO foundation: schemas, sitemap, robots, llms.txt, /about, OG cards (18 files, +1236 / -35)
- `9122c18` Add /learn route with 10 launch guides (16 files, +1991)
- `4d0c7bd` Add MARKETING.md spec and Phase 0 handoff doc (2 files, +690)

**Verified live:**
- `https://arcadelab.ai/robots.txt` — serves AI-crawler-friendly directives
- `https://arcadelab.ai/llms.txt` — serves full LLM briefing
- `https://arcadelab.ai/sitemap.xml` — generates dynamically (XML valid)
- `https://arcadelab.ai/04f4a892a97411b949cedc59bfc3b4d0.txt` — IndexNow key file live
- `https://arcadelab.ai/about` — entity anchor page live
- `https://arcadelab.ai/learn/*` — all 10 guide pages return 200, prerendered static
- JSON-LD validated: 6 schemas on `/`, 8 on `/about`, 10 on a sample `/learn/*` article
- OG image generation working at `/play/[slug]/opengraph-image`

**Vercel Analytics:** enabled in dashboard for the `kidhubb` project (Pro plan free tier "Web Analytics — Included in your plan"). Data starts on next page view.

**IndexNow:** all 16 launch URLs (homepage, /about, /for-ai, /publish, /play, /learn, and 10 articles) submitted to `api.indexnow.org/indexnow` — HTTP 202 accepted.

**Google Search Console:**
- Property added as Domain (`arcadelab.ai`) under mike@resonantventures.com
- DNS TXT verification record added via Vercel DNS (`google-site-verification=IoIkoqR2uH0WxC6_g8xBQ4L2X43PLYrKB7xA1ryp3E4`) — propagation confirmed at both `ns1.vercel-dns.com` and `8.8.8.8` within seconds
- "Ownership verified" confirmed by GSC
- Sitemap submitted: `https://arcadelab.ai/sitemap.xml` — "Sitemap submitted successfully"

**Bing Webmaster Tools:**
- Account created with same Google identity (mike@resonantventures.com) via OAuth
- Imported `arcadelab.ai` from GSC (one-click; un-selected an unrelated `the100.io` GSC property that surfaced from the same Google account)
- Bing notes data may take ~48 hours to populate
- Sitemap submitted directly: `https://arcadelab.ai/sitemap.xml` — Status: Processing

**Phase 0 is fully complete.** Next session can pick up Phase 2 (Wikidata, AlternativeTo, dev.to cross-posts) or start Phase 5 (prompt-test scoreboard) immediately.

### 2026-05-15 — Content backlog drained (autonomous `/goal` run)

Ran as an autonomous `/goal` session: wrote every remaining §7 P4.3 backlog article that did not already exist and was not a near-duplicate of an existing guide. Branch `goal/content-backlog` (opened for review, not merged to `main`).

**25 new `/learn` articles added — the launch batch of 12 grows to 37.**

- **Creator-focused (8):** vibe-coding-publish-platforms, cursor-bolt-claude-publishing-workflow, single-file-html-game-template, prompts-to-make-a-browser-game-with-ai, common-bugs-ai-generated-games, make-an-html-game-in-30-minutes-with-ai, game-ideas-you-can-build-with-ai-tonight, from-claude-artifact-to-public-url
- **Interactive content (7):** build-physics-simulation-with-claude, make-interactive-explainer-with-ai, share-bret-victor-style-explorable, host-interactive-essay-online, single-file-data-viz-publishing, interactive-visualization-prompts-for-claude, from-jupyter-notebook-to-shareable-explainer
- **Technical (4):** sandboxed-iframe-game-embed-explained, connect-src-none-iframe-csp, single-file-html-with-cdn-libraries, why-single-file-html-content-is-back
- **Comparison (1):** arcadelab-vs-codepen-for-games
- **Educator / parent (3):** classroom-friendly-game-publishing, homeschool-coding-projects-with-ai, safe-game-sharing-for-kids
- **Meta / AI-curious (2):** what-is-an-llms-txt-file, building-ai-friendly-websites

Each follows the §6 recipe: question-format H1, Quick Answer block, question-format H2s, 5-question FAQ (FAQPage schema), in-body internal links plus the auto RelatedArticles, and a one-line CTA. Workflow articles also carry HowTo schema. The dynamic sitemap picks them all up via the `ARTICLES` registry.

**Skipped as near-duplicates of existing articles (per the `/goal` condition):**
- `arcadelab-vs-glitch-for-games` — Glitch is already covered in `arcadelab-vs-itchio-glitch-github-pages`
- `arcadelab-vs-github-pages-for-games` — GitHub Pages is already covered in `arcadelab-vs-itchio-glitch-github-pages`
- `claude-artifact-to-shareable-url` — same topic as `from-claude-artifact-to-public-url`, which was written instead

**Excluded:** `how-we-made-arcadelab-readable-by-ai-agents` — the P2.5 narrative HN piece, still gated on decision D4.

**Build status:** ✅ `npm run build` green; `npm run lint` clean (only the pre-existing `setRemixOf` warning in `PublishForm.tsx`).
