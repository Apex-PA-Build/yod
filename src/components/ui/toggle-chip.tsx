import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

type ToggleChipProps = Omit<ComponentProps<"button">, "type"> & { pressed: boolean };

/** A square option button with aria-pressed, used for sizes, filters and quiz picks. */
export function ToggleChip({ pressed, className, ...props }: ToggleChipProps) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      className={cn(
        "inline-flex h-12 cursor-pointer items-center justify-center gap-1 border-[1.5px] px-5 text-sm font-semibold transition-colors",
        pressed
          ? "border-inverse bg-inverse text-on-inverse"
          : "border-line-strong bg-transparent text-fg hover:border-fg",
        "disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-line-strong",
        className,
      )}
      {...props}
    />
  );
}
