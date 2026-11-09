"use client";

import { useEffect } from "react";
import { useLanguage } from "@/lib/i18n";

/**
 * Every [data-rise] element rises in once it scrolls into view (CSS in globals.css, only under html.js). Runs again
 * after a language switch, which can bring new elements. Never put data-rise on an element whose className React
 * changes: React would drop the "is-in" class and hide it again.
 */
export function Rise() {
  const { language } = useLanguage();

  useEffect(() => {
    const items = Array.from(document.querySelectorAll<HTMLElement>("[data-rise]:not(.is-in)"));
    if (matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) {
      items.forEach((el) => el.classList.add("is-in"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            io.unobserve(e.target);
          }
        });
      },
      { rootMargin: "0px 0px -6% 0px" },
    );
    items.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [language]);

  return null;
}
