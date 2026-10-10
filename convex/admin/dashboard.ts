import { z } from "zod";
import { adminZQuery } from "../lib/functions";
import { dailySeries, DAY, istDayStart, orderItemsBetween, ordersBetween, totals } from "../lib/analytics";
import { ACTIVE_SHIPMENT_STATUSES } from "../../src/shared/inventory";

const OPEN_STATUSES = ["placed", "packed", "shipped"] as const;

export const overview = adminZQuery({
  args: { days: z.union([z.literal(7), z.literal(30), z.literal(90)]).default(30) },
  handler: async (ctx, { days }) => {
    const now = Date.now();
    const from = istDayStart(now) - (days - 1) * DAY;
    const previousFrom = from - days * DAY;

    const [orders, previous, items, inventory, products] = await Promise.all([
      ordersBetween(ctx, from, now + 1),
      ordersBetween(ctx, previousFrom, from),
      orderItemsBetween(ctx, from, now + 1),
      ctx.db.query("inventory").collect(),
      ctx.db.query("products").collect(),
    ]);
    const cancelledIds = new Set(orders.filter((o) => o.status === "cancelled").map((o) => o._id));
    const productById = new Map(products.map((p) => [p._id, p]));

    const open = Object.fromEntries(
      await Promise.all(
        OPEN_STATUSES.map(async (status) => {
          const rows = await ctx.db
            .query("orders")
            .withIndex("by_status_and_created_at", (q) => q.eq("status", status))
            .take(1000);
          return [status, rows.length] as const;
        }),
      ),
    ) as Record<(typeof OPEN_STATUSES)[number], number>;

    const deliveredInRange = await ctx.db
      .query("shipments")
      .withIndex("by_status_and_updated_at", (q) => q.eq("status", "delivered").gte("updatedAt", from))
      .take(5000);

    let activeShipments = 0;
    for (const status of ACTIVE_SHIPMENT_STATUSES) {
      activeShipments += (
        await ctx.db
          .query("shipments")
          .withIndex("by_status_and_updated_at", (q) => q.eq("status", status))
          .take(1000)
      ).length;
    }

    const lowStock = inventory
      .filter((s) => s.onHand <= s.lowStockThreshold && productById.get(s.productId)?.isActive)
      .sort((a, b) => a.onHand - b.onHand)
      .map((s) => {
        const p = productById.get(s.productId)!;
        return {
          productId: s.productId,
          productName: p.name,
          colourName: p.colours.find((c) => c.key === s.colourKey)?.name ?? s.colourKey,
          size: s.size,
          onHand: s.onHand,
          threshold: s.lowStockThreshold,
        };
      });

    const topProducts = new Map<string, { name: string; units: number; revenue: number }>();
    for (const item of items) {
      if (cancelledIds.has(item.orderId)) continue;
      const row = topProducts.get(item.productId) ?? { name: item.name, units: 0, revenue: 0 };
      row.units += item.quantity;
      row.revenue += item.quantity * item.unitPrice;
      topProducts.set(item.productId, row);
    }

    const recent = await ctx.db.query("orders").withIndex("by_created_at").order("desc").take(8);
    const unresolvedMessages = (
      await ctx.db.query("contactMessages").withIndex("by_created_at").order("desc").take(500)
    ).filter((m) => m.resolvedAt === undefined).length;

    return {
      days,
      current: {
        ...totals(orders),
        units: items.filter((i) => !cancelledIds.has(i.orderId)).reduce((n, i) => n + i.quantity, 0),
        delivered: deliveredInRange.length,
      },
      previous: totals(previous),
      series: dailySeries(orders, from, now + 1),
      open,
      activeShipments,
      unitsInStock: inventory.reduce((n, s) => n + s.onHand, 0),
      lowStock: lowStock.slice(0, 10),
      lowStockCount: lowStock.length,
      outOfStockCount: lowStock.filter((s) => s.onHand === 0).length,
      topProducts: [...topProducts.values()].sort((a, b) => b.revenue - a.revenue).slice(0, 5),
      recentOrders: recent.map((o) => ({
        orderNumber: o.orderNumber,
        customerName: o.address.fullName,
        city: o.address.city,
        total: o.total,
        status: o.status,
        createdAt: o.createdAt,
      })),
      unresolvedMessages,
    };
  },
});
