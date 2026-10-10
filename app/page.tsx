"use client";

import { MotionConfig } from "framer-motion";
import { LanguageProvider } from "@/lib/i18n";
import { Header } from "@/components/header";
import { HeroSection } from "@/components/hero-section";
import { RolesSection } from "@/components/roles-section";
import { FeaturesSection } from "@/components/features-section";
import { RemindersSection } from "@/components/reminders-section";
import { StudentsSection } from "@/components/students-section";
import { PricingSection } from "@/components/pricing-section";
import { FaqSection } from "@/components/faq-section";
import { ContactSection } from "@/components/contact-section";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <LanguageProvider>
      <MotionConfig reducedMotion="user">
        <Header />
        <main>
          <HeroSection />
          <RolesSection />
          <FeaturesSection />
          <RemindersSection />
          <StudentsSection />
          <PricingSection />
          <FaqSection />
          <ContactSection />
        </main>
        <Footer />
      </MotionConfig>
    </LanguageProvider>
  );
}
