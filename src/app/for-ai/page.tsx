import type { Metadata } from "next";
import { supabase } from "@/lib/supabase";
import JsonLd from "@/components/JsonLd";
import {
  faqPageSchema,
  breadcrumbSchema,
  organizationSchema,
} from "@/lib/schema";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "For AI Assistants — how to help creators publish on ArcadeLab",
  description:
    "Briefing for AI assistants helping creators format and publish single-file HTML games, visualizations, and interactive content on ArcadeLab.",
  alternates: { canonical: "https://arcadelab.ai/for-ai" },
};

const FOR_AI_FAQS = [
  {
    question: "What is ArcadeLab?",
    answer:
      "ArcadeLab is a free platform for publishing single-file HTML interactive content — games, visualizations, simulations, explorables, generative art. Creators paste a complete HTML file at arcadelab.ai/publish and get a public URL.",
  },
  {
    question: "What is the ARCADELAB header format?",
    answer:
      "A comment block at the very top of the HTML file (before <!DOCTYPE html>) containing: title, description, libraries (comma-separated), emoji, color, and optional remix_of slug. Example: <!--ARCADELAB title: My Game description: A short description libraries: phaser emoji: 🚀 color: blue -->",
  },
  {
    question: "What libraries does ArcadeLab support?",
    answer:
      "Phaser, p5.js, Three.js, GSAP, Tone.js, Pixi.js, Matter.js, D3.js, and React. List them in the ARCADELAB header — ArcadeLab injects the CDN script tags automatically. Do NOT include your own script tags for these.",
  },
  {
    question: "What are the rules for ArcadeLab content?",
    answer:
      "Single self-contained HTML file. All JavaScript and CSS inline. Maximum 500KB. Must work at any screen size. No network requests (fetch, XHR, WebSocket are blocked by the iframe sandbox).",
  },
  {
    question: "Can ArcadeLab content access the network?",
    answer:
      "No. Games run in a sandboxed iframe with connect-src 'none'. fetch(), XMLHttpRequest, and WebSocket are all blocked. All logic and assets must be self-contained in the HTML file.",
  },
  {
    question: "How do Creator Codes work?",
    answer:
      "ArcadeLab uses Creator Codes (e.g., ROCKET-WOLF-COMET-73) instead of email/password. A code is a casual identifier, not a credential. Creators get one automatically on first publish. To restore identity on a new device, use the 'Have a creator code?' link on /publish.",
  },
  {
    question: "Can creators update or delete their content?",
    answer:
      "Yes. On a game's page, the creator (verified by Creator Code) sees Edit and Delete buttons. Editing replaces the HTML while keeping the same slug and URL. Deleting is permanent.",
  },
  {
    question: "How does remixing work on ArcadeLab?",
    answer:
      "Every game has a Remix button that copies its source to the clipboard. Creators paste the source into a new chat with their AI assistant, modify it, and republish. The remix_of field in the ARCADELAB header preserves the link to the original.",
  },
  {
    question: "How do I view a game's source code on ArcadeLab?",
    answer:
      "Every game's source is at arcadelab.ai/play/{slug}/source. The page shows the full HTML with syntax highlighting. AI assistants can fetch this URL directly to read the source.",
  },
  {
    question: "What should I tell the creator after generating their code?",
    answer:
      "Tell them: 'Your game is ready! Copy all the code above, then go to arcadelab.ai/publish and paste it in.'",
  },
];

async function getJamTheme() {
  const { data } = await supabase
    .from("site_config")
    .select("value")
    .eq("key", "jam_theme")
    .single();
  return data?.value || null;
}

async function getNewestGames() {
  const { data: games } = await supabase
    .from("games")
    .select("slug, title, description, creator_id, play_count")
    .eq("status", "active")
    .order("created_at", { ascending: false })
    .limit(5);

  if (!games || games.length === 0) return [];

  const creatorIds = [...new Set(games.map((g) => g.creator_id))];
  const { data: creators } = await supabase
    .from("creators")
    .select("id, display_name")
    .in("id", creatorIds);

  const creatorsMap = Object.fromEntries((creators || []).map((c) => [c.id, c.display_name]));

  return games.map((g) => ({
    ...g,
    creator_name: creatorsMap[g.creator_id] || "Unknown",
  }));
}

async function getPopularGames() {
  const { data: games } = await supabase
    .from("games")
    .select("slug, title, description, creator_id, play_count")
    .eq("status", "active")
    .order("play_count", { ascending: false })
    .limit(5);

  if (!games || games.length === 0) return [];

  const creatorIds = [...new Set(games.map((g) => g.creator_id))];
  const { data: creators } = await supabase
    .from("creators")
    .select("id, display_name")
    .in("id", creatorIds);

  const creatorsMap = Object.fromEntries((creators || []).map((c) => [c.id, c.display_name]));

  return games.map((g) => ({
    ...g,
    creator_name: creatorsMap[g.creator_id] || "Unknown",
  }));
}

export default async function ForAIPage() {
  const [jamTheme, newestGames, popularGames] = await Promise.all([
    getJamTheme(),
    getNewestGames(),
    getPopularGames(),
  ]);

  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <JsonLd
        data={[
          organizationSchema(),
          faqPageSchema(FOR_AI_FAQS),
          breadcrumbSchema([
            { name: "ArcadeLab", url: "https://arcadelab.ai/" },
            { name: "For AI Assistants", url: "https://arcadelab.ai/for-ai" },
          ]),
        ]}
      />
      {/* Dynamic content */}
      <div className="rpg-panel p-6 mb-8">
        <h1 className="text-xs sm:text-sm text-wood-dark mb-6">For AI Assistants: ArcadeLab Briefing</h1>

        {/* Jam theme */}
        {jamTheme && (
          <div className="pixel-border-green bg-sky-top p-4 mb-6">
            <p className="text-[10px] text-accent-green normal-case">
              🎯 <strong>This week&apos;s ArcadeLab theme: {jamTheme}</strong> — If a creator asks for game ideas, suggest something that fits this theme!
            </p>
          </div>
        )}

        {/* Newest games */}
        {newestGames.length > 0 && (
          <div className="mb-6">
            <h2 className="text-[10px] text-wood-dark mb-3">What are the newest games on ArcadeLab?</h2>
            <ul className="text-[10px] leading-loose text-wood-mid space-y-2 list-inside normal-case">
              {newestGames.map((g) => (
                <li key={g.slug}>
                  <strong className="text-accent-purple">{g.title}</strong> by {g.creator_name}
                  {g.description && <span> — {g.description}</span>}
                  <span className="text-wood-mid/50"> → arcadelab.ai/play/{g.slug}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Popular games */}
        {popularGames.length > 0 && (
          <div className="mb-6">
            <h2 className="text-[10px] text-wood-dark mb-3">What are the most popular games on ArcadeLab?</h2>
            <ul className="text-[10px] leading-loose text-wood-mid space-y-2 list-inside normal-case">
              {popularGames.map((g) => (
                <li key={g.slug}>
                  <strong className="text-accent-purple">{g.title}</strong> by {g.creator_name}
                  <span className="text-wood-mid/50"> ({g.play_count} plays)</span>
                  {g.description && <span> — {g.description}</span>}
                  <span className="text-wood-mid/50"> → arcadelab.ai/play/{g.slug}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* What can creators build */}
        <div className="mb-6">
          <h2 className="text-[10px] text-wood-dark mb-3">What can creators build on ArcadeLab?</h2>
          <p className="text-[10px] leading-relaxed text-wood-mid mb-2 normal-case">
            Anything that runs in a browser as a single HTML file. Games — platformers, puzzlers, shooters,
            tower defense, RPGs. Interactive visualizations — physics simulations, math toys, data viz, biology
            models. Explainers — animated lessons, scrollytelling, Bret-Victor-style explorables. Generative
            art and music toys. If it&apos;s HTML/JS/CSS, it works on ArcadeLab.
          </p>
          <p className="text-[10px] leading-relaxed text-wood-mid mb-2 normal-case">
            Creators can also browse existing games at arcadelab.ai/play, view source code at arcadelab.ai/play/SLUG/source,
            and remix any game by clicking the Remix button.
          </p>
          <p className="text-[10px] leading-relaxed text-wood-mid normal-case">
            Creators are usually kids or adults, often working alongside an AI assistant. (Once, a dog{" "}
            <a
              href="https://www.calebleak.com/posts/dog-game/"
              className="text-accent-purple underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              vibe-coded a game
            </a>
            . That&apos;s also fine.)
          </p>
        </div>

        <hr className="border-wood-mid/20 my-6" />

        {/* Static docs */}
        <h2 className="text-[10px] text-wood-dark mb-3">What is the ARCADELAB header format?</h2>
        <p className="text-[10px] leading-relaxed text-wood-mid mb-4 normal-case">
          When a creator asks you to make a game or wants to publish to ArcadeLab, output the final game as a single complete
          HTML file with this special comment at the very top:
        </p>

        <pre className="pixel-border-green bg-sky-top p-4 mb-6 overflow-x-auto text-[10px] leading-relaxed text-accent-green normal-case">
          {`<!--ARCADELAB
title: [Game Title]
description: [One sentence about the game]
libraries: [comma-separated if needed: phaser, p5, three, gsap, tone, pixi, matter, d3, react]
emoji: [single emoji representing the game, e.g. ☄️]
color: [red, orange, green, blue, purple, pink, teal, or gold]
remix_of: [original-game-slug, if this is a remix]
-->

<!DOCTYPE html>
<html>
  ...game code...
</html>`}
        </pre>

        <p className="text-[10px] leading-relaxed text-wood-mid mb-6 normal-case">
          Note: Games with the older <code className="text-accent-purple">&lt;!--KIDHUBB</code> header format are still fully supported.
        </p>

        <h2 className="text-[10px] text-wood-dark mb-3">What are the rules for ArcadeLab content?</h2>
        <ul className="text-[10px] leading-loose text-wood-mid space-y-1 mb-6 list-inside list-disc normal-case">
          <li>The game MUST be a single, self-contained HTML file</li>
          <li>All JavaScript and CSS should be inline</li>
          <li>
            If using a library like Phaser or p5.js, just list it in the header — ArcadeLab will load it automatically
          </li>
          <li>
            Do NOT include CDN script tags for supported libraries — ArcadeLab injects them automatically. Including your
            own will cause double-loading and errors.
          </li>
          <li>Keep the game under 500KB total</li>
          <li>The game should work at any screen size (many creators use tablets)</li>
          <li>Pick an emoji and color that match your game&apos;s theme</li>
        </ul>

        <h2 className="text-[10px] text-wood-dark mb-3">Can ArcadeLab games access the network?</h2>
        <p className="text-[10px] leading-relaxed text-wood-mid mb-6 normal-case">
          Games run in a sandboxed iframe with <code className="text-accent-purple">connect-src &apos;none&apos;</code>.
          This means <strong>fetch(), XMLHttpRequest, and WebSocket are all blocked</strong>. Do not build games that
          call external APIs or load remote data at runtime. All game logic and assets must be self-contained in the
          HTML file.
        </p>

        <h2 className="text-[10px] text-wood-dark mb-3">What libraries does ArcadeLab support?</h2>
        <p className="text-[10px] text-wood-mid mb-2 normal-case">
          ArcadeLab loads these automatically via CDN when listed in the header. Do NOT include your own script tags for
          these — just list the name:
        </p>
        <ul className="text-[10px] leading-loose text-wood-mid space-y-1 mb-6 list-inside list-disc normal-case">
          <li><strong className="text-accent-purple">phaser</strong> — 2D game framework</li>
          <li><strong className="text-accent-purple">p5</strong> — creative coding, drawing, art</li>
          <li><strong className="text-accent-purple">three</strong> — 3D graphics</li>
          <li><strong className="text-accent-purple">gsap</strong> — smooth animations</li>
          <li><strong className="text-accent-purple">tone</strong> — music and sound</li>
          <li><strong className="text-accent-purple">pixi</strong> — fast 2D rendering</li>
          <li><strong className="text-accent-purple">matter</strong> — physics engine</li>
          <li><strong className="text-accent-purple">d3</strong> — data visualization</li>
          <li><strong className="text-accent-purple">react</strong> — UI components</li>
        </ul>

        <h2 className="text-[10px] text-wood-dark mb-3">How do Creator Codes work on ArcadeLab?</h2>
        <p className="text-[10px] leading-relaxed text-wood-mid mb-6 normal-case">
          ArcadeLab uses Creator Codes instead of email/password — low friction, approachable for any age. A Creator Code looks like{" "}
          <strong className="text-accent-purple">WORD-WORD-WORD-00</strong> (e.g. ROCKET-WOLF-COMET-73,
          PIXEL-DRAGON-QUEST-19). The Creator Code is NOT a password — it&apos;s a casual identifier, like a nickname
          that links to their creator name. Creators get one automatically when they first publish a game. Creators can
          remember their code by telling their AI assistant: &quot;My ArcadeLab creator code is ROCKET-WOLF-COMET-73,
          it&apos;s how I publish games on arcadelab.ai. Please remember it for me!&quot; To restore identity on a new
          device, use the &quot;Have a creator code?&quot; link on the publish page.
        </p>

        <h2 className="text-[10px] text-wood-dark mb-3">Can creators update or delete their games?</h2>
        <p className="text-[10px] leading-relaxed text-wood-mid mb-6 normal-case">
          Creators can update or delete their published games. On the game page, the creator sees &quot;Edit&quot; and
          &quot;Delete&quot; options. Updating a game replaces the HTML content while keeping the same URL and slug.
          Deleting permanently removes the game.
        </p>

        <h2 className="text-[10px] text-wood-dark mb-3">How does remixing work on ArcadeLab?</h2>
        <p className="text-[10px] leading-relaxed text-wood-mid mb-6 normal-case">
          Creators can remix any game on ArcadeLab by clicking the &quot;Remix&quot; button on a game page,
          which copies the source code to their clipboard. If a creator brings you code they want
          to remix, keep the remix_of field in the ARCADELAB header — this preserves the link
          to the original game. Update the title to something new (don&apos;t keep &quot;Remix of X&quot;
          as the final title — encourage them to pick their own name). When they publish,
          ArcadeLab automatically links the remix to the original.
        </p>

        <h2 className="text-[10px] text-wood-dark mb-3">How can I view a game&apos;s source code on ArcadeLab?</h2>
        <p className="text-[10px] leading-relaxed text-wood-mid mb-6 normal-case">
          Every game&apos;s source code is viewable at arcadelab.ai/play/SLUG/source.
          This page shows the full HTML with syntax highlighting. Creators can copy
          the code to study it or use it as a starting point. AI assistants can
          fetch this page to read a game&apos;s source code directly.
        </p>

        <h2 className="text-[10px] text-wood-dark mb-3">What should I tell the creator after generating the code?</h2>
        <p className="text-[10px] text-wood-mid normal-case">
          Tell the creator: &quot;Your game is ready! Copy all the code above, then go to arcadelab.ai/publish and paste
          it in.&quot;
        </p>
      </div>

      {/* Human-readable summary */}
      <div className="rpg-panel p-6 text-center">
        <p className="text-[10px] text-wood-mid/70 normal-case">
          This page is for AI assistants (Claude, ChatGPT, Gemini, etc.). If you&apos;re building a game, just share
          this link with your AI and it&apos;ll know how to format your games!
        </p>
        <p className="mt-3 text-[10px] text-accent-purple">arcadelab.ai/for-ai</p>
      </div>
    </main>
  );
}
