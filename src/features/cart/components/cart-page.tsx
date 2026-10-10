"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useCart } from "../hooks";
import { CartLine } from "./cart-line";
import { CartSummary } from "./cart-summary";

/** Full-page cart: line items on the left, totals and checkout on the right. */
export function CartPage() {
  const cart = useCart();

  if (cart === undefined) {
    return (
      <div className="flex container-page flex-wrap gap-12 pb-24" aria-busy>
        <div className="flex min-w-0 flex-[2_1_520px] flex-col gap-4">
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
        </div>
        <Skeleton className="h-64 flex-[1_1_320px]" />
      </div>
    );
  }

  if (cart.lines.length === 0) {
    return (
      <div className="flex container-page flex-col items-start gap-6 pb-24">
        <p className="m-0 text-xl text-muted">Your cart is empty. Find a tee you love and come back.</p>
        <Button asChild size="lg" caps>
          <Link href="/shop">Start shopping</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex container-page flex-wrap items-start gap-x-16 gap-y-10 pb-24">
      <section aria-label="Items in your cart" className="min-w-0 flex-[2_1_520px]">
        <ul className="m-0 list-none border-t border-line p-0">
          {cart.lines.map((line) => (
            <CartLine key={line.key} line={line} />
          ))}
        </ul>
      </section>
      <aside
        aria-label="Order summary"
        className="flex min-w-0 flex-[1_1_320px] flex-col gap-6 border border-line bg-surface p-7 lg:sticky lg:top-6"
      >
        <h2 className="m-0 text-[13px] font-bold tracking-[0.14em] uppercase">
          Summary · {cart.itemCount} item{cart.itemCount === 1 ? "" : "s"}
        </h2>
        <CartSummary subtotal={cart.subtotal} />
        <Button asChild variant="accent" size="lg" caps>
          <Link href="/checkout">Checkout</Link>
        </Button>
        <Link href="/shop" className="text-center text-sm underline-offset-4 hover:underline">
          Continue shopping
        </Link>
      </aside>
    </div>
  );
}
