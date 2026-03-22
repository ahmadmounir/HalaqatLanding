"use client";

import Link from "next/link";
import { BookOpen } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "@/lib/i18n";

export function Footer() {
  const { t } = useLanguage();

  const footerLinks = {
    [t.footer.product]: [
      { label: t.footer.featuresLink, href: "#features" },
      { label: t.footer.experience, href: "#experience" }
    ],
    [t.footer.company]: [
      { label: t.footer.contactLink, href: "#contact" },
    ],
    [t.footer.legal]: [
      { label: t.footer.privacy, href: "#" },
      { label: t.footer.terms, href: "#" },
    ],
  };

  return (
    <footer className="border-t border-border bg-background py-12 md:py-16 relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 -z-10 opacity-[0.02]">
        <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern
              id="footer-pattern"
              x="0"
              y="0"
              width="60"
              height="60"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M30 0L60 30L30 60L0 30Z"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.5"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#footer-pattern)" />
        </svg>
      </div>

      <div className="container mx-auto max-w-6xl px-4">
        <div
          className={`grid gap-8 md:grid-cols-2 lg:grid-cols-5`}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-2"
          >
            <Link
              href="/"
              className={`mb-4 flex items-center gap-2`}
            >
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary"
              >
                <BookOpen className="h-5 w-5 text-primary-foreground" />
              </motion.div>
              <span className="text-xl font-semibold tracking-tight text-foreground">
                {t.nav.brand}
              </span>
            </Link>
            <p className="mb-4 max-w-xs text-muted-foreground">
              {t.footer.description}
            </p>
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} {t.nav.brand}. {t.footer.rights}
            </p>
          </motion.div>

          {Object.entries(footerLinks).map(
            ([category, links], categoryIndex) => (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: categoryIndex * 0.1 }}
              >
                <h3 className="mb-4 font-semibold text-foreground">
                  {category}
                </h3>
                <ul className="space-y-3">
                  {links.map((link) => (
                    <li key={link.label}>
                      <motion.div whileHover={{ x: 3 }}>
                        <Link
                          href={link.href}
                          className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                        >
                          {link.label}
                        </Link>
                      </motion.div>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ),
          )}
        </div>
      </div>
    </footer>
  );
}
