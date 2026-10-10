"use client";

import { useQueryStates } from "nuqs";
import { useTransition } from "react";
import type { Size } from "@/shared/catalog";
import { catalogSearchParams } from "./search-params";

/**
 * Listing filters live in the URL. Changing one re-renders the page on the
 * server (shallow: false) so results always come from the same cached query.
 */
export function useCatalogFilters() {
  const [isPending, startTransition] = useTransition();
  const [filters, setFilters] = useQueryStates(catalogSearchParams, {
    shallow: false,
    scroll: false,
    startTransition,
  });

  function toggle<T extends string>(list: readonly T[], value: T): T[] | null {
    const next = list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
    return next.length ? next : null;
  }

  const toggleColour = (colour: string) => void setFilters({ colour: toggle(filters.colour, colour) });
  const toggleSize = (size: Size) => void setFilters({ size: toggle(filters.size, size) });

  function clearAll() {
    void setFilters({ type: null, colour: null, size: null, price: null });
  }

  return { filters, setFilters, toggleColour, toggleSize, clearAll, isPending };
}
