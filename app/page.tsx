"use client";

import { LanguageProvider } from "@/lib/i18n";
import { Header } from "@/components/header";
import { HeroSection } from "@/components/hero-section";
import { FeaturesSection } from "@/components/features-section";
import { OrganizationsSection } from "@/components/organizations-section";
import { ExperienceSection } from "@/components/experience-section";
import { SocialProofSection } from "@/components/social-proof-section";
import { CTASection } from "@/components/cta-section";
import { ContactSection } from "@/components/contact-section";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <LanguageProvider>
      <main className="min-h-screen">
        <Header />
        <HeroSection />
        <FeaturesSection />
        <OrganizationsSection />
        <ExperienceSection />
        <SocialProofSection />
        <ContactSection />
        <Footer />
      </main>
    </LanguageProvider>
  );
}
