"use client";

import { FormEvent, useState } from "react";
import { ArrowRight, Mail } from "lucide-react";
import { useLanguage } from "@/lib/i18n";
import { openWhatsAppContact } from "@/lib/whatsapp";
import { Reveal } from "@/components/motion";
import { SectionHeading } from "@/components/section-heading";
import { CONTACT_EMAIL } from "@/lib/contact";

const fieldClass =
  "w-full rounded-xl border border-line-strong bg-surface px-4 py-3 text-base text-ink placeholder:text-muted-foreground/70 transition-[border-color,box-shadow] duration-200 focus:border-green focus:outline-none focus:ring-4 focus:ring-green/15";

export function ContactSection() {
  const { t } = useLanguage();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [messageText, setMessageText] = useState("");

  const canSend = Boolean(name.trim() && email.trim() && messageText.trim());

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSend) {
      return;
    }

    openWhatsAppContact({
      name,
      email,
      message: messageText,
      template: t.contact.whatsapp.template,
    });
  };

  return (
    <section id="contact" className="section">
      <div className="container-page grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        <div>
          <SectionHeading
            label={t.contact.label}
            title={t.contact.title}
            subtitle={t.contact.subtitle}
          />
          {CONTACT_EMAIL ? (
            <Reveal delay={0.1} className="mt-8">
              <p className="text-sm text-muted-foreground">
                {t.contact.emailLabel}
              </p>
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="mt-1 inline-flex items-center gap-2 font-medium text-ink"
              >
                <Mail className="h-4 w-4 text-green" />
                <span className="link-underline pb-0.5" dir="ltr">
                  {CONTACT_EMAIL}
                </span>
              </a>
            </Reveal>
          ) : null}
        </div>

        <Reveal delay={0.1}>
          <form
            onSubmit={handleSubmit}
            className="card space-y-5 p-6 shadow-card sm:p-8"
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-ink">
                  {t.contact.name}
                </span>
                <input
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  className={fieldClass}
                  autoComplete="name"
                  required
                />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-ink">
                  {t.contact.email}
                </span>
                <input
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className={fieldClass}
                  type="email"
                  autoComplete="email"
                  dir="ltr"
                  required
                />
              </label>
            </div>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-ink">
                {t.contact.message}
              </span>
              <textarea
                value={messageText}
                onChange={(event) => setMessageText(event.target.value)}
                placeholder={t.contact.messagePlaceholder}
                className={`${fieldClass} min-h-36 resize-y`}
                required
              />
            </label>

            <button
              type="submit"
              className="btn btn-primary group w-full sm:w-auto"
              aria-disabled={!canSend}
            >
              {t.contact.sendWhatsapp}
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5" />
            </button>
          </form>
        </Reveal>
      </div>
    </section>
  );
}
