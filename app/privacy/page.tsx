"use client";

import { LegalPage } from "@/components/legal-page";
import { LanguageProvider } from "@/lib/i18n";

export default function PrivacyPage() {
  return (
    <LanguageProvider>
      <LegalPage documentType="privacy" />
    </LanguageProvider>
  );
}
