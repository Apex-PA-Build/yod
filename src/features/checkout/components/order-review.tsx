"use client";

import Image from "next/image";
import type { useCart } from "@/features/cart";
import { CartSummary } from "@/features/cart";
import { formatPrice } from "@/shared/money";

type Cart = NonNullable<ReturnType<typeof useCart>>;

export function OrderReview({ cart }: { cart: Cart }) {
  return (
    <div className="flex flex-col gap-6">
      <h2 className="m-0 text-[13px] font-bold tracking-[0.14em] uppercase">
        Your order · {cart.itemCount} item{cart.itemCount === 1 ? "" : "s"}
      </h2>
      <ul className="m-0 flex list-none flex-col gap-4 p-0">
        {cart.lines.map((line) => (
          <li key={line.key} className="flex items-center gap-4">
            <div
              className="relative h-[75px] w-[60px] shrink-0 overflow-hidden"
              style={{ background: line.colour.background }}
            >
              <Image src={line.colour.image} alt="" fill sizes="60px" className="object-cover" />
              <span className="absolute top-1 right-1 grid h-5 min-w-5 place-items-center rounded-full bg-inverse px-1 text-[11px] font-bold text-on-inverse">
                {line.quantity}
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-sm font-semibold">{line.name}</div>
              <div className="text-[13px] text-muted">
                {line.colour.name} · Size {line.size}
              </div>
            </div>
            <span className="text-sm font-semibold">{formatPrice(line.lineTotal)}</span>
          </li>
        ))}
      </ul>
      <CartSummary subtotal={cart.subtotal} />
    </div>
  );
}
