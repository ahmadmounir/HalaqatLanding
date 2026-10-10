"use client";

import Link from "next/link";
import { Instagram, Mail } from "lucide-react";
import { CONTACT_EMAIL, INSTAGRAM_URL } from "@/lib/contact";
import { useLanguage } from "@/lib/i18n";
import { Logo } from "@/components/brand/logo";
import { APP_URL } from "@/components/header";

export function Footer() {
  const { t } = useLanguage();

  const columns = [
    {
      title: t.footer.product,
      links: [
        { label: t.nav.features, href: "/#features" },
        { label: t.nav.students, href: "/#students" },
        { label: t.nav.pricing, href: "/#pricing" },
        { label: t.nav.faq, href: "/#faq" },
      ],
    },
    {
      title: t.footer.company,
      links: [
        { label: t.footer.contactLink, href: "/#contact" },
        { label: t.nav.login, href: APP_URL },
      ],
    },
    {
      title: t.footer.legal,
      links: [
        { label: t.footer.privacy, href: "/privacy" },
        { label: t.footer.terms, href: "/terms" },
      ],
    },
  ];

  const socialLinks = [
    {
      label: "Email",
      href: `mailto:${CONTACT_EMAIL}`,
      icon: Mail,
      external: false,
    },
    {
      label: "Instagram",
      href: INSTAGRAM_URL,
      icon: Instagram,
      external: true,
    },
  ];

  return (
    <footer className="bg-ink text-white">
      <div className="container-page py-14 md:py-16">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Link href="/" aria-label={t.nav.brand}>
              <Logo name={t.nav.brand} tone="light" />
            </Link>
            <p className="mt-4 max-w-xs text-[0.9375rem] leading-relaxed text-white/65">
              {t.footer.description}
            </p>
          </div>

          {columns.map((column) => (
            <div key={column.title}>
              <h3 className="text-sm font-medium text-gold">{column.title}</h3>
              <ul className="mt-4 space-y-3">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="link-underline pb-0.5 text-[0.9375rem] text-white/75 transition-colors hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col-reverse items-start gap-5 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-white/50">
            © {new Date().getFullYear()} {t.nav.brand}. {t.footer.rights}
          </p>
          <div className="flex items-center gap-3">
            {socialLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                aria-label={link.label}
                title={link.label}
                {...(link.external
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white/75 transition-[color,border-color,background-color,transform] duration-300 ease-brand hover:-translate-y-0.5 hover:border-gold hover:bg-gold hover:text-ink"
              >
                <link.icon
                  className="h-[1.125rem] w-[1.125rem]"
                  strokeWidth={1.8}
                />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
