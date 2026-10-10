import { convexTest } from "convex-test";
import type { SessionId } from "convex-helpers/server/sessions";
import { beforeEach, describe, expect, it } from "vitest";
import { api, internal } from "./_generated/api";
import schema from "./schema";
import { modules } from "./test.setup";

const sessionId = "guest-session-0001" as SessionId;
const address = {
  fullName: "Asha Rao",
  email: "asha@example.com",
  phone: "+91 98765 43210",
  line1: "12 MG Road",
  city: "Bengaluru",
  state: "Karnataka" as const,
  pincode: "560001",
};

const setup = () => convexTest(schema, modules);
let t: ReturnType<typeof setup>;

beforeEach(async () => {
  t = setup();
  await t.mutation(internal.seed.run, {});
});

describe("catalog", () => {
  it("seeds once and lists products in featured order", async () => {
    expect(await t.mutation(internal.seed.run, {})).toEqual({ inserted: 0 });
    const { products, total } = await t.query(api.products.list, {});
    expect(total).toBe(6);
    expect(products[0]?.slug).toBe("essential-drop-tee");
  });

  it("filters by type and sorts by price", async () => {
    const { products } = await t.query(api.products.list, { type: "graphic", sort: "price-asc" });
    expect(products.map((p) => p.slug)).toEqual(["line-art-drop-tee", "abstract-print-tee"]);
  });

  it("rejects invalid filters", async () => {
    // @ts-expect-error testing server-side validation
    await expect(t.query(api.products.list, { sort: "cheapest" })).rejects.toThrow();
  });

  it("returns product page data with its paired tee", async () => {
    const page = await t.query(api.products.getBySlug, { slug: "essential-drop-tee" });
    expect(page?.product.name).toBe("Essential Drop Tee");
    expect(page?.pairedProduct?.slug).toBe("line-art-drop-tee");
    expect(page?.rating.count).toBe(0);
  });
});

describe("guest cart and checkout", () => {
  async function essential() {
    const page = await t.query(api.products.getBySlug, { slug: "essential-drop-tee" });
    if (!page) throw new Error("seed missing");
    return page.product;
  }

  it("merges repeated adds of the same variant", async () => {
    const product = await essential();
    const line = { sessionId, productId: product.id, colourKey: "bone", size: "M" as const, quantity: 1 };
    await t.mutation(api.cart.add, line);
    await t.mutation(api.cart.add, { ...line, quantity: 2 });
    const cart = await t.query(api.cart.get, { sessionId });
    expect(cart.lines).toHaveLength(1);
    expect(cart.itemCount).toBe(3);
    expect(cart.subtotal).toBe(3 * 129_900);
  });

  it("rejects a colour the product doesn't come in", async () => {
    const product = await essential();
    await expect(
      t.mutation(api.cart.add, {
        sessionId,
        productId: product.id,
        colourKey: "emerald",
        size: "M",
        quantity: 1,
      }),
    ).rejects.toThrow();
  });

  it("places a COD order at catalog prices, clears the cart and can be tracked", async () => {
    const product = await essential();
    await t.mutation(api.cart.add, {
      sessionId,
      productId: product.id,
      colourKey: "bone",
      size: "L",
      quantity: 2,
    });

    const { orderNumber } = await t.mutation(api.orders.place, { sessionId, address, paymentMethod: "cod" });
    expect(orderNumber).toMatch(/^YOD-[0-9A-Z]{8}$/);
    expect((await t.query(api.cart.get, { sessionId })).itemCount).toBe(0);

    const order = await t.query(api.orders.confirmation, { orderNumber, email: "ASHA@example.com" });
    expect(order?.total).toBe(2 * 129_900);
    expect(order?.address.phone).toBe("9876543210");
    expect(await t.query(api.orders.track, { orderNumber, email: "someone@else.com" })).toBeNull();

    await t.mutation(internal.orders.setStatus, { orderNumber, status: "shipped" });
    const tracked = await t.query(api.orders.track, { orderNumber, email: "asha@example.com" });
    expect(tracked?.status).toBe("shipped");
    expect(tracked?.statusHistory.map((h) => h.status)).toEqual(["placed", "shipped"]);
  });

  it("refuses to place an order from an empty cart", async () => {
    await expect(t.mutation(api.orders.place, { sessionId, address, paymentMethod: "cod" })).rejects.toThrow(
      /empty/i,
    );
  });
});

describe("signed-out access", () => {
  it("blocks account-only functions", async () => {
    await expect(t.query(api.orders.mine, {})).rejects.toThrow(/sign in/i);
    expect(await t.query(api.wishlist.ids, {})).toEqual([]);
  });
});
