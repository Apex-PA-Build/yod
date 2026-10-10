import Link from "next/link";
import { cn } from "@/lib/utils";

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="currentColor" aria-hidden className={cn("size-[30px]", className)}>
      <path d="M11 5 Q16 9 21 5 L28 8 L30 16 L25 17 L25 27 L7 27 L7 17 L2 16 L4 8 Z" />
    </svg>
  );
}

export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={cn("flex items-center gap-2.5 text-fg no-underline", className)}
      aria-label="YOD home"
    >
      <LogoMark />
      <span className="text-2xl font-semibold tracking-[0.02em]">YOD</span>
    </Link>
  );
}
