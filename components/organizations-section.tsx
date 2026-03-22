"use client"

import { Building2, Users, Palette, Lock, Home, BookOpen, GraduationCap, Settings, Calendar, Bell, FileText } from "lucide-react"
import { motion } from "framer-motion"
import { useLanguage } from "@/lib/i18n"

export function OrganizationsSection() {
  const { t } = useLanguage()

  const benefits = [
    {
      icon: Building2,
      title: t.organizations.workspace.title,
      description: t.organizations.workspace.description,
    },
    {
      icon: Users,
      title: t.organizations.roles.title,
      description: t.organizations.roles.description,
    },
    {
      icon: Lock,
      title: t.organizations.data.title,
      description: t.organizations.data.description,
    },
  ]

  const sidebarItems = [
    { icon: Home, label: "Home", active: true },
    { icon: BookOpen, label: "Halaqat" },
    { icon: GraduationCap, label: "Students" },
    { icon: Settings, label: "Settings" },
    { icon: Users, label: "Users" },
    { icon: Calendar, label: "Seasons" },
    { icon: Bell, label: "Notifications" },
    { icon: FileText, label: "Audit Logs" },
  ]

  return (
    <section id="organizations" className="py-20 md:py-28 relative overflow-hidden">
      {/* Background effects */}
      <div
        className="absolute -right-40 top-20 h-80 w-80 rounded-full bg-primary/10 border border-primary/10"
      />
      <div
        className="absolute -left-20 bottom-40 h-60 w-60 rounded-full bg-primary/10 border border-primary/10"
      />

      <div className="container mx-auto max-w-6xl px-4">
        <div className={`grid items-center gap-12 lg:grid-cols-2 lg:gap-16`}>
          <motion.div
            initial={{ opacity: 0, x:-50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-3 text-sm font-semibold uppercase tracking-wider text-primary"
            >
              {t.organizations.label}
            </motion.p>
            <h2 className="mb-6 text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              {t.organizations.title}
            </h2>
            <p className="mb-8 text-lg leading-relaxed text-muted-foreground">
              {t.organizations.subtitle}
            </p>

            <div className="grid gap-5 sm:grid-cols-2">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ x: 5 }}
                  className={`flex gap-3`}
                >
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 text-primary shadow-sm"
                  >
                    <benefit.icon className="h-5 w-5" />
                  </motion.div>
                  <div>
                    <h3 className="font-semibold text-foreground">{benefit.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{benefit.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Desktop Dashboard Visualization */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className={`relative`}
          >
            {/* Main Dashboard Card - Desktop View */}
            <motion.div
              whileHover={{ y: -5 }}
              className="relative rounded-2xl border border-border bg-card shadow-xl overflow-hidden"
            >
              {/* Browser bar */}
              <div className={`flex items-center gap-2 border-b border-border bg-muted/50 px-4 py-2 `}>
                <div className="flex gap-1.5">
                  <div className="h-2.5 w-2.5 rounded-full bg-red-400" />
                  <div className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                  <div className="h-2.5 w-2.5 rounded-full bg-green-400" />
                </div>
                <div className={`flex-1 text-center text-xs text-muted-foreground`}>
                  app.hafiz.com
                </div>
              </div>

              <div className={`flex `}>
                {/* Sidebar */}
                <div className={`w-48 border-border bg-background p-4 border-s`}>
                  <div className={`mb-6 flex items-center gap-2 `}>
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                      <BookOpen className="h-4 w-4 text-primary-foreground" />
                    </div>
                    <span className="text-sm font-semibold text-foreground">Al-Noor</span>
                  </div>
                  <nav className="space-y-1">
                    {sidebarItems.map((navItem, i) => (
                      <motion.div
                        key={i}
                        whileHover={{ x:  3 }}
                        className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors  ${
                          navItem.active
                            ? "bg-primary text-primary-foreground"
                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                        }`}
                      >
                        <navItem.icon className="h-4 w-4" />
                        <span>{navItem.label}</span>
                      </motion.div>
                    ))}
                  </nav>
                </div>

                {/* Main content */}
                <div className="flex-1 p-6">
                  <div className={`mb-4 flex items-center justify-between `}>
                    <h3 className="font-semibold text-foreground">Dashboard</h3>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="rounded-lg border border-border px-3 py-1.5 text-xs text-muted-foreground hover:bg-muted"
                    >
                      Refresh
                    </motion.button>
                  </div>

                  {/* Stats Grid */}
                  <div className="mb-4 grid grid-cols-2 gap-3">
                    {[
                      { label: t.organizations.students, value: "60", icon: Users },
                      { label: t.organizations.teachers, value: "24", icon: GraduationCap },
                      { label: t.organizations.circles, value: "8", icon: BookOpen },
                      { label: "Total Pages", value: "2.4k", icon: FileText },
                    ].map((stat, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.4 + i * 0.1 }}
                        whileHover={{ scale: 1.03 }}
                        className={`rounded-xl border border-border bg-background p-3 `}
                      >
                        <div className={`flex items-center justify-between `}>
                          <div>
                            <p className="text-xs text-muted-foreground">{stat.label}</p>
                            <p className="text-xl font-bold text-foreground">{stat.value}</p>
                          </div>
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                            <stat.icon className="h-5 w-5 text-primary" />
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Leaderboard */}
                  <div className="rounded-xl border border-border bg-background p-3">
                    <div className={`mb-3 flex items-center gap-2 `}>
                      <span>🏆</span>
                      <span className="text-sm font-medium text-foreground">Halaqat Leaderboard</span>
                    </div>
                    <div className="space-y-2">
                      {[
                        { rank: 1, name: "ابو بكر الصديق", students: 12, score: "86.6", color: "border-l-amber-500" },
                        { rank: 2, name: "عمر ابن الخطاب", students: 13, score: "82.1", color: "border-l-gray-400" },
                        { rank: 3, name: "محمد الفاتح", students: 7, score: "81.1", color: "border-l-orange-400" },
                      ].map((item) => (
                        <motion.div
                          key={item.rank}
                          whileHover={{ x: 3 }}
                          className={`flex items-center justify-between rounded-lg border-s-4 bg-muted/50 p-2 ${item.color}`}
                        >
                          <div className={`flex items-center gap-2 `}>
                            <span className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                              item.rank === 1 ? "bg-amber-100 text-amber-700" :
                              item.rank === 2 ? "bg-gray-100 text-gray-700" :
                              "bg-orange-100 text-orange-700"
                            }`}>
                              {item.rank}
                            </span>
                            <span className="text-sm font-medium text-foreground">{item.name}</span>
                            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] text-primary">
                              {item.students} 👥
                            </span>
                          </div>
                          <span className="text-sm font-semibold text-primary">{item.score}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Secondary Tenant Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
              whileHover={{ scale: 1.05, rotate: -2 }}
              className={`absolute -bottom-4 w-52 rounded-xl border border-border bg-card p-4 shadow-xl md:-bottom-6`}
            >
              <div className={`mb-3 flex items-center gap-2`}>
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-accent/40 to-accent/20">
                  <BookOpen className="h-4 w-4 text-accent-foreground" />
                </div>
                <div >
                  <p className="text-sm font-semibold text-foreground">Badr Institute</p>
                </div>
              </div>
              <div className="flex gap-2">
                <div className="flex-1 rounded-lg bg-muted p-2 text-center">
                  <p className="text-lg font-bold text-foreground">156</p>
                  <p className="text-[10px] text-muted-foreground">{t.organizations.students}</p>
                </div>
                <div className="flex-1 rounded-lg bg-muted p-2 text-center">
                  <p className="text-lg font-bold text-foreground">8</p>
                  <p className="text-[10px] text-muted-foreground">{t.organizations.teachers}</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
