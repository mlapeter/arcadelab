# goal/seamless-identity — running notes

(Gitignored — local only. Previous goal's notes: GOAL_NOTES_scale-up-archive.md.)

## Status: IN PROGRESS (started 2026-06-11)

## Architecture decisions

### Shared detector (WS1a) — extend src/lib/creator-codes.ts
- Export ADJECTIVES/NOUNS (currently private). Code shape: ADJ-NOUN-NOUN-NN (10-99).
- New exports: `findCreatorCodes(text)` → {code, valid, suggestion?}[];
  `isCreatorCodeMessage(text)` (moves from safety.ts, now word-list-validated);
  `scrubCreatorCodes(text)` for titles/descriptions; edit-dist-1/word suggestions.
- Must stay client-safe (pure, no supabase import) — PublishForm imports it.
- safety.ts re-exports / delegates to it; old narrow regex replaced.

### Identity resolution priority (WS1c)
Authorization bearer > body.creator_code > header creator_code (web form: header > localStorage).
Server (POST /api/games) ALWAYS strips `creator_code:` line from html before storing —
regardless of how identity was resolved. Web form already strips whole header client-side;
API publishes keep header in stored html (existing behavior) minus the creator_code line.
Title/description scrubbed of any valid code-shaped token (1d).

### "Retire the empty account" (WS1b)
When signed-in account A has 0 games and kid pastes code for B: just switch local identity
to B. Row A stays orphaned in DB — harmless, zero code. That IS retirement.
If A has games: still offer sign-in (switching is reversible by pasting A's code back);
merge proposals (WS2c) handle the both-have-games case via admin.

### New tables (ONE migration file, owner applies manually; code degrades gracefully)
- `appeals` (id, contact TEXT [game url or code], message TEXT, status open/resolved, created_at)
- `moderation_decisions` (id, kind, game_id, creator_id, data JSONB, status done/pending/reversed, created_at)
  kinds: remove, ban, hide, report_dismiss, merge_proposal, ip_flag, fingerprint_hide
- `scam_fingerprints` (id, fingerprint TEXT UNIQUE, source_game_id, created_at)
- `creators.register_ip_hash TEXT` (for WS2b 7-day same-IP suggestion)
Graceful degradation: all inserts/selects on new tables wrapped, errors swallowed
(register insert: retry without register_ip_hash on column-missing error).

### Moderation v2 (WS3)
- One enriched Haiku call: account age, prior game count, quality history, link facts
  (internal/own-game), code facts (whose codes appear). Deterministic facts computed first.
- Hard rules in applyModeration:
  - own-code-only payload or own-play-links → never scam action
  - auto-remove+ban ONLY IF: new account (<3 prior safe games) AND scam conf ≥ 0.85
    AND sonnet-4-6 second opinion agrees (both verdicts logged in moderation JSON)
  - established (3+ safe games): worst case shadow-hide + queue
- Report → immediate enriched re-review; high-conf safe → auto-dismiss + log; 3-report backstop stays.
- Admin remove/ban → store normalized fingerprint (lowercase, strip digits+whitespace, sha256).
  New submissions matching → auto-hide pre-AI + decision log; same-IP creators get ip_flag
  decision rows (never auto-banned).
- Fingerprint normalization strips digits so code/amount variants still match.

### Admin (WS3g) — decisions feed
Newest-first feed from moderation_decisions + appeals; pending items (merge proposals,
hidden-queue games, open appeals) pinned top. One-click reverse per kind. Old game-queue
view logic folded in. Merge action: move games A→B, log moved ids for unmerge.

### /my/{CODE} (WS2d)
Prototype route only. NOT offering "send this to yourself" on success screen pending
risk assessment — leaning HOLD: prod incident showed kids paste/publish their code
publicly; a sign-in *link* makes that worse (one tap = full account takeover).

### Dev/test
- Dev server port 3005 (3000/3001 are Mike's other apps).
- Prod Supabase is live data: reads fine, writes only via normal app flows with
  throwaway games, cleaned up after. Never bulk writes.
- 5 real removed scams in prod: query games where status=removed + flag_reason like ai:%
  (read-only) for regression material.

## Known from previous goal (still relevant)
- TWO live games leak real creator codes (Mike to remove via /admin):
  my-arcadelab-creator-code-is-goofy-viper-quantumotter56 (GOOFY-VIPER-BLADE-14)
  my-arcadelab-creator-code-is-bold-captai-goldenraven78 (BOLD-CAPTAIN-GADGET-64)
  → these are exactly the incident class this goal fixes.
- Test creator from last goal: DriftPhoenix52 (empty, harmless).

## Progress log
- 2026-06-11: branch created, codebase mapped, tasks #1-#10 created. Starting core module.
- 2026-06-11: all workstreams implemented (commits b84a780, e95c171, bb90fe4, fd155bd, a0a7181).
- Permission classifier blocked BOTH `supabase start` (local stack) and the overlay-proxy
  harness → table-dependent features could NOT be live-tested pre-migration. Tested
  graceful degradation live instead; logic verified by review + types.

## VERIFIED LIVE (dev :3005 against prod, throwaways deleted after)
- Header creator_code → publishes as that creator; stored game_content, /api/render,
  /source ALL provably free of the code; rest of header retained.
- Code-paste (bare + reminder message) → "Sign in as {name}?" one-tap works 375+1280.
- Typo'd code (GOLDEN-RIDER-BLAD-96) → "Did you mean GOLDEN-RIDER-BLADE-96?" works.
- Empty-account adoption: silent switch verified. With-games switch shows
  "your games stay safe" reassurance.
- Own-code game content → Haiku verdict safe@0.95 ("self-reference, not phishing"),
  creator NOT banned. Incident class fixed at model level + deterministic override layer.
- Mock gift-card scam, fresh account → haiku scam@0.99 + sonnet second opinion 0.99
  → removed + banned, both verdicts in moderation JSON. True positives intact.
- Report on safe game → re-review safe@0.95 → reports resolved, count reset, note logged.
- Regression vs ALL removed prod games (read-only via classifyGame): 1 true scam
  (apple gift card) STILL removes (sonnet agrees); all 8 false-positive-class items
  (own-code messages, self-links) now safe or worst-case shadow-hide. 
- Register works pre-migration (missing-column retry path exercised on every register).
- /appeal: degraded "warming up" message kind, zero console errors. Banned 403 → linkified
  /appeal in error box. Removed game page → friendly + appeal link; missing slug still 404.
- /my/{CODE} signs in / fails kindly. /admin renders feed sections degraded, no crash.
- Full new-kid journey (paste → auto-account → welcome → publish → success) 375px clean.
- lint, tsc, build all clean.

## NOT live-testable until migration applied (logic reviewed, degradation verified):
second-account-same-IP prompt; appeal row → /admin feed; merge proposals + merge/unmerge;
fingerprint auto-hide; ip_flag; decision feed rows. → post-migration checklist in summary.

## Found during verification (fixed)
- verify 404 / appeals 4xx-5xx logged browser console errors → expected outcomes now 200+{error}.
- Rate limiter shares one per-IP bucket ACROSS routes → appeal's 3/10min budget was being
  eaten by publishes; scoped key "appeal:{ip}".

## Prod leftovers (harmless, note for Mike)
- Empty throwaway creators: AtomicCaptain35, FrozenBuilder99, PixelKoala52,
  BlazingFlare48 (banned — was the mock scam account).
- BraveStar71 (TINY-BLADE-PLANET-25) still BANNED in prod for publishing their OWN code
  message — incident victim, recommend unban via /admin approve.
