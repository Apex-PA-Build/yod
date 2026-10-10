"use client";

import type { Id } from "@convex/_generated/dataModel";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { useWishlist } from "../hooks";

type Props = {
  productId: Id<"products">;
  productName: string;
  className?: string;
  /** "card" sits on product photos; "gallery" is the larger contrasting tile on the product page. */
  tone?: "card" | "gallery";
};

export function WishlistButton({ productId, productName, className, tone = "card" }: Props) {
  const { isSaved, toggle } = useWishlist();
  const saved = isSaved(productId);
  return (
    <button
      type="button"
      aria-pressed={saved}
      aria-label={saved ? `Remove ${productName} from wishlist` : `Add ${productName} to wishlist`}
      onClick={() => void toggle(productId, productName)}
      className={cn(
        "grid size-11 cursor-pointer place-items-center transition-colors",
        tone === "card"
          ? "bg-on-inverse text-inverse hover:text-accent"
          : "size-[52px] bg-inverse text-on-inverse",
        className,
      )}
    >
      <Heart className={cn("size-[18px]", saved && "fill-current")} strokeWidth={2} aria-hidden />
    </button>
  );
}
