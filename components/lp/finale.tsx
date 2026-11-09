"use client";

import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/lib/i18n";
import { LOGIN_URL, SIGNUP_URL } from "@/lib/site";
import { WHATSAPP_NUMBER } from "@/lib/contact";
import { fill } from "@/lib/fill";
import { Voice } from "@/components/lp/icons";

/** The ending on green: the reciting mark, the closing line and the first step already open. */
export function Finale() {
  const { t, language } = useLanguage();
  const f = t.lp.finale;
  const [org, setOrg] = useState(f.orgExample);
  const [large, setLarge] = useState(false);
  const [live, setLive] = useState(false);
  const wordsRef = useRef<HTMLDivElement>(null);

  // The bars recite only while they are on screen
  useEffect(() => {
    const el = wordsRef.current;
    if (!el || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(([e]) => setLive(e.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const name = org.trim() || f.fallbackName;
  const href = large
    ? `https://wa.me/${WHATSAPP_NUMBER.replace(/\D/g, "")}?text=${encodeURIComponent(fill(f.waMessage, { name }))}`
    : `${SIGNUP_URL}?plan=free&lang=${language}`;

  return (
    <section className="finale" id="start" aria-labelledby="cta-title">
      <div className="finale-words" ref={wordsRef}>
        <Voice live={live} />
        <h2 id="cta-title" data-rise>
          <span>{f.title1}</span>
          <span>{f.title2}</span>
        </h2>
        <p data-rise style={{ ["--d" as string]: "80ms" }}>{f.text}</p>
      </div>
      <form className="dialog" data-ui data-rise style={{ ["--d" as string]: "160ms" }} onSubmit={(e) => e.preventDefault()}>
        <div className="d-top">
          <img src="/lp/icon-dark.svg" alt="" width={40} height={40} />
          <b>{f.dialogTitle}</b>
        </div>
        <label htmlFor="org">{f.org}</label>
        <input type="text" id="org" value={org} onChange={(e) => setOrg(e.target.value)} autoComplete="organization" />
        <span className="lbl" id="size-lbl">{f.size}</span>
        <div className="seg" role="group" aria-labelledby="size-lbl">
          <button type="button" aria-pressed={!large} onClick={() => setLarge(false)}>{f.small}</button>
          <button type="button" aria-pressed={large} onClick={() => setLarge(true)}>{f.large}</button>
        </div>
        <a className="btn btn-ink" href={href} {...(large ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
          {large ? f.whatsapp : f.start}
        </a>
        <p className="d-foot">
          {f.haveAccount} <a className="link" href={LOGIN_URL}>{f.login}</a>
        </p>
      </form>
    </section>
  );
}
