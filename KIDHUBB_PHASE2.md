# KidHubb — Phase 2 Planning

### Make `/for-ai` Extraordinary

The `/for-ai` page should evolve from static documentation into a **living briefing sheet** that gives any AI assistant a complete picture of what's happening on KidHubb right now. All of this is just server-rendered text on a page — no AI models, no complex APIs, no costs.

**Current jam theme (at the very top):**
- One line an AI reads immediately: "This week's KidHubb theme: UNDERWATER. Kids can make any game, but if they want inspiration, suggest an underwater theme."
- One database field, updated weekly (by you, manually for now)
- Every AI assistant that visits becomes a creative prompt delivery system

**Newest games (dynamic, server-rendered):**
- List the 5 most recent games with title, creator, description
- AI can say "I see CosmicCoder just published a space shooter — want to make something like that?"
- Just a database query on page load, rendered as plain text

**Most popular games for inspiration:**
- Top 5 by play count, same format
- AI can recommend games to play or suggest "want to see its source code and remix it?"
- Connects the source-viewing feature directly to AI discovery

**"What can kids build here" examples:**
- A few short example descriptions of real games on the platform
- "A kid made a meteor shooter using Phaser. Another made a drawing app with p5.js."
- Gives AI assistants concrete suggestions when a kid says "I want to make a game but I don't know what"
- Update occasionally by hand, or auto-generate from actual games

**Keep the existing instructions too:**
- KidHubb header format, supported libraries, game rules, publishing flow
- These move below the dynamic content — the static docs are still valuable but they're the reference section, not the headline

The result: an AI visits `/for-ai` and walks away knowing what KidHubb is, what's happening on it right now, what games exist, and exactly how to help the kid in front of them.

### Per-Game AI Context on Source Pages
- On `/play/[slug]/source`, include a hidden AI-readable block
- Contains: title, creator, libraries used, approximate complexity, and the full source code
- When a kid says "I want to remix the meteor game," their AI fetches the source page and gets everything needed
- No AI model required — the game's own code IS the context

## Features to Build

### Game Source Sharing & Remixing

**View Source page (`/play/[slug]/source`):**
- The code in a `<pre>` block with syntax highlighting (Prism.js or highlight.js via CDN)
- "Copy Code" button for pasting into AI chat
- Includes hidden AI-context block (see "Per-Game AI Context" above)
- No file tree, no line numbers, no blame view — just "here's what this game is made of"

**Remix button:**
- One button on any game page: "🔀 Remix This Game"
- Copies the game's HTML to a new entry under the current kid's account
- Title prefixed: "Remix of [original title]"
- Stores `forked_from` UUID linking back to the original
- Implementation: one new column on `games` table, one database insert

**Remix chain display:**
- On the remix: "Remixed from Meteor Shooter by CosmicCoder" (link to original)
- On the original: "🔀 3 remixes" (link to list)
- Two small queries — the remixes ARE the social layer, no comments needed

**"Made With" library badges:**
- Small badges on game pages: "Made with Phaser" "Made with p5.js"
- Pure display from existing library data in the games table
- Helps kids discover what tools exist — see a cool 3D game, notice the "Three.js" badge, tell their AI "I want to use Three.js too"

### Stars (instead of Likes)
- Rename "likes" to "stars": "⭐ 12 stars" instead of "❤️ 12 likes"
- Same implementation, different language — stars feel like GitHub (a nod of respect), likes feel like social media
- Shows on game cards and game pages

### Play Counter
- Visible play count on each game page, front and center (not hidden in metadata)
- Increment on game load (debounced to prevent refresh spam)
- Show on game cards in the browse grid too

### Creator Portfolio Page
- Simple page at `/creators/[name]`
- Shows creator's display name and their games in chronological order
- Games numbered: "Game #1", "Game #2", etc. — tells the story of a kid's creative journey
- No bio, no avatar, no settings. Just a name and their games.

### Fullscreen Game Mode
- Add a fullscreen button/icon on the game player page
- Either use Fullscreen API on the iframe, or a `?fullscreen=1` URL param that hides all nav/chrome
- Great for "show and tell" in classrooms — just the game, nothing else

### AI Difficulty/Complexity Signal (Future)
- Add optional `complexity: beginner|intermediate|advanced` field to KidHubb header
- AI assistants can use this to recommend games as inspiration for new creators
- Could also be auto-detected based on code length and library usage

### Game Jams (Future)
- Weekly or monthly creative theme at `/jam`
- AI-readable so any assistant can discover the current theme
- Kid says "let's make a game" → AI checks the jam page → suggests the theme
- Gallery of jam submissions
- Low-key, no prizes, just creative prompts

## Deliberately NOT Building (Complexity Traps)

These seem cool but add too much code for too little value:

- **Version history / diffs** — kids don't care about v3 vs v4. Overwrite to update. One game, one version.
- **Comments / discussions** — social feature creep. The remix chain IS the conversation.
- **Collections / playlists** — new data model + UI for marginal discovery benefit. Homepage sort + creator pages cover 90%.
- **Tags / categories** — library badges + future jam themes provide enough categorization.
- **Following creators** — gateway to social media. Leads to feeds, notifications, then you're building Twitter for kids. Creator page bookmarks are enough.

## Design Principles (Protect These)

- **No real accounts.** Creator codes are signatures, not logins.
- **No social features.** No comments, followers, DMs. Play counts and stars yes, competition no.
- **No monetization.** Free, no ads, no premium tiers. Maybe a "support" page someday.
- **Embrace the document web.** Every game is a single HTML file. Viewable, inspectable, learnable.
- **AI-first publishing.** The site is designed to be read by AI assistants, not just humans.
- **Simplicity is the feature.** Resist complexity at every turn.
- **80/20 rule.** Find the 20% of code that delivers 80% of the awesomeness. If a feature needs more than ~50 lines, question whether it's worth it.
- **Open source friendly.** This codebase should be readable and learnable. No AI slop, no unnecessary abstractions, no over-engineering.
