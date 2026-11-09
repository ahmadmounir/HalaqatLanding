import { NextResponse, type NextRequest } from "next/server";
import { LANGUAGE_COOKIE, localePath, pickLanguage } from "@/lib/site";

/**
 * An address without a language ("/", and the old "/privacy" / "/terms" links people already shared) opens the
 * same page in the visitor's language: the one they picked in the menu, else their browser's, else English.
 * Every page itself lives under /ar, /en or /tr, so each language has its own address for search engines.
 */
export function proxy(request: NextRequest) {
  const language = pickLanguage(request.cookies.get(LANGUAGE_COOKIE)?.value, request.headers.get("accept-language"));
  const url = request.nextUrl.clone();
  url.pathname = localePath(language, url.pathname === "/" ? "" : url.pathname);

  // Temporary (307): the answer depends on the visitor, so no cache may keep it for everyone.
  const response = NextResponse.redirect(url, 307);
  response.headers.set("Vary", "Accept-Language, Cookie");
  response.headers.set("Cache-Control", "private, no-store");
  return response;
}

export const config = {
  matcher: ["/", "/privacy", "/terms"],
};
