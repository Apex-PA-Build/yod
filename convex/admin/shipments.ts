import { paginationOptsValidator } from "convex/server";
import { v } from "convex/values";
import { zid } from "convex-helpers/server/zod4";
import { vShipmentStatus } from "../schema";
import { appError } from "../lib/errors";
import { adminQuery, adminZMutation, adminZQuery } from "../lib/functions";
import { recordShipmentEvent } from "../lib/shipments";
import { ACTIVE_SHIPMENT_STATUSES, SHIPMENT_STATUSES } from "../../src/shared/inventory";
import { orderNumberSchema } from "../../src/shared/schemas/checkout";
import { shipmentEventSchema, shipmentSchema } from "../../src/shared/schemas/admin";

/** Hands an order to a courier: creates the shipment with its tracking number. */
export const create = adminZMutation({
  args: {
    orderNumber: orderNumberSchema,
    ...shipmentSchema.shape,
    pickupLocation: shipmentEventSchema.shape.location,
  },
  handler: async (ctx, { orderNumber, pickupLocation, ...details }) => {
    const order = await ctx.db
      .query("orders")
      .withIndex("by_order_number", (q) => q.eq("orderNumber", orderNumber))
      .unique();
    if (!order) appError("NOT_FOUND", `No order ${orderNumber}.`);
    if (order.status === "cancelled") appError("CONFLICT", "This order is cancelled.");

    const current = await ctx.db
      .query("shipments")
      .withIndex("by_order", (q) => q.eq("orderId", order._id))
      .collect();
    if (current.some((s) => s.status !== "returned_to_origin")) {
      appError("CONFLICT", "This order already has an active shipment. Update that one instead.");
    }
    const sameAwb = await ctx.db
      .query("shipments")
      .withIndex("by_tracking_number", (q) => q.eq("trackingNumber", details.trackingNumber))
      .first();
    if (sameAwb)
      appError(
        "CONFLICT",
        `Tracking number ${details.trackingNumber} is already used by ${sameAwb.orderNumber}.`,
      );

    const now = Date.now();
    const shipmentId = await ctx.db.insert("shipments", {
      orderId: order._id,
      orderNumber: order.orderNumber,
      ...details,
      status: "label_created",
      currentLocation: pickupLocation,
      destinationCity: order.address.city,
      destinationState: order.address.state,
      createdAt: now,
      updatedAt: now,
    });
    const shipment = (await ctx.db.get(shipmentId))!;
    await recordShipmentEvent(
      ctx,
      shipment,
      { status: "label_created", location: pickupLocation, note: `Handed to ${details.courier}`, at: now },
      ctx.admin.email,
    );
    return { shipmentId };
  },
});

export const update = adminZMutation({
  args: { shipmentId: zid("shipments"), ...shipmentSchema.shape },
  handler: async (ctx, { shipmentId, ...details }) => {
    const shipment = await ctx.db.get(shipmentId);
    if (!shipment) appError("NOT_FOUND", "Shipment not found.");
    await ctx.db.patch(shipmentId, { ...details, updatedAt: Date.now() });
  },
});

/** Adds a tracking scan: where the parcel is now and what happened. */
export const addEvent = adminZMutation({
  args: { shipmentId: zid("shipments"), ...shipmentEventSchema.shape },
  handler: async (ctx, { shipmentId, ...event }) => {
    const shipment = await ctx.db.get(shipmentId);
    if (!shipment) appError("NOT_FOUND", "Shipment not found.");
    if (event.at < shipment.createdAt - 24 * 60 * 60 * 1000) {
      appError("BAD_REQUEST", "That time is before the shipment was created.");
    }
    await recordShipmentEvent(ctx, shipment, event, ctx.admin.email);
  },
});

/** Shipments newest-updated first, optionally only one status. */
export const list = adminQuery({
  args: { status: v.optional(vShipmentStatus), paginationOpts: paginationOptsValidator },
  handler: async (ctx, { status, paginationOpts }) => {
    const page = await (
      status
        ? ctx.db.query("shipments").withIndex("by_status_and_updated_at", (q) => q.eq("status", status))
        : ctx.db.query("shipments").withIndex("by_updated_at")
    )
      .order("desc")
      .paginate(paginationOpts);

    return {
      ...page,
      page: await Promise.all(
        page.page.map(async (s) => {
          const last = await ctx.db
            .query("shipmentEvents")
            .withIndex("by_shipment_and_at", (q) => q.eq("shipmentId", s._id))
            .order("desc")
            .first();
          return {
            id: s._id,
            orderNumber: s.orderNumber,
            courier: s.courier,
            trackingNumber: s.trackingNumber,
            trackingUrl: s.trackingUrl ?? null,
            status: s.status,
            currentLocation: s.currentLocation ?? null,
            destination: `${s.destinationCity}, ${s.destinationState}`,
            estimatedDelivery: s.estimatedDelivery ?? null,
            lastEventAt: last?.at ?? s.createdAt,
            lastNote: last?.note ?? null,
            createdAt: s.createdAt,
            deliveredAt: s.deliveredAt ?? null,
          };
        }),
      ),
    };
  },
});

/** How many parcels are in each live state, and which are overdue. */
export const summary = adminZQuery({
  args: {},
  handler: async (ctx) => {
    const now = Date.now();
    const counts = Object.fromEntries(SHIPMENT_STATUSES.map((s) => [s, 0])) as Record<
      (typeof SHIPMENT_STATUSES)[number],
      number
    >;
    let overdue = 0;
    for (const status of ACTIVE_SHIPMENT_STATUSES) {
      const rows = await ctx.db
        .query("shipments")
        .withIndex("by_status_and_updated_at", (q) => q.eq("status", status))
        .collect();
      counts[status] = rows.length;
      overdue += rows.filter((r) => r.estimatedDelivery !== undefined && r.estimatedDelivery < now).length;
    }
    return { counts, active: ACTIVE_SHIPMENT_STATUSES.reduce((n, s) => n + counts[s], 0), overdue };
  },
});
