import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

/**
 * Every crawler may read the whole site (search engines and AI search alike); the sitemap lists every page.
 * Never disallow /_next/: Google needs the scripts and styles to render the page.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: `${SITE_URL}/sitemap.xml`,
    // No "Host:" line: it is not part of the standard and Google ignores it (SEO audit 2026-11-15, T-09).
  };
}
