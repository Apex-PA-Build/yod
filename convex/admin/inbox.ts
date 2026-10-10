import { paginationOptsValidator } from "convex/server";
import { zid } from "convex-helpers/server/zod4";
import { z } from "zod";
import { adminQuery, adminZMutation, adminZQuery } from "../lib/functions";

export const messages = adminQuery({
  args: { paginationOpts: paginationOptsValidator },
  handler: async (ctx, { paginationOpts }) => {
    const page = await ctx.db
      .query("contactMessages")
      .withIndex("by_created_at")
      .order("desc")
      .paginate(paginationOpts);
    return {
      ...page,
      page: page.page.map((m) => ({
        id: m._id,
        name: m.name,
        email: m.email,
        topic: m.topic,
        orderNumber: m.orderNumber ?? null,
        message: m.message,
        resolvedAt: m.resolvedAt ?? null,
        createdAt: m.createdAt,
      })),
    };
  },
});

export const unresolvedCount = adminZQuery({
  args: {},
  handler: async (ctx) => {
    const recent = await ctx.db.query("contactMessages").withIndex("by_created_at").order("desc").take(500);
    return recent.filter((m) => m.resolvedAt === undefined).length;
  },
});

export const setResolved = adminZMutation({
  args: { messageId: zid("contactMessages"), resolved: z.boolean() },
  handler: async (ctx, { messageId, resolved }) => {
    await ctx.db.patch(messageId, { resolvedAt: resolved ? Date.now() : undefined });
  },
});

export const subscribers = adminQuery({
  args: { paginationOpts: paginationOptsValidator },
  handler: async (ctx, { paginationOpts }) => {
    const page = await ctx.db
      .query("newsletterSubscribers")
      .withIndex("by_created_at")
      .order("desc")
      .paginate(paginationOpts);
    return {
      ...page,
      page: page.page.map((s) => ({ id: s._id, email: s.email, source: s.source, createdAt: s.createdAt })),
    };
  },
});
