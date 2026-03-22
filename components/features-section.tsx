"use client"

import {
  Globe,
  BarChart3,
  BookMarked,
  Trophy,
  Send,
  Shield,
} from "lucide-react"
import { motion } from "framer-motion"
import { useLanguage } from "@/lib/i18n"

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

export function FeaturesSection() {
  const { t, } = useLanguage()

  const features = [
    {
      icon: Globe,
      title: t.features.multilingual.title,
      description: t.features.multilingual.description,
      gradient: "from-blue-500/20 to-cyan-500/20",
    },
    {
      icon: BarChart3,
      title: t.features.analytics.title,
      description: t.features.analytics.description,
      gradient: "from-purple-500/20 to-pink-500/20",
    },
    {
      icon: BookMarked,
      title: t.features.recitation.title,
      description: t.features.recitation.description,
      gradient: "from-primary/20 to-emerald-500/20",
    },
    {
      icon: Trophy,
      title: t.features.gamification.title,
      description: t.features.gamification.description,
      gradient: "from-amber-500/20 to-orange-500/20",
    },
    {
      icon: Send,
      title: t.features.telegram.title,
      description: t.features.telegram.description,
      gradient: "from-sky-500/20 to-blue-500/20",
    },
    {
      icon: Shield,
      title: t.features.security.title,
      description: t.features.security.description,
      gradient: "from-slate-500/20 to-gray-500/20",
    },
  ]

  return (
    <section id="features" className="relative border-t border-border bg-card py-20 md:py-28 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-0 top-0 h-64 w-64 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute right-0 bottom-0 h-64 w-64 rounded-full bg-accent/5 blur-3xl" />
      </div>

      <div className="container mx-auto max-w-6xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className={`mx-auto mb-16 max-w-2xl text-center`}
        >
          <motion.p
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="mb-3 text-sm font-semibold uppercase tracking-wider text-primary"
          >
            {t.features.label}
          </motion.p>
          <h2 className="mb-4 text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            {t.features.title}
          </h2>
          <p className="text-lg text-muted-foreground">
            {t.features.subtitle}
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={item}
              whileHover={{ y: -8, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
              className={`group relative rounded-2xl border border-border bg-background p-6 transition-all hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 overflow-hidden`}
            >
              {/* Gradient background on hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

              <div className="relative">
                <motion.div
                  whileHover={{ rotate: [0, -10, 10, 0] }}
                  transition={{ duration: 0.5 }}
                  className={`mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-all duration-300 group-hover:bg-primary group-hover:text-primary-foreground group-hover:shadow-lg group-hover:shadow-primary/25`}
                >
                  <feature.icon className="h-7 w-7" />
                </motion.div>
                <h3 className="mb-2 text-lg font-semibold text-foreground clear-both">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>

              {/* Corner decoration */}
              <div className="absolute -bottom-4 -right-4 h-24 w-24 rounded-full bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
