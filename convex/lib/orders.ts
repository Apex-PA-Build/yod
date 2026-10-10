import type { Doc } from "../_generated/dataModel";
import type { MutationCtx } from "../_generated/server";
import { appError } from "./errors";
import { changeStock } from "./inventory";
import type { OrderStatus } from "../../src/shared/orders";

/**
 * Moves an order to a new status and records it in the history.
 * Cancelling puts the order's units back into stock.
 */
export async function setOrderStatus(
  ctx: MutationCtx,
  order: Doc<"orders">,
  status: OrderStatus,
  actorEmail?: string,
) {
  if (order.status === status) return;
  if (order.status === "cancelled") appError("CONFLICT", "This order is cancelled and can't change status.");

  if (status === "cancelled") {
    if (order.status === "delivered") {
      appError("CONFLICT", "Delivered orders can't be cancelled. Record a return in inventory instead.");
    }
    const items = await ctx.db
      .query("orderItems")
      .withIndex("by_order", (q) => q.eq("orderId", order._id))
      .collect();
    for (const item of items) {
      await changeStock(ctx, item, item.quantity, {
        reason: "cancellation",
        orderId: order._id,
        actorEmail,
      });
    }
  }

  await ctx.db.patch(order._id, {
    status,
    statusHistory: [...order.statusHistory, { status, at: Date.now() }],
  });
}
