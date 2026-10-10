import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Serif italic accent used inside headings, e.g. "Shop by *Category*". */
export function SerifAccent({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cn("font-serif font-normal tracking-[-0.02em] text-accent normal-case italic", className)}
    >
      {children}
    </span>
  );
}

type Props = {
  title: ReactNode;
  description?: ReactNode;
  eyebrow?: ReactNode;
  as?: "h1" | "h2";
  className?: string;
  titleClassName?: string;
  /** Extra content aligned to the right of the title, e.g. a CTA. */
  aside?: ReactNode;
};

/** Big uppercase display heading with an optional note on the right, as on the product page. */
export function SectionHeading({
  title,
  description,
  eyebrow,
  as: Tag = "h2",
  className,
  titleClassName,
  aside,
}: Props) {
  return (
    <div className={cn("flex flex-wrap items-end justify-between gap-6", className)}>
      <div className="flex flex-col gap-4">
        {eyebrow ? <span className="text-sm font-medium text-accent">{eyebrow}</span> : null}
        <Tag
          className={cn(
            "m-0 text-[clamp(2.75rem,6vw,6rem)] leading-[0.9] font-semibold tracking-[-0.05em] uppercase",
            titleClassName,
          )}
        >
          {title}
        </Tag>
      </div>
      {description ? (
        <p className="m-0 max-w-[360px] text-[15px] leading-relaxed text-muted">{description}</p>
      ) : null}
      {aside}
    </div>
  );
}
