"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useLanguage } from "@/lib/i18n";
import { SIGNUP_URL } from "@/lib/site";
import { fill } from "@/lib/fill";
import { PAGE_582 } from "@/lib/mushaf-page-582";
import { ArrowForward, Person, Tap } from "@/components/lp/icons";

type Mark = "r" | "m" | "x";

// The app's deductions for a memorization / review part (recitationSections.ts): out of 100, 80 to pass.
const POINTS: Record<Mark, number> = { r: 1, m: 2, x: 4 };
const MARK_COLOR: Record<Mark, string> = { r: "var(--mark-r)", m: "var(--mark-m)", x: "var(--mark-x)" };
// A recitation in progress: two words already marked, as a teacher would mid-session.
const START: [number, Mark][] = [[9, "r"], [40, "m"]];
// The surah frame glyph of surah 78 in the print's surah-header font (surahHeaderGlyph in the app).
const NABA_FRAME = String.fromCodePoint(0xfba5);

export function Hero() {
  const { t, language } = useLanguage();
  const h = t.lp.hero;

  return (
    <section className="hero" aria-labelledby="hero-title">
      <h1 id="hero-title">
        <span>{h.title1}</span>
        <span>{h.title2}</span>
      </h1>
      <div className="hero-lead">
        <p>{h.lead}</p>
        <div className="hero-actions">
          <a className="btn btn-ink" href={`${SIGNUP_URL}?plan=free&lang=${language}`}>
            {h.cta}
            <ArrowForward className="flip" />
          </a>
          <a className="link" href="#grade">
            {h.try}
          </a>
        </div>
        <p className="hero-note">{h.note}</p>
      </div>
      <div className="stage-wrap" id="grade">
        <div className="stage">
          <p className="stage-caption">
            <Tap />
            {h.tap}
          </p>
          <MushafDemo />
        </div>
      </div>
    </section>
  );
}

/** A real page of the print where the visitor grades words exactly like a teacher in the app. */
function MushafDemo() {
  const { t } = useLanguage();
  const h = t.lp.hero;
  const [marks, setMarks] = useState<Map<number, Mark>>(() => new Map(START));
  const [open, setOpen] = useState(-1);
  const [pos, setPos] = useState<{ left: number; top: number } | null>(null);
  const [bump, setBump] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Words get a running index (end-of-ayah markers are not words)
  const lines = useMemo(() => {
    let i = 0;
    return PAGE_582.lines.map((line) =>
      line.t === "w" ? { ...line, words: line.w.map((w) => ({ g: w[0], ayah: w[1], end: !!w[2], text: w[3], i: w[2] ? -1 : i++ })) } : line,
    );
  }, []);
  const words = useMemo(() => lines.flatMap((l) => ("words" in l ? l.words.filter((w) => !w.end) : [])), [lines]);

  const counts = { r: 0, m: 0, x: 0 };
  marks.forEach((k) => counts[k]++);
  const lost = counts.r * POINTS.r + counts.m * POINTS.m + counts.x * POINTS.x;
  const score = Math.max(0, 100 - lost);
  const low = score < 80;

  const wordEl = (i: number) => cardRef.current?.querySelector<HTMLElement>(`[data-i="${i}"]`) ?? null;

  // Place the menu under the word (above it near the page's foot), inside the page
  useLayoutEffect(() => {
    if (open < 0) return setPos(null);
    const card = cardRef.current?.getBoundingClientRect();
    const word = wordEl(open)?.getBoundingClientRect();
    const menu = menuRef.current;
    if (!card || !word || !menu) return;
    const mw = menu.offsetWidth;
    const mh = menu.offsetHeight;
    let left = word.left - card.left + word.width / 2 - mw / 2;
    left = Math.max(8, Math.min(left, card.width - mw - 8));
    let top = word.bottom - card.top + 8;
    if (top + mh > card.height) top = word.top - card.top - mh - 8;
    setPos({ left, top: Math.max(8, top) });
  }, [open]);

  // Into the menu once it is placed (an element still hidden cannot take focus)
  useEffect(() => {
    if (open >= 0 && pos) menuRef.current?.querySelector("button")?.focus({ preventScroll: true });
  }, [open, pos]);

  useEffect(() => {
    if (open < 0) return;
    const onDown = (e: PointerEvent) => {
      if (!menuRef.current?.contains(e.target as Node) && !(e.target as HTMLElement).closest?.(".mp-w")) setOpen(-1);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        wordEl(open)?.focus({ preventScroll: true });
        setOpen(-1);
      }
    };
    const onResize = () => setOpen(-1);
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
    };
  }, [open]);

  const choose = (mark: Mark | "") => {
    const i = open;
    setMarks((prev) => {
      const next = new Map(prev);
      if (mark) next.set(i, mark);
      else next.delete(i);
      return next;
    });
    setBump((b) => b + 1);
    setOpen(-1);
    wordEl(i)?.focus({ preventScroll: true });
  };

  const openWord = open >= 0 ? words[open] : null;

  return (
    <>
      <div className="mushaf" data-ui ref={cardRef} aria-label={h.pageAria}>
        <div className="mp-head">
          <b>{h.surah}</b>
          <span className={`live${low ? " low" : ""}`}>{fill(h.score, { n: score })}</span>
          <span>{h.page}</span>
        </div>
        <div
          className="mp-body"
          onClick={(e) => {
            const w = (e.target as HTMLElement).closest<HTMLElement>(".mp-w");
            if (!w) return;
            const i = Number(w.dataset.i);
            setOpen((cur) => (cur === i ? -1 : i));
          }}
          onKeyDown={(e) => {
            const w = (e.target as HTMLElement).closest<HTMLElement>(".mp-w");
            if (w && (e.key === "Enter" || e.key === " ")) {
              e.preventDefault();
              setOpen(Number(w.dataset.i));
            }
          }}
        >
          {lines.map((line, li) => {
            if (line.t === "h")
              return (
                <div className="mp-header" key={li}>
                  <span className="mp-frame" aria-label={h.surah}>{NABA_FRAME}</span>
                </div>
              );
            if (line.t === "b")
              return (
                <div className="mp-basmala" key={li} aria-label="بسم الله الرحمن الرحيم">
                  {[...line.g].map((g, gi) => <span key={gi}>{g}</span>)}
                </div>
              );
            return (
              <div className="mp-line" key={li}>
                {"words" in line &&
                  line.words.map((w, wi) =>
                    w.end ? (
                      <span key={wi} className="mp-end" aria-label={fill(h.ayah, { n: w.ayah })}>{w.g}</span>
                    ) : (
                      <span
                        key={wi}
                        className={`mp-w${marks.get(w.i) ? " " + marks.get(w.i) : ""}${open === w.i ? " is-open" : ""}`}
                        role="button"
                        tabIndex={0}
                        data-i={w.i}
                        aria-label={`${w.text}، ${fill(h.ayah, { n: w.ayah })}`}
                      >
                        {w.g}
                      </span>
                    ),
                  )}
              </div>
            );
          })}
        </div>
        <div className="mp-folio ltr">582</div>
        <div
          className="word-menu"
          ref={menuRef}
          role="menu"
          aria-label={h.menuAria}
          hidden={open < 0}
          style={pos ? { left: pos.left, top: pos.top } : { left: 0, top: 0, visibility: "hidden" }}
        >
          <div className="wm-word">
            <span>{openWord ? fill(h.ayah, { n: openWord.ayah }) : ""}</span>
            <span className="wm-glyph" aria-hidden="true">{openWord?.g}</span>
          </div>
          {(["r", "m", "x"] as Mark[]).map((k) => (
            <button key={k} type="button" role="menuitem" onClick={() => choose(k)}>
              <span className="dot" style={{ background: MARK_COLOR[k] }} />
              {h.marks[k]}
              <span className="pts ltr">−{POINTS[k]}</span>
            </button>
          ))}
          <button type="button" role="menuitem" onClick={() => choose("")}>
            <span className="dot" style={{ background: "#e5e0d4" }} />
            {h.marks.clear}
          </button>
        </div>
      </div>

      <aside className="grade" data-ui aria-live="polite">
        <p className="grade-do">
          <Tap />
          {h.panelTap}
        </p>
        <div className="grade-who">
          <span className="av"><Person /></span>
          <span>
            <b>{h.student}</b>
            <span>{h.assignment}</span>
          </span>
        </div>
        <div className="grade-score">
          <strong key={bump} className={`${low ? "low" : ""}${bump ? " bump" : ""}`}>{score}</strong>
          <span>{h.outOf}</span>
        </div>
        <div className="meter" aria-hidden="true">
          <i className={low ? "low" : ""} style={{ width: `${score}%` }} />
          <em />
        </div>
        <div className="meter-note">
          <span>{h.pass}</span>
          <span>{lost ? fill(h.deducted, { n: lost }) : h.none}</span>
        </div>
        <ul>
          {(["r", "m", "x"] as Mark[]).map((k) => (
            <li key={k}>
              <span className="dot" style={{ background: MARK_COLOR[k] }} />
              {h.marks[k]}
              <span className="n">{counts[k]}</span>
            </li>
          ))}
        </ul>
        <button
          className="grade-reset"
          type="button"
          onClick={() => {
            setMarks(new Map());
            setBump((b) => b + 1);
          }}
        >
          {h.reset}
        </button>
      </aside>
    </>
  );
}
