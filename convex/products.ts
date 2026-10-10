import { zid } from "convex-helpers/server/zod4";
import { z } from "zod";
import { SHOW_STOCK_LEFT_AT } from "../src/shared/inventory";
import type { Doc } from "./_generated/dataModel";
import type { QueryCtx } from "./_generated/server";
import { colourFacets, filterCatalog, toProductCard } from "./lib/catalog";
import { zQuery } from "./lib/functions";
import { summariseReviews } from "./lib/reviews";
import {
  catalogFiltersSchema,
  genderSchema,
  searchQuerySchema,
  slugSchema,
} from "../src/shared/schemas/catalog";
import { VIBES } from "../src/shared/catalog";

const DAY = 24 * 60 * 60 * 1000;

async function activeProducts(ctx: QueryCtx): Promise<Doc<"products">[]> {
  return await ctx.db
    .query("products")
    .withIndex("by_active_and_featured_rank", (q) => q.eq("isActive", true))
    .collect();
}

/** Products for the "Trending Now" row on the home page. */
export const trending = zQuery({
  args: { limit: z.number().int().min(1).max(12).default(4) },
  handler: async (ctx, { limit }) => {
    const products = await ctx.db
      .query("products")
      .withIndex("by_active_and_featured_rank", (q) => q.eq("isActive", true))
      .take(limit);
    return products.map(toProductCard);
  },
});

/** Category and shop listings with filters, facets and sort. */
export const list = zQuery({
  args: catalogFiltersSchema.shape,
  handler: async (ctx, filters) => {
    const all = await activeProducts(ctx);
    const inGender = filters.gender ? all.filter((p) => p.genders.includes(filters.gender!)) : all;
    const { results, typeCounts, total } = filterCatalog(all, filters);
    return {
      products: results.map(toProductCard),
      typeCounts,
      total,
      colours: colourFacets(inGender),
    };
  },
});

export const search = zQuery({
  args: { q: searchQuerySchema },
  handler: async (ctx, { q }) => {
    const products = await ctx.db
      .query("products")
      .withSearchIndex("search_text", (s) => s.search("searchText", q).eq("isActive", true))
      .take(24);
    return products.map(toProductCard);
  },
});

/** Everything the product page needs in one round trip. */
export const getBySlug = zQuery({
  args: { slug: slugSchema },
  handler: async (ctx, { slug }) => {
    const product = await ctx.db
      .query("products")
      .withIndex("by_slug", (q) => q.eq("slug", slug))
      .unique();
    if (!product || !product.isActive) return null;

    const reviews = (
      await ctx.db
        .query("reviews")
        .withIndex("by_product", (q) => q.eq("productId", product._id))
        .collect()
    ).filter((r) => !r.hidden);
    const rating = summariseReviews(reviews);

    const stockRows = await ctx.db
      .query("inventory")
      .withIndex("by_product", (q) => q.eq("productId", product._id))
      .collect();
    // Exact counts are only shown when low, so stock levels stay private.
    const stock = stockRows.map((r) => ({
      colourKey: r.colourKey,
      size: r.size,
      left: r.onHand > SHOW_STOCK_LEFT_AT ? null : r.onHand,
    }));

    const featuredReview =
      reviews.filter((r) => r.rating === 5).sort((a, b) => b.createdAt - a.createdAt)[0] ?? null;

    const since = Date.now() - 30 * DAY;
    const recentLines = await ctx.db
      .query("orderItems")
      .withIndex("by_product_and_created_at", (q) => q.eq("productId", product._id).gte("createdAt", since))
      .collect();
    const recentBuyers = new Set(recentLines.map((l) => l.orderId)).size;

    const paired = product.pairedProductId ? await ctx.db.get(product.pairedProductId) : null;

    return {
      product: {
        id: product._id,
        slug: product.slug,
        name: product.name,
        tagline: product.tagline,
        description: product.description,
        type: product.type,
        tag: product.tag,
        genders: product.genders,
        price: product.price,
        colours: product.colours,
        sizes: product.sizes,
        measurements: product.measurements ?? null,
      },
      rating,
      featuredReview: featuredReview && {
        title: featuredReview.title,
        body: featuredReview.body,
        authorName: featuredReview.authorName,
        size: featuredReview.size,
        verifiedBuyer: featuredReview.verifiedBuyer,
      },
      recentBuyers,
      stock,
      pairedProduct: paired && paired.isActive ? toProductCard(paired) : null,
    };
  },
});

/** Other products to show under "Complete the drop". */
export const related = zQuery({
  args: { productId: zid("products"), limit: z.number().int().min(1).max(8).default(4) },
  handler: async (ctx, { productId, limit }) => {
    const all = await activeProducts(ctx);
    return all
      .filter((p) => p._id !== productId)
      .slice(0, limit)
      .map(toProductCard);
  },
});

/** Picks a product for the "Find your perfect tee" quiz. */
export const quizMatch = zQuery({
  args: { gender: genderSchema, vibe: z.enum(VIBES) },
  handler: async (ctx, { gender, vibe }) => {
    const all = await activeProducts(ctx);
    const forGender = all.filter((p) => p.genders.includes(gender));
    const match = forGender.find((p) => p.vibe === vibe) ?? forGender[0] ?? null;
    return match ? toProductCard(match) : null;
  },
});

/** Slugs for static generation and the sitemap. */
export const slugs = zQuery({
  args: {},
  handler: async (ctx) => {
    const all = await activeProducts(ctx);
    return all.map((p) => ({ slug: p.slug, updatedAt: p._creationTime }));
  },
});
