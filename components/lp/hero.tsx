"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type FocusEvent as ReactFocusEvent,
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { useLanguage } from "@/lib/i18n";
import { SIGNUP_URL } from "@/lib/site";
import { fill } from "@/lib/fill";
import { PAGE_582 } from "@/lib/mushaf-page-582";
import { ArrowForward, Person, Tap } from "@/components/lp/icons";
import { Kicker } from "@/components/lp/kicker";

type Mark = "r" | "m" | "x";

// The app's deductions for a memorization / review part (recitationSections.ts): out of 100, 80 to pass.
const POINTS: Record<Mark, number> = { r: 1, m: 2, x: 4 };
const MARK_COLOR: Record<Mark, string> = { r: "var(--mark-r)", m: "var(--mark-m)", x: "var(--mark-x)" };
// A recitation in progress: two words already marked, as a teacher would mid-session.
const START: [number, Mark][] = [[9, "r"], [40, "m"]];
// The surah frame glyph of surah 78 in the print's surah-header font (surahHeaderGlyph in the app).
const NABA_FRAME = String.fromCodePoint(0xfba5);

/*
 * The page first shows a picture of itself (public/lp/mushaf-582-*: the live page below, captured with the START
 * marks), and the live page replaces it once the visitor reaches for it: a click or tap, the mouse over it, or the
 * keyboard. The three page fonts (320 KB, public/fonts/qcf, the Complex's files unmodified) are then no longer part
 * of the first load: on phones they cost most of the speed score (SEO audit 2026-11-15: mobile 50-59, LCP 5.7-6.5 s).
 * They are fetched quietly once the page has loaded, so the switch is quick.
 */
const QCF_FAMILIES = ["qcf-p582", "qcf-p1", "qcf-surah"];
let qcfFonts: Promise<unknown> | null = null;
function loadQcfFonts(): Promise<unknown> {
  qcfFonts ??= Promise.all(QCF_FAMILIES.map((family) => document.fonts.load(`20px "${family}"`))).catch((error) => {
    qcfFonts = null; // offline or blocked: try again on the next reach
    throw error;
  });
  return qcfFonts;
}

export function Hero() {
  const { t, language } = useLanguage();
  const h = t.lp.hero;

  return (
    <section className="hero" aria-labelledby="hero-title">
      {/* What the product is, inside the H1 (search engines and AI answers read it), above the visual line. The
          spaces between the spans keep the words apart in the page's text. */}
      <h1 id="hero-title">
        <Kicker>{h.kicker}</Kicker> <span>{h.title1}</span> <span>{h.title2}</span>
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
  const [live, setLive] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  // Where the visitor tapped the picture (0–1 of its box), to open that word once the live page is in
  const tapAt = useRef<{ x: number; y: number } | null>(null);
  const focusFirst = useRef(false);
  const waking = useRef(false);

  const wake = useCallback(() => {
    if (waking.current) return;
    waking.current = true;
    loadQcfFonts().then(
      () => setLive(true),
      () => {
        waking.current = false;
      },
    );
  }, []);

  // Fetch the page fonts a little after the page has loaded, when the browser is idle (never on a data-saving
  // connection): on a slow phone they must not take bandwidth from the picture, the text fonts or the scripts.
  // Reaching for the page (mouse over it, a tap) fetches them at once anyway.
  useEffect(() => {
    if ((navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData) return;
    let cancelled = false;
    let timer = 0;
    const idle = () => {
      timer = window.setTimeout(() => {
        const later = window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 200));
        later(() => !cancelled && loadQcfFonts().catch(() => {}), { timeout: 4000 });
      }, 3000);
    };
    if (document.readyState === "complete") idle();
    else window.addEventListener("load", idle, { once: true });
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
      window.removeEventListener("load", idle);
    };
  }, []);

  // The live page is in: open the word that was tapped on the picture, or take the keyboard to the first word
  useEffect(() => {
    if (!live) return;
    const tap = tapAt.current;
    tapAt.current = null;
    const body = bodyRef.current;
    if (tap && body) {
      const r = body.getBoundingClientRect();
      const word = document.elementFromPoint(r.left + tap.x * r.width, r.top + tap.y * r.height)?.closest<HTMLElement>(".mp-w");
      if (word) setOpen(Number(word.dataset.i));
    } else if (focusFirst.current) {
      focusFirst.current = false;
      wordEl(0)?.focus({ preventScroll: true });
    }
  }, [live]);

  // The mouse over the page or the panel wakes it at once (hover works then). A touch wakes it on the tap itself
  // (click), never on pointerdown or focus: the picture must still be there when the tap ends, so the tap is seen.
  const byKeyboard = (e: ReactFocusEvent<HTMLElement>) => (e.target as HTMLElement).matches?.(":focus-visible") ?? false;
  const wakeProps = {
    onPointerEnter: (e: ReactPointerEvent<HTMLElement>) => {
      if (e.pointerType === "mouse") wake();
      else loadQcfFonts().catch(() => {});
    },
    onClick: wake,
    onFocus: (e: ReactFocusEvent<HTMLElement>) => {
      if (byKeyboard(e)) wake();
    },
  };
  const tapPicture = (e: ReactMouseEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    tapAt.current = { x: (e.clientX - r.left) / r.width, y: (e.clientY - r.top) / r.height };
    wake();
  };
  const keyPicture = () => {
    focusFirst.current = true;
    wake();
  };

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
      <div className="mushaf" data-ui data-nosnippet ref={cardRef} aria-label={h.pageAria} {...wakeProps}>
        <div className="mp-head">
          <b>{h.surah}</b>
          <span className={`live${low ? " low" : ""}`}>{fill(h.score, { n: score })}</span>
          <span>{h.page}</span>
        </div>
        {!live ? (
          <div
            className="mp-body mp-still"
            role="button"
            tabIndex={0}
            aria-label={h.tap}
            onClick={tapPicture}
            onFocus={(e) => {
              if (byKeyboard(e)) keyPicture();
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                keyPicture();
              }
            }}
          >
            {/* The same page with the same two marks, until the live one is in (see loadQcfFonts) */}
            <picture>
              <source
                type="image/avif"
                srcSet="/lp/mushaf-582-700.avif 700w, /lp/mushaf-582-900.avif 900w, /lp/mushaf-582-1182.avif 1182w"
                sizes="(max-width: 760px) 86vw, 400px"
              />
              <img src="/lp/mushaf-582-790.webp" width={1182} height={1893} alt={h.pageAlt} fetchPriority="high" />
            </picture>
          </div>
        ) : (
        <div
          ref={bodyRef}
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
                      <span key={wi} className="mp-end" role="img" aria-label={fill(h.ayah, { n: w.ayah })}>{w.g}</span>
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
        )}
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

      <aside className="grade" data-ui data-nosnippet aria-live="polite" {...wakeProps}>
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
