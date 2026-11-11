"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "@/components/lp/icons";

/** One phone screen: the picture's file and its size in pixels (the frame crops it from the top). */
export interface PhoneShot {
  src: string;
  w: number;
  h: number;
}

/** The texts of a row, from locales/*.json: one caption per shot, in the same order. */
export interface PhoneRowTexts {
  title: string;
  lead: string;
  prev: string;
  next: string;
  rowAria: string;
  screens: { name: string; text: string; alt: string }[];
}

/**
 * A dark row of real phone screens: the centred one is lit; the arrows sit on both sides of its caption.
 * Used twice on the page, for the staff (teachers and administration) and for the students and parents.
 */
export function PhoneRow({ id, texts, shots, className }: { id: string; texts: PhoneRowTexts; shots: PhoneShot[]; className?: string }) {
  const rowRef = useRef<HTMLDivElement>(null);
  const [current, setCurrent] = useState(0);
  const [shown, setShown] = useState(0);
  const [swapping, setSwapping] = useState(false);

  const figures = () => Array.from(rowRef.current?.querySelectorAll("figure") ?? []);

  const light = useCallback(() => {
    const row = rowRef.current;
    if (!row) return;
    const box = row.getBoundingClientRect();
    const mid = box.left + box.width / 2;
    let best = 0;
    let bestD = Infinity;
    figures().forEach((f, i) => {
      const r = f.getBoundingClientRect();
      const d = Math.abs(r.left + r.width / 2 - mid);
      if (d < bestD) {
        bestD = d;
        best = i;
      }
    });
    setCurrent(best);
  }, []);

  // The caption fades out, changes, fades in
  useEffect(() => {
    if (current === shown) return;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    setSwapping(true);
    const timer = setTimeout(() => {
      setShown(current);
      setSwapping(false);
    }, reduce ? 0 : 180);
    return () => clearTimeout(timer);
  }, [current, shown]);

  // Moves the row itself (never the page): the screen's centre to the row's centre
  const go = (i: number) => {
    const row = rowRef.current;
    const list = figures();
    const target = list[Math.max(0, Math.min(list.length - 1, i))];
    if (!row || !target) return;
    const box = row.getBoundingClientRect();
    const r = target.getBoundingClientRect();
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    row.scrollBy({ left: r.left + r.width / 2 - (box.left + box.width / 2), behavior: reduce ? "auto" : "smooth" });
  };

  // Drag with a mouse (touch scrolls natively)
  const drag = useRef<{ x: number; left: number } | null>(null);
  useEffect(() => {
    let raf = 0;
    const row = rowRef.current;
    if (!row) return;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(light);
    };
    row.addEventListener("scroll", onScroll, { passive: true });
    light();
    return () => row.removeEventListener("scroll", onScroll);
  }, [light]);

  const screens = texts.screens;
  const caption = screens[shown] ?? screens[0];
  const titleId = `${id}-title`;

  return (
    <section className={className ? `apps ${className}` : "apps"} id={id} aria-labelledby={titleId}>
      <div className="apps-head">
        <h2 id={titleId} data-rise>{texts.title}</h2>
        <p data-rise style={{ ["--d" as string]: "80ms" }}>{texts.lead}</p>
      </div>
      <div
        className="row"
        ref={rowRef}
        tabIndex={0}
        aria-label={texts.rowAria}
        onKeyDown={(e) => {
          const forward = document.documentElement.dir === "rtl" ? "ArrowLeft" : "ArrowRight";
          const back = forward === "ArrowLeft" ? "ArrowRight" : "ArrowLeft";
          if (e.key === forward) { e.preventDefault(); go(current + 1); }
          if (e.key === back) { e.preventDefault(); go(current - 1); }
        }}
        onPointerDown={(e) => {
          if (e.pointerType !== "mouse") return;
          const row = rowRef.current!;
          drag.current = { x: e.clientX, left: row.scrollLeft };
          row.style.scrollSnapType = "none";
          row.setPointerCapture(e.pointerId);
        }}
        onPointerMove={(e) => {
          if (drag.current) rowRef.current!.scrollLeft = drag.current.left - (e.clientX - drag.current.x);
        }}
        onPointerUp={() => {
          if (!drag.current) return;
          drag.current = null;
          rowRef.current!.style.scrollSnapType = "";
          go(current);
        }}
      >
        {shots.map((s, i) => (
          <figure key={s.src} className={i === current ? "is-lit" : undefined}>
            <img src={s.src} width={s.w} height={s.h} alt={screens[i]?.alt ?? ""} loading={i === 0 ? undefined : "lazy"} decoding="async" />
          </figure>
        ))}
      </div>
      <div className="apps-foot">
        <button className="arrow" type="button" aria-label={texts.prev} disabled={current === 0} onClick={() => go(current - 1)}>
          <ChevronRight />
        </button>
        <p className={`apps-caption${swapping ? " is-swap" : ""}`} aria-live="polite">
          <b>{caption.name}</b>
          <span>{caption.text}</span>
        </p>
        <button className="arrow" type="button" aria-label={texts.next} disabled={current === shots.length - 1} onClick={() => go(current + 1)}>
          <ChevronLeft />
        </button>
      </div>
    </section>
  );
}
