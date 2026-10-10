import { Reveal } from "@/components/motion";
import { cn } from "@/lib/utils";

/** Label, title and one supporting line: the opening of every section. */
export function SectionHeading({
  label,
  title,
  subtitle,
  tone = "dark",
  className,
}: {
  label: string;
  title: string;
  subtitle?: string;
  tone?: "dark" | "light";
  className?: string;
}) {
  return (
    <Reveal className={cn("max-w-2xl", className)}>
      <p className={cn("eyebrow", tone === "light" && "text-gold")}>{label}</p>
      <h2 className={cn("heading mt-4", tone === "light" && "text-white")}>
        {title}
      </h2>
      {subtitle ? (
        <p className={cn("lead mt-4", tone === "light" && "text-white/70")}>
          {subtitle}
        </p>
      ) : null}
    </Reveal>
  );
}
