"use client";

import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";
import { usePaginatedQuery } from "convex/react";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { ToggleChip } from "@/components/ui/toggle-chip";
import { LABELS, REVIEW_FILTERS, type ReviewFilter } from "@/shared/catalog";
import { ReviewCard } from "./review-card";

const PAGE_SIZE = 5;

export function ReviewList({ productId }: { productId: Id<"products"> }) {
  const [filter, setFilter] = useState<ReviewFilter>("all");
  const { results, status, loadMore } = usePaginatedQuery(
    api.reviews.list,
    { productId, filter },
    { initialNumItems: PAGE_SIZE },
  );

  return (
    <div className="flex min-w-0 flex-[2_1_520px] flex-col gap-6">
      <div role="group" aria-label="Filter reviews" className="flex flex-wrap gap-2">
        {REVIEW_FILTERS.map((f) => (
          <ToggleChip
            key={f}
            pressed={filter === f}
            onClick={() => setFilter(f)}
            className="h-11 px-[18px] text-[13px]"
          >
            {LABELS.reviewFilter[f]}
          </ToggleChip>
        ))}
      </div>

      <div aria-live="polite" aria-busy={status === "LoadingFirstPage"}>
        {status === "LoadingFirstPage" ? (
          <div className="flex flex-col gap-4 border-t border-line py-7">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-5 w-2/3" />
            <Skeleton className="h-16 w-full" />
          </div>
        ) : results.length === 0 ? (
          <p className="m-0 border-t border-line py-7 text-[15px] text-muted">
            {filter === "all"
              ? "No reviews yet. Be the first to share how it fits."
              : "No reviews match this filter yet."}
          </p>
        ) : (
          results.map((review) => <ReviewCard key={review.id} review={review} />)
        )}
      </div>

      {status === "CanLoadMore" || status === "LoadingMore" ? (
        <button
          type="button"
          onClick={() => loadMore(PAGE_SIZE)}
          disabled={status === "LoadingMore"}
          className="h-12 cursor-pointer self-start border-0 border-b-[1.5px] border-fg bg-transparent px-6 text-sm font-semibold text-fg disabled:opacity-50"
        >
          {status === "LoadingMore" ? "Loading…" : "Load more reviews"}
        </button>
      ) : null}
    </div>
  );
}
