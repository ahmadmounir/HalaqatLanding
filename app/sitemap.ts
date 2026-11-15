import { execFileSync } from "node:child_process";
import type { MetadataRoute } from "next";
import { legalContent } from "@/lib/legal-content";
import { LANGUAGES, PAGES, SITE_URL, languageAlternates, localePath, type PagePath } from "@/lib/site";

const absolute = (path: string) => `${SITE_URL}${path === "/" ? "" : path}`;

/**
 * When the home page's content last changed: the last commit that touched its texts, components or pictures (the
 * sitemap is written at build time, where the repository is checked out). Not the build time: a deploy that changes
 * nothing on the page must not look like new content (SEO audit 2026-11-15, T-08).
 */
function homeLastChanged(): Date {
  try {
    const iso = execFileSync("git", ["log", "-1", "--format=%cI", "--", "locales", "components/lp", "app/[lang]/page.tsx", "public/lp"], {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();
    if (iso) return new Date(iso);
  } catch {
    // no git where it builds: fall back to the build time
  }
  return new Date();
}

function lastModified(page: PagePath): Date {
  if (page === "/privacy") return new Date(legalContent.en.privacy.lastUpdated);
  if (page === "/terms") return new Date(legalContent.en.terms.lastUpdated);
  return homeLastChanged();
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
