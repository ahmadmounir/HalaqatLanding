"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/i18n";
import { legalContent, type LegalDocumentType } from "@/lib/legal-content";
import { Logo } from "@/components/brand/logo";
import { LanguageMenu } from "@/components/language-menu";

export function LegalPage({
  documentType,
}: {
  documentType: LegalDocumentType;
}) {
  const { language, t } = useLanguage();
  const localeContent = legalContent[language];
  const document = localeContent[documentType];

  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-50 w-full border-b border-line bg-paper/85 backdrop-blur-md">
        <div className="container-page flex h-16 items-center justify-between">
          <Link href="/" aria-label={t.nav.brand}>
            <Logo name={t.nav.brand} />
          </Link>
          <LanguageMenu />
        </div>
      </header>

      <section className="container mx-auto max-w-4xl px-4 py-10 md:py-14">
        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <h1 className="heading">
              {document.title}
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              {document.lastUpdatedLabel}: {document.lastUpdated}
            </p>
          </div>
          <Link
            href="/"
            className="link-underline pb-0.5 text-sm font-medium text-green"
          >
            {localeContent.backToHome}
          </Link>
        </div>

        <article className="space-y-8">
          <section className="rounded-xl border border-border bg-card p-5 md:p-6">
            <h2 className="text-xl font-semibold">{document.aboutTitle}</h2>
            <p className="mt-3 text-sm leading-7 text-muted-foreground md:text-base">
              {document.aboutText}
            </p>
            <p className="mt-3 text-sm font-medium leading-7 md:text-base">
              {document.mandatorySentence}
            </p>
          </section>

          {document.sections.map((section) => (
            <section
              key={section.title}
              className="rounded-xl border border-border bg-card p-5 md:p-6"
            >
              <h2 className="text-xl font-semibold">{section.title}</h2>
              <ul className="mt-3 list-disc space-y-2 ps-5 text-sm leading-7 text-muted-foreground md:text-base">
                {section.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>
          ))}
        </article>
      </section>
    </main>
  );
}
