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
const fullTitle = `${title} · Wedding Reception Invitation`;
const description = `Join us as we celebrate the wedding reception of ${config.couple.groom} & ${config.couple.bride} — ${config.hero.dateLabel}, ${config.hero.location}. ${config.hero.tagline}`;

// Absolute URLs are required so WhatsApp / Messenger can fetch the preview.
// Keep NEXT_PUBLIC_SITE_URL set to the public production domain when deploying.
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://gokulamrithawedding.in";
const metadataBase = new URL(siteUrl);
const canonicalUrl = new URL("/", metadataBase).toString();
// Clean URL with NO query string — WhatsApp's link crawler frequently fails to
// fetch og:image URLs that carry a `?query`, and a fresh path also sidesteps its
// aggressive per-URL preview cache.
const ogImageUrl = new URL("/og.jpg", metadataBase).toString();

export const metadata: Metadata = {
  metadataBase,
  title: fullTitle,
  description,
  applicationName: title,
  alternates: {
    canonical: canonicalUrl,
  },
  openGraph: {
    type: "website",
    url: canonicalUrl,
    siteName: title,
    title: fullTitle,
    description,
    locale: "en_IN",
    images: [
      {
        url: ogImageUrl,
        secureUrl: ogImageUrl,
        width: 1200,
        height: 630,
        alt: `${config.couple.groom} & ${config.couple.bride} — Wedding Reception`,
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: fullTitle,
    description,
    images: [ogImageUrl],
  },
  robots: { index: true, follow: true },
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
