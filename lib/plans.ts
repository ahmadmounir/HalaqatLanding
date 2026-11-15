// The plans and their prices, shared by the pricing cards (components/lp/pricing.tsx) and the structured data
// (lib/seo.ts). A plain module: server code cannot read values out of a "use client" file.

export type PlanId = "starter" | "basic" | "pro" | "enterprise";
export type Period = "annual" | "semester";

// US dollars for the whole period. 2026-11-09 (the owner): no priority-support add-on, prices up — Pro 500 → 600 a
// year; the same +20% on every paid price, rounded to 10.
export const PRICES: Record<PlanId, { annual: number; semester: number } | "free" | "custom"> = {
  starter: "free",
  basic: { annual: 360, semester: 230 },
  pro: { annual: 600, semester: 380 },
  enterprise: "custom",
};
export const PLAN_ORDER: PlanId[] = ["starter", "basic", "pro", "enterprise"];
export const PERIODS: Period[] = ["annual", "semester"];

/** How many students each plan is for (the cards say the same in words). Enterprise has no upper limit. */
export const PLAN_STUDENTS: Record<PlanId, { min: number; max?: number }> = {
  starter: { min: 1, max: 20 },
  basic: { min: 21, max: 50 },
  pro: { min: 51, max: 150 },
  enterprise: { min: 151 },
};
