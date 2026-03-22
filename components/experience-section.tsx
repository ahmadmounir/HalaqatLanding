"use client"

import { CheckCircle2, BookOpen, RotateCcw, Target, Users, Calendar } from "lucide-react"
import { motion } from "framer-motion"
import { useLanguage } from "@/lib/i18n"

export function ExperienceSection() {
  const { t } = useLanguage()

  return (
    <section id="experience" className="border-t border-border bg-card py-20 md:py-28 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/4 top-0 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute right-1/4 bottom-0 h-96 w-96 rounded-full bg-accent/5 blur-3xl" />
      </div>

      <div className="container mx-auto max-w-6xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className={`mx-auto mb-16 max-w-2xl text-center`}
        >
          <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-primary">
            {t.experience.label}
          </p>
          <h2 className="mb-4 text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            {t.experience.title}
          </h2>
          <p className="text-lg text-muted-foreground">
            {t.experience.subtitle}
          </p>
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Student Portal */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            whileHover={{ y: -5 }}
            className={`rounded-2xl border border-border bg-background p-6 md:p-8 relative overflow-hidden`}
          >
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent" />

            <div className="relative">
              <div className="mb-6">
                <motion.span
                  whileHover={{ scale: 1.05 }}
                  className="inline-block rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary"
                >
                  {t.experience.student.badge}
                </motion.span>
              </div>

              <h3 className="mb-4 text-2xl font-bold text-foreground">
                {t.experience.student.title}
              </h3>
              <p className="mb-6 text-muted-foreground">
                {t.experience.student.description}
              </p>

              <ul className="mb-6 space-y-3">
                {t.experience.student.features.map((item, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x:  -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className={`flex items-start gap-3 `}
                  >
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                    <span className="text-foreground">{item}</span>
                  </motion.li>
                ))}
              </ul>

              {/* Student UI Preview - Mobile Style based on actual app */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="rounded-2xl border border-border bg-card overflow-hidden shadow-lg"
              >
                {/* Mobile Header */}
                <div className={`flex items-center justify-between bg-primary px-4 py-3 `}>
                  <div className={`flex items-center gap-2 `}>
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-foreground/20">
                      <BookOpen className="h-4 w-4 text-primary-foreground" />
                    </div>
                    <span className="text-sm font-medium text-primary-foreground">مبادرة الريان</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-7 w-7 rounded-full bg-primary-foreground/20" />
                    <div className="h-7 w-7 rounded-full bg-primary-foreground/20" />
                  </div>
                </div>

                <div className="p-4">
                  {/* Welcome */}
                  <div className="mb-4">
                    <p className={`text-lg font-bold text-foreground `}>
                      {t.experience.student.welcome} 👋
                    </p>
                    <p className={`text-sm text-muted-foreground`}>
                      {t.experience.student.progress}
                    </p>
                  </div>

                  {/* Stats Grid */}
                  <div className="mb-4 grid grid-cols-2 gap-3">
                    {[
                      { icon: BookOpen, label: t.dashboard.hifzPages, value: "0", color: "bg-primary/10 text-primary" },
                      { icon: RotateCcw, label: t.dashboard.revisionPages, value: "300", color: "bg-blue-100 text-blue-600" },
                      { icon: Target, label: t.dashboard.accuracy, value: "90.7%", color: "bg-amber-100 text-amber-600" },
                      { icon: Users, label: t.dashboard.absences, value: "0", color: "bg-red-100 text-red-600" },
                    ].map((stat, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 + i * 0.1 }}
                        className={`rounded-xl border border-border bg-background p-3 `}
                      >
                        <div className={`mb-2 inline-flex h-8 w-8 items-center justify-center rounded-lg ${stat.color.split(" ")[0]}`}>
                          <stat.icon className={`h-4 w-4 ${stat.color.split(" ")[1]}`} />
                        </div>
                        <p className="text-xl font-bold text-foreground">{stat.value}</p>
                        <p className="text-xs text-muted-foreground">{stat.label}</p>
                      </motion.div>
                    ))}
                  </div>

                  {/* Next Recitation Card */}
                  <motion.div
                    whileHover={{ scale: 1.01 }}
                    className="rounded-xl border border-border bg-background p-4"
                  >
                    <div className={`mb-3 flex items-center gap-2 `}>
                      <Calendar className="h-5 w-5 text-primary" />
                      <span className="font-medium text-foreground">{t.dashboard.nextRecitation}</span>
                    </div>
                    <div className={`mb-3 flex items-center justify-between rounded-lg bg-muted p-3 `}>
                      <div >
                        <p className="font-semibold text-foreground">Wednesday</p>
                        <p className="text-sm text-muted-foreground">Mar 25, 2026</p>
                      </div>
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                        <Calendar className="h-5 w-5 text-primary" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className={`rounded-lg bg-primary/5 p-2 border-s-2 border-primary`}>
                        <p className="text-xs text-muted-foreground">Hifz</p>
                        <p className="text-sm font-medium text-foreground">النساء ١ - ٦ (1 Pages)</p>
                      </div>
                      <div className={`rounded-lg bg-primary/5 p-2 border-s-2 border-blue-500`}>
                        <p className="text-xs text-muted-foreground">Revision</p>
                        <p className="text-sm font-medium text-foreground">الأنفال والمائدة (33 Pages)</p>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Teacher Interface */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
            whileHover={{ y: -5 }}
            className={`rounded-2xl border border-border bg-background p-6 md:p-8 relative overflow-hidden `}
          >
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-transparent" />

            <div className="relative">
              <div className="mb-6">
                <motion.span
                  whileHover={{ scale: 1.05 }}
                  className="inline-block rounded-full bg-accent/20 px-4 py-1.5 text-sm font-medium text-accent-foreground"
                >
                  {t.experience.teacher.badge}
                </motion.span>
              </div>

              <h3 className="mb-4 text-2xl font-bold text-foreground">
                {t.experience.teacher.title}
              </h3>
              <p className="mb-6 text-muted-foreground">
                {t.experience.teacher.description}
              </p>

              <ul className="mb-6 space-y-3">
                {t.experience.teacher.features.map((item, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className={`flex items-start gap-3 `}
                  >
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                    <span className="text-foreground">{item}</span>
                  </motion.li>
                ))}
              </ul>

              {/* Teacher UI Preview - Recitation Details based on actual app */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="rounded-2xl border border-border bg-card overflow-hidden shadow-lg"
              >
                {/* Modal Header */}
                <div className={`flex items-center justify-between border-b border-border px-4 py-3 `}>
                  <div className={`flex items-center gap-2 `}>
                    <h4 className="font-semibold text-foreground">Recitation Details</h4>
                    <span className="rounded-full bg-primary px-2 py-0.5 text-xs font-medium text-primary-foreground">
                      {t.experience.teacher.completed}
                    </span>
                  </div>
                  <button className="text-muted-foreground hover:text-foreground">×</button>
                </div>

                <div className="p-4 space-y-4">
                  {/* Date & Teacher */}
                  <div className={`flex justify-between text-sm `}>
                    <div >
                      <p className="text-muted-foreground">Date</p>
                      <p className="font-medium text-foreground">Wed, Mar 11, 2026</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Teacher</p>
                      <p className="font-medium text-foreground">أحمد منير عبدالرحمن</p>
                    </div>
                  </div>

                  {/* Hifz Details */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className={`rounded-xl border border-border bg-background p-4 border-s-4 border-s-primary`}
                  >
                    <div className={`mb-3 flex items-center gap-2 `}>
                      <div className="h-2 w-2 rounded-full bg-primary" />
                      <span className="font-medium text-foreground">{t.experience.teacher.hifzDetails}</span>
                      <span className="text-lg font-bold text-primary">97</span>
                    </div>
                    <div className={`grid grid-cols-2 gap-4 text-sm`}>
                      <div>
                        <p className="text-muted-foreground">{t.experience.teacher.content}</p>
                        <p className="font-medium text-foreground">ابراهيم والحجر</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">{t.experience.teacher.pages}</p>
                        <p className="font-medium text-foreground">0</p>
                      </div>
                    </div>
                    <div className={`mt-3 grid grid-cols-3 gap-2 text-sm `}>
                      <div>
                        <p className="text-muted-foreground">{t.experience.teacher.reminders}</p>
                        <p className="font-bold text-foreground">3</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">{t.experience.teacher.mistakes}</p>
                        <p className="font-bold text-foreground">0</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">{t.experience.teacher.minorMistakes}</p>
                        <p className="font-bold text-foreground">0</p>
                      </div>
                    </div>
                  </motion.div>

                  {/* Revision Details */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                    className={`rounded-xl border border-border bg-background p-4 border-s-4 border-s-blue-500`}
                  >
                    <div className={`mb-3 flex items-center gap-2`}>
                      <div className="h-2 w-2 rounded-full bg-blue-500" />
                      <span className="font-medium text-foreground">{t.experience.teacher.revisionDetails}</span>
                      <span className="text-lg font-bold text-blue-500">95</span>
                    </div>
                    <div className={`grid grid-cols-2 gap-4 text-sm `}>
                      <div>
                        <p className="text-muted-foreground">{t.experience.teacher.content}</p>
                        <p className="font-medium text-foreground">الانعام</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">{t.experience.teacher.pages}</p>
                        <p className="font-medium text-foreground">32</p>
                      </div>
                    </div>
                    <div className={`mt-3 grid grid-cols-3 gap-2 text-sm`}>
                      <div>
                        <p className="text-muted-foreground">{t.experience.teacher.reminders}</p>
                        <p className="font-bold text-foreground">3</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">{t.experience.teacher.mistakes}</p>
                        <p className="font-bold text-foreground">0</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">{t.experience.teacher.minorMistakes}</p>
                        <p className="font-bold text-foreground">1</p>
                      </div>
                    </div>
                  </motion.div>

                  {/* Total Score */}
                  <div className={`flex items-center justify-between rounded-xl bg-muted p-4`}>
                    <span className="text-muted-foreground">{t.experience.teacher.totalScore}</span>
                    <span className="text-2xl font-bold text-primary">192</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
