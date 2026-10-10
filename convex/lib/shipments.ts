import type { Doc, Id } from "../_generated/dataModel";
import type { MutationCtx } from "../_generated/server";
import { setOrderStatus } from "./orders";
import type { ShipmentStatus } from "../../src/shared/inventory";
import type { OrderStatus } from "../../src/shared/orders";

/** What the order should say once its parcel reaches a shipment status. */
const ORDER_STATUS_FOR: Partial<Record<ShipmentStatus, OrderStatus>> = {
  label_created: "packed",
  picked_up: "shipped",
  in_transit: "shipped",
  out_for_delivery: "shipped",
  delivered: "delivered",
};

const ORDER_RANK: Record<OrderStatus, number> = {
  placed: 0,
  packed: 1,
  shipped: 2,
  delivered: 3,
  cancelled: 4,
};

/** Records a scan and moves the shipment, and its order, forward. */
export async function recordShipmentEvent(
  ctx: MutationCtx,
  shipment: Doc<"shipments">,
  event: { status: ShipmentStatus; location: string; note?: string; at: number },
  actorEmail?: string,
) {
  await ctx.db.insert("shipmentEvents", { shipmentId: shipment._id, ...event, createdBy: actorEmail });

  // Only the newest scan decides the current state, so late entries don't rewind it.
  const latest = await ctx.db
    .query("shipmentEvents")
    .withIndex("by_shipment_and_at", (q) => q.eq("shipmentId", shipment._id))
    .order("desc")
    .first();
  if (latest && latest.at > event.at) return;

  await ctx.db.patch(shipment._id, {
    status: event.status,
    currentLocation: event.location,
    updatedAt: Date.now(),
    deliveredAt: event.status === "delivered" ? event.at : shipment.deliveredAt,
  });

  const target = ORDER_STATUS_FOR[event.status];
  const order = await ctx.db.get(shipment.orderId);
  if (target && order && order.status !== "cancelled" && ORDER_RANK[target] > ORDER_RANK[order.status]) {
    await setOrderStatus(ctx, order, target, actorEmail);
  }
}

export async function shipmentWithEvents(ctx: Pick<MutationCtx, "db">, id: Id<"shipments">) {
  const shipment = await ctx.db.get(id);
  if (!shipment) return null;
  const events = await ctx.db
    .query("shipmentEvents")
    .withIndex("by_shipment_and_at", (q) => q.eq("shipmentId", id))
    .order("desc")
    .collect();
  return { shipment, events };
}
