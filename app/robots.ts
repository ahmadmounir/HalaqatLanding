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
    host: SITE_URL,
  };
}
