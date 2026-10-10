"use client";

import { api } from "@convex/_generated/api";
import { useQuery } from "convex/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ListingCard } from "@/features/catalog";
import { WishlistButton } from "./wishlist-button";

export function WishlistGrid() {
  const items = useQuery(api.wishlist.list);

  if (items === undefined) {
    return (
      <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-6">
        {[0, 1, 2].map((i) => (
          <Skeleton key={i} className="aspect-[4/5]" />
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-start gap-6">
        <p className="m-0 text-xl text-muted">Nothing saved yet. Tap the heart on any tee to keep it here.</p>
        <Button asChild size="lg" caps>
          <Link href="/shop">Browse tees</Link>
        </Button>
      </div>
    );
  }

  return (
    <ul className="m-0 grid list-none grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-x-6 gap-y-12 p-0">
      {items.map((product) => (
        <li key={product.id} className="relative">
          <ListingCard product={product} />
          <div className="absolute top-3 right-3">
            <WishlistButton productId={product.id} productName={product.name} />
          </div>
        </li>
      ))}
    </ul>
  );
}
