"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { ToggleChip } from "@/components/ui/toggle-chip";
import { cn } from "@/lib/utils";
import { PRICE_RANGES, SIZES } from "@/shared/catalog";
import type { CatalogResult } from "../types";
import { useCatalogFilters } from "../hooks";

function Group({ label, children }: { label: string; children: ReactNode }) {
  return (
    <fieldset className="m-0 flex flex-col gap-3.5 border-0 border-t border-line p-0 pt-6">
      <legend className="float-left mb-3.5 w-full text-[13px] font-semibold tracking-[0.1em] uppercase">
        {label}
      </legend>
      {children}
    </fieldset>
  );
}

export function FilterSidebar({ colours }: { colours: CatalogResult["colours"] }) {
  const { filters, setFilters, toggleColour, toggleSize, clearAll } = useCatalogFilters();

  return (
    <aside aria-label="Filters" className="flex min-w-0 flex-col gap-8 lg:max-w-[300px] lg:flex-[1_1_240px]">
      <div className="flex items-center justify-between">
        <h2 className="m-0 text-[13px] font-bold tracking-[0.14em] uppercase">Filter</h2>
        <button
          type="button"
          onClick={clearAll}
          className="h-11 cursor-pointer text-[13px] font-semibold text-accent"
        >
          Clear all
        </button>
      </div>

      <Group label="Colour">
        <div className="grid grid-cols-3 gap-3">
          {colours.map((c) => {
            const on = filters.colour.includes(c.key);
            return (
              <button
                key={c.key}
                type="button"
                aria-pressed={on}
                onClick={() => toggleColour(c.key)}
                className={cn(
                  "flex cursor-pointer flex-col items-center gap-1.5 py-1.5 text-xs",
                  on ? "text-fg" : "text-muted",
                )}
              >
                <span
                  className={cn(
                    "size-10 border border-line-strong outline-2 outline-offset-[3px]",
                    on ? "outline outline-accent" : "outline-transparent",
                  )}
                  style={{ background: c.swatch }}
                />
                {c.name}
              </button>
            );
          })}
        </div>
      </Group>

      <Group label="Size">
        <div className="grid grid-cols-3 gap-2">
          {SIZES.map((z) => (
            <ToggleChip
              key={z}
              pressed={filters.size.includes(z)}
              onClick={() => toggleSize(z)}
              className="h-11 px-0 text-[13px]"
            >
              {z}
            </ToggleChip>
          ))}
        </div>
      </Group>

      <Group label="Price">
        <div className="flex flex-col gap-1">
          {PRICE_RANGES.map((r) => {
            const on = filters.price === r.key;
            return (
              <button
                key={r.key}
                type="button"
                aria-pressed={on}
                onClick={() => void setFilters({ price: on ? null : r.key })}
                className="flex min-h-11 cursor-pointer items-center gap-3 text-left text-sm"
              >
                <span
                  className={cn(
                    "size-[18px] shrink-0 border-[1.5px]",
                    on ? "border-accent bg-accent" : "border-subtle",
                  )}
                />
                {r.label}
              </button>
            );
          })}
        </div>
      </Group>

      <Link
        href="/size-guide"
        className="flex flex-col gap-2 border border-line bg-surface p-[22px] no-underline"
      >
        <span className="text-[13px] font-semibold tracking-[0.1em] text-accent uppercase">
          Not sure of your size?
        </span>
        <span className="text-sm leading-relaxed text-muted">See exact measurements in the size guide →</span>
      </Link>
    </aside>
  );
}
