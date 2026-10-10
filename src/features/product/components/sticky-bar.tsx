"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/shared/money";
import { useProductSelection } from "../selection";

export function StickyBar() {
  const { product, colour, size, addToCart, added, pending } = useProductSelection();
  return (
    <div className="sticky bottom-0 z-20 flex container-page flex-wrap items-center justify-between gap-4 border-t border-line-strong bg-bg/95 py-3.5 backdrop-blur">
      <div className="flex min-w-0 items-center gap-3.5">
        <div
          className="relative h-[60px] w-12 shrink-0 overflow-hidden"
          style={{ background: colour.background }}
        >
          <Image
            src={colour.image}
            alt=""
            fill
            sizes="48px"
            className="object-cover"
            style={{ objectPosition: colour.focus }}
          />
        </div>
        <div className="min-w-0">
          <div className="text-[15px] font-semibold">{product.name}</div>
          <div className="text-[13px] text-muted">
            {colour.name} · Size {size ?? "Select"} · {formatPrice(product.price)}
          </div>
        </div>
      </div>
      <Button
        variant="accent"
        size="lg"
        caps
        className="px-10 font-bold"
        disabled={pending}
        onClick={() => void addToCart()}
      >
        {added ? "Added to cart ✓" : "Add to cart"}
      </Button>
    </div>
  );
}
