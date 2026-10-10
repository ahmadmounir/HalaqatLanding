"use client";

import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "@/lib/i18n";
import { LogoMark } from "@/components/brand/logo";
import { EASE, Stagger, StaggerItem } from "@/components/motion";
import { DashboardMock, MessageCard } from "@/components/product-mocks";

export function HeroSection() {
  const { t } = useLanguage();

  const stats = [
    { value: "3+", label: t.stats.organizations },
    { value: "150+", label: t.stats.students },
    { value: t.stats.languagesValue, label: t.stats.languages },
  ];

  return (
    <section className="relative overflow-hidden pb-16 pt-10 md:pb-24 md:pt-16">
      <LogoMark className="pointer-events-none absolute -end-40 -top-24 -z-10 h-[44rem] w-[44rem] text-ink/[0.035]" />

      <div className="container-page">
        <div className="grid items-center gap-14 lg:grid-cols-[1fr_1.08fr] lg:gap-12">
          <Stagger onLoad gap={0.08} className="max-w-xl">
            <StaggerItem>
              <p className="eyebrow">{t.hero.eyebrow}</p>
            </StaggerItem>
            <StaggerItem>
              <h1 className="display mt-5">
                {t.hero.title}{" "}
                <span className="text-green">{t.hero.titleAccent}</span>
              </h1>
            </StaggerItem>
            <StaggerItem>
              <p className="lead mt-6">{t.hero.subtitle}</p>
            </StaggerItem>
            <StaggerItem>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a href="#pricing" className="btn btn-primary group">
                  {t.hero.ctaPrimary}
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5" />
                </a>
                <a href="#roles" className="btn btn-secondary">
                  {t.hero.ctaSecondary}
                </a>
              </div>
            </StaggerItem>
            <StaggerItem>
              <p className="mt-5 text-sm text-muted-foreground">{t.hero.note}</p>
            </StaggerItem>
          </Stagger>

          <div className="relative lg:pb-36">
            <motion.div
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: EASE, delay: 0.2 }}
            >
              <DashboardMock />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.7, ease: EASE, delay: 0.75 }}
              className="relative mx-4 -mt-6 sm:mx-auto sm:max-w-sm lg:absolute lg:-end-6 lg:bottom-0 lg:mx-0 lg:mt-0 lg:w-[19rem]"
            >
              <MessageCard
                to={t.mock.toStudent}
                text={t.mock.msgStudent}
                channel={t.reminders.channels.telegram}
                className="shadow-lift"
              />
            </motion.div>
          </div>
        </div>

        <Stagger className="mt-16 grid gap-6 border-t border-line pt-8 sm:grid-cols-3 md:mt-20">
          {stats.map((stat) => (
            <StaggerItem key={stat.label} className="flex items-baseline gap-3">
              <span className="shrink-0 whitespace-nowrap text-3xl font-semibold tabular-nums tracking-tight text-ink">
                {stat.value}
              </span>
              <span className="text-sm text-muted-foreground">{stat.label}</span>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
