"use client";

import { Fragment } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useCatalogFilters } from "../hooks";
import type { ProductCardData } from "../types";
import { ListingCard } from "./listing-card";
import { PromoTile } from "./promo-tile";

/** Listing grid. Honours the compact toggle and slots the fit promo after the third tee. */
export function ProductGrid({
  products,
  showPromo = true,
}: {
  products: ProductCardData[];
  showPromo?: boolean;
}) {
  const { filters, clearAll, isPending } = useCatalogFilters();

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 border border-dashed border-line-strong px-8 py-16 text-center">
        <p className="m-0 text-[22px] font-semibold">No tees match these filters</p>
        <Button size="md" onClick={clearAll}>
          Clear filters
        </Button>
      </div>
    );
  }

  return (
    <div
      aria-busy={isPending}
      className={cn(
        "grid gap-x-5 gap-y-9 transition-opacity",
        filters.compact
          ? "grid-cols-[repeat(auto-fill,minmax(min(100%,200px),1fr))]"
          : "grid-cols-[repeat(auto-fill,minmax(min(100%,280px),1fr))]",
        isPending && "opacity-60",
      )}
    >
      {products.map((p, i) => (
        <Fragment key={p.id}>
          <ListingCard product={p} priority={i < 3} />
          {showPromo && i === 2 && products.length > 3 ? <PromoTile /> : null}
        </Fragment>
      ))}
    </div>
  );
}
