import type { MetadataRoute } from "next";
import { legalContent } from "@/lib/legal-content";
import { LANGUAGES, PAGES, SITE_URL, languageAlternates, localePath, type PagePath } from "@/lib/site";

const absolute = (path: string) => `${SITE_URL}${path === "/" ? "" : path}`;

function lastModified(page: PagePath): Date {
  if (page === "/privacy") return new Date(legalContent.en.privacy.lastUpdated);
  if (page === "/terms") return new Date(legalContent.en.terms.lastUpdated);
  return new Date(); // the home page changes with every deploy
}

/** Every page in every language, each with its hreflang alternates (Google reads them from the sitemap too). */
export default function sitemap(): MetadataRoute.Sitemap {
  return PAGES.flatMap((page) => {
    const languages = Object.fromEntries(
      Object.entries(languageAlternates(page)).map(([language, path]) => [language, absolute(path)]),
    );
    return LANGUAGES.map((language) => ({
      url: absolute(localePath(language, page)),
      lastModified: lastModified(page),
      changeFrequency: page === "" ? ("weekly" as const) : ("yearly" as const),
      priority: page === "" ? 1 : 0.3,
      alternates: { languages },
    }));
  });
}
