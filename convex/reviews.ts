import { paginationOptsValidator } from "convex/server";
import { zid } from "convex-helpers/server/zod4";
import type { Doc } from "./_generated/dataModel";
import { query, type QueryCtx } from "./_generated/server";
import { appError } from "./lib/errors";
import { authedZMutation, getUser, zQuery } from "./lib/functions";
import { summariseReviews } from "./lib/reviews";
import { v } from "convex/values";
import { z } from "zod";
import { MAX_REVIEW_PHOTOS } from "../src/shared/catalog";
import { reviewFilterSchema, reviewFormSchema } from "../src/shared/schemas/review";

export const summary = zQuery({
  args: { productId: zid("products") },
  handler: async (ctx, { productId }) => {
    const reviews = await ctx.db
      .query("reviews")
      .withIndex("by_product", (q) => q.eq("productId", productId))
      .collect();
    return summariseReviews(reviews.filter((r) => !r.hidden));
  },
});

async function toPublicReview(ctx: QueryCtx, r: Doc<"reviews">) {
  const photoUrls = (await Promise.all(r.photoIds.map((id) => ctx.storage.getUrl(id)))).filter(
    (u): u is string => u !== null,
  );
  return {
    id: r._id,
    rating: r.rating,
    title: r.title,
    body: r.body,
    authorName: r.authorName,
    size: r.size,
    colourName: r.colourName,
    fit: r.fit ?? null,
    verifiedBuyer: r.verifiedBuyer,
    photoUrls,
    createdAt: r.createdAt,
  };
}

/**
 * Paginated reviews, newest first. Uses a plain `query` because Convex's
 * pagination validator isn't a Zod schema; the filter is still parsed with Zod.
 */
export const list = query({
  args: {
    productId: v.id("products"),
    filter: v.string(),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    const filter = reviewFilterSchema.parse(args.filter);
    const base =
      filter === "five-star"
        ? ctx.db
            .query("reviews")
            .withIndex("by_product_and_rating", (q) => q.eq("productId", args.productId).eq("rating", 5))
        : filter === "with-photos"
          ? ctx.db
              .query("reviews")
              .withIndex("by_product_and_has_photos", (q) =>
                q.eq("productId", args.productId).eq("hasPhotos", true),
              )
          : ctx.db.query("reviews").withIndex("by_product", (q) => q.eq("productId", args.productId));

    const ordered = base.order("desc");
    const page = await (
      filter === "fit" ? ordered.filter((q) => q.neq(q.field("fit"), undefined)) : ordered
    ).paginate(args.paginationOpts);

    return {
      ...page,
      page: await Promise.all(page.page.map((r) => toPublicReview(ctx, r))),
    };
  },
});

/** Whether the signed-in user may review this product (and already has). */
export const myStatus = zQuery({
  args: { productId: zid("products") },
  handler: async (ctx, { productId }) => {
    const user = await getUser(ctx);
    if (!user) return { signedIn: false as const };
    const existing = await ctx.db
      .query("reviews")
      .withIndex("by_user_and_product", (q) => q.eq("userId", user.id).eq("productId", productId))
      .first();
    return { signedIn: true as const, hasReviewed: existing !== null };
  },
});

export const generateUploadUrl = authedZMutation({
  args: {},
  handler: async (ctx) => await ctx.storage.generateUploadUrl(),
});

export const create = authedZMutation({
  args: {
    productId: zid("products"),
    ...reviewFormSchema.shape,
    photoIds: z.array(zid("_storage")).max(MAX_REVIEW_PHOTOS),
  },
  handler: async (ctx, { productId, photoIds, ...form }) => {
    const product = await ctx.db.get(productId);
    if (!product || !product.isActive) appError("NOT_FOUND", "This product is no longer available.");
    const colour = product.colours.find((c) => c.key === form.colourKey);
    if (!colour || !product.sizes.includes(form.size)) {
      appError("INVALID_VARIANT", "Choose the colour and size you bought.");
    }

    const existing = await ctx.db
      .query("reviews")
      .withIndex("by_user_and_product", (q) => q.eq("userId", ctx.user.id).eq("productId", productId))
      .first();
    if (existing) appError("ALREADY_REVIEWED", "You've already reviewed this tee.");

    const purchase = await ctx.db
      .query("orderItems")
      .withIndex("by_user_and_product", (q) => q.eq("userId", ctx.user.id).eq("productId", productId))
      .first();

    await ctx.db.insert("reviews", {
      productId,
      userId: ctx.user.id,
      authorName: ctx.user.name,
      rating: form.rating,
      title: form.title,
      body: form.body,
      size: form.size,
      colourKey: colour.key,
      colourName: colour.name,
      fit: form.fit,
      photoIds,
      hasPhotos: photoIds.length > 0,
      verifiedBuyer: purchase !== null,
      createdAt: Date.now(),
    });
  },
});
