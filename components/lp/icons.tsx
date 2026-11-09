// The few line icons the landing uses (same strokes as the app's lucide set), inline so they need no request.
import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

const base = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

/** Points to the reading direction's "forward" in Arabic (left); `.flip` mirrors it in English / Turkish. */
export const ArrowForward = (p: IconProps) => (
  <svg {...base} {...p}><path d="M19 12H5M11 18l-6-6 6-6" /></svg>
);
export const ChevronRight = (p: IconProps) => (
  <svg {...base} strokeWidth={2.2} {...p}><path d="m9 6 6 6-6 6" /></svg>
);
export const ChevronLeft = (p: IconProps) => (
  <svg {...base} strokeWidth={2.2} {...p}><path d="m15 6-6 6 6 6" /></svg>
);
export const Check = (p: IconProps) => (
  <svg {...base} strokeWidth={2.6} {...p}><path d="M20 6 9 17l-5-5" /></svg>
);
export const Tap = (p: IconProps) => (
  <svg {...base} {...p}><path d="M9 11V6a3 3 0 0 1 6 0v5" /><path d="M5 13a7 7 0 0 0 14 0v-2H5z" /></svg>
);
export const Person = (p: IconProps) => (
  <svg {...base} {...p}><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></svg>
);
export const Trophy = (p: IconProps) => (
  <svg {...base} {...p}><path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0z" /><path d="M17 5h3v2a3 3 0 0 1-3 3M7 5H4v2a3 3 0 0 0 3 3" /></svg>
);
export const Sheet = (p: IconProps) => (
  <svg {...base} {...p}><path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" /><path d="M14 3v6h6M9 13l6 6M15 13l-6 6" /></svg>
);
export const Lock = (p: IconProps) => (
  <svg {...base} {...p}><rect x="4" y="11" width="16" height="10" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" /></svg>
);
export const WhatsApp = (p: IconProps) => (
  <svg {...base} strokeWidth={1.9} {...p}><path d="M3.5 20.5 5 16a8.5 8.5 0 1 1 3.2 3.1z" /><path d="M9 9.5c.4 2 2.5 4.2 4.8 4.8l1.2-1.1 2 1-.6 1.6c-3.6.4-8-3.9-7.6-7.6L10.5 7.6l1 2z" /></svg>
);
export const Mail = (p: IconProps) => (
  <svg {...base} strokeWidth={1.9} {...p}><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></svg>
);
export const Instagram = (p: IconProps) => (
  <svg {...base} strokeWidth={1.9} {...p}><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" /></svg>
);

/** The mark «صوت المصحف»: nine bars of a reciting voice, the gold one the mushaf's spine (brandGeometry). */
const BARS = [
  { x: 0, y: 18, h: 154, ring: 4 },
  { x: 40, y: 0, h: 184, ring: 3 },
  { x: 80, y: 10, h: 186, ring: 2 },
  { x: 120, y: 36, h: 170, ring: 1 },
  { x: 160, y: 74, h: 140, ring: 0 },
  { x: 200, y: 36, h: 170, ring: 1 },
  { x: 240, y: 10, h: 186, ring: 2 },
  { x: 280, y: 0, h: 184, ring: 3 },
  { x: 320, y: 18, h: 154, ring: 4 },
];

export function Voice({ live, className }: { live?: boolean; className?: string }) {
  return (
    <svg className={`voice${live ? " is-live" : ""}${className ? " " + className : ""}`} viewBox="0 0 344 214" aria-hidden="true">
      {BARS.map((b) => (
        <rect
          key={b.x}
          style={{ ["--ring" as string]: b.ring }}
          x={b.x}
          y={b.y}
          width={24}
          height={b.h}
          rx={12}
          fill={b.ring === 0 ? "#D4B061" : "#F3ECDC"}
        />
      ))}
    </svg>
  );
}
