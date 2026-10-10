"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { SIZES, type Size } from "@/shared/catalog";

export type Measurement = {
  size: Size;
  chestCm: number;
  lengthCm: number;
  shoulderCm: number;
  sleeveCm: number;
};

type Unit = "cm" | "in";

const COLUMNS = [
  { key: "chestCm", label: "A · Chest" },
  { key: "lengthCm", label: "B · Length" },
  { key: "shoulderCm", label: "C · Shoulder" },
  { key: "sleeveCm", label: "D · Sleeve" },
] as const;

function format(cm: number, unit: Unit) {
  return unit === "cm" ? cm.toFixed(0) : (cm / 2.54).toFixed(1);
}

/**
 * Garment measurements with a cm / inches toggle. Rows without data
 * show a placeholder until real measurements are added to the product.
 */
export function MeasurementsTable({ measurements }: { measurements: Measurement[] | null }) {
  const [unit, setUnit] = useState<Unit>("cm");
  const bySize = new Map(measurements?.map((m) => [m.size, m]));

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span id="measurements-caption" className="text-[13px] font-semibold tracking-[0.1em] uppercase">
          Garment measurements ({unit === "cm" ? "cm" : "inches"})
        </span>
        <div role="group" aria-label="Units" className="flex border-[1.5px] border-line-strong">
          {(["cm", "in"] as const).map((u) => (
            <button
              key={u}
              type="button"
              aria-pressed={unit === u}
              onClick={() => setUnit(u)}
              className={cn(
                "h-11 cursor-pointer border-0 px-[18px] text-[13px] font-semibold",
                unit === u ? "bg-inverse text-on-inverse" : "bg-transparent text-fg",
              )}
            >
              {u === "cm" ? "cm" : "inches"}
            </button>
          ))}
        </div>
      </div>
      <div className="overflow-x-auto border border-line">
        <table
          aria-labelledby="measurements-caption"
          className="w-full min-w-[520px] border-collapse text-sm"
        >
          <thead>
            <tr className="bg-surface">
              <th scope="col" className="px-5 py-4 text-left font-semibold">
                Size
              </th>
              {COLUMNS.map((c) => (
                <th key={c.key} scope="col" className="px-5 py-4 text-left font-semibold">
                  {c.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {SIZES.map((size) => {
              const row = bySize.get(size);
              return (
                <tr key={size} className="border-t border-line">
                  <th scope="row" className="px-5 py-3.5 text-left font-semibold">
                    {size}
                  </th>
                  {COLUMNS.map((c) => (
                    <td key={c.key} className="px-5 py-3.5 text-muted">
                      {row ? format(row[c.key], unit) : "[—]"}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
