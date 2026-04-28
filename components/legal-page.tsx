"use client";

import Link from "next/link";
import { BookOpen, ChevronDown, Globe } from "lucide-react";
import { useLanguage, type Language } from "@/lib/i18n";
import { legalContent, type LegalDocumentType } from "@/lib/legal-content";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

const languages: { code: Language; label: string; flag: string }[] = [
  { code: "en", label: "English", flag: "EN" },
  { code: "ar", label: "العربية", flag: "AR" },
  { code: "tr", label: "Turkce", flag: "TR" },
];

export function LegalPage({
  documentType,
}: {
  documentType: LegalDocumentType;
}) {
  const { language, setLanguage, t, isRTL } = useLanguage();
  const localeContent = legalContent[language];
  const document = localeContent[documentType];
  const selectedLanguage =
    languages.find((lang) => lang.code === language) ?? languages[0];

  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/85 backdrop-blur">
        <div className="container mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <BookOpen className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-semibold tracking-tight text-foreground">
              {t.nav.brand}
            </span>
          </Link>

          <div
            className={`flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}
          >
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-1.5"
                  aria-label={localeContent.switchLanguage}
                >
                  <Globe className="h-4 w-4" />
                  <span>{selectedLanguage.flag}</span>
                  <ChevronDown className="h-3 w-3 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align={isRTL ? "start" : "end"}>
                {languages.map((lang) => (
                  <DropdownMenuItem
                    key={lang.code}
                    onClick={() => setLanguage(lang.code)}
                    className={language === lang.code ? "bg-muted" : ""}
                  >
                    <span className="font-medium">{lang.flag}</span>
                    <span className={isRTL ? "mr-2" : "ml-2"}>
                      {lang.label}
                    </span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <section className="container mx-auto max-w-4xl px-4 py-10 md:py-14">
        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
              {document.title}
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              {document.lastUpdatedLabel}: {document.lastUpdated}
            </p>
          </div>
          <Link
            href="/"
            className="text-sm font-medium text-primary underline-offset-4 hover:underline"
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
