import { describe, expect, it } from "vitest";
import { catalogFiltersSchema } from "./catalog";
import { orderNumberSchema, phoneSchema, pincodeSchema, shippingAddressSchema } from "./checkout";
import { redirectPathSchema, signUpSchema } from "./account";
import { reviewFormSchema } from "./review";

describe("checkout schemas", () => {
  it("accepts Indian PIN codes and rejects bad ones", () => {
    expect(pincodeSchema.safeParse("560001").success).toBe(true);
    expect(pincodeSchema.safeParse("060001").success).toBe(false);
    expect(pincodeSchema.safeParse("56001").success).toBe(false);
  });

  it("normalises mobile numbers", () => {
    expect(phoneSchema.parse("+91 98765-43210")).toBe("9876543210");
    expect(phoneSchema.parse("09876543210")).toBe("9876543210");
    expect(phoneSchema.safeParse("1234567890").success).toBe(false);
  });

  it("uppercases order numbers", () => {
    expect(orderNumberSchema.parse(" yod-ab12cd34 ")).toBe("YOD-AB12CD34");
    expect(orderNumberSchema.safeParse("YOD-123").success).toBe(false);
  });

  it("drops an empty second address line and lowercases email", () => {
    const address = shippingAddressSchema.parse({
      fullName: "Asha Rao",
      email: "Asha@Example.com",
      phone: "9876543210",
      line1: "12 MG Road",
      line2: "",
      city: "Bengaluru",
      state: "Karnataka",
      pincode: "560001",
    });
    expect(address.line2).toBeUndefined();
    expect(address.email).toBe("asha@example.com");
  });
});

describe("account schemas", () => {
  it("requires matching passwords on sign-up", () => {
    const result = signUpSchema.safeParse({
      name: "Asha",
      email: "asha@example.com",
      password: "password123",
      confirmPassword: "password124",
    });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.path).toEqual(["confirmPassword"]);
  });

  it("only allows same-site redirects", () => {
    expect(redirectPathSchema.parse("/checkout")).toBe("/checkout");
    expect(redirectPathSchema.parse("//evil.example")).toBe("/account");
    expect(redirectPathSchema.parse("https://evil.example")).toBe("/account");
  });
});

describe("catalog filters", () => {
  it("fills defaults", () => {
    const filters = catalogFiltersSchema.parse({});
    expect(filters.type).toBe("all");
    expect(filters.sort).toBe("featured");
  });
});

describe("review form", () => {
  it("needs a rating and a real review", () => {
    const result = reviewFormSchema.safeParse({
      rating: 0,
      title: "ok",
      body: "short",
      size: "M",
      colourKey: "bone",
    });
    expect(result.success).toBe(false);
    const paths = result.error?.issues.map((i) => i.path[0]);
    expect(paths).toEqual(expect.arrayContaining(["rating", "title", "body"]));
  });
});
