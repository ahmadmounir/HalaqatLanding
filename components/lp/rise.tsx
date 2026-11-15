"use client";

import { useEffect } from "react";
import { useLanguage } from "@/lib/i18n";

/**
 * Every [data-rise] element rises in once it scrolls into view (CSS in globals.css, only under html.js). Runs again
 * after a language switch, which can bring new elements. Never put data-rise on an element whose className React
 * changes: React would drop the "is-in" class and hide it again.
 *
 * html.js is set here, not by an inline script in <head>: until this runs every section is plainly visible (a slow or
 * failed script never leaves the prices, the questions or the form invisible). What is already on screen at that
 * moment is shown at once, so nothing blinks out and back in.
 */
export function Rise() {
  const { language } = useLanguage();

  useEffect(() => {
    const items = Array.from(document.querySelectorAll<HTMLElement>("[data-rise]:not(.is-in)"));
    if (matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) {
      items.forEach((el) => el.classList.add("is-in"));
      return;
    }
    const onScreen = (el: HTMLElement) => {
      const r = el.getBoundingClientRect();
      return r.top < window.innerHeight && r.bottom > 0;
    };
    items.filter(onScreen).forEach((el) => el.classList.add("is-in"));
    document.documentElement.classList.add("js");
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
    items.filter((el) => !el.classList.contains("is-in")).forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [language]);

  return null;
}
