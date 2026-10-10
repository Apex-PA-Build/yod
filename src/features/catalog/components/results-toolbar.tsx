"use client";

import { LayoutGrid, Grid3x3 } from "lucide-react";
import { NativeSelect } from "@/components/ui/field";
import { cn } from "@/lib/utils";
import { LABELS, PRICE_RANGES, SORTS, type Sort } from "@/shared/catalog";
import type { CatalogResult } from "../types";
import { useCatalogFilters } from "../hooks";

export function ResultsToolbar({ count, colours }: { count: number; colours: CatalogResult["colours"] }) {
  const { filters, setFilters, toggleColour, toggleSize, isPending } = useCatalogFilters();
  const colourName = (key: string) => colours.find((c) => c.key === key)?.name ?? key;

  const active = [
    ...(filters.type !== "all"
      ? [{ label: LABELS.typeFilter[filters.type], remove: () => setFilters({ type: null }) }]
      : []),
    ...filters.colour.map((c) => ({ label: colourName(c), remove: () => toggleColour(c) })),
    ...filters.size.map((z) => ({ label: `Size ${z}`, remove: () => toggleSize(z) })),
    ...(filters.price
      ? [
          {
            label: PRICE_RANGES.find((r) => r.key === filters.price)?.label ?? "",
            remove: () => setFilters({ price: null }),
          },
        ]
      : []),
  ];

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line pb-5">
        <p
          aria-live="polite"
          className={cn("m-0 text-sm text-muted transition-opacity", isPending && "opacity-50")}
        >
          <b className="font-semibold text-fg">{count}</b> {count === 1 ? "tee" : "tees"}
        </p>
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2.5 text-[13px] text-muted">
            Sort
            <NativeSelect
              value={filters.sort}
              onChange={(e) =>
                void setFilters({ sort: e.target.value === "featured" ? null : (e.target.value as Sort) })
              }
              className="h-11 w-auto border-[1.5px] px-3.5 text-sm"
            >
              {SORTS.map((s) => (
                <option key={s} value={s}>
                  {LABELS.sort[s]}
                </option>
              ))}
            </NativeSelect>
          </label>
          <div
            role="group"
            aria-label="Grid size"
            className="hidden border-[1.5px] border-line-strong sm:flex"
          >
            {[
              { compact: false, label: "Large tiles", Icon: LayoutGrid },
              { compact: true, label: "Small tiles", Icon: Grid3x3 },
            ].map(({ compact, label, Icon }) => {
              const on = filters.compact === compact;
              return (
                <button
                  key={label}
                  type="button"
                  aria-label={label}
                  aria-pressed={on}
                  onClick={() => void setFilters({ compact: compact || null }, { shallow: true })}
                  className={cn(
                    "grid h-[41px] w-11 cursor-pointer place-items-center",
                    on ? "bg-inverse text-on-inverse" : "text-fg",
                  )}
                >
                  <Icon className="size-4" aria-hidden />
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {active.length > 0 ? (
        <ul aria-label="Active filters" className="m-0 flex list-none flex-wrap gap-2 p-0">
          {active.map((a) => (
            <li key={a.label}>
              <button
                type="button"
                onClick={() => void a.remove()}
                aria-label={`Remove filter ${a.label}`}
                className="h-9 cursor-pointer bg-surface-3 px-3 text-[13px] hover:bg-line-strong"
              >
                {a.label} ✕
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
