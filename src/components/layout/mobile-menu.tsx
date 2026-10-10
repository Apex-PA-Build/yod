"use client";

import { Heart, Menu, Package } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { MainNav } from "./main-nav";
import { SearchBox } from "./search-box";

export function MobileMenu({ triggerClassName }: { triggerClassName?: string }) {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger aria-label="Open menu" className={triggerClassName}>
        <Menu className="size-5" aria-hidden />
      </SheetTrigger>
      <SheetContent title="Menu" side="left">
        <div className="flex flex-col gap-8 p-6">
          <SearchBox className="w-full" />
          <MainNav onNavigate={close} className="[&_a]:text-2xl [&_ul]:flex-col [&_ul]:gap-1" />
          <div className="flex flex-col gap-3 border-t border-line pt-6 text-sm">
            <Link
              href="/wishlist"
              onClick={close}
              className="flex items-center gap-3 no-underline hover:text-accent"
            >
              <Heart className="size-4" aria-hidden /> Wishlist
            </Link>
            <Link
              href="/track-order"
              onClick={close}
              className="flex items-center gap-3 no-underline hover:text-accent"
            >
              <Package className="size-4" aria-hidden /> Track order
            </Link>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
