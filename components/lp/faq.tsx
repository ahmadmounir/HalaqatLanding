"use client";

import { useLanguage } from "@/lib/i18n";
import { WHATSAPP_NUMBER } from "@/lib/contact";

/** Common questions: one open at a time; the heading and a way to ask stay beside the list. */
export function Faq() {
  const { t } = useLanguage();
  const f = t.lp.faq;

  return (
    <section className="faq" id="faq" aria-labelledby="faq-title">
      <div className="faq-head" data-rise>
        <h2 id="faq-title">{f.title}</h2>
        <p>{f.more}</p>
        <a className="btn btn-ink" href={`https://wa.me/${WHATSAPP_NUMBER.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer">
          {f.ask}
        </a>
      </div>
      <div className="faq-list" data-rise style={{ ["--d" as string]: "80ms" }}>
        {f.items.map((item, i) => (
          // `name` makes the browser keep one answer open at a time
          <details key={item.question} name="faq" open={i === 0}>
            <summary>
              {item.question}
              <span className="pm" aria-hidden="true" />
            </summary>
            <p>{item.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
