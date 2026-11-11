"use client";

import { useLanguage } from "@/lib/i18n";
import { CONTACT_EMAIL, INSTAGRAM_URL, WHATSAPP_NUMBER } from "@/lib/contact";
import { LANGUAGES, LANGUAGE_INFO, LOGIN_URL, SIGNUP_URL, localePath } from "@/lib/site";
import { usePagePart } from "@/components/lp/site-header";
import { Instagram, Mail, WhatsApp } from "@/components/lp/icons";

/** The close of every page: the logo on deep green, how to reach us, and the links. */
export function SiteFooter() {
  const { t, language, setLanguage, href } = useLanguage();
  const page = usePagePart();
  const f = t.lp.footer;
  const nav = t.lp.nav;

  const social = [
    { label: f.whatsapp, href: `https://wa.me/${WHATSAPP_NUMBER.replace(/\D/g, "")}`, Icon: WhatsApp, external: true },
    { label: f.email, href: `mailto:${CONTACT_EMAIL}`, Icon: Mail, external: false },
    { label: f.instagram, href: INSTAGRAM_URL, Icon: Instagram, external: true },
  ];

  return (
    <footer className="footer">
      <div className="f-top">
        <div className="f-brand">
          <a href={href()} aria-label={nav.home}>
            <img src="/lp/logo-side-onDark.svg" alt="حافظ HAFIZ" width={176} height={56} />
          </a>
          <p>{f.about}</p>
          <div className="f-social">
            {social.map(({ label, href: link, Icon, external }) => (
              <a key={label} href={link} aria-label={label} title={label} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
                <Icon />
              </a>
            ))}
          </div>
        </div>
        <nav className="f-col" aria-labelledby="f-product">
          <h3 id="f-product">{f.product}</h3>
          <ul>
            <li><a href={`${href()}#grade`}>{nav.grade}</a></li>
            <li><a href={`${href()}#messages`}>{nav.messages}</a></li>
            <li><a href={`${href()}#staff`}>{nav.staff}</a></li>
            <li><a href={`${href()}#pricing`}>{nav.pricing}</a></li>
          </ul>
        </nav>
        <nav className="f-col" aria-labelledby="f-start">
          <h3 id="f-start">{f.start}</h3>
          <ul>
            <li><a href={`${SIGNUP_URL}?plan=free&lang=${language}`}>{f.signup}</a></li>
            <li><a href={LOGIN_URL}>{f.login}</a></li>
            <li><a href={`${href()}#faq`}>{f.faq}</a></li>
          </ul>
        </nav>
        <nav className="f-col" aria-labelledby="f-legal">
          <h3 id="f-legal">{f.legal}</h3>
          <ul>
            <li><a href={href("/privacy")}>{f.privacy}</a></li>
            <li><a href={href("/terms")}>{f.terms}</a></li>
          </ul>
        </nav>
        <nav className="f-col" aria-labelledby="f-lang">
          <h3 id="f-lang">{f.language}</h3>
          <ul>
            {LANGUAGES.map((lang) => (
              <li key={lang}>
                {/* Plain links to every language: people switch here, crawlers find each language's page. */}
                <a
                  href={localePath(lang, page)}
                  lang={lang}
                  hrefLang={lang}
                  aria-current={lang === language ? "page" : undefined}
                  onClick={(e) => {
                    e.preventDefault();
                    setLanguage(lang);
                  }}
                >
                  {LANGUAGE_INFO[lang].label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div className="f-bottom">
        <span>
          <span className="ltr">© {new Date().getFullYear()}</span> {t.nav.brand}. {f.rights}
        </span>
        <span className="ltr">alhafiz.app</span>
      </div>
    </footer>
  );
}
