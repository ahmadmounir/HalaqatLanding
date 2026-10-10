import { cn } from "@/lib/utils";
import { LOGO_PATH, LOGO_VIEWBOX } from "./logo-path";

/** The Hafiz mark on its own. It takes the current text color. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox={LOGO_VIEWBOX}
      className={cn("h-6 w-6", className)}
      fill="currentColor"
      aria-hidden="true"
    >
      <path fillRule="evenodd" d={LOGO_PATH} />
    </svg>
  );
}

/** Gold mark on the deep green tile, as in the original artwork. */
export function LogoTile({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-[28%] bg-ink text-gold",
        className,
      )}
    >
      <LogoMark className="h-[62%] w-[62%]" />
    </span>
  );
}

/** Tile + name. `tone="light"` is for deep green backgrounds. */
export function Logo({
  name,
  tone = "dark",
  className,
}: {
  name: string;
  tone?: "dark" | "light";
  className?: string;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <LogoTile
        className={tone === "light" ? "bg-white/10" : undefined}
      />
      <span
        className={cn(
          "text-[1.1875rem] font-semibold tracking-tight",
          tone === "light" ? "text-white" : "text-ink",
        )}
      >
        {name}
      </span>
    </span>
  );
}
