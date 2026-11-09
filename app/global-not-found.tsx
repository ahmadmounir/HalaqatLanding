import type { Metadata } from "next";
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
      <body>
        <main className="nf">
          <img src="/icon.svg" alt="" width={72} height={72} />
          <strong>404</strong>
          <div>
            {MESSAGES.map((message) => (
              <p key={message.lang} lang={message.lang} dir={LANGUAGE_INFO[message.lang].dir}>
                {message.text}
              </p>
            ))}
          </div>
          <nav>
            {LANGUAGES.map((language) => (
              <a key={language} href={localePath(language)} lang={language}>
                {LANGUAGE_INFO[language].label}
              </a>
            ))}
          </nav>
        </main>
      </body>
    </html>
  );
}
