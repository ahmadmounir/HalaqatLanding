import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { Almarai, IBM_Plex_Sans, IBM_Plex_Sans_Arabic } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { Providers } from "@/components/providers";
import { LANGUAGES, LANGUAGE_INFO, SITE_URL, isLanguage } from "@/lib/site";
import "../globals.css";

const plex = IBM_Plex_Sans({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-plex",
  display: "swap",
});

const plexArabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-plex-arabic",
  display: "swap",
});

// Headings: the face of the wordmark «حافظ» / HAFIZ.
const almarai = Almarai({
  subsets: ["arabic", "latin"],
  weight: ["400", "700", "800"],
  variable: "--font-almarai",
  display: "swap",
});

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
    <html lang={lang} dir={LANGUAGE_INFO[lang].dir} className={`${plex.variable} ${plexArabic.variable} ${almarai.variable}`} suppressHydrationWarning>
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
