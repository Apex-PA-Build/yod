"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useCartActions } from "@/features/cart";
import { cn } from "@/lib/utils";
import { SIZES, type Size } from "@/shared/catalog";
import type { ProductCardData } from "../types";

/**
 * "Quick add" on listing cards. The first press reveals the sizes; picking
 * one adds the product in its default colour.
 */
export function QuickAdd({ product, className }: { product: ProductCardData; className?: string }) {
  const { add } = useCartActions();
  const [choosing, setChoosing] = useState(false);
  const [added, setAdded] = useState(false);

  async function addSize(size: Size) {
    const ok = await add({ productId: product.id, colourKey: product.colour.key, size, quantity: 1 });
    setChoosing(false);
    if (ok !== null) {
      setAdded(true);
      toast.success(`Added ${product.name} (${size}) to your cart`);
    }
  }

  if (choosing) {
    return (
      <div
        role="group"
        aria-label={`Choose a size for ${product.name}`}
        className={cn("grid grid-cols-6 gap-px bg-line-strong", className)}
      >
        {SIZES.map((size) => (
          <button
            key={size}
            type="button"
            onClick={() => void addSize(size)}
            className="h-12 cursor-pointer bg-white text-[13px] font-bold text-[#111111] hover:bg-accent"
          >
            {size}
          </button>
        ))}
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setChoosing(true)}
      aria-label={added ? `Added ${product.name}. Add another size` : `Quick add ${product.name}`}
      className={cn(
        "h-12 w-full cursor-pointer text-[13px] font-bold tracking-[0.08em] text-[#111111] uppercase",
        added ? "bg-accent" : "bg-white hover:bg-accent",
        className,
      )}
    >
      {added ? "Added ✓" : "Quick add"}
    </button>
  );
}
