import { ImageResponse } from "next/og";
import { getArticle } from "@/lib/articles";

export const runtime = "nodejs";
export const alt = "ArcadeLab guide preview";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function OpenGraphImage({ params }: Props) {
  const { slug } = await params;
  const article = getArticle(slug);

  const title = article?.title || "ArcadeLab Guide";
  const tagline = article?.tagline || "Publish single-file HTML interactive content";
  const emoji = article?.emoji || "📚";

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
          position: "relative",
        }}
      >
        {/* Top bar — ArcadeLab brand + Guide label */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: 32,
            color: "#fcc419",
            letterSpacing: 2,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <span style={{ fontSize: 48 }}>🎮</span>
            <span style={{ fontFamily: "monospace", fontWeight: 700 }}>ARCADELAB</span>
          </div>
          <span
            style={{
              fontFamily: "monospace",
              fontSize: 24,
              color: "#b197fc",
              opacity: 0.8,
              letterSpacing: 3,
            }}
          >
            GUIDE
          </span>
        </div>

        {/* Main content — emoji + title + tagline */}
        <div
          style={{
            display: "flex",
            flex: 1,
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "flex-start",
            gap: 24,
          }}
        >
          <div style={{ fontSize: 140, lineHeight: 1, display: "flex" }}>{emoji}</div>
          <div
            style={{
              fontSize: 56,
              color: "#fcc419",
              fontWeight: 700,
              lineHeight: 1.15,
              maxWidth: 1040,
              display: "flex",
              flexWrap: "wrap",
            }}
          >
            {title}
          </div>
          <div
            style={{
              fontSize: 28,
              color: "#e0e0e0",
              opacity: 0.85,
              maxWidth: 1040,
              display: "flex",
              flexWrap: "wrap",
            }}
          >
            {tagline}
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
          arcadelab.ai/learn
        </div>
      </div>
    ),
    { ...size }
  );
}
