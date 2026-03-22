"use client"

import { CheckCircle } from "lucide-react"
import { motion, useInView } from "framer-motion"
import { useRef, useEffect, useState } from "react"
import { useLanguage } from "@/lib/i18n"

function AnimatedCounter({ value, suffix = "" }: { value: number; suffix?: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  useEffect(() => {
    if (isInView) {
      const duration = 2000
      const steps = 60
      const stepValue = value / steps
      let current = 0
      const timer = setInterval(() => {
        current += stepValue
        if (current >= value) {
          setCount(value)
          clearInterval(timer)
        } else {
          setCount(Math.floor(current))
        }
      }, duration / steps)
      return () => clearInterval(timer)
    }
  }, [isInView, value])

  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  )
}

export function SocialProofSection() {
  const { t } = useLanguage()

  const stats = [
    { value: 2, suffix: "+", label: t.socialProof.institutions },
    { value: 60, suffix: "+", label: t.socialProof.students, format: (v: number) => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v },
    { value: 4.9, suffix: "/5", label: t.socialProof.rating, decimal: true },
  ]

  return (
    <section className="py-20 md:py-28 relative overflow-hidden">
      <div className="container mx-auto max-w-6xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="relative rounded-3xl bg-gradient-to-br from-primary via-primary to-primary/90 p-8 md:p-12 lg:p-16 overflow-hidden"
        >
          {/* Animated background elements */}
          <div className="absolute inset-0 overflow-hidden">
            {/* Islamic geometric pattern overlay */}
            <div className="absolute inset-0 opacity-5">
              <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="social-pattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M20 0L40 20L20 40L0 20Z" fill="none" stroke="white" strokeWidth="0.5" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#social-pattern)" />
              </svg>
            </div>
          </div>

          <div className={`relative mx-auto max-w-3xl text-center`}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className={`mb-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 backdrop-blur-sm`}
            >
              <CheckCircle className="h-4 w-4 text-primary-foreground" />
              <span className="text-sm font-medium text-primary-foreground">{t.socialProof.badge}</span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="mb-4 text-balance text-3xl font-bold tracking-tight text-primary-foreground md:text-4xl"
            >
              {t.socialProof.title}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="mb-10 text-lg text-primary-foreground/80"
            >
              {t.socialProof.subtitle}
            </motion.p>

            <div className={`grid grid-cols-2 gap-6 md:grid-cols-3`}>
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="group relative rounded-2xl bg-white/10 p-4 backdrop-blur-sm transition-all hover:bg-white/15"
                >
                  <p className="text-3xl font-bold text-primary-foreground md:text-4xl">
                    {stat.decimal ? (
                      <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                    ) : stat.value >= 1000 ? (
                      <>
                        <AnimatedCounter value={stat.value / 1000} suffix="" />
                        {"k" + stat.suffix}
                      </>
                    ) : (
                      <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                    )}
                  </p>
                  <p className="mt-1 text-sm text-primary-foreground/70">
                    {stat.label}
                  </p>

                  {/* Hover glow effect */}
                  <div className="absolute inset-0 -z-10 rounded-2xl bg-white/5 opacity-0 blur-xl transition-opacity group-hover:opacity-100" />
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
