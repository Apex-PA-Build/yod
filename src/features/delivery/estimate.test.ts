import { describe, expect, it } from "vitest";
import { estimateDelivery } from "./estimate";

describe("estimateDelivery", () => {
  it("returns an estimate for a valid PIN code", () => {
    const result = estimateDelivery("110001");
    expect(result.ok).toBe(true);
  });

  it("explains an invalid PIN code", () => {
    const result = estimateDelivery("abc");
    expect(result).toEqual({ ok: false, message: "Enter a valid 6-digit PIN code" });
  });
});
