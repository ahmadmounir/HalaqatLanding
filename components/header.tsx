"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useLanguage } from "@/lib/i18n";
import { Logo } from "@/components/brand/logo";
import { LanguageMenu } from "@/components/language-menu";
import { EASE } from "@/components/motion";
import { cn } from "@/lib/utils";

export const APP_URL = "https://hafiz.pluto4host.com/";

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { href: "#roles", label: t.nav.roles },
    { href: "#features", label: t.nav.features },
    { href: "#students", label: t.nav.students },
    { href: "#pricing", label: t.nav.pricing },
    { href: "#faq", label: t.nav.faq },
  ];

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b transition-[background-color,border-color,box-shadow] duration-300",
        scrolled || menuOpen
          ? "border-line bg-paper/85 backdrop-blur-md"
          : "border-transparent bg-transparent",
      )}
    >
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <Link href="/" aria-label={t.nav.brand} className="shrink-0">
          <Logo name={t.nav.brand} />
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="link-underline pb-0.5 text-[0.9375rem] text-muted-foreground transition-colors hover:text-ink"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-1 sm:gap-2">
          <LanguageMenu />
          <a
            href={APP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-sm btn-ghost hidden sm:inline-flex"
          >
            {t.nav.login}
          </a>
          <a href="#pricing" className="btn btn-sm btn-primary hidden sm:inline-flex">
            {t.nav.cta}
          </a>
          <button
            type="button"
            className="btn btn-sm btn-ghost px-2.5 lg:hidden"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label={t.nav.menu}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: EASE }}
            className="overflow-hidden border-t border-line lg:hidden"
          >
            <nav className="container-page flex flex-col py-3">
              {links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="border-b border-line/70 py-3.5 text-base text-ink last:border-b-0"
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </a>
              ))}
              <div className="grid grid-cols-2 gap-3 py-4 sm:hidden">
                <a
                  href={APP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-secondary"
                >
                  {t.nav.login}
                </a>
                <a
                  href="#pricing"
                  className="btn btn-primary"
                  onClick={() => setMenuOpen(false)}
                >
                  {t.nav.cta}
                </a>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
