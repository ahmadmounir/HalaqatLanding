"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/lib/i18n";
import { LANGUAGES, LANGUAGE_INFO, LOGIN_URL, SIGNUP_URL, isLanguage, localePath, type Language } from "@/lib/site";
import { Check, Globe } from "@/components/lp/icons";

const SHORT: Record<Language, string> = { ar: "ع", en: "EN", tr: "TR" };

/** The page part after the language ("/privacy"), so a language link keeps the page. */
export function usePagePart(): string {
  const pathname = usePathname() ?? "/";
  const parts = pathname.split("/");
  return isLanguage(parts[1]) ? parts.slice(2).join("/").replace(/^(?=.)/, "/") : "";
}

/** The plain bar on top of every page; it stays visible while the page scrolls. */
export function SiteHeader() {
  const { t, language, setLanguage, href } = useLanguage();
  const page = usePagePart();
  const [stuck, setStuck] = useState(false);
  const nav = t.lp.nav;

  useEffect(() => {
    const onScroll = () => setStuck(window.scrollY > 4);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { hash: "#grade", label: nav.grade },
    { hash: "#messages", label: nav.messages },
    { hash: "#staff", label: nav.staff },
    { hash: "#apps", label: nav.apps },
    { hash: "#pricing", label: nav.pricing },
  ];

  return (
    <header className={`nav${stuck ? " is-stuck" : ""}`}>
      <a className="logo" href={href()} aria-label={nav.home}>
        <img src="/lp/logo-side-onLight.svg" alt="حافظ HAFIZ" width={138} height={44} />
      </a>
      <nav className="nav-links" aria-label={nav.sections}>
        {links.map((link) => (
          <a key={link.hash} href={`${href()}${link.hash}`}>
            {link.label}
          </a>
        ))}
      </nav>
      <div className="nav-end">
        <LanguageMenu />
        <div className="lang" role="group" aria-label={nav.language}>
          {LANGUAGES.map((lang) => (
            <a
              key={lang}
              href={localePath(lang, page)}
              lang={lang}
              hrefLang={lang}
              title={LANGUAGE_INFO[lang].label}
              aria-current={lang === language ? "page" : undefined}
              onClick={(e) => {
                e.preventDefault();
                setLanguage(lang);
              }}
            >
              {SHORT[lang]}
            </a>
          ))}
        </div>
        <a className="link" href={LOGIN_URL}>
          {nav.login}
        </a>
        <a className="btn btn-ink" href={`${SIGNUP_URL}?plan=free&lang=${language}`}>
          {nav.start}
        </a>
      </div>
    </header>
  );
}

/** On a phone the three language links do not fit in the bar: one button opens them as a small menu. */
function LanguageMenu() {
  const { t, language, setLanguage } = useLanguage();
  const page = usePagePart();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Closes on a tap outside it and on Escape
  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div className="lang-menu" ref={ref}>
      <button
        type="button"
        className="lang-btn"
        aria-label={t.lp.nav.language}
        aria-expanded={open}
        aria-controls="lang-list"
        onClick={() => setOpen((o) => !o)}
      >
        <Globe />
      </button>
      <ul id="lang-list" className="lang-list" hidden={!open}>
        {LANGUAGES.map((lang) => (
          <li key={lang}>
            <a
              href={localePath(lang, page)}
              lang={lang}
              hrefLang={lang}
              aria-current={lang === language ? "page" : undefined}
              onClick={(e) => {
                e.preventDefault();
                setOpen(false);
                setLanguage(lang);
              }}
            >
              {LANGUAGE_INFO[lang].label}
              {lang === language && <Check />}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
