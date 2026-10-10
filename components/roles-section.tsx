"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check } from "lucide-react";
import { useLanguage } from "@/lib/i18n";
import { EASE, Reveal } from "@/components/motion";
import { SectionHeading } from "@/components/section-heading";
import {
  MushafMock,
  SeasonsMock,
  StudentMock,
} from "@/components/product-mocks";
import { cn } from "@/lib/utils";

type Role = "admin" | "teacher" | "student";
const ROLES: Role[] = ["admin", "teacher", "student"];

export function RolesSection() {
  const { t } = useLanguage();
  const [role, setRole] = useState<Role>("teacher");
  const content = t.roles[role];

  return (
    <section id="roles" className="section border-t border-line bg-surface">
      <div className="container-page">
        <SectionHeading
          label={t.roles.label}
          title={t.roles.title}
          subtitle={t.roles.subtitle}
        />

        <Reveal className="mt-10">
          <div
            role="tablist"
            aria-label={t.roles.label}
            className="inline-flex rounded-full border border-line bg-paper p-1"
          >
            {ROLES.map((item) => (
              <button
                key={item}
                type="button"
                role="tab"
                id={`role-tab-${item}`}
                aria-selected={role === item}
                aria-controls="role-panel"
                onClick={() => setRole(item)}
                className={cn(
                  "relative h-10 rounded-full px-5 text-[0.9375rem] font-medium transition-colors duration-200",
                  role === item ? "text-white" : "text-muted-foreground hover:text-ink",
                )}
              >
                {role === item && (
                  <motion.span
                    layoutId="role-pill"
                    className="absolute inset-0 rounded-full bg-ink"
                    transition={{ type: "spring", stiffness: 380, damping: 34 }}
                  />
                )}
                <span className="relative">{t.roles[item].tab}</span>
              </button>
            ))}
          </div>
        </Reveal>

        <Reveal className="mt-8">
          <div
            id="role-panel"
            role="tabpanel"
            aria-labelledby={`role-tab-${role}`}
            className="grid items-center gap-10 rounded-3xl border border-line bg-paper p-6 sm:p-10 lg:grid-cols-[0.85fr_1fr] lg:gap-14 lg:p-14"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={`text-${role}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.3, ease: EASE }}
              >
                <h3 className="heading text-[clamp(1.5rem,2.4vw,2rem)]">
                  {content.title}
                </h3>
                <ul className="mt-6 space-y-4">
                  {content.points.map((point) => (
                    <li key={point} className="flex gap-3">
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green-tint text-green">
                        <Check className="h-3 w-3" strokeWidth={3} />
                      </span>
                      <span className="text-[1.0625rem] leading-relaxed text-ink">
                        {point}
                      </span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </AnimatePresence>

            <div className="flex min-h-[21rem] items-center">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={`mock-${role}`}
                  className="w-full"
                  initial={{ opacity: 0, y: 14, scale: 0.985 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.985 }}
                  transition={{ duration: 0.35, ease: EASE }}
                >
                  {role === "admin" && <SeasonsMock />}
                  {role === "teacher" && <MushafMock />}
                  {role === "student" && <StudentMock />}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
