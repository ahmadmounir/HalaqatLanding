"use client";

import { useLanguage, type Translations } from "@/lib/i18n";
import { LogoMark } from "@/components/brand/logo";
import { Reveal, Stagger, StaggerItem } from "@/components/motion";
import { SectionHeading } from "@/components/section-heading";
import { QuranMapMock } from "@/components/product-mocks";

type ItemKey = keyof Translations["students"]["items"];
const ITEMS: ItemKey[] = ["map", "weak", "goals", "recap", "seasons", "look"];

export function StudentsSection() {
  const { t } = useLanguage();

  return (
    <section
      id="students"
      className="section relative overflow-hidden bg-ink text-white"
    >
      <LogoMark className="pointer-events-none absolute -bottom-40 -start-32 h-[36rem] w-[36rem] text-white/[0.035]" />

      <div className="container-page relative grid items-center gap-14 lg:grid-cols-[1fr_1fr] lg:gap-16">
        <div>
          <SectionHeading
            tone="light"
            label={t.students.label}
            title={t.students.title}
            subtitle={t.students.subtitle}
          />

          <Stagger className="mt-10 grid gap-x-10 gap-y-7 sm:grid-cols-2">
            {ITEMS.map((key) => (
              <StaggerItem key={key} className="border-t border-white/15 pt-4">
                <h3 className="font-semibold text-white">
                  {t.students.items[key].title}
                </h3>
                <p className="mt-1.5 text-[0.9375rem] leading-relaxed text-white/65">
                  {t.students.items[key].description}
                </p>
              </StaggerItem>
            ))}
          </Stagger>
        </div>

        <Reveal delay={0.1}>
          <QuranMapMock />
        </Reveal>
      </div>
    </section>
  );
}
