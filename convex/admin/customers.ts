import { z } from "zod";
import { adminZQuery } from "../lib/functions";
import { emailSchema } from "../../src/shared/schemas/checkout";

/** How far back the customer list looks. Raise or switch to an aggregate as the store grows. */
const MAX_ORDERS_SCANNED = 5000;

/** Customers built from orders (guests included), biggest spenders first. */
export const list = adminZQuery({
  args: { q: z.string().trim().max(254).optional() },
  handler: async (ctx, { q }) => {
    const orders = await ctx.db
      .query("orders")
      .withIndex("by_created_at")
      .order("desc")
      .take(MAX_ORDERS_SCANNED);
    const customers = new Map<
      string,
      {
        email: string;
        name: string;
        phone: string;
        city: string;
        state: string;
        orders: number;
        spend: number;
        cancelled: number;
        hasAccount: boolean;
        firstOrderAt: number;
        lastOrderAt: number;
      }
    >();
    for (const o of orders) {
      const c = customers.get(o.email);
      const counted = o.status !== "cancelled";
      if (!c) {
        customers.set(o.email, {
          email: o.email,
          name: o.address.fullName,
          phone: o.address.phone,
          city: o.address.city,
          state: o.address.state,
          orders: 1,
          spend: counted ? o.total : 0,
          cancelled: counted ? 0 : 1,
          hasAccount: o.userId !== undefined,
          firstOrderAt: o.createdAt,
          lastOrderAt: o.createdAt,
        });
      } else {
        c.orders += 1;
        c.spend += counted ? o.total : 0;
        c.cancelled += counted ? 0 : 1;
        c.hasAccount ||= o.userId !== undefined;
        c.firstOrderAt = Math.min(c.firstOrderAt, o.createdAt);
      }
    }
    const needle = q?.toLowerCase();
    return [...customers.values()]
      .filter(
        (c) =>
          !needle ||
          c.email.includes(needle) ||
          c.name.toLowerCase().includes(needle) ||
          c.phone.includes(needle),
      )
      .sort((a, b) => b.spend - a.spend);
  },
});

export const get = adminZQuery({
  args: { email: emailSchema },
  handler: async (ctx, { email }) => {
    const orders = await ctx.db
      .query("orders")
      .withIndex("by_email", (q) => q.eq("email", email))
      .order("desc")
      .collect();
    if (orders.length === 0) return null;
    const latest = orders[0]!;
    const userId = orders.find((o) => o.userId !== undefined)?.userId;
    const reviews = userId
      ? await ctx.db
          .query("reviews")
          .withIndex("by_user_and_product", (q) => q.eq("userId", userId))
          .collect()
      : [];
    return {
      email,
      name: latest.address.fullName,
      phone: latest.address.phone,
      address: latest.address,
      hasAccount: orders.some((o) => o.userId !== undefined),
      spend: orders.filter((o) => o.status !== "cancelled").reduce((n, o) => n + o.total, 0),
      orders: orders.map((o) => ({
        orderNumber: o.orderNumber,
        status: o.status,
        total: o.total,
        createdAt: o.createdAt,
        city: o.address.city,
      })),
      reviewCount: reviews.length,
    };
  },
});
