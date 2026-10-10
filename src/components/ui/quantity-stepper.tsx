"use client";

import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  value: number;
  min?: number;
  max: number;
  onChange: (value: number) => void;
  disabled?: boolean;
  size?: "md" | "lg";
  className?: string;
};

export function QuantityStepper({ value, min = 1, max, onChange, disabled, size = "md", className }: Props) {
  return (
    <div
      role="group"
      aria-label="Quantity"
      className={cn(
        "flex shrink-0 items-center border-[1.5px] border-line-strong",
        size === "lg" ? "h-16" : "h-11",
        className,
      )}
    >
      <button
        type="button"
        aria-label="Decrease quantity"
        disabled={disabled || value <= min}
        onClick={() => onChange(value - 1)}
        className={cn(
          "grid h-full cursor-pointer place-items-center disabled:opacity-40",
          size === "lg" ? "w-12" : "w-10",
        )}
      >
        <Minus className="size-4" />
      </button>
      <span aria-live="polite" className="w-9 text-center text-base font-semibold tabular-nums">
        {value}
      </span>
      <button
        type="button"
        aria-label="Increase quantity"
        disabled={disabled || value >= max}
        onClick={() => onChange(value + 1)}
        className={cn(
          "grid h-full cursor-pointer place-items-center disabled:opacity-40",
          size === "lg" ? "w-12" : "w-10",
        )}
      >
        <Plus className="size-4" />
      </button>
    </div>
  );
}
