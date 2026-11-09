"use client";

import type { ReactNode } from "react";
import { MotionConfig } from "framer-motion";
import { LanguageProvider } from "@/lib/i18n";
import type { Language } from "@/lib/site";

/** What every page needs on the client: its language (from the address) and the motion settings. */
export function Providers({ language, children }: { language: Language; children: ReactNode }) {
  return (
    <LanguageProvider language={language}>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </LanguageProvider>
  );
}
