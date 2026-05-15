import type { Metadata } from "next";
import { Press_Start_2P } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import Header from "@/components/Header";

const pixelFont = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-pixel",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://arcadelab.ai"),
  title: {
    default: "ArcadeLab — publish a single-file HTML game in one paste",
    template: "%s — ArcadeLab",
  },
  description:
    "ArcadeLab is the shortest path from \"I made something\" to \"anyone can play with it.\" Paste a single HTML file, get a shareable URL. Free, no signup, no build tools. Games, visualizations, simulations, interactive explorables.",
  applicationName: "ArcadeLab",
  authors: [{ name: "Michael LaPeter", url: "https://github.com/mlapeter" }],
  creator: "Michael LaPeter",
  publisher: "ArcadeLab",
  keywords: [
    "single-file HTML games",
    "vibe coding",
    "publish HTML game",
    "free HTML game hosting",
    "AI-generated games",
    "interactive visualization hosting",
    "single-file HTML",
    "ArcadeLab",
    "share Phaser game",
    "share p5.js sketch",
    "share Three.js demo",
  ],
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🎮</text></svg>",
  },
  openGraph: {
    type: "website",
    siteName: "ArcadeLab",
    url: "https://arcadelab.ai",
    title: "ArcadeLab — publish a single-file HTML game in one paste",
    description:
      "Paste a single HTML file. Get a shareable URL. Free, no signup, no build tools. Games, visualizations, and interactive content.",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "ArcadeLab — publish a single-file HTML game in one paste",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ArcadeLab — publish a single-file HTML game in one paste",
    description:
      "Paste a single HTML file. Get a shareable URL. Free, no signup, no build tools.",
    images: ["/opengraph-image"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${pixelFont.variable} font-pixel text-foreground min-h-screen`}
      >
        <Header />
        <div className="relative z-[1]">
          {children}
        </div>
        <Analytics />
      </body>
    </html>
  );
}
