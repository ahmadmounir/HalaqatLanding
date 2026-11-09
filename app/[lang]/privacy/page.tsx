import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LegalPage } from "@/components/legal-page";
import { legalContent } from "@/lib/legal-content";
import { jsonLd, legalStructuredData, pageMetadata } from "@/lib/seo";
import { isLanguage } from "@/lib/site";
import { translations } from "@/lib/translations";

export async function generateMetadata({ params }: PageProps<"/[lang]/privacy">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLanguage(lang)) notFound();
  const document = legalContent[lang].privacy;
  return pageMetadata(lang, "/privacy", {
    title: `${document.title} | ${translations[lang].seo.siteName}`,
    description: document.aboutText,
  });
}

export default async function PrivacyPage({ params }: PageProps<"/[lang]/privacy">) {
  const { lang } = await params;
  if (!isLanguage(lang)) notFound();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(legalStructuredData(lang, "/privacy", legalContent[lang].privacy.title)) }}
      />
      <LegalPage documentType="privacy" />
    </>
  );
}
