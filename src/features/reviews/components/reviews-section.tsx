"use client";

import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { SectionHeading, SerifAccent } from "@/components/ui/section-heading";
import type { Size } from "@/shared/catalog";
import type { RatingSummary as Summary } from "../types";
import { RatingSummary } from "./rating-summary";
import { ReviewList } from "./review-list";
import { WriteReview } from "./write-review";

type Props = {
  productId: Id<"products">;
  productName: string;
  colours: { key: string; name: string }[];
  sizes: Size[];
  /** Server-rendered summary, shown until the live one arrives. */
  initialSummary: Summary;
};

export function ReviewsSection({ initialSummary, ...product }: Props) {
  const live = useQuery(api.reviews.summary, { productId: product.productId });
  const summary = live ?? initialSummary;

  return (
    <section
      id="reviews"
      aria-labelledby="reviews-title"
      className="flex container-page scroll-mt-8 flex-col gap-14 py-24 lg:py-26"
    >
      <SectionHeading
        title={
          <span id="reviews-title">
            Reviews &amp;
            <br />
            <SerifAccent>ratings</SerifAccent>
          </span>
        }
        aside={<WriteReview {...product} />}
      />
      <div className="flex flex-wrap items-start gap-x-16 gap-y-12">
        <RatingSummary summary={summary} />
        <ReviewList productId={product.productId} />
      </div>
    </section>
  );
}
