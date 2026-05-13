import { ImageResponse } from "next/og";
import { supabase } from "@/lib/supabase";

export const runtime = "nodejs";
export const alt = "ArcadeLab game preview";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const COLOR_MAP: Record<string, { bg: string; accent: string }> = {
  red: { bg: "#3d1a1a", accent: "#ff6b6b" },
  orange: { bg: "#3d2a1a", accent: "#ffa94d" },
  green: { bg: "#1a3d22", accent: "#5dad46" },
  blue: { bg: "#1a2a3d", accent: "#4dabf7" },
  purple: { bg: "#2a1a3d", accent: "#b197fc" },
  pink: { bg: "#3d1a2e", accent: "#f783ac" },
  teal: { bg: "#1a3d3a", accent: "#4dd4c5" },
  gold: { bg: "#3d2f1a", accent: "#fcc419" },
};

const DEFAULT_COLORS = COLOR_MAP.purple;

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function OpenGraphImage({ params }: Props) {
  const { slug } = await params;

  const { data: game } = await supabase
    .from("games")
    .select("title, emoji, color, creator_id")
    .eq("slug", slug)
    .eq("status", "active")
    .single();

  let creatorName = "ArcadeLab creator";
  if (game?.creator_id) {
    const { data: creator } = await supabase
      .from("creators")
      .select("display_name")
      .eq("id", game.creator_id)
      .single();
    if (creator?.display_name) creatorName = creator.display_name;
  }

  const colors =
    (game?.color && COLOR_MAP[game.color]) || DEFAULT_COLORS;
  const emoji = game?.emoji || "🎮";
  const title = game?.title || "ArcadeLab";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: `linear-gradient(135deg, ${colors.bg} 0%, #1a1a2e 100%)`,
          display: "flex",
          flexDirection: "column",
          padding: 80,
          position: "relative",
        }}
      >
        {/* Top bar — ArcadeLab brand */}
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

        {/* Main content — emoji + title */}
        <div
          style={{
            display: "flex",
            flex: 1,
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "flex-start",
            gap: 32,
          }}
        >
          <div style={{ fontSize: 200, lineHeight: 1, display: "flex" }}>{emoji}</div>
          <div
            style={{
              fontSize: 72,
              color: colors.accent,
              fontWeight: 700,
              lineHeight: 1.1,
              maxWidth: 1040,
              display: "flex",
              flexWrap: "wrap",
            }}
          >
            {title}
          </div>
          <div
            style={{
              fontSize: 32,
              color: "#e0e0e0",
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            <span style={{ opacity: 0.6 }}>by</span>
            <span style={{ fontWeight: 600 }}>{creatorName}</span>
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
