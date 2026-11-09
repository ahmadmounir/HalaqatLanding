import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { Analytics } from "@vercel/analytics/next";
import { Providers } from "@/components/providers";
import { LANGUAGES, LANGUAGE_INFO, SITE_URL, isLanguage } from "@/lib/site";
// The fonts ship with the site (Fontsource packages) instead of next/font/google: on Netlify, Turbopack failed twice
// while fetching Google's font files at build time ("next/font/google queries have exactly one entry", 2026-11-09),
// never locally. Almarai = the wordmark's face (headings), IBM Plex Sans Arabic / IBM Plex Sans = text.
import "@fontsource/almarai/400.css";
import "@fontsource/almarai/700.css";
import "@fontsource/almarai/800.css";
import "@fontsource/ibm-plex-sans-arabic/400.css";
import "@fontsource/ibm-plex-sans-arabic/500.css";
import "@fontsource/ibm-plex-sans-arabic/600.css";
import "@fontsource/ibm-plex-sans-arabic/700.css";
import "@fontsource/ibm-plex-sans/400.css";
import "@fontsource/ibm-plex-sans/500.css";
import "@fontsource/ibm-plex-sans/600.css";
import "@fontsource/ibm-plex-sans/700.css";
import "../globals.css";

// Only /ar, /en and /tr exist; any other first segment is a 404 (global-not-found).
export const dynamicParams = false;

export function generateStaticParams() {
  return LANGUAGES.map((lang) => ({ lang }));
}

// Shared by every page; each page adds its own title, description, canonical, hreflang and share picture.
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: "Hafiz",
  authors: [{ name: "Hafiz", url: SITE_URL }],
  creator: "Hafiz",
  publisher: "Hafiz",
  category: "education",
  formatDetection: { telephone: false, email: false, address: false },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "16x16 32x32 48x48" },
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/icons/hafiz-dark-32.png", type: "image/png", sizes: "32x32" },
      { url: "/icons/hafiz-dark-192.png", type: "image/png", sizes: "192x192" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  manifest: "/manifest.webmanifest",
  appleWebApp: { title: "Hafiz", statusBarStyle: "default" },
  // Search Console / Bing Webmaster "HTML tag" checks; not needed when the domain is verified through DNS.
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || undefined,
    other: process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION
      ? { "msvalidate.01": process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION }
      : undefined,
  },
};

export const viewport: Viewport = {
  themeColor: "#faf8f3",
  colorScheme: "light",
};

export default async function LangLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLanguage(lang)) notFound();

  return (
    <html lang={lang} dir={LANGUAGE_INFO[lang].dir} suppressHydrationWarning>
      <head>
        {/* Sections rise in as they scroll into view, only when scripts run (content stays visible without them). */}
        <script dangerouslySetInnerHTML={{ __html: 'document.documentElement.classList.add("js")' }} />
      </head>
      <body>
        <Providers language={lang}>{children}</Providers>
        <Analytics />
      </body>
    </html>
  );
}
