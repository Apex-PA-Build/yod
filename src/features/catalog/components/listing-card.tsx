import Link from "next/link";
import { LABELS } from "@/shared/catalog";
import { formatPrice } from "@/shared/money";
import type { ProductCardData } from "../types";
import { ProductImage } from "./product-image";
import { ProductTag } from "./product-tag";
import { QuickAdd } from "./quick-add";

/** Product card on category, shop and search listings. */
export function ListingCard({ product, priority }: { product: ProductCardData; priority?: boolean }) {
  const href = `/products/${product.slug}` as const;
  return (
    <article className="group/card flex flex-col gap-3.5">
      <div className="relative">
        <Link href={href} tabIndex={-1} aria-hidden className="block">
          <ProductImage
            colour={product.colour}
            sizes="(min-width: 1280px) 22vw, (min-width: 768px) 33vw, 50vw"
            priority={priority}
            className="aspect-[4/5]"
          />
        </Link>
        <ProductTag tag={product.tag} />
        <div className="absolute inset-x-3 bottom-3 transition-all duration-300 [@media(hover:hover)]:translate-y-2 [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-focus-within/card:translate-y-0 [@media(hover:hover)]:group-focus-within/card:opacity-100 [@media(hover:hover)]:group-hover/card:translate-y-0 [@media(hover:hover)]:group-hover/card:opacity-100">
          <QuickAdd product={product} />
        </div>
      </div>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="m-0 text-base font-semibold">
            <Link href={href} className="no-underline hover:text-accent">
              {product.name}
            </Link>
          </h3>
          <p className="m-0 mt-1 text-[13px] text-muted">
            {product.colour.name} · {LABELS.type[product.type]}
            {product.colourCount > 1 ? ` · ${product.colourCount} colours` : ""}
          </p>
        </div>
        <span className="shrink-0 text-base font-semibold">{formatPrice(product.price)}</span>
      </div>
      <span aria-hidden className="flex gap-1.5">
        <span
          className="size-3.5 border border-line-strong outline outline-1 outline-offset-2 outline-accent"
          style={{ background: product.colour.swatch }}
        />
      </span>
    </article>
  );
}
