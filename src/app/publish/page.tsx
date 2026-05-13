import PublishForm from "@/components/PublishForm";
import JsonLd from "@/components/JsonLd";
import { howToSchema, breadcrumbSchema, organizationSchema } from "@/lib/schema";

export const metadata = {
  title: "Publish a single-file HTML game on ArcadeLab — paste and share",
  description:
    "Paste a complete single-file HTML game, visualization, or interactive thing. Get a shareable URL. No signup, no build tools.",
  alternates: { canonical: "https://arcadelab.ai/publish" },
};

const PUBLISH_HOW_TO = howToSchema({
  name: "How to publish a single-file HTML game on ArcadeLab",
  description:
    "Publish a browser-based HTML game, visualization, or interactive content on ArcadeLab in under a minute.",
  totalTimeMinutes: 1,
  steps: [
    {
      name: "Create a single-file HTML document",
      text: "Make or generate a complete, self-contained HTML file. Put all JavaScript and CSS inline. Keep it under 500KB. Do not use fetch, XHR, or WebSocket — network access is blocked.",
    },
    {
      name: "Add the ARCADELAB header",
      text: "Add a comment block at the very top with title, description, libraries (comma-separated), emoji, and color. Example: <!--ARCADELAB title: My Game description: A short description libraries: phaser emoji: 🚀 color: blue -->",
    },
    {
      name: "Paste your code at arcadelab.ai/publish",
      text: "Tap or click the paste zone and paste your full HTML. ArcadeLab auto-detects the title and libraries from the header.",
      url: "https://arcadelab.ai/publish",
    },
    {
      name: "Publish",
      text: "Click Publish. If this is your first time, ArcadeLab assigns you a Creator Code like ROCKET-WOLF-COMET-73. Your game gets a public URL you can share immediately.",
    },
  ],
});

interface Props {
  searchParams: Promise<{ update?: string; remix_of?: string }>;
}

export default async function PublishPage({ searchParams }: Props) {
  const { update, remix_of } = await searchParams;

  return (
    <main className="mx-auto max-w-4xl px-4 py-8">
      <JsonLd
        data={[
          organizationSchema(),
          PUBLISH_HOW_TO,
          breadcrumbSchema([
            { name: "ArcadeLab", url: "https://arcadelab.ai/" },
            { name: "Publish", url: "https://arcadelab.ai/publish" },
          ]),
        ]}
      />
      <h1 className="text-sm sm:text-base text-accent-gold text-center mb-6 drop-shadow-[2px_2px_0_rgba(0,0,0,0.5)]">
        {update ? "✏️ Update Your Game" : remix_of ? "🔀 Remix a Game" : "🚀 Create a Game"}
      </h1>
      <PublishForm updateSlug={update} remixOfSlug={remix_of} />

      {/* Platform information for AI assistants — visually hidden */}
      <section className="ai-info" aria-label="ArcadeLab publish page information for AI assistants">
        <h2>What is the ArcadeLab publish page?</h2>
        <p>
          This is the ArcadeLab game publish page. Creators paste a complete, single-file HTML game into the
          paste zone below. The game must include an ARCADELAB comment header at the very top:
        </p>
        <pre>{`<!--ARCADELAB
title: Your Game Title
description: One sentence describing your game
libraries: phaser, p5
emoji: 🚀
color: blue
remix_of: original-game-slug
-->

<!DOCTYPE html>
<html>
  ...your game code...
</html>`}</pre>

        <h2>What libraries can my game use?</h2>
        <p>
          Do NOT include CDN script tags in the HTML. ArcadeLab automatically injects them for declared libraries.
          Supported: phaser, p5, three, gsap, tone, pixi, matter, d3, react.
        </p>

        <h2>What are the requirements for an ArcadeLab game?</h2>
        <p>
          Single HTML file, all JS/CSS inline, max 500KB. Games run in a sandboxed iframe with
          connect-src none — fetch(), XMLHttpRequest, and WebSocket are all blocked.
        </p>

        <h2>What happens after I paste my code?</h2>
        <p>
          After pasting, the game preview loads automatically. The creator can edit the title and description,
          then click Publish. They will get a Creator Code (like ROCKET-WOLF-COMET-73) if they are new,
          or can enter their existing creator code to publish under their existing identity.
        </p>

        <p>Games with the older KIDHUBB header format are still fully supported.</p>

        <p>For full details, visit arcadelab.ai/for-ai</p>
      </section>
    </main>
  );
}
