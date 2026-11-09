// Metadata and structured data (JSON-LD) per language: what search engines and link previews (WhatsApp,
// Telegram, X, LinkedIn, Facebook) read.
import type { Metadata } from "next";
import { translations } from "@/lib/translations";
import { CONTACT_EMAIL, INSTAGRAM_URL, WHATSAPP_NUMBER } from "@/lib/contact";
import {
  LANGUAGES,
  LANGUAGE_INFO,
  SITE_URL,
  languageAlternates,
  localePath,
  type Language,
  type PagePath,
} from "@/lib/site";

/** The share picture: the hero's dashboard and message, 1200 × 630 (made from the hero, see scripts/share-images.md). */
export const SHARE_IMAGE = { width: 1200, height: 630, type: "image/jpeg" } as const;
export const shareImagePath = (language: Language) => `/og/hafiz-${language}.jpg`;

/** The brand's icon for the structured data (a square PNG, at least 112 px, crawlable). */
export const LOGO_PATH = "/icons/hafiz-dark-512.png";

/** Metadata of one page in one language: title, description, canonical + hreflang, share preview. */
export function pageMetadata(
  language: Language,
  page: PagePath,
  overrides: { title?: string; description?: string } = {},
): Metadata {
  const seo = translations[language].seo;
  const title = overrides.title ?? seo.title;
  const description = overrides.description ?? seo.description;
  const shareTitle = overrides.title ?? seo.shareTitle;
  const shareDescription = overrides.description ?? seo.shareDescription;
  const url = localePath(language, page);
  const image = {
    url: shareImagePath(language),
    width: SHARE_IMAGE.width,
    height: SHARE_IMAGE.height,
    type: SHARE_IMAGE.type,
    alt: seo.imageAlt,
  };

  return {
    title: { absolute: title },
    description,
    keywords: seo.keywords,
    alternates: { canonical: url, languages: languageAlternates(page) },
    openGraph: {
      type: "website",
      url,
      siteName: seo.siteName,
      title: shareTitle,
      description: shareDescription,
      locale: LANGUAGE_INFO[language].ogLocale,
      alternateLocale: LANGUAGES.filter((other) => other !== language).map((other) => LANGUAGE_INFO[other].ogLocale),
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title: shareTitle,
      description: shareDescription,
      images: [image],
    },
  };
}

/** Organization + website + the product + the FAQ, one graph per language (Google's rich results, Bing, AI search). */
export function homeStructuredData(language: Language) {
  const t = translations[language];
  const url = `${SITE_URL}${localePath(language)}`;
  const organizationId = `${SITE_URL}/#organization`;
  const websiteId = `${SITE_URL}/#website`;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": organizationId,
        name: "Hafiz",
        alternateName: ["حافظ", "Hafız", "alhafiz.app"],
        url: SITE_URL,
        logo: { "@type": "ImageObject", url: `${SITE_URL}${LOGO_PATH}`, width: 512, height: 512 },
        email: CONTACT_EMAIL,
        sameAs: [INSTAGRAM_URL],
        contactPoint: {
          "@type": "ContactPoint",
          contactType: "customer support",
          email: CONTACT_EMAIL,
          telephone: `+${WHATSAPP_NUMBER.replace(/\D/g, "")}`,
          availableLanguage: ["Arabic", "English", "Turkish"],
        },
      },
      {
        "@type": "WebSite",
        "@id": websiteId,
        name: "Hafiz",
        alternateName: ["حافظ", "Hafız"],
        url: SITE_URL,
        inLanguage: [...LANGUAGES],
        publisher: { "@id": organizationId },
      },
      {
        "@type": "WebPage",
        "@id": `${url}#webpage`,
        url,
        name: t.seo.title,
        description: t.seo.description,
        inLanguage: language,
        isPartOf: { "@id": websiteId },
        about: { "@id": `${SITE_URL}/#app` },
        primaryImageOfPage: { "@type": "ImageObject", url: `${SITE_URL}${shareImagePath(language)}` },
      },
      {
        "@type": "SoftwareApplication",
        "@id": `${SITE_URL}/#app`,
        name: t.seo.siteName,
        alternateName: "Hafiz",
        applicationCategory: "EducationalApplication",
        applicationSubCategory: t.seo.appCategory,
        operatingSystem: "Web, Android, iOS",
        url,
        description: t.seo.description,
        image: `${SITE_URL}${shareImagePath(language)}`,
        inLanguage: [...LANGUAGES],
        publisher: { "@id": organizationId },
        // The free plan (up to 20 students). The paid plans are on the page; Enterprise is priced per organization.
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
          category: "free",
          url: `${url}#pricing`,
        },
      },
      {
        "@type": "FAQPage",
        "@id": `${url}#faq`,
        inLanguage: language,
        mainEntity: t.faq.items.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: { "@type": "Answer", text: item.answer },
        })),
      },
    ],
  };
}

/** A legal page: what it is and where it sits (Home › Privacy). */
export function legalStructuredData(language: Language, page: PagePath, name: string) {
  const url = `${SITE_URL}${localePath(language, page)}`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${url}#webpage`,
        url,
        name,
        inLanguage: language,
        isPartOf: { "@id": `${SITE_URL}/#website` },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: translations[language].seo.siteName, item: `${SITE_URL}${localePath(language)}` },
          { "@type": "ListItem", position: 2, name, item: url },
        ],
      },
    ],
  };
}

/** JSON for a <script type="application/ld+json">, safe inside HTML. */
export function jsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
