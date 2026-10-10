import type { Doc } from "../_generated/dataModel";
import type { QueryCtx } from "../_generated/server";

export const DAY = 24 * 60 * 60 * 1000;
/** India Standard Time offset, so days roll over at local midnight. */
const IST_OFFSET = 5.5 * 60 * 60 * 1000;

/** Start of the IST day containing `ms`, as a UTC timestamp. */
export function istDayStart(ms: number) {
  return Math.floor((ms + IST_OFFSET) / DAY) * DAY - IST_OFFSET;
}

/** Upper bound on rows read by a single report, to stay inside Convex limits. */
export const MAX_REPORT_ROWS = 8000;

export async function ordersBetween(ctx: QueryCtx, from: number, to: number) {
  return await ctx.db
    .query("orders")
    .withIndex("by_created_at", (q) => q.gte("createdAt", from).lt("createdAt", to))
    .take(MAX_REPORT_ROWS);
}

export async function orderItemsBetween(ctx: QueryCtx, from: number, to: number) {
  return await ctx.db
    .query("orderItems")
    .withIndex("by_created_at", (q) => q.gte("createdAt", from).lt("createdAt", to))
    .take(MAX_REPORT_ROWS);
}

/** Revenue and order count per IST day, with empty days filled in. */
export function dailySeries(orders: Doc<"orders">[], from: number, to: number) {
  const days = new Map<number, { day: number; revenue: number; orders: number }>();
  for (let d = istDayStart(from); d < to; d += DAY) days.set(d, { day: d, revenue: 0, orders: 0 });
  for (const o of orders) {
    if (o.status === "cancelled") continue;
    const bucket = days.get(istDayStart(o.createdAt));
    if (!bucket) continue;
    bucket.revenue += o.total;
    bucket.orders += 1;
  }
  return [...days.values()];
}

export function totals(orders: Doc<"orders">[]) {
  const live = orders.filter((o) => o.status !== "cancelled");
  const revenue = live.reduce((n, o) => n + o.total, 0);
  return {
    revenue,
    orders: live.length,
    cancelled: orders.length - live.length,
    averageOrderValue: live.length === 0 ? 0 : Math.round(revenue / live.length),
  };
}
