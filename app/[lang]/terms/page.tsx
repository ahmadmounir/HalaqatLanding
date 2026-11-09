import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LegalPage } from "@/components/legal-page";
import { legalContent } from "@/lib/legal-content";
import { jsonLd, legalStructuredData, pageMetadata } from "@/lib/seo";
import { isLanguage } from "@/lib/site";
import { translations } from "@/lib/translations";

export async function generateMetadata({ params }: PageProps<"/[lang]/terms">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLanguage(lang)) notFound();
  const document = legalContent[lang].terms;
  return pageMetadata(lang, "/terms", {
    title: `${document.title} | ${translations[lang].seo.siteName}`,
    description: document.aboutText,
  });
}

export default async function TermsPage({ params }: PageProps<"/[lang]/terms">) {
  const { lang } = await params;
  if (!isLanguage(lang)) notFound();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(legalStructuredData(lang, "/terms", legalContent[lang].terms.title)) }}
      />
      <LegalPage documentType="terms" />
    </>
  );
}
