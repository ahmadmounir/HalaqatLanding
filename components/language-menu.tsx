"use client";

import { Check, ChevronDown, Globe } from "lucide-react";
import { useLanguage, type Language } from "@/lib/i18n";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const languages: { code: Language; label: string; short: string }[] = [
  { code: "en", label: "English", short: "EN" },
  { code: "ar", label: "العربية", short: "AR" },
  { code: "tr", label: "Türkçe", short: "TR" },
];

export function LanguageMenu() {
  const { language, setLanguage, t } = useLanguage();
  const selected = languages.find((lang) => lang.code === language) ?? languages[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="btn btn-sm btn-ghost gap-1.5 px-3"
        aria-label={t.nav.language}
      >
        <Globe className="h-4 w-4" />
        <span>{selected.short}</span>
        <ChevronDown className="h-3.5 w-3.5 opacity-60" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-36 rounded-xl p-1">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => setLanguage(lang.code)}
            className="justify-between rounded-lg px-3 py-2"
          >
            <span lang={lang.code}>{lang.label}</span>
            {language === lang.code ? (
              <Check className="h-4 w-4 text-green" />
            ) : null}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
