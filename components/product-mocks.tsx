"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";
import {
  BarChart3,
  Bell,
  BookOpen,
  Check,
  Download,
  LayoutGrid,
  Lock,
  MessageSquare,
  Users,
} from "lucide-react";
import { useLanguage } from "@/lib/i18n";
import { LogoTile } from "@/components/brand/logo";
import { EASE } from "@/components/motion";
import { cn } from "@/lib/utils";

/*
  Small drawings of the product, built from the same tokens as the page.
  They show sample data only.
*/

function Frame({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl border border-line bg-surface shadow-lift",
        className,
      )}
    >
      {children}
    </div>
  );
}

function AppBar({ title, trailing }: { title: string; trailing?: ReactNode }) {
  return (
    <div className="flex h-12 items-center justify-between border-b border-line px-4">
      <div className="flex items-center gap-2.5">
        <LogoTile className="h-6 w-6" />
        <span className="text-sm font-medium text-ink">{title}</span>
      </div>
      {trailing}
    </div>
  );
}

/** A bar that grows from the reading side when it scrolls into view. */
function Bar({
  value,
  className,
  delay = 0,
}: {
  value: number;
  className?: string;
  delay?: number;
}) {
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-sand">
      <motion.div
        className={cn(
          "h-full origin-left rounded-full bg-green rtl:origin-right",
          className,
        )}
        style={{ width: `${value}%` }}
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.9, ease: EASE, delay }}
      />
    </div>
  );
}

export function DashboardMock({ className }: { className?: string }) {
  const { t } = useLanguage();
  const nav = [
    { icon: LayoutGrid, label: t.mock.dashboard, active: true },
    { icon: Users, label: t.mock.students },
    { icon: BookOpen, label: t.mock.halaqat },
    { icon: BarChart3, label: t.mock.statistics },
    { icon: MessageSquare, label: t.mock.messages },
  ];
  const stats = [
    { label: t.mock.students, value: "148" },
    { label: t.mock.pages, value: "312" },
    { label: t.mock.attendance, value: "94%" },
  ];
  const halaqat = [
    { value: 92, pages: 86 },
    { value: 78, pages: 73 },
    { value: 64, pages: 60 },
    { value: 51, pages: 48 },
  ];

  return (
    <Frame className={className}>
      <AppBar
        title={t.mock.school}
        trailing={
          <span className="relative text-muted-foreground">
            <Bell className="h-4 w-4" />
            <span className="absolute -end-0.5 -top-0.5 h-1.5 w-1.5 rounded-full bg-gold" />
          </span>
        }
      />
      <div className="flex">
        <div className="hidden w-40 shrink-0 flex-col gap-0.5 border-e border-line p-2.5 sm:flex">
          {nav.map((item) => (
            <div
              key={item.label}
              className={cn(
                "flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[0.8125rem]",
                item.active
                  ? "bg-green-tint font-medium text-ink"
                  : "text-muted-foreground",
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </div>
          ))}
        </div>

        <div className="min-w-0 flex-1 p-4 sm:p-5">
          <div className="grid grid-cols-3 divide-x divide-line rounded-xl border border-line rtl:divide-x-reverse">
            {stats.map((stat) => (
              <div key={stat.label} className="px-3 py-3 sm:px-4">
                <p className="text-xl font-semibold tabular-nums text-ink sm:text-2xl">
                  {stat.value}
                </p>
                <p className="mt-0.5 truncate text-xs text-muted-foreground">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>

          <p className="mb-3 mt-5 text-[0.8125rem] font-medium text-ink">
            {t.mock.halaqaProgress}
          </p>
          <div className="space-y-3.5">
            {halaqat.map((row, index) => (
              <div key={index} className="flex items-center gap-3">
                <span className="w-16 shrink-0 truncate text-[0.8125rem] text-ink sm:w-20">
                  {t.mock.halaqaNames[index]}
                </span>
                <Bar value={row.value} delay={0.3 + index * 0.08} />
                <span className="w-7 shrink-0 text-end text-xs tabular-nums text-muted-foreground">
                  {row.pages}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Frame>
  );
}

export function SeasonsMock({ className }: { className?: string }) {
  const { t } = useLanguage();
  const rows = [
    { before: [62, 71], after: [86, 92] },
    { before: [58, 66], after: [73, 78] },
    { before: [49, 60], after: [60, 64] },
    { before: [40, 52], after: [48, 51] },
  ];

  return (
    <Frame className={className}>
      <AppBar
        title={t.mock.seasonCompare}
        trailing={
          <span className="inline-flex items-center gap-1.5 rounded-full border border-line px-2.5 py-1 text-xs text-ink">
            <Download className="h-3.5 w-3.5" />
            {t.mock.export}
          </span>
        }
      />
      <div className="p-4 sm:p-5">
        <div className="grid grid-cols-[4.5rem_1fr_1fr] items-center gap-x-4 gap-y-4 sm:grid-cols-[6rem_1fr_1fr]">
          <span />
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
            {t.mock.seasonNames[0]}
            <span className="inline-flex items-center gap-1 rounded-full bg-sand px-1.5 py-0.5 text-[0.6875rem] text-ink">
              <Lock className="h-3 w-3" />
              {t.mock.saved}
            </span>
          </span>
          <span className="text-xs font-medium text-ink">
            {t.mock.seasonNames[1]}
          </span>

          {rows.map((row, index) => (
            <div key={index} className="contents">
              <span className="truncate text-[0.8125rem] text-ink">
                {t.mock.halaqaNames[index]}
              </span>
              <div className="flex items-center gap-2">
                <Bar
                  value={row.before[1]}
                  className="bg-line-strong"
                  delay={index * 0.06}
                />
                <span className="w-6 text-xs tabular-nums text-muted-foreground">
                  {row.before[0]}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Bar value={row.after[1]} delay={0.15 + index * 0.06} />
                <span className="w-6 text-xs font-medium tabular-nums text-ink">
                  {row.after[0]}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Frame>
  );
}

type Mark = "reminder" | "minor" | "mistake";

const MARK_STYLE: Record<Mark, string> = {
  reminder: "bg-mark-reminder",
  minor: "bg-mark-minor",
  mistake: "bg-mark-mistake",
};

/** Word widths of a made-up page; three of them carry a mark. */
const PAGE_LINES: { width: number; mark?: Mark }[][] = [
  [{ width: 11 }, { width: 15 }, { width: 9 }, { width: 18 }, { width: 12 }, { width: 14 }],
  [{ width: 16 }, { width: 10, mark: "reminder" }, { width: 13 }, { width: 19 }, { width: 11 }],
  [{ width: 9 }, { width: 17 }, { width: 12 }, { width: 14 }, { width: 10 }, { width: 16 }],
  [{ width: 14 }, { width: 12 }, { width: 18, mark: "mistake" }, { width: 9 }, { width: 15 }],
  [{ width: 12 }, { width: 16 }, { width: 10 }, { width: 13, mark: "minor" }, { width: 17 }, { width: 9 }],
  [{ width: 18 }, { width: 11 }, { width: 14 }, { width: 12 }],
];

export function MushafMock({ className }: { className?: string }) {
  const { t } = useLanguage();
  const legend: { mark: Mark; label: string; points: string }[] = [
    { mark: "reminder", label: t.mock.reminder, points: "−1" },
    { mark: "minor", label: t.mock.minor, points: "−2" },
    { mark: "mistake", label: t.mock.mistake, points: "−4" },
  ];

  return (
    <Frame className={className}>
      <div className="flex h-12 items-center justify-between border-b border-line px-4">
        <span className="text-sm font-medium text-ink">{t.mock.studentName}</span>
        <span className="text-xs text-muted-foreground">
          {t.mock.memorization} · {t.mock.page.replace("{n}", "77")}
        </span>
      </div>

      {/* The Mushaf always reads right to left. */}
      <div dir="rtl" className="space-y-4 bg-paper px-5 py-6 sm:px-8">
        {PAGE_LINES.map((line, lineIndex) => (
          <div key={lineIndex} className="flex justify-between gap-2">
            {line.map((word, wordIndex) => (
              <motion.span
                key={wordIndex}
                className={cn(
                  "h-2.5 rounded-full",
                  word.mark ? MARK_STYLE[word.mark] : "bg-ink/15",
                )}
                style={{ width: `${word.width}%` }}
                initial={word.mark ? { opacity: 0.25 } : false}
                whileInView={word.mark ? { opacity: 1 } : undefined}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.5 + lineIndex * 0.25 }}
              />
            ))}
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-line px-4 py-3">
        {legend.map((item) => (
          <span
            key={item.mark}
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground"
          >
            <span className={cn("h-2 w-2 rounded-full", MARK_STYLE[item.mark])} />
            {item.label}
            <span className="tabular-nums text-ink" dir="ltr">
              {item.points}
            </span>
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between border-t border-line px-4 py-3">
        <div className="flex items-baseline gap-2">
          <span className="text-xs text-muted-foreground">{t.mock.score}</span>
          <span className="text-2xl font-semibold tabular-nums text-ink">93</span>
        </div>
        <span className="inline-flex h-9 items-center rounded-full bg-ink px-4 text-[0.8125rem] font-medium text-white">
          {t.mock.submit}
        </span>
      </div>
    </Frame>
  );
}

export function StudentMock({ className }: { className?: string }) {
  const { t } = useLanguage();
  const stats = [
    { label: t.mock.pages, value: "214" },
    { label: t.mock.accuracy, value: "96%" },
    { label: t.mock.attendance, value: "98%" },
  ];

  return (
    <div
      className={cn(
        "mx-auto w-full max-w-[19rem] overflow-hidden rounded-[2rem] border border-line bg-surface p-2 shadow-lift",
        className,
      )}
    >
      <div className="overflow-hidden rounded-[1.5rem] bg-paper">
        <div className="bg-ink px-5 pb-6 pt-5 text-white">
          <div className="flex items-center justify-between">
            <LogoTile className="h-7 w-7 bg-white/10" />
            <Bell className="h-4 w-4 text-white/70" />
          </div>
          <p className="mt-5 text-[0.9375rem] font-medium">{t.mock.greeting}</p>
        </div>

        <div className="-mt-3 space-y-3 px-3 pb-4">
          <div className="rounded-2xl border border-line bg-surface p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">
                {t.mock.nextSession}
              </span>
              <span className="rounded-full bg-gold-tint px-2 py-0.5 text-xs font-medium text-gold-ink">
                {t.mock.tomorrow}
              </span>
            </div>
            <div className="mt-3 space-y-2.5">
              {[
                { kind: t.mock.memorization, what: t.mock.surahA, tone: "bg-green" },
                { kind: t.mock.revision, what: t.mock.surahB, tone: "bg-gold" },
              ].map((row) => (
                <div key={row.kind} className="flex items-center gap-3">
                  <span className={cn("h-8 w-1 rounded-full", row.tone)} />
                  <div>
                    <p className="text-xs text-muted-foreground">{row.kind}</p>
                    <p className="text-sm font-medium text-ink">{row.what}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl border border-line bg-surface px-2 py-3 text-center"
              >
                <p className="text-base font-semibold tabular-nums text-ink">
                  {stat.value}
                </p>
                <p className="mt-0.5 truncate text-[0.6875rem] text-muted-foreground">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function MessageCard({
  to,
  text,
  channel,
  className,
}: {
  to: string;
  text: string;
  channel: string;
  className?: string;
}) {
  const { t } = useLanguage();

  return (
    <div
      className={cn(
        "rounded-2xl border border-line bg-surface p-4 shadow-card",
        className,
      )}
    >
      <div className="flex items-center gap-2.5">
        <LogoTile className="h-7 w-7" />
        <div className="min-w-0 flex-1">
          <p className="text-[0.8125rem] font-medium text-ink">{t.nav.brand}</p>
          <p className="text-[0.6875rem] text-muted-foreground">{to}</p>
        </div>
        <span className="text-[0.6875rem] tabular-nums text-muted-foreground">
          {t.mock.today}
        </span>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-ink">{text}</p>
      <p className="mt-3 flex items-center gap-1.5 text-xs text-green">
        <Check className="h-3.5 w-3.5" />
        {t.mock.delivered} · {channel}
      </p>
    </div>
  );
}

/** Memorized share of each of the 30 juz, in quarters. */
const JUZ_LEVELS = [
  4, 4, 4, 4, 3, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 4, 4,
];
const JUZ_TONE = [
  "bg-white/[0.06] text-white/35",
  "bg-gold/25 text-white/70",
  "bg-gold/45 text-white/80",
  "bg-gold/70 text-ink",
  "bg-gold text-ink",
];
const THEME_COLORS = ["#1f6b52", "#6b4fa3", "#2f6fb0", "#c9772b"];

export function QuranMapMock({ className }: { className?: string }) {
  const { t } = useLanguage();

  return (
    <div className={cn("space-y-3", className)}>
      <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm font-medium text-white">{t.mock.quranMap}</p>
          <p className="text-xs text-white/60">
            {t.mock.memorized} · <span className="tabular-nums">7 / 30</span>
          </p>
        </div>
        <div className="grid grid-cols-6 gap-1.5 sm:grid-cols-10">
          {JUZ_LEVELS.map((level, index) => (
            <motion.div
              key={index}
              className={cn(
                "flex aspect-square items-center justify-center rounded-lg text-xs font-medium tabular-nums",
                JUZ_TONE[level],
              )}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, ease: EASE, delay: index * 0.015 }}
            >
              {index + 1}
            </motion.div>
          ))}
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-[1.4fr_1fr]">
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
          <div className="flex items-center justify-between">
            <p className="text-xs text-white/60">{t.mock.goal}</p>
            <span className="rounded-full bg-gold/20 px-2 py-0.5 text-xs font-medium text-gold">
              {t.mock.onTrack}
            </span>
          </div>
          <p className="mt-2 text-sm font-medium text-white">{t.mock.goalText}</p>
          <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/10">
            <motion.div
              className="h-full origin-left rounded-full bg-gold rtl:origin-right"
              style={{ width: "68%" }}
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: EASE, delay: 0.3 }}
            />
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
          <p className="text-xs text-white/60">{t.mock.themeColor}</p>
          <div className="mt-3 flex gap-2.5">
            {THEME_COLORS.map((color, index) => (
              <span
                key={color}
                className={cn(
                  "h-7 w-7 rounded-full",
                  index === 0 &&
                    "ring-2 ring-white ring-offset-2 ring-offset-ink",
                )}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
