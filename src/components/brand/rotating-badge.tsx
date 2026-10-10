import { ArrowUpRight } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";
import { useId } from "react";
import { cn } from "@/lib/utils";

type Props = {
  href: Route;
  ringText: string;
  label: string;
  size?: number;
  className?: string;
};

/** Circular badge with text spinning around a gold "Shop now" button. */
export function RotatingBadge({ href, ringText, label, size = 176, className }: Props) {
  const id = useId();
  const inner = Math.round(size * 0.62);
  return (
    <Link
      href={href}
      aria-label={label}
      className={cn("relative grid shrink-0 place-items-center no-underline", className)}
      style={{ width: size, height: size }}
    >
      <svg viewBox="0 0 200 200" aria-hidden className="absolute inset-0 size-full animate-spin-slow">
        <defs>
          <path id={id} d="M100,100 m-80,0 a80,80 0 1,1 160,0 a80,80 0 1,1 -160,0" />
        </defs>
        <text className="fill-fg font-sans" fontSize="14" fontWeight="500" letterSpacing="5">
          <textPath href={`#${id}`}>{ringText}</textPath>
        </text>
      </svg>
      <span
        className="flex flex-col items-center justify-center gap-1.5 rounded-full bg-accent text-[13px] font-semibold text-on-accent"
        style={{ width: inner, height: inner }}
      >
        <ArrowUpRight className="size-4" strokeWidth={2.2} aria-hidden />
        Shop now
      </span>
    </Link>
  );
}
