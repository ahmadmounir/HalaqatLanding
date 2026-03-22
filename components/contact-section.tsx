"use client";

import { FormEvent, useState } from "react";
import { motion } from "framer-motion";
import { Mail, Linkedin, Github, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useLanguage } from "@/lib/i18n";
import { openWhatsAppContact } from "@/lib/whatsapp";

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
    <section
      id="contact"
      className="relative overflow-hidden border-t border-border py-20 md:py-28"
    >
      <div className="absolute inset-0 -z-10 bg-background" />
      <div className="absolute inset-0 -z-10 opacity-[0.06]">
        <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern
              id="contact-grid"
              x="0"
              y="0"
              width="32"
              height="32"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M32 0H0V32"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.7"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#contact-grid)" />
        </svg>
      </div>

      <div className="container mx-auto max-w-6xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className={`mb-10 text-center`}
        >
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground md:text-5xl">
            {t.contact.title}
          </h2>
          <p className="mx-auto max-w-3xl text-lg text-muted-foreground">
            {t.contact.subtitle}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          className="mx-auto max-w-5xl rounded-3xl border border-border/60 bg-card/70 p-6 shadow-[0_0_80px_-35px_rgba(16,185,129,0.5)] backdrop-blur md:p-10"
        >
          <form onSubmit={handleSubmit} className="space-y-5">
            <div
              className={`grid gap-4 md:grid-cols-2`}
            >
              <Input
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder={t.contact.namePlaceholder}
                className="h-12"
                aria-label={t.contact.namePlaceholder}
              />
              <Input
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder={t.contact.emailPlaceholder}
                className="h-12"
                aria-label={t.contact.emailPlaceholder}
                type="email"
              />
            </div>

            <Textarea
              value={messageText}
              onChange={(event) => setMessageText(event.target.value)}
              placeholder={t.contact.messagePlaceholder}
              className="min-h-44"
              aria-label={t.contact.messagePlaceholder}
            />

            <Button type="submit" disabled={!canSend} className="h-12 w-full">
              <MessageCircle className={`h-5 w-5 `} />
              {t.contact.sendWhatsapp}
            </Button>
          </form>

          <div className="mt-8 border-t border-border/60 pt-6">
            <div
              className={`flex flex-wrap items-center justify-center gap-5 text-muted-foreground`}
            >
              <a
                href="mailto:ahmadmallak2004@gmail.com"
                className="inline-flex items-center gap-2 transition-colors hover:text-foreground"
              >
                <Mail className="h-4 w-4" />
                <span>{process.env.NEXT_PUBLIC_EMAIL}</span>
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
