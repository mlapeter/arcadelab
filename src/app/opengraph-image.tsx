import { ImageResponse } from "next/og";

/**
 * Default Open Graph image for ArcadeLab.
 *
 * Next.js applies this to every route that does not provide its own
 * `opengraph-image` file and does not set `openGraph.images` in metadata —
 * so the home page, /about, /publish, /play, /learn, /prompts, /for-ai, the
 * library hubs, /prompts/[slug], /creators/[name], and /play/[slug]/source
 * all get a resolvable social preview image from this single file.
 */

export const runtime = "nodejs";
export const alt =
  "ArcadeLab — publish a single-file HTML game in one paste";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "linear-gradient(135deg, #2a1a3d 0%, #1a1a2e 100%)",
          display: "flex",
          flexDirection: "column",
          padding: 80,
        }}
      >
        {/* Top bar — brand */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            fontSize: 32,
            color: "#fcc419",
            letterSpacing: 2,
          }}
        >
          <span style={{ fontSize: 48 }}>🎮</span>
          <span style={{ fontFamily: "monospace", fontWeight: 700 }}>ARCADELAB</span>
        </div>

        {/* Main content */}
        <div
          style={{
            display: "flex",
            flex: 1,
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "flex-start",
            gap: 28,
          }}
        >
          <div
            style={{
              fontSize: 68,
              color: "#b197fc",
              fontWeight: 700,
              lineHeight: 1.15,
              maxWidth: 1040,
              display: "flex",
              flexWrap: "wrap",
            }}
          >
            Publish a single-file HTML game in one paste
          </div>
          <div
            style={{
              fontSize: 32,
              color: "#e0e0e0",
              maxWidth: 1000,
              display: "flex",
              flexWrap: "wrap",
            }}
          >
            Games, visualizations, simulations, explorables. Free, no signup, no build tools.
          </div>
        </div>

        {/* Bottom — domain */}
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            fontSize: 28,
            color: "#fcc419",
            opacity: 0.7,
            fontFamily: "monospace",
          }}
        >
          arcadelab.ai
        </div>
      </div>
    ),
    { ...size }
  );
}
