"use client";

import { useLanguage } from "@/lib/i18n";
import { Lock, Sheet, Trophy } from "@/components/lp/icons";

const FACT_ICONS = [Trophy, Sheet, Lock];

/** The staff dashboard (two real screens crossfading), the seasons, three facts. */
export function Admin() {
  const { t } = useLanguage();
  const a = t.lp.admin;

  return (
    <section className="admin" id="admin" aria-labelledby="admin-title">
      <div className="admin-head">
        <h2 id="admin-title" data-rise>{a.title}</h2>
        <p className="admin-lead" data-rise style={{ ["--d" as string]: "80ms" }}>{a.lead}</p>
      </div>
      <figure className="admin-photo" data-rise style={{ ["--d" as string]: "120ms" }}>
        <img className="is-on" src="/lp/dashboard.jpg" width={1220} height={760} alt={a.alt1} loading="lazy" />
        <img src="/lp/dashboard-form.jpg" width={1220} height={760} alt={a.alt2} loading="lazy" />
      </figure>
      <div className="admin-side" data-rise style={{ ["--d" as string]: "200ms" }}>
        <div className="season" data-ui>
          <b>{a.season}</b>
          <svg viewBox="0 0 300 40" aria-hidden="true">
            <rect x="0" y="10" width="92" height="20" rx="10" fill="#4a6e62" />
            <rect x="104" y="10" width="120" height="20" rx="10" fill="#d4b061" />
            <rect x="236" y="10" width="64" height="20" rx="10" fill="#4a6e62" />
            <circle cx="196" cy="20" r="7" fill="#0d3429" />
            <circle cx="196" cy="20" r="3.5" fill="#f3ecdc" />
          </svg>
          <small>{a.seasonNote}</small>
        </div>
        <ul className="facts">
          {a.facts.map((fact, i) => {
            const Icon = FACT_ICONS[i] ?? Trophy;
            return (
              <li key={fact}>
                <Icon />
                {fact}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
