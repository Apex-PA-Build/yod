"use client";

import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { QuantityStepper } from "@/components/ui/quantity-stepper";
import { MAX_QTY_PER_LINE } from "@/shared/catalog";
import { useProductSelection } from "../selection";

export function PurchaseActions() {
  const { quantity, setQuantity, addToCart, buyNow, added, pending, colour, size } = useProductSelection();
  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-3">
        <QuantityStepper value={quantity} max={MAX_QTY_PER_LINE} onChange={setQuantity} size="lg" />
        <Button
          variant="accent"
          size="xl"
          caps
          className="flex-1 font-bold"
          disabled={pending}
          onClick={() => void addToCart()}
        >
          {added ? "Added to cart ✓" : "Add to cart"}
          <ArrowUpRight className="size-[18px]" strokeWidth={2.4} aria-hidden />
        </Button>
      </div>
      <Button variant="outline" size="lg" caps disabled={pending} onClick={() => void buyNow()}>
        Buy it now
      </Button>
      {added ? (
        <div
          role="status"
          className="flex items-center justify-between gap-3 border border-accent bg-[var(--glow)] px-[18px] py-3.5 text-sm"
        >
          <span>
            Added {quantity} × {colour.name} / {size} to your cart.
          </span>
          <Link href="/cart" className="font-semibold text-accent no-underline">
            View cart →
          </Link>
        </div>
      ) : null}
    </div>
  );
}
