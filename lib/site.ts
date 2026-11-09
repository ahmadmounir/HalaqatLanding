// The site's addresses and languages, in one place for the pages, the metadata, the sitemap and the redirects.

/** The landing page's own address (no trailing slash). Every canonical / share URL is built from it. */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://alhafiz.app").replace(/\/+$/, "");

/** The app (sign-in, the organizations' portal). */
export const PORTAL_URL = (process.env.NEXT_PUBLIC_PORTAL_URL || "https://portal.alhafiz.app").replace(/\/+$/, "");

/** Where a new organization signs up (the free plan's button): an account with a verified email, then a request
 *  that the platform team approves. */
export const SIGNUP_URL = `${PORTAL_URL}/signup`;

export const LANGUAGES = ["ar", "en", "tr"] as const;
export type Language = (typeof LANGUAGES)[number];

/** For visitors whose browser asks for none of our languages, and for `x-default`. */
export const DEFAULT_LANGUAGE: Language = "en";

/** Set when a visitor picks a language in the menu; "/" then sends them there again. */
export const LANGUAGE_COOKIE = "hafiz-lang";

export function isLanguage(value: unknown): value is Language {
  return typeof value === "string" && (LANGUAGES as readonly string[]).includes(value);
}

export const LANGUAGE_INFO: Record<Language, { label: string; short: string; dir: "rtl" | "ltr"; ogLocale: string }> = {
  ar: { label: "العربية", short: "AR", dir: "rtl", ogLocale: "ar_AR" },
  en: { label: "English", short: "EN", dir: "ltr", ogLocale: "en_US" },
  tr: { label: "Türkçe", short: "TR", dir: "ltr", ogLocale: "tr_TR" },
};

/** The pages that exist in every language ("" = the home page). */
export const PAGES = ["", "/privacy", "/terms"] as const;
export type PagePath = (typeof PAGES)[number];

/** "/ar", "/ar/privacy"… */
export function localePath(language: Language, page: PagePath | string = ""): string {
  return `/${language}${page}`;
}

/** hreflang alternates of one page for the metadata and the sitemap (relative; `metadataBase` makes them absolute). */
export function languageAlternates(page: PagePath): Record<string, string> {
  const alternates: Record<string, string> = {};
  for (const language of LANGUAGES) alternates[language] = localePath(language, page);
  // No language matched: the address without one picks it from the browser.
  alternates["x-default"] = page || "/";
  return alternates;
}

/**
 * The language a visitor gets at an address without one: the menu's last choice (cookie), else the first of the
 * browser's languages that we have (Accept-Language with its q-values), else the default.
 */
export function pickLanguage(cookieValue: string | undefined, acceptLanguage: string | null): Language {
  if (isLanguage(cookieValue)) return cookieValue;

  const wanted = (acceptLanguage ?? "")
    .split(",")
    .map((part, index) => {
      const [tag, ...params] = part.trim().split(";");
      const q = params.map((p) => p.trim()).find((p) => p.startsWith("q="));
      const quality = q ? Number.parseFloat(q.slice(2)) : 1;
      return { base: tag.trim().toLowerCase().split("-")[0], quality: Number.isFinite(quality) ? quality : 0, index };
    })
    .filter((entry) => entry.base && entry.quality > 0)
    .sort((a, b) => b.quality - a.quality || a.index - b.index);

  return wanted.map((entry) => entry.base).find(isLanguage) ?? DEFAULT_LANGUAGE;
}
