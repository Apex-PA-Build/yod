import { cva, type VariantProps } from "class-variance-authority";
import { ArrowUpRight } from "lucide-react";
import Link, { type LinkProps } from "next/link";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

const arrowLinkVariants = cva(
  "group inline-flex items-center gap-[18px] py-1.5 pr-1.5 pl-6 text-sm font-medium no-underline transition-colors",
  {
    variants: {
      tone: {
        /** Light chip on dark pages (inverts in light theme). */
        chip: "bg-[var(--chip)] text-on-inverse [--arrow-bg:var(--on-inverse)] [--arrow-fg:var(--inverse)]",
        inverse: "bg-inverse text-on-inverse [--arrow-bg:var(--on-inverse)] [--arrow-fg:var(--inverse)]",
        outline:
          "border-[1.5px] border-fg bg-bg text-fg [--arrow-bg:var(--inverse)] [--arrow-fg:var(--on-inverse)]",
        accent: "bg-inverse text-on-inverse [--arrow-bg:var(--accent)] [--arrow-fg:var(--on-accent)]",
      },
      shape: {
        square: "rounded-none",
        pill: "rounded-full",
      },
      size: {
        md: "[--arrow-size:2.5rem]",
        lg: "pl-[26px] text-[15px] [--arrow-size:2.75rem]",
      },
    },
    defaultVariants: { tone: "chip", shape: "square", size: "md" },
  },
);

type ArrowLinkProps<T extends string> = LinkProps<T> &
  Omit<ComponentProps<"a">, keyof LinkProps<T>> &
  VariantProps<typeof arrowLinkVariants>;

/** The design's call-to-action: a label with a square arrow tile on the right. */
export function ArrowLink<T extends string>({
  tone,
  shape,
  size,
  className,
  children,
  ...props
}: ArrowLinkProps<T>) {
  return (
    <Link className={cn(arrowLinkVariants({ tone, shape, size }), className)} {...props}>
      {children}
      <ArrowTile rounded={shape === "pill"} />
    </Link>
  );
}

export function ArrowTile({ rounded, className }: { rounded?: boolean; className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        "grid size-[var(--arrow-size,2.5rem)] shrink-0 place-items-center bg-[var(--arrow-bg)] text-[var(--arrow-fg)] transition-transform group-hover:rotate-45",
        rounded && "rounded-full",
        className,
      )}
    >
      <ArrowUpRight className="size-4" strokeWidth={2.2} />
    </span>
  );
}
