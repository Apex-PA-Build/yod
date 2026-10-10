import { adminZQuery } from "../lib/functions";
import {
  dailySeries,
  DAY,
  MAX_REPORT_ROWS,
  orderItemsBetween,
  ordersBetween,
  totals,
} from "../lib/analytics";
import { variantKey } from "../../src/shared/inventory";
import { reportRangeSchema } from "../../src/shared/schemas/admin";

/**
 * Sales, geography, delivery and stock figures for a date range.
 * Costs come from stock imports (weighted average per colour and size).
 */
export const summary = adminZQuery({
  args: reportRangeSchema.shape,
  handler: async (ctx, { from, to }) => {
    const [orders, items, imports] = await Promise.all([
      ordersBetween(ctx, from, to),
      orderItemsBetween(ctx, from, to),
      ctx.db.query("stockImports").withIndex("by_received_at").order("desc").take(2000),
    ]);
    const orderById = new Map(orders.map((o) => [o._id, o]));
    const liveItems = items.filter((i) => orderById.get(i.orderId)?.status !== "cancelled");

    // Weighted average cost per variant across all imports.
    const cost = new Map<string, { units: number; total: number }>();
    for (const batch of imports) {
      for (const line of batch.lines) {
        const key = variantKey(line);
        const c = cost.get(key) ?? { units: 0, total: 0 };
        c.units += line.quantity;
        c.total += line.quantity * line.unitCost;
        cost.set(key, c);
      }
    }
    const unitCost = (key: string) => {
      const c = cost.get(key);
      return c && c.units > 0 ? c.total / c.units : null;
    };

    const byProduct = new Map<
      string,
      { productId: string; name: string; units: number; revenue: number; cost: number; costKnown: boolean }
    >();
    const byVariant = new Map<
      string,
      { name: string; colourName: string; size: string; units: number; revenue: number }
    >();
    for (const i of liveItems) {
      const p = byProduct.get(i.productId) ?? {
        productId: i.productId,
        name: i.name,
        units: 0,
        revenue: 0,
        cost: 0,
        costKnown: true,
      };
      const uc = unitCost(variantKey(i));
      p.units += i.quantity;
      p.revenue += i.quantity * i.unitPrice;
      if (uc === null) p.costKnown = false;
      else p.cost += Math.round(uc * i.quantity);
      byProduct.set(i.productId, p);

      const key = variantKey(i);
      const v = byVariant.get(key) ?? {
        name: i.name,
        colourName: i.colourName,
        size: i.size,
        units: 0,
        revenue: 0,
      };
      v.units += i.quantity;
      v.revenue += i.quantity * i.unitPrice;
      byVariant.set(key, v);
    }

    const byState = new Map<
      string,
      { state: string; orders: number; revenue: number; delivered: number; cancelled: number }
    >();
    const byCity = new Map<string, { city: string; state: string; orders: number; revenue: number }>();
    for (const o of orders) {
      const s = byState.get(o.address.state) ?? {
        state: o.address.state,
        orders: 0,
        revenue: 0,
        delivered: 0,
        cancelled: 0,
      };
      if (o.status === "cancelled") s.cancelled += 1;
      else {
        s.orders += 1;
        s.revenue += o.total;
        if (o.status === "delivered") s.delivered += 1;
      }
      byState.set(o.address.state, s);
      if (o.status === "cancelled") continue;
      const cityKey = `${o.address.city.toLowerCase()}|${o.address.state}`;
      const c = byCity.get(cityKey) ?? {
        city: o.address.city,
        state: o.address.state,
        orders: 0,
        revenue: 0,
      };
      c.orders += 1;
      c.revenue += o.total;
      byCity.set(cityKey, c);
    }

    // Delivery performance for shipments created in the range.
    const shipments = (
      await ctx.db
        .query("shipments")
        .withIndex("by_updated_at", (q) => q.gte("updatedAt", from))
        .take(MAX_REPORT_ROWS)
    ).filter((s) => s.createdAt >= from && s.createdAt < to);
    const couriers = new Map<
      string,
      {
        courier: string;
        shipments: number;
        delivered: number;
        failed: number;
        returned: number;
        totalDays: number;
      }
    >();
    for (const s of shipments) {
      const c = couriers.get(s.courier) ?? {
        courier: s.courier,
        shipments: 0,
        delivered: 0,
        failed: 0,
        returned: 0,
        totalDays: 0,
      };
      c.shipments += 1;
      if (s.status === "delivered" && s.deliveredAt) {
        c.delivered += 1;
        const order = await ctx.db.get(s.orderId);
        c.totalDays += (s.deliveredAt - (order?.createdAt ?? s.createdAt)) / DAY;
      }
      if (s.status === "delivery_failed") c.failed += 1;
      if (s.status === "returned_to_origin") c.returned += 1;
      couriers.set(s.courier, c);
    }

    const importsInRange = imports.filter((b) => b.receivedAt >= from && b.receivedAt < to);
    const products = [...byProduct.values()].sort((a, b) => b.revenue - a.revenue);
    const costOfGoods = products.reduce((n, p) => n + p.cost, 0);
    const summaryTotals = totals(orders);

    return {
      from,
      to,
      truncated: orders.length >= MAX_REPORT_ROWS || items.length >= MAX_REPORT_ROWS,
      totals: {
        ...summaryTotals,
        units: liveItems.reduce((n, i) => n + i.quantity, 0),
        costOfGoods,
        grossProfit: summaryTotals.revenue - costOfGoods,
        costComplete: products.every((p) => p.costKnown),
        shippingCollected: orders
          .filter((o) => o.status !== "cancelled")
          .reduce((n, o) => n + o.shippingFee, 0),
      },
      series: dailySeries(orders, from, to),
      products,
      variants: [...byVariant.values()].sort((a, b) => b.units - a.units).slice(0, 25),
      states: [...byState.values()].sort((a, b) => b.revenue - a.revenue),
      cities: [...byCity.values()].sort((a, b) => b.orders - a.orders).slice(0, 15),
      couriers: [...couriers.values()]
        .map((c) => ({
          ...c,
          averageDays: c.delivered === 0 ? null : Math.round((c.totalDays / c.delivered) * 10) / 10,
        }))
        .sort((a, b) => b.shipments - a.shipments),
      imports: {
        batches: importsInRange.length,
        units: importsInRange.reduce((n, b) => n + b.totalUnits, 0),
        cost: importsInRange.reduce((n, b) => n + b.totalCost, 0),
      },
    };
  },
});
