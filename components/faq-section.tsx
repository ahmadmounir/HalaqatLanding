"use client";

import { useLanguage } from "@/lib/i18n";
import { Reveal } from "@/components/motion";
import { SectionHeading } from "@/components/section-heading";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export function FaqSection() {
  const { t } = useLanguage();

  return (
    <section id="faq" className="section border-t border-line bg-surface">
      <div className="container-page grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        <SectionHeading label={t.faq.label} title={t.faq.title} />

        <Reveal>
          <Accordion type="single" collapsible defaultValue="faq-0">
            {t.faq.items.map((item, index) => (
              <AccordionItem
                key={item.question}
                value={`faq-${index}`}
                className="border-line"
              >
                <AccordionTrigger className="py-5 text-start text-[1.0625rem] font-semibold text-ink hover:no-underline">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="pb-6 text-base leading-relaxed text-muted-foreground">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
      </div>
    </section>
  );
}
