"use client";

import { api } from "@convex/_generated/api";
import { useQuery } from "convex/react";
import { ArrowLink } from "@/components/ui/arrow-link";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingCard } from "@/features/catalog";

export function TrendingSection() {
  const products = useQuery(api.products.trending, { limit: 4 });

  return (
    <section id="trending" className="flex container-page scroll-mt-8 flex-col gap-10 pt-8 pb-[104px]">
      <div className="flex flex-wrap items-end justify-between gap-5">
        <div className="flex flex-col gap-2.5">
          <h2 className="m-0 text-[clamp(34px,3.6vw,52px)] leading-[1.1] font-medium tracking-[-0.02em]">
            Trending Now
          </h2>
          <p className="m-0 max-w-[460px] text-[15px] leading-relaxed text-muted">
            The drop shoulder tees everyone&apos;s reaching for this season.
          </p>
        </div>
        <ArrowLink href="/shop">Shop Trending</ArrowLink>
      </div>

      <div
        className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,250px),1fr))] gap-7"
        aria-busy={products === undefined}
      >
        {products === undefined
          ? [0, 1, 2, 3].map((i) => <Skeleton key={i} className="aspect-[4/5]" />)
          : products.map((p, i) => <TrendingCard key={p.id} product={p} priority={i < 2} />)}
      </div>
    </section>
  );
}
