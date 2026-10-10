"use client";

import {
  BarChart3,
  BookOpenCheck,
  ClipboardList,
  FileQuestion,
  Languages,
  Lock,
  ShieldCheck,
  Trophy,
  UserCog,
  type LucideIcon,
} from "lucide-react";
import { useLanguage, type Translations } from "@/lib/i18n";
import { Stagger, StaggerItem } from "@/components/motion";
import { SectionHeading } from "@/components/section-heading";

type GroupKey = keyof Translations["features"]["groups"];
type ItemKey = keyof Translations["features"]["items"];

const GROUPS: { key: GroupKey; items: { key: ItemKey; icon: LucideIcon }[] }[] = [
  {
    key: "teaching",
    items: [
      { key: "recitation", icon: ClipboardList },
      { key: "mushaf", icon: BookOpenCheck },
      { key: "exams", icon: FileQuestion },
    ],
  },
  {
    key: "progress",
    items: [
      { key: "statistics", icon: BarChart3 },
      { key: "seasons", icon: Lock },
      { key: "leaderboards", icon: Trophy },
    ],
  },
  {
    key: "organization",
    items: [
      { key: "roles", icon: UserCog },
      { key: "security", icon: ShieldCheck },
      { key: "languages", icon: Languages },
    ],
  },
];

export function FeaturesSection() {
  const { t } = useLanguage();

  return (
    <section id="features" className="section">
      <div className="container-page">
        <SectionHeading
          label={t.features.label}
          title={t.features.title}
          subtitle={t.features.subtitle}
        />

        <div className="mt-14 border-t border-line">
          {GROUPS.map((group, groupIndex) => (
            <Stagger
              key={group.key}
              className="grid gap-x-10 gap-y-8 border-b border-line py-10 lg:grid-cols-[12rem_1fr]"
            >
              <StaggerItem className="flex items-baseline gap-3 lg:flex-col lg:gap-2">
                <span className="text-sm tabular-nums text-gold-ink">
                  0{groupIndex + 1}
                </span>
                <h3 className="subheading">{t.features.groups[group.key]}</h3>
              </StaggerItem>

              <div className="grid gap-x-10 gap-y-9 sm:grid-cols-3">
                {group.items.map((item) => (
                  <StaggerItem key={item.key} className="group">
                    <item.icon
                      className="h-6 w-6 text-green transition-transform duration-300 ease-brand group-hover:-translate-y-0.5"
                      strokeWidth={1.6}
                    />
                    <h4 className="mt-4 text-[1.0625rem] font-semibold text-ink">
                      {t.features.items[item.key].title}
                    </h4>
                    <p className="mt-2 text-[0.9375rem] leading-relaxed text-muted-foreground">
                      {t.features.items[item.key].description}
                    </p>
                  </StaggerItem>
                ))}
              </div>
            </Stagger>
          ))}
        </div>
      </div>
    </section>
  );
}
