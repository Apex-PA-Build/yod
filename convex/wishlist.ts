import { zid } from "convex-helpers/server/zod4";
import { toProductCard } from "./lib/catalog";
import { appError } from "./lib/errors";
import { authedZMutation, authedZQuery, getUser, zQuery } from "./lib/functions";

/** Product ids on the user's wishlist; empty for guests so hearts can render. */
export const ids = zQuery({
  args: {},
  handler: async (ctx) => {
    const user = await getUser(ctx);
    if (!user) return [];
    const items = await ctx.db
      .query("wishlistItems")
      .withIndex("by_user", (q) => q.eq("userId", user.id))
      .collect();
    return items.map((i) => i.productId);
  },
});

export const list = authedZQuery({
  args: {},
  handler: async (ctx) => {
    const items = await ctx.db
      .query("wishlistItems")
      .withIndex("by_user", (q) => q.eq("userId", ctx.user.id))
      .order("desc")
      .collect();
    const products = await Promise.all(items.map((i) => ctx.db.get(i.productId)));
    return products.filter((p) => p !== null && p.isActive).map((p) => toProductCard(p!));
  },
});

export const toggle = authedZMutation({
  args: { productId: zid("products") },
  handler: async (ctx, { productId }) => {
    const product = await ctx.db.get(productId);
    if (!product) appError("NOT_FOUND", "This product is no longer available.");
    const existing = await ctx.db
      .query("wishlistItems")
      .withIndex("by_user_and_product", (q) => q.eq("userId", ctx.user.id).eq("productId", productId))
      .unique();
    if (existing) {
      await ctx.db.delete(existing._id);
      return { saved: false };
    }
    await ctx.db.insert("wishlistItems", { userId: ctx.user.id, productId, createdAt: Date.now() });
    return { saved: true };
  },
});
