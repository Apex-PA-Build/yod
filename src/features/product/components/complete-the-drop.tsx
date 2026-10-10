"use client";

import { Check, Plus } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { SerifAccent } from "@/components/ui/section-heading";
import { useCartActions } from "@/features/cart";
import { ProductImage, type ProductCardData } from "@/features/catalog";
import { cn } from "@/lib/utils";
import { formatPrice } from "@/shared/money";
import { useProductSelection } from "../selection";

/**
 * "Frequently bought together" bundle plus single-tee cross-sells.
 * Everything is added in the size picked in the buy box.
 */
export function CompleteTheDrop({
  paired,
  related,
}: {
  paired: ProductCardData | null;
  related: ProductCardData[];
}) {
  const { product, colour, size, promptForSize } = useProductSelection();
  const { add, addMany } = useCartActions();
  const [added, setAdded] = useState<Set<string>>(new Set());
  const [busy, setBusy] = useState<string | null>(null);

  const markAdded = (key: string) => setAdded((prev) => new Set(prev).add(key));

  async function addBundle() {
    if (!paired) return;
    if (!size) return promptForSize();
    setBusy("bundle");
    const ok = await addMany([
      { productId: product.id, colourKey: colour.key, size, quantity: 1 },
      { productId: paired.id, colourKey: paired.colour.key, size, quantity: 1 },
    ]);
    setBusy(null);
    if (ok !== null) markAdded("bundle");
  }

  async function addOne(item: ProductCardData) {
    if (!size) return promptForSize();
    setBusy(item.id);
    const ok = await add({ productId: item.id, colourKey: item.colour.key, size, quantity: 1 });
    setBusy(null);
    if (ok !== null) markAdded(item.id);
  }

  const crossSell = related.filter((r) => r.id !== paired?.id).slice(0, 4);
  if (!paired && crossSell.length === 0) return null;

  return (
    <section
      aria-labelledby="complete-title"
      className="flex container-page flex-col gap-12 border-t border-line py-24"
    >
      <div className="flex flex-wrap items-end justify-between gap-6">
        <h2
          id="complete-title"
          className="m-0 text-[clamp(2.75rem,6vw,6rem)] leading-[0.9] font-semibold tracking-[-0.05em] uppercase"
        >
          Complete
          <br />
          <SerifAccent>the drop</SerifAccent>
        </h2>
        <p className="m-0 max-w-[360px] text-[15px] leading-relaxed text-muted">
          {size
            ? `Adds in your selected size, ${size}.`
            : "Pick your size above and we'll add these in the same size."}
        </p>
      </div>

      {paired ? (
        <div className="flex flex-wrap items-center gap-x-10 gap-y-6 border border-line bg-surface p-7">
          <div className="flex items-center gap-4">
            <ProductImage colour={colour} sizes="110px" hoverZoom={false} className="h-[136px] w-[110px]" />
            <Plus aria-hidden className="size-7 text-accent" strokeWidth={1.25} />
            <ProductImage
              colour={paired.colour}
              sizes="110px"
              hoverZoom={false}
              className="h-[136px] w-[110px]"
            />
          </div>
          <div className="flex min-w-0 flex-[1_1_260px] flex-col gap-1.5">
            <span className="text-[13px] font-semibold tracking-[0.1em] text-accent uppercase">
              Frequently bought together
            </span>
            <span className="text-xl font-semibold">
              {product.name} + {paired.name}
            </span>
            <span className="text-sm text-muted">
              Together: <b className="font-semibold text-fg">{formatPrice(product.price + paired.price)}</b>
            </span>
          </div>
          <Button
            variant="accent"
            size="xl"
            caps
            onClick={addBundle}
            disabled={busy === "bundle"}
            className="h-[60px]"
          >
            {added.has("bundle") ? (
              <>
                Both added <Check aria-hidden className="size-4" />
              </>
            ) : (
              "Add both to cart"
            )}
          </Button>
        </div>
      ) : null}

      {crossSell.length > 0 ? (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-6">
          {crossSell.map((item) => {
            const isAdded = added.has(item.id);
            return (
              <article key={item.id} className="group/card flex flex-col gap-3.5">
                <Link href={`/products/${item.slug}`} tabIndex={-1} aria-hidden>
                  <ProductImage
                    colour={item.colour}
                    sizes="(min-width: 768px) 25vw, 50vw"
                    className="aspect-[4/5]"
                  />
                </Link>
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="m-0 text-base font-semibold">
                      <Link href={`/products/${item.slug}`} className="no-underline hover:text-accent">
                        {item.name}
                      </Link>
                    </h3>
                    <div className="mt-1 text-[13px] text-muted">{item.colour.name}</div>
                    <div className="mt-2 text-base font-semibold">{formatPrice(item.price)}</div>
                  </div>
                  <button
                    type="button"
                    aria-label={`${isAdded ? "Added" : "Add"} ${item.name} to cart`}
                    onClick={() => addOne(item)}
                    disabled={busy === item.id}
                    className={cn(
                      "inline-flex h-11 flex-none cursor-pointer items-center gap-1.5 border-[1.5px] px-4 text-[13px] font-semibold transition-colors disabled:opacity-60",
                      isAdded
                        ? "border-accent bg-accent text-on-accent"
                        : "border-fg bg-transparent text-fg hover:bg-inverse hover:text-on-inverse",
                    )}
                  >
                    {isAdded ? (
                      <>
                        Added <Check aria-hidden className="size-3.5" />
                      </>
                    ) : (
                      <>
                        <Plus aria-hidden className="size-3.5" /> Add
                      </>
                    )}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      ) : null}
    </section>
  );
}
