import { describe, expect, it } from "vitest";
import { summariseReviews } from "./reviews";

describe("summariseReviews", () => {
  it("handles no reviews", () => {
    expect(summariseReviews([])).toMatchObject({ average: null, count: 0, fitScore: null, fitLabel: null });
  });

  it("averages to one decimal and builds the distribution", () => {
    const summary = summariseReviews([
      { rating: 5, fit: "true" },
      { rating: 4, fit: "large" },
      { rating: 5, fit: undefined },
    ]);
    expect(summary.average).toBe(4.7);
    expect(summary.distribution[0]).toEqual({ stars: 5, count: 2 });
    expect(summary.distribution[1]).toEqual({ stars: 4, count: 1 });
    expect(summary.fitScore).toBe(0.75);
    expect(summary.fitLabel).toBe("large");
  });
});
