import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { WishlistButton } from "@/features/wishlist";
import { formatPrice } from "@/shared/money";
import { LABELS } from "@/shared/catalog";
import type { ProductCardData } from "../types";
import { ProductImage } from "./product-image";

/** Product card from the home page's "Trending Now" row. */
export function TrendingCard({ product, priority }: { product: ProductCardData; priority?: boolean }) {
  const href = `/products/${product.slug}` as const;
  return (
    <article className="group/card flex flex-col gap-4">
      <div className="relative">
        <Link href={href} tabIndex={-1} aria-hidden className="block">
          <ProductImage
            colour={product.colour}
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
            priority={priority}
            className="aspect-[4/5]"
          />
        </Link>
        {product.tag ? (
          <span className="absolute top-4 left-4 bg-on-inverse px-3.5 py-[7px] text-xs font-medium text-inverse">
            {LABELS.tag[product.tag]}
          </span>
        ) : null}
        <WishlistButton
          productId={product.id}
          productName={product.name}
          className="absolute top-2.5 right-2.5"
        />
      </div>
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <h3 className="m-0 text-[17px] font-semibold">
            <Link href={href} className="no-underline hover:text-accent">
              {product.name}
            </Link>
          </h3>
          <p className="m-0 mt-1 text-[13px] text-muted">{product.colour.name} · Oversized fit</p>
          <p className="m-0 mt-2 text-[17px] font-semibold">{formatPrice(product.price)}</p>
        </div>
        <Link
          href={href}
          aria-label={`Shop ${product.name}`}
          className="grid size-11 shrink-0 place-items-center bg-inverse text-on-inverse transition-colors hover:bg-accent hover:text-on-accent"
        >
          <ArrowUpRight className="size-4" strokeWidth={2.2} aria-hidden />
        </Link>
      </div>
    </article>
  );
}
