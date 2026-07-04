import type { Metadata, Viewport } from "next";
import { Alex_Brush, Cormorant_Garamond, Cormorant_SC, Great_Vibes } from "next/font/google";
import { config } from "@/lib/config";
import "./globals.css";

const garamond = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-garamond",
  display: "swap",
});

const cormorantSC = Cormorant_SC({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-cormorant-sc",
  display: "swap",
});

const greatVibes = Great_Vibes({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-great-vibes",
  display: "swap",
});

const alexBrush = Alex_Brush({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-alex-brush",
  display: "swap",
});

const title = `${config.couple.groom} weds ${config.couple.bride}`;

export const metadata: Metadata = {
  title: `${title} · A Wedding Reception Invitation`,
  description: `${config.hero.line1} ${config.hero.line2} Join us as we celebrate the wedding of ${config.couple.groom} & ${config.couple.bride} — ${config.hero.dateLabel}, ${config.hero.location}.`,
  openGraph: {
    title,
    description: `${config.hero.tagline} — ${config.hero.dateLabel}`,
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#1a2c5b",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${garamond.variable} ${cormorantSC.variable} ${greatVibes.variable} ${alexBrush.variable}`}
    >
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
