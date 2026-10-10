import type { Doc } from "../_generated/dataModel";
import type { FitFeedback } from "../../src/shared/catalog";

export type RatingSummary = {
  average: number | null;
  count: number;
  /** Counts for 5, 4, 3, 2 and 1 stars, in that order. */
  distribution: { stars: number; count: number }[];
  /** 0 = runs small, 0.5 = true to size, 1 = runs large. Null without fit feedback. */
  fitScore: number | null;
  fitLabel: FitFeedback | null;
};

const FIT_VALUE: Record<FitFeedback, number> = { small: 0, true: 0.5, large: 1 };

export function summariseReviews(reviews: Pick<Doc<"reviews">, "rating" | "fit">[]): RatingSummary {
  const count = reviews.length;
  const distribution = [5, 4, 3, 2, 1].map((stars) => ({
    stars,
    count: reviews.filter((r) => r.rating === stars).length,
  }));
  const average =
    count === 0 ? null : Math.round((reviews.reduce((s, r) => s + r.rating, 0) / count) * 10) / 10;

  const fits = reviews.flatMap((r) => (r.fit ? [FIT_VALUE[r.fit]] : []));
  const fitScore = fits.length === 0 ? null : fits.reduce((s, f) => s + f, 0) / fits.length;
  const fitLabel: FitFeedback | null =
    fitScore === null ? null : fitScore < 0.35 ? "small" : fitScore > 0.65 ? "large" : "true";

  return { average, count, distribution, fitScore, fitLabel };
}
