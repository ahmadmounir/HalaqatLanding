"use client";

import { Bell, MonitorSmartphone, Send, type LucideIcon } from "lucide-react";
import { useLanguage, type Translations } from "@/lib/i18n";
import { Reveal, Stagger, StaggerItem } from "@/components/motion";
import { SectionHeading } from "@/components/section-heading";
import { MessageCard } from "@/components/product-mocks";

type PointKey = keyof Translations["reminders"]["points"];
type ChannelKey = keyof Translations["reminders"]["channels"];

const POINTS: PointKey[] = ["student", "teacher", "wording", "log"];
const CHANNELS: { key: ChannelKey; icon: LucideIcon }[] = [
  { key: "app", icon: Bell },
  { key: "browser", icon: MonitorSmartphone },
  { key: "telegram", icon: Send },
];

export function RemindersSection() {
  const { t } = useLanguage();

  return (
    <section id="reminders" className="section border-t border-line bg-surface">
      <div className="container-page grid items-center gap-14 lg:grid-cols-[1fr_0.9fr] lg:gap-20">
        <div>
          <SectionHeading
            label={t.reminders.label}
            title={t.reminders.title}
            subtitle={t.reminders.subtitle}
          />

          <Stagger className="mt-10 grid gap-x-10 gap-y-8 sm:grid-cols-2">
            {POINTS.map((key) => (
              <StaggerItem key={key} className="border-t border-line pt-5">
                <h3 className="text-[1.0625rem] font-semibold text-ink">
                  {t.reminders.points[key].title}
                </h3>
                <p className="mt-2 text-[0.9375rem] leading-relaxed text-muted-foreground">
                  {t.reminders.points[key].description}
                </p>
              </StaggerItem>
            ))}
          </Stagger>
        </div>

        <div className="rounded-3xl bg-sand p-5 sm:p-8">
          <Stagger gap={0.14} className="space-y-4">
            <StaggerItem className="sm:me-10">
              <MessageCard
                to={t.mock.toStudent}
                text={t.mock.msgStudent}
                channel={t.reminders.channels.telegram}
              />
            </StaggerItem>
            <StaggerItem className="sm:ms-10">
              <MessageCard
                to={t.mock.toTeacher}
                text={t.mock.msgTeacher}
                channel={t.reminders.channels.app}
              />
            </StaggerItem>
          </Stagger>

          <Reveal delay={0.2} className="mt-7 border-t border-line-strong/60 pt-6">
            <p className="text-[0.9375rem] font-semibold text-ink">
              {t.reminders.channelsTitle}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              {t.reminders.channelsText}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {CHANNELS.map((channel) => (
                <span
                  key={channel.key}
                  className="inline-flex items-center gap-2 rounded-full border border-line-strong/70 bg-surface px-3.5 py-2 text-sm text-ink"
                >
                  <channel.icon className="h-4 w-4 text-green" strokeWidth={1.8} />
                  {t.reminders.channels[channel.key]}
                </span>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
