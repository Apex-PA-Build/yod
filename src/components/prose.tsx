import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Long-form text styling for policy and about pages. */
export function Prose({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "max-w-3xl text-[15px] leading-[1.75] text-muted",
        "[&_a]:text-fg [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-accent",
        "[&_h2]:mt-12 [&_h2]:mb-4 [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:tracking-[-0.02em] [&_h2]:text-fg first:[&_h2]:mt-0",
        "[&_h3]:mt-8 [&_h3]:mb-3 [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-fg",
        "[&_li]:mb-2 [&_ol]:pl-5 [&_p]:my-4 [&_strong]:text-fg [&_ul]:list-disc [&_ul]:pl-5",
        className,
      )}
    >
      {children}
    </div>
  );
}
