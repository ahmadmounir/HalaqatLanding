"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useLanguage } from "@/lib/i18n";
import {
  buildWhatsAppMessageUrl,
  buildWhatsAppSubscriptionUrl,
} from "@/lib/whatsapp";
import { EASE, Reveal, Stagger, StaggerItem } from "@/components/motion";
import { SectionHeading } from "@/components/section-heading";
import { SIGNUP_URL } from "@/components/header";
import { cn } from "@/lib/utils";

type BillingPeriod = "annual" | "semester";
type PlanId = "starter" | "basic" | "pro" | "enterprise";

interface PlanPricing {
  id: PlanId;
  annualPrice: number;
  semesterPrice: number;
  highlighted?: boolean;
  /** No price on the page: priced with the organization, so the button opens a conversation. */
  contactOnly?: boolean;
}

// Prices in US dollars for the whole period.
const PLANS: PlanPricing[] = [
  { id: "starter", annualPrice: 0, semesterPrice: 0 },
  { id: "basic", annualPrice: 300, semesterPrice: 190 },
  { id: "pro", annualPrice: 500, semesterPrice: 315, highlighted: true },
  { id: "enterprise", annualPrice: 0, semesterPrice: 0, contactOnly: true },
];

const PRIORITY_SUPPORT = { annualPrice: 200, semesterPrice: 125 };

const PERIODS: BillingPeriod[] = ["annual", "semester"];

// Invisible marks that keep a price left-to-right inside Arabic text.
const LTR_START = "\u2066";
const LTR_END = "\u2069";

export function PricingSection() {
  const { t, language } = useLanguage();
  const [period, setPeriod] = useState<BillingPeriod>("annual");
  const [prioritySupport, setPrioritySupport] = useState(false);

  const formatter = useMemo(() => {
    const locale = language === "tr" ? "tr-TR" : "en-US";
    return new Intl.NumberFormat(locale, { maximumFractionDigits: 0 });
  }, [language]);
  // Isolated as left-to-right so the symbol stays in front of the number in Arabic.
  const money = (value: number) =>
    `${LTR_START}${t.pricing.currencySymbol}${formatter.format(value)}${LTR_END}`;

  const months = period === "annual" ? 12 : 6;
  const supportPrice =
    period === "annual"
      ? PRIORITY_SUPPORT.annualPrice
      : PRIORITY_SUPPORT.semesterPrice;
  const periodSuffix =
    period === "annual" ? t.pricing.perYear : t.pricing.perSemester;

  return (
    <section id="pricing" className="section">
      <div className="container-page">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            label={t.pricing.label}
            title={t.pricing.title}
            subtitle={t.pricing.subtitle}
          />

          <Reveal>
            <div
              role="radiogroup"
              aria-label={t.pricing.period.ariaLabel}
              className="inline-flex rounded-full border border-line bg-surface p-1"
            >
              {PERIODS.map((item) => (
                <button
                  key={item}
                  type="button"
                  role="radio"
                  aria-checked={period === item}
                  onClick={() => setPeriod(item)}
                  className={cn(
                    "relative h-10 rounded-full px-5 text-[0.9375rem] font-medium transition-colors duration-200",
                    period === item
                      ? "text-white"
                      : "text-muted-foreground hover:text-ink",
                  )}
                >
                  {period === item && (
                    <motion.span
                      layoutId="period-pill"
                      className="absolute inset-0 rounded-full bg-ink"
                      transition={{ type: "spring", stiffness: 380, damping: 34 }}
                    />
                  )}
                  <span className="relative">{t.pricing.period[item]}</span>
                </button>
              ))}
            </div>
          </Reveal>
        </div>

        <Stagger className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {PLANS.map((plan) => {
            const text = t.pricing.plans[plan.id];
            const basePrice =
              period === "annual" ? plan.annualPrice : plan.semesterPrice;
            const isCustom = plan.contactOnly === true;
            const isFree = basePrice === 0 && !isCustom;
            const withSupport = prioritySupport && !isFree && !isCustom;
            const total = basePrice + (withSupport ? supportPrice : 0);

            // Free: straight to the sign-up page of the app. Enterprise: a conversation, no price.
            // The paid plans: a WhatsApp message with the plan, the period and the total.
            const ctaUrl = isFree
              ? `${SIGNUP_URL}?plan=free&lang=${language}`
              : isCustom
                ? buildWhatsAppMessageUrl(t.pricing.enterpriseWhatsappMessage)
                : buildWhatsAppSubscriptionUrl({
                    template: t.pricing.whatsappTemplate,
                    planName: text.name,
                    period: t.pricing.periodNames[period],
                    addOns: withSupport ? [t.pricing.addOnItems.priority] : [],
                    noAddOnsLabel: t.pricing.noAddOns,
                    totalPrice: total,
                    currencySymbol: t.pricing.currencySymbol,
                  });
            const opensNewTab = !isFree && ctaUrl !== null;

            return (
              <StaggerItem key={plan.id} className="h-full">
                <div
                  className={cn(
                    "flex h-full flex-col rounded-2xl border p-6 transition-[transform,box-shadow] duration-300 ease-brand hover:-translate-y-1",
                    plan.highlighted
                      ? "border-ink bg-ink text-white shadow-lift"
                      : "border-line bg-surface hover:shadow-card",
                  )}
                >
                  <div className="flex items-center justify-between gap-2">
                    <h3
                      className={cn(
                        "text-lg font-semibold",
                        plan.highlighted ? "text-white" : "text-ink",
                      )}
                    >
                      {text.name}
                    </h3>
                    {plan.highlighted ? (
                      <span className="rounded-full bg-gold px-2.5 py-1 text-xs font-medium text-ink">
                        {t.pricing.recommended}
                      </span>
                    ) : null}
                  </div>
                  <p
                    className={cn(
                      "mt-1 text-sm font-medium",
                      plan.highlighted ? "text-gold" : "text-gold-ink",
                    )}
                  >
                    {text.students}
                  </p>

                  <div className="mt-6 h-[4.5rem]">
                    <AnimatePresence mode="wait" initial={false}>
                      <motion.div
                        key={`${period}-${total}`}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.22, ease: EASE }}
                      >
                        <p className="flex items-baseline gap-2">
                          <span
                            className={cn(
                              "text-4xl font-semibold tabular-nums tracking-tight",
                              plan.highlighted ? "text-white" : "text-ink",
                            )}
                          >
                            {isCustom
                              ? t.pricing.customLabel
                              : isFree
                                ? t.pricing.freeLabel
                                : money(total)}
                          </span>
                          {!isFree && !isCustom && (
                            <span
                              className={cn(
                                "text-sm",
                                plan.highlighted
                                  ? "text-white/65"
                                  : "text-muted-foreground",
                              )}
                            >
                              {periodSuffix}
                            </span>
                          )}
                        </p>
                        <p
                          className={cn(
                            "mt-1.5 text-sm",
                            plan.highlighted
                              ? "text-white/65"
                              : "text-muted-foreground",
                          )}
                        >
                          {isCustom
                            ? t.pricing.customNote
                            : isFree
                            ? t.pricing.freeNote
                            : t.pricing.perMonth.replace(
                                "{amount}",
                                money(Math.round(total / months)),
                              )}
                        </p>
                      </motion.div>
                    </AnimatePresence>
                  </div>

                  <p
                    className={cn(
                      "mt-5 flex-1 text-[0.9375rem] leading-relaxed",
                      plan.highlighted ? "text-white/75" : "text-muted-foreground",
                    )}
                  >
                    {text.description}
                  </p>

                  <a
                    href={ctaUrl ?? "#contact"}
                    {...(opensNewTab
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                    className={cn(
                      "btn group mt-6 w-full",
                      plan.highlighted ? "btn-gold" : "btn-secondary",
                    )}
                  >
                    {isCustom
                      ? t.pricing.contactSales
                      : isFree
                        ? t.pricing.startFree
                        : t.pricing.startNow}
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5" />
                  </a>
                </div>
              </StaggerItem>
            );
          })}
        </Stagger>

        <Reveal className="mt-4">
          <label className="flex cursor-pointer items-center justify-between gap-6 rounded-2xl border border-line bg-surface px-6 py-5">
            <span>
              <span className="block font-semibold text-ink">
                {t.pricing.support.title}
                <span className="ms-2 font-normal tabular-nums text-muted-foreground">
                  +{money(supportPrice)} {periodSuffix}
                </span>
              </span>
              <span className="mt-1 block text-[0.9375rem] text-muted-foreground">
                {t.pricing.support.description}
              </span>
            </span>
            <Switch
              checked={prioritySupport}
              onCheckedChange={setPrioritySupport}
              aria-label={t.pricing.support.title}
              className="scale-125 data-[state=checked]:bg-green"
            />
          </label>
        </Reveal>

        <Reveal className="mt-14 grid gap-8 border-t border-line pt-10 lg:grid-cols-[12rem_1fr]">
          <h3 className="subheading">{t.pricing.includedTitle}</h3>
          <div>
            <ul className="grid gap-x-10 gap-y-3.5 sm:grid-cols-2">
              {t.pricing.included.map((item) => (
                <li key={item} className="flex gap-3 text-[0.9375rem] text-ink">
                  <Check
                    className="mt-0.5 h-4 w-4 shrink-0 text-green"
                    strokeWidth={2.5}
                  />
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-8 text-[0.9375rem] text-muted-foreground">
              {t.pricing.larger}{" "}
              <a
                href="#contact"
                className="link-underline pb-0.5 font-medium text-ink"
              >
                {t.pricing.largerCta}
              </a>
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
