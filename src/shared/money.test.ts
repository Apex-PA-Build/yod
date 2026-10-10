import { describe, expect, it } from "vitest";
import { formatPrice } from "./money";

describe("formatPrice", () => {
  it("formats paise as rupees without decimals for whole amounts", () => {
    expect(formatPrice(129_900)).toBe("₹1,299");
    expect(formatPrice(27_98_00)).toBe("₹2,798");
  });

  it("uses Indian digit grouping", () => {
    expect(formatPrice(1_23_456_00)).toBe("₹1,23,456");
  });
});
