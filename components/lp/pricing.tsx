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

const waLink = (text: string) => `https://wa.me/${WHATSAPP_NUMBER.replace(/\D/g, "")}?text=${encodeURIComponent(text)}`;
const usd = (n: number) => `$${n.toLocaleString("en-US")}`;

/** Plan names as one list; the card shows the chosen one's price and its button. */
export function Pricing() {
  const { t, language } = useLanguage();
  const p = t.lp.pricing;
  const [plan, setPlan] = useState<PlanId>("pro");
  const [period, setPeriod] = useState<Period>("annual");

  const price = PRICES[plan];
  const paid = typeof price === "object";
  const total = paid ? price[period] : 0;

  let cta = { label: p.startFree, href: `${SIGNUP_URL}?plan=free&lang=${language}`, after: p.afterFree, external: false };
  if (price === "custom") cta = { label: p.contact, href: waLink(p.waEnterprise), after: p.afterWa, external: true };
  if (paid)
    cta = {
      label: p.subscribe,
      href: waLink(fill(p.waSubscribe, { plan: p.plans[plan].name, period: p.periodNames[period], total: usd(total) })),
      after: p.afterWa,
      external: true,
    };

  return (
    <section className="pricing" id="pricing" aria-labelledby="pricing-title">
      <h2 id="pricing-title" data-rise>{p.title}</h2>
      <p className="pricing-sub" data-rise style={{ ["--d" as string]: "80ms" }}>{p.sub}</p>
      <div className="plans" role="tablist" aria-label={p.plansAria}>
        {ORDER.map((id) => (
          <button
            key={id}
            className="plan-name"
            role="tab"
            aria-selected={plan === id}
            aria-controls="plan-stage"
            onClick={() => setPlan(id)}
          >
            {p.plans[id].name}
            {id === "pro" && <small>{p.recommended}</small>}
          </button>
        ))}
      </div>
      <div className="plan-stage" id="plan-stage" role="tabpanel">
        <div className="seg" role="group" aria-label={p.periodAria} hidden={!paid}>
          {(["annual", "semester"] as Period[]).map((v) => (
            <button key={v} type="button" aria-pressed={period === v} onClick={() => setPeriod(v)}>
              {v === "annual" ? p.year : p.half}
            </button>
          ))}
        </div>
        <div className="plan-body" key={`${plan}-${period}`}>
          <div className="price">
            {paid ? (
              <>
                <strong>{usd(total)}</strong>
                <span>{period === "annual" ? p.perYear : p.perHalf}</span>
              </>
            ) : (
              <strong className="word">{price === "free" ? p.free : p.custom}</strong>
            )}
          </div>
          <p className="plan-students">{p.plans[plan].students}</p>
        </div>
        <a className="btn btn-ink" href={cta.href} {...(cta.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
          {cta.label}
        </a>
        <p className="plan-after">{cta.after}</p>
      </div>
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
