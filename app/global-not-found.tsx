import type { Metadata } from "next";
import { LogoTile } from "@/components/brand/logo";
import { LANGUAGES, LANGUAGE_INFO, localePath } from "@/lib/site";
import "./globals.css";

// No next/font here: on Netlify's build, Turbopack failed on a Google font loaded by this file ("next/font/google
// queries have exactly one entry", 2026-11-09) while the same fonts in app/[lang]/layout.tsx built fine. The 404 page
// uses the system font (the rest of the stack in globals.css).

export const metadata: Metadata = {
  title: "404 — Hafiz",
  robots: { index: false, follow: true },
};

const MESSAGES = [
  { lang: "ar", text: "هذه الصفحة غير موجودة." },
  { lang: "en", text: "This page does not exist." },
  { lang: "tr", text: "Bu sayfa bulunamadı." },
] as const;

/** Any address the site does not have (the root layout is per language, so this one stands alone, in all three). */
export default function GlobalNotFound() {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <main className="flex min-h-dvh flex-col items-center justify-center gap-8 px-4 text-center">
          <LogoTile className="h-16 w-16" />
          <p className="text-5xl font-semibold tracking-tight text-ink">404</p>
          <div className="space-y-2">
            {MESSAGES.map((message) => (
              <p key={message.lang} lang={message.lang} dir={LANGUAGE_INFO[message.lang].dir} className="text-muted-foreground">
                {message.text}
              </p>
            ))}
          </div>
          <nav className="flex flex-wrap justify-center gap-3">
            {LANGUAGES.map((language) => (
              <a key={language} href={localePath(language)} lang={language} className="btn btn-sm btn-secondary">
                {LANGUAGE_INFO[language].label}
              </a>
            ))}
          </nav>
        </main>
      </body>
    </html>
  );
}
