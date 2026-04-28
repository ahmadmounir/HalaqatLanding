"use client";

import { LegalPage } from "@/components/legal-page";
import { LanguageProvider } from "@/lib/i18n";

export default function TermsPage() {
  return (
    <LanguageProvider>
      <LegalPage documentType="terms" />
    </LanguageProvider>
  );
}
