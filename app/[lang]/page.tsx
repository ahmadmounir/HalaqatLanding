import type { Metadata } from "next";
import { notFound } from "next/navigation";
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
import { homeStructuredData, jsonLd, pageMetadata } from "@/lib/seo";
import { isLanguage } from "@/lib/site";

export async function generateMetadata({ params }: PageProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLanguage(lang)) notFound();
  return pageMetadata(lang, "");
}

export default async function Home({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLanguage(lang)) notFound();

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(homeStructuredData(lang)) }} />
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
    </>
  );
}
