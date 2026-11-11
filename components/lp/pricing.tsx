"use client";

import { useState } from "react";
import { useLanguage } from "@/lib/i18n";
import { SIGNUP_URL } from "@/lib/site";
import { WHATSAPP_NUMBER } from "@/lib/contact";
import { fill } from "@/lib/fill";
import { Check } from "@/components/lp/icons";

type PlanId = "starter" | "basic" | "pro" | "enterprise";
type Period = "annual" | "semester";

// US dollars for the whole period. 2026-11-09 (the owner): no priority-support add-on, prices up — Pro 500 → 600 a
// year; the same +20% on every paid price, rounded to 10.
const PRICES: Record<PlanId, { annual: number; semester: number } | "free" | "custom"> = {
  starter: "free",
  basic: { annual: 360, semester: 230 },
  pro: { annual: 600, semester: 380 },
  enterprise: "custom",
};
const ORDER: PlanId[] = ["starter", "basic", "pro", "enterprise"];
const PERIODS: Period[] = ["annual", "semester"];

const waLink = (text: string) => `https://wa.me/${WHATSAPP_NUMBER.replace(/\D/g, "")}?text=${encodeURIComponent(text)}`;
const usd = (n: number) => `$${n.toLocaleString("en-US")}`;

/** Four plan cards side by side; one switch moves every paid price between a year and 6 months. */
export function Pricing() {
  const { t, language } = useLanguage();
  const p = t.lp.pricing;
  const [period, setPeriod] = useState<Period>("annual");

  return (
    <section className="pricing" id="pricing" aria-labelledby="pricing-title">
      <div className="pricing-head">
        <h2 id="pricing-title" data-rise>{p.title}</h2>
        <p className="pricing-sub" data-rise style={{ ["--d" as string]: "80ms" }}>{p.sub}</p>
      </div>

      <div className="period" role="radiogroup" aria-label={p.periodAria} data-period={period}>
        <span className="period-thumb" aria-hidden="true" />
        {PERIODS.map((v) => (
          <button key={v} type="button" role="radio" aria-checked={period === v} onClick={() => setPeriod(v)}>
            {v === "annual" ? p.year : p.half}
            {v === "annual" && <small>{p.saving}</small>}
          </button>
        ))}
      </div>

      <ul className="plan-cards">
        {ORDER.map((id) => {
          const price = PRICES[id];
          const paid = typeof price === "object";
          const total = paid ? price[period] : 0;
          const plan = p.plans[id];
          const featured = id === "pro";

          let cta = { label: p.startFree, href: `${SIGNUP_URL}?plan=free&lang=${language}`, external: false };
          if (price === "custom") cta = { label: p.contact, href: waLink(p.waEnterprise), external: true };
          if (paid)
            cta = {
              label: p.subscribe,
              href: waLink(fill(p.waSubscribe, { plan: plan.name, period: p.periodNames[period], total: usd(total) })),
              external: true,
            };

          return (
            <li key={id} className={featured ? "plan-card is-featured" : "plan-card"}>
              <div className="plan-top">
                <h3>{plan.name}</h3>
                {featured && <span className="plan-badge">{p.recommended}</span>}
              </div>
              <p className="plan-students">{plan.students}</p>
              <p className="plan-price" key={paid ? period : id}>
                {paid ? (
                  <>
                    <strong className="ltr">{usd(total)}</strong>
                    <span>{period === "annual" ? p.perYear : p.perHalf}</span>
                  </>
                ) : (
                  <strong className="word">{price === "free" ? p.free : p.custom}</strong>
                )}
              </p>
              <a
                className={`btn ${featured ? "btn-gold" : paid ? "btn-ink" : "btn-line"}`}
                href={cta.href}
                {...(cta.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              >
                {cta.label}
              </a>
            </li>
          );
        })}
      </ul>

      <ul className="included" aria-label={p.includedAria}>
        {p.included.map((item) => (
          <li key={item}>
            <Check />
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}
