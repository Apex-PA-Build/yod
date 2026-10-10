import Link from "next/link";
import { Stars } from "@/components/ui/stars";
import { formatPrice } from "@/shared/money";
import type { ProductPageData } from "../types";
import { DeliveryCheck } from "./delivery-check";
import { ProductDetails } from "./product-details";
import { PurchaseActions } from "./purchase-actions";
import { TrustRow } from "./trust-row";
import { ColourPicker, SizePicker } from "./variant-pickers";

export function BuyBox({ data }: { data: ProductPageData }) {
  const { product, rating, recentBuyers, featuredReview } = data;
  const [first, ...rest] = product.name.split(" ");

  return (
    <div id="buy" className="flex min-w-0 flex-[1_1_440px] scroll-mt-8 flex-col gap-7">
      <div className="flex flex-col gap-3">
        <span className="font-serif text-2xl text-accent italic">Drop shoulder · Oversized fit</span>
        <h1 className="m-0 text-[clamp(40px,4.4vw,64px)] leading-none font-semibold tracking-[-0.04em] uppercase">
          {first}
          <br />
          {rest.join(" ")}
        </h1>
        {rating.count > 0 && rating.average !== null ? (
          <Link href="#reviews" className="flex flex-wrap items-center gap-2.5 text-sm no-underline">
            <Stars rating={rating.average} />
            <span className="font-semibold">{rating.average.toFixed(1)}</span>
            <span className="border-b border-subtle text-muted">
              {rating.count} review{rating.count === 1 ? "" : "s"}
            </span>
          </Link>
        ) : (
          <Link href="#reviews" className="text-sm text-muted underline-offset-4 hover:underline">
            Be the first to review
          </Link>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <div className="flex items-baseline gap-3.5">
          <span className="text-4xl font-semibold tracking-[-0.02em]">{formatPrice(product.price)}</span>
          <span className="text-[13px] text-subtle">Inclusive of all taxes</span>
        </div>
        {recentBuyers >= 10 ? (
          <span className="inline-flex items-center gap-2 text-[13px] text-muted">
            <span aria-hidden className="size-2 bg-accent" />
            {recentBuyers} people bought this in the last 30 days
          </span>
        ) : null}
      </div>

      <ColourPicker />
      <SizePicker />
      <PurchaseActions />
      <DeliveryCheck />
      <TrustRow />

      {featuredReview ? (
        <figure className="m-0 flex flex-col gap-2.5 border-l-[3px] border-accent bg-surface p-[22px]">
          <blockquote className="m-0 font-serif text-[22px] leading-[1.35] italic">
            “{featuredReview.body}”
          </blockquote>
          <figcaption className="text-[13px] text-muted">
            {featuredReview.authorName} · Size {featuredReview.size}
            {featuredReview.verifiedBuyer ? " · Verified buyer" : ""}
          </figcaption>
        </figure>
      ) : null}

      <ProductDetails description={product.description} />
    </div>
  );
}
