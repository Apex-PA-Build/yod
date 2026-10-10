"use client";

import { ToggleChip } from "@/components/ui/toggle-chip";
import { LABELS, TYPE_FILTERS, type TypeFilter } from "@/shared/catalog";
import { useCatalogFilters } from "../hooks";

export function TypeTabs({ counts }: { counts: Record<TypeFilter, number> }) {
  const { filters, setFilters } = useCatalogFilters();
  return (
    <div
      role="group"
      aria-label="Type"
      className="flex container-page flex-wrap gap-2.5 border-b border-line pb-8"
    >
      {TYPE_FILTERS.map((t) => (
        <ToggleChip
          key={t}
          pressed={filters.type === t}
          onClick={() => void setFilters({ type: t === "all" ? null : t })}
        >
          {LABELS.typeFilter[t]} <span className="font-medium opacity-60">({counts[t]})</span>
        </ToggleChip>
      ))}
    </div>
  );
}
