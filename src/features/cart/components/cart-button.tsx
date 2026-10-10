"use client";

import { ShoppingCart } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetClose, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { useCart } from "../hooks";
import { CartLine } from "./cart-line";
import { CartSummary } from "./cart-summary";

export function CartButton({ className }: { className?: string }) {
  const cart = useCart();
  const [open, setOpen] = useState(false);
  const count = cart?.itemCount ?? 0;

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        aria-label={count ? `Cart, ${count} item${count === 1 ? "" : "s"}` : "Cart"}
        className={className}
      >
        <ShoppingCart className="size-[17px]" strokeWidth={2} aria-hidden />
        {count > 0 ? (
          <span className="absolute -top-1 -right-1 grid h-5 min-w-5 place-items-center rounded-full bg-accent px-1 text-[11px] font-bold text-on-accent">
            {count}
          </span>
        ) : null}
      </SheetTrigger>
      <SheetContent title="Your cart">
        {cart === undefined ? (
          <div className="flex flex-col gap-4 p-6">
            <Skeleton className="h-24" />
            <Skeleton className="h-24" />
          </div>
        ) : cart.lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-5 p-6 text-center">
            <p className="m-0 text-xl font-semibold">Your cart is empty</p>
            <SheetClose asChild>
              <Button asChild variant="primary" size="lg">
                <Link href="/shop">Start shopping</Link>
              </Button>
            </SheetClose>
          </div>
        ) : (
          <>
            <ul className="m-0 flex-1 list-none overflow-y-auto px-6">
              {cart.lines.map((line) => (
                <CartLine key={line.key} line={line} />
              ))}
            </ul>
            <div className="flex flex-col gap-4 border-t border-line p-6">
              <CartSummary subtotal={cart.subtotal} />
              <SheetClose asChild>
                <Button asChild variant="accent" size="lg" caps>
                  <Link href="/checkout">Checkout</Link>
                </Button>
              </SheetClose>
              <SheetClose asChild>
                <Link href="/cart" className="text-center text-sm underline-offset-4 hover:underline">
                  View cart
                </Link>
              </SheetClose>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
