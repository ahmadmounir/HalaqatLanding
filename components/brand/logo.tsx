/**
 * The Hafiz identity «صوت المصحف» (geometry in brand-geometry.ts, generated from brand/src in the workspace): nine bars
 * of a reciting voice drawing an open mushaf, the gold bar in the middle is its spine — always two colors. The name
 * «حافظ» and HAFIZ are outlines, never live text.
 */
import { cn } from "@/lib/utils";
import {
  BARS,
  BRAND_TONES,
  MARK_H,
  MARK_W,
  SPINE_INDEX,
  WORDMARK_AR,
  WORDMARK_LATIN,
  lockupLayout,
  type BrandTone,
} from "./brand-geometry";

function Bars({ bars, spine }: { bars: string; spine: string }) {
  return (
    <>
      {BARS.map(([x, y, h], i) => (
        <rect key={i} x={x} y={y} width={24} height={h} rx={12} fill={i === SPINE_INDEX ? spine : bars} />
      ))}
    </>
  );
}

/** The mark alone in the current text color: for the faint watermarks behind sections. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox={`0 0 ${MARK_W} ${MARK_H}`} className={cn("h-6 w-auto", className)} aria-hidden="true">
      <Bars bars="currentColor" spine="currentColor" />
    </svg>
  );
}

/** The app icon: the mark on the deep green tile (a caller's bg-* replaces the tile's color). */
export function LogoTile({ className }: { className?: string }) {
  const tone = BRAND_TONES.onDark;
  return (
    <span className={cn("inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-[22%] bg-ink", className)}>
      <svg viewBox={`0 0 ${MARK_W} ${MARK_H}`} className="h-auto w-[64%]" aria-hidden="true">
        <Bars bars={tone.bars} spine={tone.spine} />
      </svg>
    </span>
  );
}

/** The logo: the mark with «حافظ» and HAFIZ beside it. `tone="light"` is for deep green backgrounds. */
export function Logo({
  name,
  tone = "dark",
  className,
}: {
  name: string;
  tone?: "dark" | "light";
  className?: string;
}) {
  const colors = BRAND_TONES[(tone === "light" ? "onDark" : "onLight") satisfies BrandTone];
  const layout = lockupLayout("sideLatin");
  return (
    <svg
      viewBox={`0 0 ${layout.w.toFixed(1)} ${layout.h.toFixed(1)}`}
      className={cn("h-10 w-auto", className)}
      role="img"
      aria-label={name}
    >
      {layout.parts.map((part) => {
        const transform = `translate(${part.x.toFixed(2)} ${part.y.toFixed(2)}) scale(${part.s.toFixed(5)})`;
        if (part.kind === "mark") {
          return (
            <g key="mark" transform={transform}>
              <Bars bars={colors.bars} spine={colors.spine} />
            </g>
          );
        }
        const ar = part.kind === "ar";
        return (
          <path
            key={part.kind}
            transform={transform}
            d={ar ? WORDMARK_AR.d : WORDMARK_LATIN.d}
            fill={ar ? colors.word : colors.latin}
          />
        );
      })}
    </svg>
  );
}
