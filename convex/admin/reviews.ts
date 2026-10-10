import { paginationOptsValidator } from "convex/server";
import { zid } from "convex-helpers/server/zod4";
import { z } from "zod";
import { adminQuery, adminZMutation } from "../lib/functions";

export const list = adminQuery({
  args: { paginationOpts: paginationOptsValidator },
  handler: async (ctx, { paginationOpts }) => {
    const page = await ctx.db
      .query("reviews")
      .withIndex("by_created_at")
      .order("desc")
      .paginate(paginationOpts);
    return {
      ...page,
      page: await Promise.all(
        page.page.map(async (r) => {
          const product = await ctx.db.get(r.productId);
          const photoUrls = (await Promise.all(r.photoIds.map((id) => ctx.storage.getUrl(id)))).filter(
            (u): u is string => u !== null,
          );
          return {
            id: r._id,
            productName: product?.name ?? "Deleted product",
            productSlug: product?.slug ?? null,
            rating: r.rating,
            title: r.title,
            body: r.body,
            authorName: r.authorName,
            size: r.size,
            colourName: r.colourName,
            fit: r.fit ?? null,
            verifiedBuyer: r.verifiedBuyer,
            hidden: r.hidden ?? false,
            photoUrls,
            createdAt: r.createdAt,
          };
        }),
      ),
    };
  },
});

export const setHidden = adminZMutation({
  args: { reviewId: zid("reviews"), hidden: z.boolean() },
  handler: async (ctx, { reviewId, hidden }) => {
    await ctx.db.patch(reviewId, { hidden });
  },
});

export const remove = adminZMutation({
  args: { reviewId: zid("reviews") },
  handler: async (ctx, { reviewId }) => {
    const review = await ctx.db.get(reviewId);
    if (!review) return;
    for (const id of review.photoIds) await ctx.storage.delete(id);
    await ctx.db.delete(reviewId);
  },
});
