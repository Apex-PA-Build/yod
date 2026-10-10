"use client";

import Link from "next/link";
import { ToggleChip } from "@/components/ui/toggle-chip";
import { cn } from "@/lib/utils";
import { SIZES } from "@/shared/catalog";
import { useProductSelection } from "../selection";

export function ColourPicker() {
  const { product, colourIndex, colour, setColour } = useProductSelection();
  return (
    <div role="group" aria-label="Colour" className="flex flex-col gap-3.5">
      <span className="text-[13px] font-semibold tracking-[0.1em] uppercase">
        Colour — <span className="text-accent">{colour.name}</span>
      </span>
      <div className="flex flex-wrap gap-3.5">
        {product.colours.map((c, i) => (
          <button
            key={c.key}
            type="button"
            aria-label={c.name}
            aria-pressed={i === colourIndex}
            onClick={() => setColour(i)}
            className={cn(
              "size-[52px] cursor-pointer border-2 p-1",
              i === colourIndex ? "border-accent" : "border-transparent",
            )}
          >
            <span className="block size-full border border-line-strong" style={{ background: c.swatch }} />
          </button>
        ))}
      </div>
    </div>
  );
}

export function SizePicker() {
  const { product, size, setSize, sizeError } = useProductSelection();
  return (
    <div id="size-picker" role="group" aria-label="Size" className="flex scroll-mt-24 flex-col gap-3.5">
      <div className="flex items-center justify-between">
        <span className="text-[13px] font-semibold tracking-[0.1em] uppercase">
          Size — <span className="text-accent">{size ?? "Select"}</span>
        </span>
        <Link href="#size-guide" className="border-b border-fg py-1.5 text-[13px] no-underline">
          Size guide
        </Link>
      </div>
      <div className="grid grid-cols-6 gap-2">
        {SIZES.map((s) => (
          <ToggleChip
            key={s}
            pressed={size === s}
            disabled={!product.sizes.includes(s)}
            onClick={() => setSize(s)}
            className="h-[52px] px-0"
          >
            {s}
          </ToggleChip>
        ))}
      </div>
      <p className="m-0 text-[13px] leading-relaxed text-muted">
        Cut oversized on purpose. Take your usual size for a relaxed drape, or size up for extra room.
      </p>
      {sizeError ? (
        <p role="alert" className="m-0 text-sm font-semibold text-accent">
          Please pick a size first.
        </p>
      ) : null}
    </div>
  );
}
