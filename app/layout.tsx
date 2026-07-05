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

// Absolute base URL is required so WhatsApp / Messenger can fetch the preview
// image. Set NEXT_PUBLIC_SITE_URL to your real domain before going live.
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://gokul-invitation.example";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: fullTitle,
  description,
  applicationName: title,
  openGraph: {
    type: "website",
    url: "/",
    siteName: title,
    title: fullTitle,
    description,
    locale: "en_IN",
    images: [
      {
        url: "/og-image.jpg", // resolved to an absolute URL via metadataBase
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
    images: ["/og-image.jpg"],
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
