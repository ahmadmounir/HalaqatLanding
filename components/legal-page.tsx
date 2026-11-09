"use client";

import { useLanguage } from "@/lib/i18n";
import { legalContent, type LegalDocumentType } from "@/lib/legal-content";
import { SiteHeader } from "@/components/lp/site-header";
import { SiteFooter } from "@/components/lp/site-footer";

/** Privacy policy / terms in the page's language, with the landing's header and footer. */
export function LegalPage({ documentType }: { documentType: LegalDocumentType }) {
  const { language, href } = useLanguage();
  const localeContent = legalContent[language];
  const document = localeContent[documentType];

  return (
    <div className="legal-page">
      <SiteHeader />
      <main className="legal">
        <h1>{document.title}</h1>
        <p className="legal-meta">
          {document.lastUpdatedLabel}: <span className="ltr">{document.lastUpdated}</span>
        </p>
        <a className="link legal-back" href={href()}>
          {localeContent.backToHome}
        </a>
        <article className="legal-body">
          <section className="legal-block">
            <h2>{document.aboutTitle}</h2>
            <p>{document.aboutText}</p>
          </section>
          {document.sections.map((section) => (
            <section key={section.title} className="legal-block">
              <h2>{section.title}</h2>
              <ul>
                {section.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>
          ))}
        </article>
      </main>
      <SiteFooter />
    </div>
  );
}
