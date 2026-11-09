"use client";

import { createContext, useCallback, useContext, useEffect, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { translations, type Translations } from "@/lib/translations";
import { LANGUAGE_COOKIE, LANGUAGE_INFO, isLanguage, localePath, type Language } from "@/lib/site";

export type { Language } from "@/lib/site";
export type { Translations } from "@/lib/translations";

interface LanguageContextType {
  language: Language;
  /** Opens the same page in another language (/ar/privacy → /en/privacy) and remembers the choice. */
  setLanguage: (lang: Language) => void;
  t: Translations;
  isRTL: boolean;
  /** "/ar", "/ar/privacy"… in the page's language. */
  href: (page?: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

/** The language comes from the address (/ar, /en, /tr), so every page is rendered on the server in its language. */
export function LanguageProvider({ language, children }: { language: Language; children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  // The root layout sets lang / dir on <html>; keep them right after a switch without a full load.
  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = LANGUAGE_INFO[language].dir;
  }, [language]);

  const setLanguage = useCallback(
    (next: Language) => {
      document.cookie = `${LANGUAGE_COOKIE}=${next}; path=/; max-age=${60 * 60 * 24 * 365}; samesite=lax`;
      if (next === language) return;
      const segments = (pathname ?? "/").split("/");
      // "/ar/privacy" → ["", "ar", "privacy"]: swap the language, keep the rest of the page.
      if (isLanguage(segments[1])) segments[1] = next;
      else segments.splice(1, 0, next);
      router.push(segments.join("/") || localePath(next), { scroll: false });
    },
    [language, pathname, router],
  );

  const value: LanguageContextType = {
    language,
    setLanguage,
    t: translations[language],
    isRTL: LANGUAGE_INFO[language].dir === "rtl",
    href: (page = "") => localePath(language, page),
  };

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
