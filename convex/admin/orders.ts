import { paginationOptsValidator } from "convex/server";
import { v } from "convex/values";
import { z } from "zod";
import type { Doc } from "../_generated/dataModel";
import type { QueryCtx } from "../_generated/server";
import { vOrderStatus } from "../schema";
import { appError } from "../lib/errors";
import { adminQuery, adminZMutation, adminZQuery } from "../lib/functions";
import { setOrderStatus } from "../lib/orders";
import { orderNumberSchema } from "../../src/shared/schemas/checkout";
import { orderStatusUpdateSchema } from "../../src/shared/schemas/admin";

async function latestShipment(ctx: QueryCtx, orderId: Doc<"orders">["_id"]) {
  return await ctx.db
    .query("shipments")
    .withIndex("by_order", (q) => q.eq("orderId", orderId))
    .order("desc")
    .first();
}

async function toRow(ctx: QueryCtx, o: Doc<"orders">) {
  const [items, shipment] = await Promise.all([
    ctx.db
      .query("orderItems")
      .withIndex("by_order", (q) => q.eq("orderId", o._id))
      .collect(),
    latestShipment(ctx, o._id),
  ]);
  return {
    id: o._id,
    orderNumber: o.orderNumber,
    customerName: o.address.fullName,
    email: o.email,
    city: o.address.city,
    state: o.address.state,
    units: items.reduce((n, i) => n + i.quantity, 0),
    total: o.total,
    status: o.status,
    paymentMethod: o.paymentMethod,
    shipmentStatus: shipment?.status ?? null,
    createdAt: o.createdAt,
  };
}

export const list = adminQuery({
  args: { status: v.optional(vOrderStatus), paginationOpts: paginationOptsValidator },
  handler: async (ctx, { status, paginationOpts }) => {
    const page = await (
      status
        ? ctx.db.query("orders").withIndex("by_status_and_created_at", (q) => q.eq("status", status))
        : ctx.db.query("orders").withIndex("by_created_at")
    )
      .order("desc")
      .paginate(paginationOpts);
    return { ...page, page: await Promise.all(page.page.map((o) => toRow(ctx, o))) };
  },
});

/** Finds orders by order number or customer email. */
export const search = adminZQuery({
  args: { q: z.string().trim().min(3).max(254) },
  handler: async (ctx, { q }) => {
    const asNumber = orderNumberSchema.safeParse(q);
    if (asNumber.success) {
      const order = await ctx.db
        .query("orders")
        .withIndex("by_order_number", (x) => x.eq("orderNumber", asNumber.data))
        .unique();
      return order ? [await toRow(ctx, order)] : [];
    }
    const orders = await ctx.db
      .query("orders")
      .withIndex("by_email", (x) => x.eq("email", q.toLowerCase()))
      .order("desc")
      .take(50);
    return await Promise.all(orders.map((o) => toRow(ctx, o)));
  },
});

export const get = adminZQuery({
  args: { orderNumber: orderNumberSchema },
  handler: async (ctx, { orderNumber }) => {
    const order = await ctx.db
      .query("orders")
      .withIndex("by_order_number", (q) => q.eq("orderNumber", orderNumber))
      .unique();
    if (!order) return null;

    const [items, shipments, movements, previousOrders] = await Promise.all([
      ctx.db
        .query("orderItems")
        .withIndex("by_order", (q) => q.eq("orderId", order._id))
        .collect(),
      ctx.db
        .query("shipments")
        .withIndex("by_order", (q) => q.eq("orderId", order._id))
        .order("desc")
        .collect(),
      ctx.db
        .query("stockMovements")
        .withIndex("by_order", (q) => q.eq("orderId", order._id))
        .collect(),
      ctx.db
        .query("orders")
        .withIndex("by_email", (q) => q.eq("email", order.email))
        .collect(),
    ]);

    const shipmentsWithEvents = await Promise.all(
      shipments.map(async (s) => ({
        id: s._id,
        courier: s.courier,
        trackingNumber: s.trackingNumber,
        trackingUrl: s.trackingUrl ?? null,
        status: s.status,
        currentLocation: s.currentLocation ?? null,
        estimatedDelivery: s.estimatedDelivery ?? null,
        deliveredAt: s.deliveredAt ?? null,
        createdAt: s.createdAt,
        events: (
          await ctx.db
            .query("shipmentEvents")
            .withIndex("by_shipment_and_at", (q) => q.eq("shipmentId", s._id))
            .order("desc")
            .collect()
        ).map((e) => ({
          id: e._id,
          status: e.status,
          location: e.location,
          note: e.note ?? null,
          at: e.at,
          createdBy: e.createdBy ?? null,
        })),
      })),
    );

    return {
      id: order._id,
      orderNumber: order.orderNumber,
      status: order.status,
      statusHistory: order.statusHistory,
      email: order.email,
      address: order.address,
      paymentMethod: order.paymentMethod,
      subtotal: order.subtotal,
      shippingFee: order.shippingFee,
      total: order.total,
      createdAt: order.createdAt,
      isGuest: order.userId === undefined,
      customerOrderCount: previousOrders.length,
      items: items.map((i) => ({
        id: i._id,
        productId: i.productId,
        name: i.name,
        slug: i.slug,
        colourName: i.colourName,
        image: i.image,
        size: i.size,
        quantity: i.quantity,
        unitPrice: i.unitPrice,
      })),
      shipments: shipmentsWithEvents,
      stockMovements: movements.map((m) => ({
        delta: m.delta,
        balanceAfter: m.balanceAfter,
        reason: m.reason,
        name: items.find((i) => i.productId === m.productId)?.name ?? "",
        colourName:
          items.find((i) => i.productId === m.productId && i.colourKey === m.colourKey)?.colourName ??
          m.colourKey,
        size: m.size,
        at: m.createdAt,
      })),
    };
  },
});

/** Changes an order's status. Cancelling returns its units to stock. */
export const setStatus = adminZMutation({
  args: { orderNumber: orderNumberSchema, ...orderStatusUpdateSchema.shape },
  handler: async (ctx, { orderNumber, status }) => {
    const order = await ctx.db
      .query("orders")
      .withIndex("by_order_number", (q) => q.eq("orderNumber", orderNumber))
      .unique();
    if (!order) appError("NOT_FOUND", `No order ${orderNumber}.`);
    await setOrderStatus(ctx, order, status, ctx.admin.email);
  },
});
