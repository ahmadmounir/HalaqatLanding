"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { useLanguage } from "@/lib/i18n";
import { buildWhatsAppSubscriptionUrl } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

type BillingPeriod = "annual" | "semester";
type PlanId = "starter" | "basic" | "pro" | "enterprise";
type AddOnId = "whatsapp" | "priority" | "landing";

interface PlanPricing {
  id: PlanId;
  annualPrice: number;
  semesterPrice: number;
  highlighted?: boolean;
}

interface AddOnPricing {
  id: AddOnId;
  annualPrice: number;
  semesterPrice: number;
  oneTime?: boolean;
}

const PLANS: PlanPricing[] = [
  { id: "starter", annualPrice: 0, semesterPrice: 0 },
  { id: "basic", annualPrice: 150, semesterPrice: 95 },
  { id: "pro", annualPrice: 350, semesterPrice: 220, highlighted: true },
  { id: "enterprise", annualPrice: 600, semesterPrice: 380 },
];

const ADD_ONS: AddOnPricing[] = [
//   { id: "whatsapp", annualPrice: 200, semesterPrice: 125 },
  { id: "priority", annualPrice: 150, semesterPrice: 95 },
  { id: "landing", annualPrice: 150, semesterPrice: 150, oneTime: true },
];

const DEFAULT_ADD_ON_SELECTIONS: Record<PlanId, Record<AddOnId, boolean>> = {
  starter: { whatsapp: false, priority: false, landing: false },
  basic: { whatsapp: false, priority: false, landing: false },
  pro: { whatsapp: false, priority: false, landing: false },
  enterprise: { whatsapp: false, priority: false, landing: false },
};

function getAddOnPrice(addOn: AddOnPricing, period: BillingPeriod) {
  if (addOn.oneTime) {
    return addOn.annualPrice;
  }
  return period === "annual" ? addOn.annualPrice : addOn.semesterPrice;
}

function formatAmount(
  value: number,
  formatter: Intl.NumberFormat,
  symbol: string,
) {
  return `${symbol}${formatter.format(value)}`;
}

export function PricingSection() {
  const { t, language, isRTL } = useLanguage();
  const [billingPeriod, setBillingPeriod] = useState<BillingPeriod>("annual");
  const [selectedAddOnsByPlan, setSelectedAddOnsByPlan] = useState(
    DEFAULT_ADD_ON_SELECTIONS,
  );

  const numberFormatter = useMemo(() => {
    const locale =
      language === "tr" ? "tr-TR" : language === "ar" ? "ar" : "en-US";
    return new Intl.NumberFormat(locale, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    });
  }, [language]);

  const monthsInPeriod = billingPeriod === "annual" ? 12 : 6;
  const selectedPeriodName =
    billingPeriod === "annual"
      ? t.pricing.periodNames.annual
      : t.pricing.periodNames.semester;

  const toggleAddOn = (
    planId: PlanId,
    addOnId: AddOnId,
    checked: boolean | "indeterminate",
  ) => {
    setSelectedAddOnsByPlan((previous) => ({
      ...previous,
      [planId]: {
        ...previous[planId],
        [addOnId]: checked === true,
      },
    }));
  };

  return (
    <section
      id="pricing"
      className="relative overflow-hidden border-t border-border py-20 md:py-28"
    >
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-background via-muted/20 to-background" />

      <div className="container mx-auto max-w-6xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          className="mb-10 text-center"
        >
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground md:text-5xl">
            {t.pricing.title}
          </h2>
          <p className="mx-auto max-w-3xl text-lg text-muted-foreground">
            {t.pricing.subtitle}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          className={cn(
            "mx-auto mb-10 flex w-full max-w-2xl items-center justify-center gap-4 rounded-2xl border border-border bg-card/80 p-4",
          )}
        >
          <div className="text-center">
            <p
              className={cn(
                "text-sm font-semibold",
                billingPeriod === "annual"
                  ? "text-foreground"
                  : "text-muted-foreground",
              )}
            >
              {t.pricing.periodToggle.annualLabel}
            </p>
            <p className="text-xs text-muted-foreground">
              {t.pricing.periodToggle.annualDuration}
            </p>
          </div>

          <Switch
            checked={billingPeriod === "semester"}
            onCheckedChange={(checked) =>
              setBillingPeriod(checked ? "semester" : "annual")
            }
            aria-label={t.pricing.periodToggle.ariaLabel}
          />

          <div className="text-center">
            <p
              className={cn(
                "text-sm font-semibold",
                billingPeriod === "semester"
                  ? "text-foreground"
                  : "text-muted-foreground",
              )}
            >
              {t.pricing.periodToggle.semesterLabel}
            </p>
            <p className="text-xs text-muted-foreground">
              {t.pricing.periodToggle.semesterDuration}
            </p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
          {PLANS.map((plan, index) => {
            const planText = t.pricing.plans[plan.id];
            const basePrice =
              billingPeriod === "annual"
                ? plan.annualPrice
                : plan.semesterPrice;

            const selectedAddOns = ADD_ONS.filter(
              (addOn) => selectedAddOnsByPlan[plan.id][addOn.id],
            );

            const addOnTotal = selectedAddOns.reduce(
              (sum, addOn) => sum + getAddOnPrice(addOn, billingPeriod),
              0,
            );

            const totalPrice = basePrice + addOnTotal;
            const monthlyEquivalent = totalPrice / monthsInPeriod;

            const selectedAddOnNames = selectedAddOns.map(
              (addOn) => t.pricing.addOnItems[addOn.id],
            );

            const whatsappUrl = buildWhatsAppSubscriptionUrl({
              template: t.pricing.whatsappTemplate,
              planName: planText.name,
              period: selectedPeriodName,
              addOns: selectedAddOnNames,
              noAddOnsLabel: t.pricing.noAddOns,
              totalPrice,
              currencySymbol: t.pricing.currencySymbol,
            });

            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ delay: index * 0.06, duration: 0.35 }}
                className="h-full"
              >
                <Card
                  className={cn(
                    "relative flex h-full flex-col border-border/70 bg-card/80 backdrop-blur",
                    plan.highlighted &&
                      "border-primary shadow-lg shadow-primary/10",
                  )}
                >
                  <CardHeader className="space-y-3 pb-0">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <CardTitle className="text-2xl">
                          {planText.name}
                        </CardTitle>
                        <CardDescription className="mt-2 text-sm">
                          {planText.students}
                        </CardDescription>
                      </div>
                      {plan.highlighted ? (
                        <Badge>{t.pricing.mostPopular}</Badge>
                      ) : null}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {planText.description}
                    </p>
                  </CardHeader>

                  <CardContent className="space-y-5 pt-2">
                    <div className="rounded-xl border border-border/70 bg-background/60 p-4">
                      <AnimatePresence mode="wait" initial={false}>
                        <motion.div
                          key={`${billingPeriod}-${totalPrice}`}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -8 }}
                          transition={{ duration: 0.22 }}
                        >
                          <p className="text-3xl font-bold tracking-tight text-foreground">
                            {totalPrice === 0
                              ? t.pricing.freeLabel
                              : formatAmount(
                                  totalPrice,
                                  numberFormatter,
                                  t.pricing.currencySymbol,
                                )}
                          </p>
                          <p className="mt-1 text-xs text-muted-foreground">
                            {t.pricing.equivalentToMonthly.replace(
                              "{amount}",
                              formatAmount(
                                monthlyEquivalent,
                                numberFormatter,
                                t.pricing.currencySymbol,
                              ),
                            )}
                          </p>
                        </motion.div>
                      </AnimatePresence>
                    </div>

                    <div className="space-y-3">
                      <p className="text-sm font-semibold text-foreground">
                        {t.pricing.addOnsLabel}
                      </p>

                      {ADD_ONS.map((addOn) => {
                        const addOnPrice = getAddOnPrice(addOn, billingPeriod);
                        const addOnSuffix = addOn.oneTime
                          ? t.pricing.oneTimeFee
                          : billingPeriod === "annual"
                            ? t.pricing.perYear
                            : t.pricing.perSemester;

                        return (
                          <label
                            key={`${plan.id}-${addOn.id}`}
                            className="flex cursor-pointer items-start gap-3 rounded-xl border border-border/60 p-3 transition-colors hover:bg-muted/35"
                          >
                            <Checkbox
                              checked={selectedAddOnsByPlan[plan.id][addOn.id]}
                              onCheckedChange={(checked) =>
                                toggleAddOn(plan.id, addOn.id, checked)
                              }
                              className="mt-0.5"
                            />
                            <div>
                              <p className="text-sm font-medium text-foreground">
                                {t.pricing.addOnItems[addOn.id]}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                +
                                {formatAmount(
                                  addOnPrice,
                                  numberFormatter,
                                  t.pricing.currencySymbol,
                                )}{" "}
                                {addOnSuffix}
                              </p>
                            </div>
                          </label>
                        );
                      })}
                    </div>
                  </CardContent>

                  <CardFooter className="mt-auto">
                    {whatsappUrl ? (
                      <Button asChild className="w-full">
                        <a
                          href={whatsappUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {t.pricing.startNow}
                        </a>
                      </Button>
                    ) : (
                      <Button className="w-full" disabled>
                        {t.pricing.startNow}
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
