import { z } from "zod";
import type { Doc } from "./_generated/dataModel";
import type { MutationCtx, QueryCtx } from "./_generated/server";
import { findCart, ownerKey } from "./lib/cart";
import { availableUnits, changeStock } from "./lib/inventory";
import { setOrderStatus } from "./lib/orders";
import { appError } from "./lib/errors";
import { authedZQuery, getUser, sessionZMutation, zInternalMutation, zQuery } from "./lib/functions";
import { placeOrderSchema, orderNumberSchema, trackOrderSchema } from "../src/shared/schemas/checkout";
import { ORDER_STATUSES } from "../src/shared/orders";
import { storeConfig } from "../src/shared/store-config";

const ORDER_ALPHABET = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";

/** Order numbers avoid look-alike characters (0/O, 1/I) so they're easy to read out. */
async function newOrderNumber(ctx: MutationCtx): Promise<string> {
  for (let attempt = 0; attempt < 5; attempt++) {
    const bytes = crypto.getRandomValues(new Uint8Array(8));
    const code = Array.from(bytes, (b) => ORDER_ALPHABET[b % ORDER_ALPHABET.length]).join("");
    const orderNumber = `YOD-${code}`;
    const clash = await ctx.db
      .query("orders")
      .withIndex("by_order_number", (q) => q.eq("orderNumber", orderNumber))
      .unique();
    if (!clash) return orderNumber;
  }
  throw new Error("Could not allocate an order number");
}

async function shipmentFor(ctx: QueryCtx, orderId: Doc<"orders">["_id"]) {
  const shipment = await ctx.db
    .query("shipments")
    .withIndex("by_order", (q) => q.eq("orderId", orderId))
    .order("desc")
    .first();
  if (!shipment) return null;
  const events = await ctx.db
    .query("shipmentEvents")
    .withIndex("by_shipment_and_at", (q) => q.eq("shipmentId", shipment._id))
    .order("desc")
    .take(20);
  return {
    courier: shipment.courier,
    trackingNumber: shipment.trackingNumber,
    trackingUrl: shipment.trackingUrl ?? null,
    status: shipment.status,
    currentLocation: shipment.currentLocation ?? null,
    estimatedDelivery: shipment.estimatedDelivery ?? null,
    events: events.map((e) => ({ status: e.status, location: e.location, note: e.note ?? null, at: e.at })),
  };
}

function publicStatus(order: Doc<"orders">) {
  return {
    orderNumber: order.orderNumber,
    status: order.status,
    statusHistory: order.statusHistory,
    createdAt: order.createdAt,
  };
}

/**
 * Turns the shopper's cart into an order. Prices are re-read from the
 * catalog here, never taken from the client.
 */
export const place = sessionZMutation({
  args: placeOrderSchema.shape,
  handler: async (ctx, { address, paymentMethod }) => {
    const user = await getUser(ctx);
    const cart = await findCart(ctx, await ownerKey(ctx, ctx.sessionId));
    if (!cart || cart.items.length === 0) appError("CART_EMPTY", "Your cart is empty.");

    const lines = await Promise.all(
      cart.items.map(async (item) => {
        const product = await ctx.db.get(item.productId);
        const colour = product?.colours.find((c) => c.key === item.colourKey);
        if (!product || !product.isActive || !colour || !product.sizes.includes(item.size)) {
          appError(
            "INVALID_VARIANT",
            "Something in your cart is no longer available. Please review your cart.",
          );
        }
        if ((await availableUnits(ctx, item)) < item.quantity) {
          appError(
            "OUT_OF_STOCK",
            `${product.name} in ${colour.name}, size ${item.size}, doesn't have enough stock left. Please update your cart.`,
          );
        }
        return { item, product, colour };
      }),
    );

    const subtotal = lines.reduce((n, l) => n + l.product.price * l.item.quantity, 0);
    const shippingFee = storeConfig.shippingFeePaise;
    const now = Date.now();
    const orderNumber = await newOrderNumber(ctx);

    const orderId = await ctx.db.insert("orders", {
      orderNumber,
      userId: user?.id,
      email: address.email,
      address,
      paymentMethod,
      subtotal,
      shippingFee,
      total: subtotal + shippingFee,
      status: "placed",
      statusHistory: [{ status: "placed", at: now }],
      createdAt: now,
    });

    for (const { item, product, colour } of lines) {
      await changeStock(ctx, item, -item.quantity, { reason: "sale", orderId, actorEmail: address.email });
      await ctx.db.insert("orderItems", {
        orderId,
        productId: product._id,
        userId: user?.id,
        name: product.name,
        slug: product.slug,
        colourKey: colour.key,
        colourName: colour.name,
        image: colour.image,
        size: item.size,
        quantity: item.quantity,
        unitPrice: product.price,
        createdAt: now,
      });
    }

    await ctx.db.patch(cart._id, { items: [], updatedAt: now });
    return { orderNumber };
  },
});

async function orderWithItems(ctx: QueryCtx, order: Doc<"orders">) {
  const items = await ctx.db
    .query("orderItems")
    .withIndex("by_order", (q) => q.eq("orderId", order._id))
    .collect();
  return {
    ...publicStatus(order),
    shipment: await shipmentFor(ctx, order._id),
    email: order.email,
    address: order.address,
    paymentMethod: order.paymentMethod,
    subtotal: order.subtotal,
    shippingFee: order.shippingFee,
    total: order.total,
    items: items.map((i) => ({
      id: i._id,
      name: i.name,
      slug: i.slug,
      colourName: i.colourName,
      image: i.image,
      size: i.size,
      quantity: i.quantity,
      unitPrice: i.unitPrice,
    })),
  };
}

export const mine = authedZQuery({
  args: {},
  handler: async (ctx) => {
    const orders = await ctx.db
      .query("orders")
      .withIndex("by_user", (q) => q.eq("userId", ctx.user.id))
      .order("desc")
      .take(50);
    return orders.map((o) => ({ ...publicStatus(o), total: o.total }));
  },
});

export const getMine = authedZQuery({
  args: { orderNumber: orderNumberSchema },
  handler: async (ctx, { orderNumber }) => {
    const order = await ctx.db
      .query("orders")
      .withIndex("by_order_number", (q) => q.eq("orderNumber", orderNumber))
      .unique();
    if (!order || order.userId !== ctx.user.id) return null;
    return await orderWithItems(ctx, order);
  },
});

/**
 * The confirmation page right after checkout. Guests can see the order they
 * just placed by proving they know its email address.
 */
export const confirmation = zQuery({
  args: trackOrderSchema.shape,
  handler: async (ctx, { orderNumber, email }) => {
    const order = await ctx.db
      .query("orders")
      .withIndex("by_order_number", (q) => q.eq("orderNumber", orderNumber))
      .unique();
    if (!order || order.email !== email) return null;
    return await orderWithItems(ctx, order);
  },
});

/** Public order tracking: needs the order number and the email used to order. */
export const track = zQuery({
  args: trackOrderSchema.shape,
  handler: async (ctx, { orderNumber, email }) => {
    const order = await ctx.db
      .query("orders")
      .withIndex("by_order_number", (q) => q.eq("orderNumber", orderNumber))
      .unique();
    if (!order || order.email !== email) return null;
    return { ...publicStatus(order), shipment: await shipmentFor(ctx, order._id) };
  },
});

/**
 * Moves an order to a new status from the CLI, e.g.
 * `npx convex run orders:setStatus`. The admin app uses admin/orders instead.
 */
export const setStatus = zInternalMutation({
  args: {
    orderNumber: orderNumberSchema,
    status: z.enum(ORDER_STATUSES),
  },
  handler: async (ctx, { orderNumber, status }) => {
    const order = await ctx.db
      .query("orders")
      .withIndex("by_order_number", (q) => q.eq("orderNumber", orderNumber))
      .unique();
    if (!order) appError("NOT_FOUND", `No order ${orderNumber}`);
    await setOrderStatus(ctx, order, status);
  },
});
