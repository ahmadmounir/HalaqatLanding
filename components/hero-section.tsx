"use client";

import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  ArrowLeft,
  Play,
  BookOpen,
  RotateCcw,
  Target,
  Users,
} from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "@/lib/i18n";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export function HeroSection() {
  const { t, isRTL } = useLanguage();
  const Arrow = isRTL ? ArrowLeft : ArrowRight;

  return (
    <section className="relative overflow-hidden py-20">
      {/* Animated background elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(16,185,129,0.08)_0%,transparent_50%)]" />
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute right-0 top-20 h-96 w-96 rounded-full bg-primary/5 blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
          className="absolute -left-20 bottom-20 h-72 w-72 rounded-full bg-accent/10 blur-3xl"
        />
      </div>

      {/* Geometric pattern */}
      <div className="absolute inset-0 -z-10 opacity-[0.015]">
        <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern
              id="islamic-pattern"
              x="0"
              y="0"
              width="60"
              height="60"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M30 0L60 30L30 60L0 30Z"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.5"
              />
              <circle
                cx="30"
                cy="30"
                r="10"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.5"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#islamic-pattern)" />
        </svg>
      </div>

      <div className="container mx-auto max-w-6xl px-4">
        <div
          className={`grid items-center gap-12 lg:grid-cols-2 lg:gap-16 ${isRTL ? "lg:grid-flow-dense" : ""}`}
        >
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className={`flex flex-col gap-6 ${isRTL ? "lg:col-start-2 text-right" : ""}`}
          >
            {/* <motion.div variants={item} className={`inline-flex w-fit items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5`}>
              <motion.span
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="h-2 w-2 rounded-full bg-primary"
              />
              <span className="text-sm font-medium text-primary">{t.hero.badge}</span>
            </motion.div> */}

            <motion.h1
              variants={item}
              className="text-balance text-4xl font-bold leading-tight tracking-tight text-foreground md:text-5xl lg:text-6xl"
            >
              {t.hero.title}{" "}
              <span className="relative text-primary">
                {t.hero.titleHighlight}
                <motion.svg
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className="absolute -bottom-2 left-0 h-3 w-full"
                  viewBox="0 0 200 12"
                  fill="none"
                >
                  <path
                    d="M2 10C50 2 150 2 198 10"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    className="text-primary/30"
                  />
                </motion.svg>
              </span>
            </motion.h1>

            <motion.p
              variants={item}
              className="max-w-xl text-lg leading-relaxed text-muted-foreground md:text-xl"
            >
              {t.hero.subtitle}
            </motion.p>

            <motion.div
              variants={item}
              className={`flex flex-col gap-3 pt-2 sm:flex-row sm:items-center ${isRTL ? "sm:flex-row-reverse" : ""}`}
            >
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <a href="#contact">
                  <Button
                    size="lg"
                    className="bg-primary hover:bg-primary/90 h-12 px-6 text-base group"
                  >
                    {t.hero.ctaPrimary}
                    <Arrow
                      className={`h-4 w-4 transition-transform group-hover:translate-x-1 ${isRTL ? "mr-2 group-hover:-translate-x-1" : "ml-2"}`}
                    />
                  </Button>
                </a>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <a href="#features">
                  <Button
                    variant="outline"
                    size="lg"
                    className="h-12 px-6 text-base border-border"
                  >
                    <Play className={`h-4 w-4 ${isRTL ? "ml-2" : "mr-2"}`} />
                    {t.hero.ctaSecondary}
                  </Button>
                </a>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Dashboard Mockup with App Screenshots */}
          <motion.div
            initial={{ opacity: 0, x: isRTL ? -50 : 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className={`relative ${isRTL ? "lg:col-start-1" : ""}`}
          >
            {/* Main Dashboard Card */}
            <motion.div
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="relative rounded-2xl border border-border bg-card p-2 shadow-2xl shadow-primary/10"
            >
              <div className="overflow-hidden rounded-xl bg-muted">
                {/* Browser Header */}
                <div
                  className={`flex items-center gap-2 border-b border-border bg-card px-4 py-3 ${isRTL ? "flex-row-reverse" : ""}`}
                >
                  <div className="flex gap-1.5">
                    <motion.div
                      whileHover={{ scale: 1.2 }}
                      className="h-3 w-3 rounded-full bg-destructive/60"
                    />
                    <motion.div
                      whileHover={{ scale: 1.2 }}
                      className="h-3 w-3 rounded-full bg-accent"
                    />
                    <motion.div
                      whileHover={{ scale: 1.2 }}
                      className="h-3 w-3 rounded-full bg-primary/60"
                    />
                  </div>
                  <div
                    className={`flex-1 rounded-md bg-muted px-3 py-1 text-xs text-muted-foreground ${isRTL ? "mr-4 text-right" : "ml-4"}`}
                  >
                    {t.dashboard.url}
                  </div>
                </div>

                {/* Dashboard Content */}
                <div className="grid gap-4 p-4">
                  {/* Stats Row - Based on actual app data */}
                  <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                    {[
                      {
                        icon: Users,
                        label: t.dashboard.activeStudents,
                        value: "60",
                        color: "text-primary",
                        bgColor: "bg-primary/10",
                      },
                      {
                        icon: BookOpen,
                        label: t.dashboard.halaqat,
                        value: "8",
                        color: "text-primary",
                        bgColor: "bg-primary/10",
                      },
                      {
                        icon: Target,
                        label: t.dashboard.accuracy,
                        value: "90.7%",
                        color: "text-accent",
                        bgColor: "bg-accent/20",
                      },
                      {
                        icon: RotateCcw,
                        label: t.dashboard.revisionPages,
                        value: "2.4k",
                        color: "text-primary",
                        bgColor: "bg-primary/10",
                      },
                    ].map((stat, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 + index * 0.1 }}
                        whileHover={{ scale: 1.02 }}
                        className={`rounded-lg bg-card p-3 shadow-sm border border-border/50 ${isRTL ? "text-right" : ""}`}
                      >
                        <div
                          className={`mb-2 inline-flex h-8 w-8 items-center justify-center rounded-lg ${stat.bgColor}`}
                        >
                          <stat.icon className={`h-4 w-4 ${stat.color}`} />
                        </div>
                        <p className="text-2xl font-bold text-foreground">
                          {stat.value}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {stat.label}
                        </p>
                      </motion.div>
                    ))}
                  </div>

                  {/* Progress Chart */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.9 }}
                    className="rounded-lg bg-card p-4 shadow-sm border border-border/50"
                  >
                    <div
                      className={`mb-3 flex items-center justify-between ${isRTL ? "flex-row-reverse" : ""}`}
                    >
                      <p className="text-sm font-medium text-foreground">
                        {t.dashboard.weeklyProgress}
                      </p>
                      <span className="text-xs text-muted-foreground">
                        {t.dashboard.last7Days}
                      </span>
                    </div>
                    <div className="flex h-24 items-end gap-2">
                      {[65, 72, 58, 85, 90, 78, 95].map((height, i) => (
                        <motion.div
                          key={i}
                          initial={{ height: 0 }}
                          animate={{ height: `${height}%` }}
                          transition={{
                            delay: 1 + i * 0.1,
                            duration: 0.5,
                            ease: "easeOut",
                          }}
                          whileHover={{ scale: 1.05 }}
                          className="flex-1 rounded-t bg-gradient-to-t from-primary to-primary/60 transition-all"
                        />
                      ))}
                    </div>
                    <div
                      className={`mt-2 flex justify-between text-xs text-muted-foreground ${isRTL ? "flex-row-reverse" : ""}`}
                    >
                      {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
                        (day) => (
                          <span key={day}>{day}</span>
                        ),
                      )}
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>

            {/* Floating Student Card */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.2, duration: 0.5 }}
              whileHover={{ scale: 1.05, rotate: -2 }}
              className={`absolute -bottom-4 w-40 rounded-xl border border-border bg-card p-4 shadow-xl md:-bottom-6 md:w-48 ${isRTL ? "-right-4 md:-right-8" : "-left-4 md:-left-8"}`}
            >
              <div
                className={`mb-3 flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20">
                  <span className="text-lg font-semibold text-primary">A</span>
                </div>
                <div className={isRTL ? "text-right" : ""}>
                  <p className="text-sm font-medium text-foreground">Ahmed</p>
                  <p className="text-xs text-muted-foreground">Juz 15</p>
                </div>
              </div>
              <div className="space-y-2">
                <div
                  className={`flex justify-between text-xs ${isRTL ? "flex-row-reverse" : ""}`}
                >
                  <span className="text-muted-foreground">
                    {t.dashboard.accuracy}
                  </span>
                  <span className="font-medium text-primary">90.7%</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "90.7%" }}
                    transition={{ delay: 1.5, duration: 0.8, ease: "easeOut" }}
                    className="h-2 rounded-full bg-gradient-to-r from-primary to-primary/70"
                  />
                </div>
              </div>
            </motion.div>

            {/* Floating Leaderboard Card */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.4, duration: 0.5 }}
              whileHover={{ scale: 1.05, rotate: 2 }}
              className={`absolute -top-4 w-36 rounded-xl border border-border bg-card p-3 shadow-xl md:-top-6 md:w-44 ${isRTL ? "-left-4 md:-left-8" : "-right-4 md:-right-8"}`}
            >
              <div
                className={`mb-2 flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}
              >
                <span className="text-lg">🏆</span>
                <p className="text-xs font-medium text-foreground">
                  Leaderboard
                </p>
              </div>
              <div className="space-y-1.5">
                {[
                  {
                    rank: 1,
                    name: "Abu Bakr",
                    score: "86.6",
                    color: "bg-amber-100 text-amber-700",
                  },
                  {
                    rank: 2,
                    name: "Omar",
                    score: "82.1",
                    color: "bg-gray-100 text-gray-700",
                  },
                  {
                    rank: 3,
                    name: "M. Fatih",
                    score: "81.1",
                    color: "bg-orange-100 text-orange-700",
                  },
                ].map((item) => (
                  <div
                    key={item.rank}
                    className={`flex items-center justify-between rounded bg-muted/50 px-2 py-1 ${isRTL ? "flex-row-reverse" : ""}`}
                  >
                    <div
                      className={`flex items-center gap-1.5 ${isRTL ? "flex-row-reverse" : ""}`}
                    >
                      <span
                        className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold ${item.color}`}
                      >
                        {item.rank}
                      </span>
                      <span className="text-[10px] text-foreground">
                        {item.name}
                      </span>
                    </div>
                    <span className="text-[10px] font-semibold text-primary">
                      {item.score}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
