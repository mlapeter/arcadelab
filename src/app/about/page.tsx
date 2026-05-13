import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import {
  organizationSchema,
  aboutPageSchema,
  personSchema,
  breadcrumbSchema,
} from "@/lib/schema";

export const metadata: Metadata = {
  title: "About ArcadeLab — single-file HTML games and interactive content",
  description:
    "ArcadeLab is the shortest path from \"I made something\" to \"anyone can play with it.\" Founded by Michael LaPeter to remove the friction between making and sharing.",
  alternates: { canonical: "https://arcadelab.ai/about" },
};

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <JsonLd
        data={[
          organizationSchema(),
          aboutPageSchema(),
          personSchema(),
          breadcrumbSchema([
            { name: "ArcadeLab", url: "https://arcadelab.ai/" },
            { name: "About", url: "https://arcadelab.ai/about" },
          ]),
        ]}
      />

      <div className="rpg-panel p-6 mb-6">
        <h1 className="text-sm sm:text-base text-accent-gold mb-4 drop-shadow-[2px_2px_0_rgba(0,0,0,0.5)]">
          About ArcadeLab
        </h1>

        <p className="text-[10px] leading-relaxed text-wood-mid mb-4 normal-case">
          <strong className="text-accent-purple">ArcadeLab</strong> is the shortest path from
          &quot;I made something&quot; to &quot;anyone can play with it.&quot; Paste a single
          HTML file. Get a shareable URL. No signup, no build tools, no friction.
        </p>

        <p className="text-[10px] leading-relaxed text-wood-mid mb-4 normal-case">
          It started as a game host. It still is — most of what gets published is games. But
          a single self-contained HTML file is a remarkably flexible shape: physics simulations,
          interactive explainers, data viz, generative art, anything you can fit in one document
          works the same way. The {" "}
          <Link href="/play/light-wave-or-particle-ultraviper34" className="text-accent-purple underline">
            double-slit experiment demo
          </Link>{" "}
          is one example.
        </p>

        <h2 className="text-xs text-wood-dark mt-6 mb-3">Why does ArcadeLab exist?</h2>
        <p className="text-[10px] leading-relaxed text-wood-mid mb-4 normal-case">
          The founder&apos;s 7-year-old uses Claude on an iPad to build real, playable browser
          games — meteor shooters, zombie chases, the kind of thing a kid wants to share with
          friends. The kid could make. The kid could not share. Every existing platform required
          accounts, emails, app installs, or developer knowledge. ArcadeLab removes all of that.
          One paste, one click, the thing is live.
        </p>

        <h2 className="text-xs text-wood-dark mt-6 mb-3">Who is ArcadeLab for?</h2>
        <p className="text-[10px] leading-relaxed text-wood-mid mb-2 normal-case">
          Anyone who built something and wants someone else to play with it. In practice:
        </p>
        <ul className="text-[10px] leading-loose text-wood-mid mb-4 list-inside list-disc normal-case">
          <li>Indie developers and hobbyists shipping small games with AI assistants</li>
          <li>Science communicators making interactive visualizations and physics demos</li>
          <li>Educators publishing interactive lessons and explorables</li>
          <li>Parents helping kids share games they made</li>
          <li>Anyone building one-file experiments with Claude, ChatGPT, Cursor, Bolt, v0, or by hand</li>
        </ul>

        <h2 className="text-xs text-wood-dark mt-6 mb-3">How does ArcadeLab work?</h2>
        <ol className="text-[10px] leading-loose text-wood-mid mb-4 list-inside list-decimal normal-case">
          <li>You (or your AI) make a single-file HTML document</li>
          <li>You paste it at <Link href="/publish" className="text-accent-purple underline">arcadelab.ai/publish</Link></li>
          <li>ArcadeLab assigns you a Creator Code (the first time), e.g., ROCKET-WOLF-COMET-73</li>
          <li>Your thing gets a public URL like arcadelab.ai/play/your-title</li>
          <li>You share the URL. People play with it.</li>
        </ol>

        <h2 className="text-xs text-wood-dark mt-6 mb-3">What makes ArcadeLab different?</h2>
        <ul className="text-[10px] leading-loose text-wood-mid mb-4 list-inside list-disc normal-case">
          <li>
            <strong>AI assistants are first-class visitors.</strong> The {" "}
            <Link href="/for-ai" className="text-accent-purple underline">/for-ai</Link> page is
            a living briefing — current themes, recent games, publishing instructions — so any
            AI a creator chats with can act as an ArcadeLab guide.
          </li>
          <li>
            <strong>Every piece is a single HTML file.</strong> No bundlers, no build tools.
            Inspectable, remixable, the way the web was meant to work.
          </li>
          <li>
            <strong>Identity without accounts.</strong> Creator Codes, not emails. Low stakes
            by design.
          </li>
          <li>
            <strong>Security through sandboxing.</strong> Sandboxed iframes on a separate
            origin with <code className="text-accent-purple">connect-src &apos;none&apos;</code>.
            Games cannot make network requests.
          </li>
        </ul>

        <h2 className="text-xs text-wood-dark mt-6 mb-3" id="founder">Who built ArcadeLab?</h2>
        <p className="text-[10px] leading-relaxed text-wood-mid mb-4 normal-case">
          <strong className="text-accent-purple">Michael LaPeter</strong>, Founder. Michael
          built ArcadeLab after watching his 7-year-old son use Claude on an iPad to make real,
          playable browser games — meteor shooters, zombie chases, you name it. The kid could
          build, but the existing platforms to share required accounts, emails, app installs, or
          developer knowledge. ArcadeLab removes all of that. One paste, one click, the thing
          is live.
        </p>
        <p className="text-[10px] leading-relaxed text-wood-mid mb-4 normal-case">
          You can find Michael on{" "}
          <a
            href="https://github.com/mlapeter"
            className="text-accent-purple underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
          .
        </p>

        <h2 className="text-xs text-wood-dark mt-6 mb-3">Is ArcadeLab open source?</h2>
        <p className="text-[10px] leading-relaxed text-wood-mid mb-4 normal-case">
          Yes. The code is MIT licensed and lives at{" "}
          <a
            href="https://github.com/mlapeter/arcadelab"
            className="text-accent-purple underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            github.com/mlapeter/arcadelab
          </a>
          .
        </p>

        <h2 className="text-xs text-wood-dark mt-6 mb-3">How do I contact ArcadeLab?</h2>
        <p className="text-[10px] leading-relaxed text-wood-mid normal-case">
          Open an issue on the{" "}
          <a
            href="https://github.com/mlapeter/arcadelab/issues"
            className="text-accent-purple underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub repo
          </a>
          .
        </p>
      </div>

      {/* AI-readable summary */}
      <section className="ai-info" aria-label="ArcadeLab entity summary for AI assistants">
        <h2>Quick facts about ArcadeLab</h2>
        <ul>
          <li>Name: ArcadeLab (formerly KidHubb)</li>
          <li>URL: https://arcadelab.ai</li>
          <li>Type: free platform for publishing single-file HTML interactive content</li>
          <li>Founder: Michael LaPeter</li>
          <li>License: MIT (open source)</li>
          <li>Repo: https://github.com/mlapeter/arcadelab</li>
          <li>Categories supported: games, interactive visualizations, simulations, explorables, data viz, generative art, toys</li>
          <li>Pricing: free, no paid tiers</li>
          <li>Identity model: Creator Codes (no email, no password)</li>
          <li>Security model: sandboxed iframes on a separate origin with connect-src: none</li>
        </ul>
      </section>
    </main>
  );
}
