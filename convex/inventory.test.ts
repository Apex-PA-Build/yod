import { convexTest } from "convex-test";
import type { SessionId } from "convex-helpers/server/sessions";
import { beforeEach, describe, expect, it } from "vitest";
import { api, internal } from "./_generated/api";
import type { Id } from "./_generated/dataModel";
import { changeStock, findStock } from "./lib/inventory";
import { recordShipmentEvent } from "./lib/shipments";
import schema from "./schema";
import { modules } from "./test.setup";

const sessionId = "guest-session-0002" as SessionId;
const address = {
  fullName: "Ravi Kumar",
  email: "ravi@example.com",
  phone: "9876543210",
  line1: "4 Park Street",
  city: "Kolkata",
  state: "West Bengal" as const,
  pincode: "700016",
};

const setup = () => convexTest(schema, modules);
let t: ReturnType<typeof setup>;
let productId: Id<"products">;
const variant = () => ({ productId, colourKey: "emerald", size: "M" as const });

beforeEach(async () => {
  t = setup();
  await t.mutation(internal.seed.run, {});
  const page = await t.query(api.products.getBySlug, { slug: "emerald-drop-tee" });
  productId = page!.product.id;
});

async function onHand() {
  return await t.run(async (ctx) => (await findStock(ctx, variant()))?.onHand);
}

describe("stock", () => {
  it("seeds opening stock with a recorded movement", async () => {
    expect(await onHand()).toBe(25);
    const movements = await t.run((ctx) => ctx.db.query("stockMovements").collect());
    expect(movements.every((m) => m.reason === "recount" && m.balanceAfter === 25)).toBe(true);
  });

  it("never goes below zero", async () => {
    await expect(t.run((ctx) => changeStock(ctx, variant(), -26, { reason: "damaged" }))).rejects.toThrow(
      /enough stock/,
    );
    expect(await onHand()).toBe(25);
  });

  it("shows low stock on the product page only when it's low", async () => {
    await t.run((ctx) => changeStock(ctx, variant(), -22, { reason: "damaged" }));
    const page = await t.query(api.products.getBySlug, { slug: "emerald-drop-tee" });
    const m = page!.stock.find((s) => s.size === "M");
    const l = page!.stock.find((s) => s.size === "L");
    expect(m?.left).toBe(3);
    expect(l?.left).toBeNull();
  });

  it("stops shoppers adding more than is in stock", async () => {
    await t.run((ctx) => changeStock(ctx, variant(), -23, { reason: "damaged" }));
    await expect(t.mutation(api.cart.add, { sessionId, ...variant(), quantity: 3 })).rejects.toThrow(
      /Only 2 left/,
    );
    await t.mutation(api.cart.add, { sessionId, ...variant(), quantity: 2 });
    await expect(t.mutation(api.cart.add, { sessionId, ...variant(), quantity: 1 })).rejects.toThrow(
      /Only 2 left/,
    );
  });

  it("takes stock on checkout and gives it back on cancellation", async () => {
    await t.mutation(api.cart.add, { sessionId, ...variant(), quantity: 3 });
    const { orderNumber } = await t.mutation(api.orders.place, { sessionId, address, paymentMethod: "cod" });
    expect(await onHand()).toBe(22);

    await t.mutation(internal.orders.setStatus, { orderNumber, status: "cancelled" });
    expect(await onHand()).toBe(25);
    const reasons = await t.run(async (ctx) =>
      (
        await ctx.db
          .query("stockMovements")
          .withIndex("by_product_and_created_at", (q) => q.eq("productId", productId))
          .collect()
      )
        .filter((m) => m.size === "M" && m.colourKey === "emerald")
        .map((m) => m.reason),
    );
    expect(reasons).toEqual(["recount", "sale", "cancellation"]);
    await expect(t.mutation(internal.orders.setStatus, { orderNumber, status: "packed" })).rejects.toThrow(
      /cancelled/,
    );
  });

  it("refuses checkout when stock ran out after the item was added", async () => {
    await t.mutation(api.cart.add, { sessionId, ...variant(), quantity: 2 });
    await t.run((ctx) => changeStock(ctx, variant(), -24, { reason: "damaged" }));
    await expect(t.mutation(api.orders.place, { sessionId, address, paymentMethod: "cod" })).rejects.toThrow(
      /enough stock/,
    );
    expect(await onHand()).toBe(1);
  });
});

describe("shipments", () => {
  it("moves the order forward with each scan and shows tracking to the customer", async () => {
    await t.mutation(api.cart.add, { sessionId, ...variant(), quantity: 1 });
    const { orderNumber } = await t.mutation(api.orders.place, { sessionId, address, paymentMethod: "cod" });
    const now = Date.now();

    const shipmentId = await t.run(async (ctx) => {
      const order = (await ctx.db
        .query("orders")
        .withIndex("by_order_number", (q) => q.eq("orderNumber", orderNumber))
        .unique())!;
      const id = await ctx.db.insert("shipments", {
        orderId: order._id,
        orderNumber,
        courier: "Delhivery",
        trackingNumber: "AWB123456",
        status: "label_created",
        destinationCity: "Kolkata",
        destinationState: "West Bengal",
        createdAt: now,
        updatedAt: now,
      });
      const shipment = (await ctx.db.get(id))!;
      await recordShipmentEvent(ctx, shipment, {
        status: "label_created",
        location: "Bengaluru warehouse",
        at: now,
      });
      await recordShipmentEvent(ctx, (await ctx.db.get(id))!, {
        status: "in_transit",
        location: "Kolkata hub",
        at: now + 2000,
      });
      // A late entry for an earlier scan must not rewind the shipment.
      await recordShipmentEvent(ctx, (await ctx.db.get(id))!, {
        status: "picked_up",
        location: "Bengaluru",
        at: now + 1000,
      });
      return id;
    });

    const tracked = await t.query(api.orders.track, { orderNumber, email: address.email });
    expect(tracked?.status).toBe("shipped");
    expect(tracked?.shipment?.status).toBe("in_transit");
    expect(tracked?.shipment?.currentLocation).toBe("Kolkata hub");
    expect(tracked?.shipment?.events.map((e) => e.location)).toEqual([
      "Kolkata hub",
      "Bengaluru",
      "Bengaluru warehouse",
    ]);

    await t.run(async (ctx) =>
      recordShipmentEvent(ctx, (await ctx.db.get(shipmentId))!, {
        status: "delivered",
        location: "Kolkata",
        at: now + 3000,
      }),
    );
    const delivered = await t.query(api.orders.track, { orderNumber, email: address.email });
    expect(delivered?.status).toBe("delivered");
    expect(delivered?.statusHistory.map((h) => h.status)).toEqual([
      "placed",
      "packed",
      "shipped",
      "delivered",
    ]);
  });
});

describe("admin access", () => {
  it("rejects signed-out callers", async () => {
    expect(await t.query(api.admin.team.me, {})).toBeNull();
    await expect(t.query(api.admin.dashboard.overview, { days: 30 })).rejects.toThrow(/sign in/i);
    await expect(t.query(api.admin.inventory.overview, {})).rejects.toThrow(/sign in/i);
  });
});
