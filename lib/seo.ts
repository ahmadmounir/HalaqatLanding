// Metadata and structured data (JSON-LD) per language: what search engines and link previews (WhatsApp,
// Telegram, X, LinkedIn, Facebook) read.
import type { Metadata } from "next";
import { translations } from "@/lib/translations";
import { CONTACT_EMAIL, INSTAGRAM_URL, WHATSAPP_NUMBER } from "@/lib/contact";
import { PERIODS, PLAN_ORDER, PLAN_STUDENTS, PRICES, type PlanId } from "@/lib/plans";
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
/** The page's own screenshots (same files and the same alt texts as on the page). */
function screenshots(language: Language) {
  const lp = translations[language].lp;
  const shot = (path: string, width: number, height: number, caption: string) => ({
    "@type": "ImageObject",
    url: `${SITE_URL}${path}`,
    contentUrl: `${SITE_URL}${path}`,
    width,
    height,
    caption,
  });
  return [
    shot("/lp/dashboard.webp", 1220, 760, lp.admin.alt1),
    shot("/lp/dashboard-form.webp", 1220, 760, lp.admin.alt2),
    shot("/lp/staff-grading.webp", 540, 1000, lp.staff.screens[0].alt),
    shot("/lp/student-home.webp", 540, 1960, lp.apps.screens[0].alt),
    shot("/lp/parent-child.webp", 540, 1169, lp.apps.screens[4].alt),
  ];
}

/** One offer per priced plan and period, as the cards show them (Enterprise has no public price, so no offer). */
function offers(language: Language, pageUrl: string) {
  const p = translations[language].lp.pricing;
  const students = (id: PlanId) => {
    const range = PLAN_STUDENTS[id];
    return { "@type": "QuantitativeValue", minValue: range.min, ...(range.max ? { maxValue: range.max } : {}) };
  };
  return PLAN_ORDER.flatMap((id): Record<string, unknown>[] => {
    const price = PRICES[id];
    const plan = p.plans[id];
    const base = { "@type": "Offer", priceCurrency: "USD", availability: "https://schema.org/InStock", url: `${pageUrl}#pricing`, eligibleQuantity: students(id) };
    if (price === "free") return [{ ...base, name: plan.name, description: plan.students, price: "0", category: "free" }];
    if (price === "custom") return [];
    return PERIODS.map((period) => ({
      ...base,
      name: `${plan.name} · ${p.periodNames[period]}`,
      description: plan.students,
      price: String(price[period]),
      priceSpecification: {
        "@type": "UnitPriceSpecification",
        price: String(price[period]),
        priceCurrency: "USD",
        billingDuration: period === "annual" ? "P1Y" : "P6M",
      },
    }));
  });
}

export function homeStructuredData(language: Language) {
  const t = translations[language];
  const url = `${SITE_URL}${localePath(language)}`;
  const organizationId = `${SITE_URL}/#organization`;
  const websiteId = `${SITE_URL}/#website`;
  const phone = `+${WHATSAPP_NUMBER.replace(/\D/g, "")}`;
  const languages = ["Arabic", "English", "Turkish"];
  // Several products share the name «حافظ» (SEO audit 2026-11-15, GEO-01): always with the domain and what it does.
  const names = ["حافظ", "Hafiz", "Hafız", "alhafiz.app"].filter((name) => name !== t.seo.siteName);

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": organizationId,
        name: t.seo.siteName,
        alternateName: names,
        url: SITE_URL,
        description: t.lp.footer.about,
        disambiguatingDescription: t.seo.disambiguation,
        logo: {
          "@type": "ImageObject",
          "@id": `${SITE_URL}/#logo`,
          url: `${SITE_URL}${LOGO_PATH}`,
          contentUrl: `${SITE_URL}${LOGO_PATH}`,
          width: 512,
          height: 512,
        },
        image: { "@id": `${SITE_URL}/#logo` },
        email: CONTACT_EMAIL,
        sameAs: [INSTAGRAM_URL],
        contactPoint: [
          { "@type": "ContactPoint", contactType: "customer support", email: CONTACT_EMAIL, telephone: phone, availableLanguage: languages },
          // The paid plans are sold over WhatsApp
          { "@type": "ContactPoint", contactType: "sales", telephone: phone, availableLanguage: languages },
        ],
      },
      {
        "@type": "WebSite",
        "@id": websiteId,
        name: t.seo.siteName,
        alternateName: names,
        url: SITE_URL,
        description: t.seo.description,
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
        hasPart: { "@id": `${url}#faq` },
        primaryImageOfPage: {
          "@type": "ImageObject",
          url: `${SITE_URL}${shareImagePath(language)}`,
          width: SHARE_IMAGE.width,
          height: SHARE_IMAGE.height,
        },
      },
      {
        "@type": "WebApplication",
        "@id": `${SITE_URL}/#app`,
        name: t.seo.siteName,
        alternateName: names,
        url,
        description: t.lp.hero.lead,
        disambiguatingDescription: t.seo.disambiguation,
        applicationCategory: "EducationalApplication",
        applicationSubCategory: t.seo.appCategory,
        // A web app, installed from the browser (PWA); not in the app stores yet.
        operatingSystem: "Web",
        browserRequirements: "A current web browser; installable as a web app (PWA) on Android, iOS and computers.",
        inLanguage: [...LANGUAGES],
        audience: { "@type": "Audience", audienceType: t.seo.audience },
        image: `${SITE_URL}${shareImagePath(language)}`,
        screenshot: screenshots(language),
        featureList: [...t.lp.pricing.included, ...t.lp.admin.facts.slice(0, 2)],
        publisher: { "@id": organizationId },
        offers: offers(language, url),
      },
      {
        "@type": "FAQPage",
        "@id": `${url}#faq`,
        inLanguage: language,
        mainEntity: t.lp.faq.items.map((item) => ({
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
