import { paginationOptsValidator } from "convex/server";
import { v } from "convex/values";
import { zid } from "convex-helpers/server/zod4";
import type { Doc, Id } from "../_generated/dataModel";
import type { QueryCtx } from "../_generated/server";
import { appError } from "../lib/errors";
import { adminQuery, adminZMutation, adminZQuery } from "../lib/functions";
import { changeStock, findStock } from "../lib/inventory";
import { variantKey } from "../../src/shared/inventory";
import {
  lowStockThresholdSchema,
  stockAdjustSchema,
  stockVariantSchema,
} from "../../src/shared/schemas/admin";

const DAY = 24 * 60 * 60 * 1000;

/**
 * Stock for every colour and size of every product, with units sold in the
 * last 30 days so staff can see what's running out.
 */
export const overview = adminZQuery({
  args: {},
  handler: async (ctx) => {
    const [products, stock, recentSales] = await Promise.all([
      ctx.db.query("products").collect(),
      ctx.db.query("inventory").collect(),
      ctx.db
        .query("orderItems")
        .withIndex("by_created_at", (q) => q.gte("createdAt", Date.now() - 30 * DAY))
        .collect(),
    ]);

    const byVariant = new Map(stock.map((s) => [variantKey(s), s]));
    const sold = new Map<string, number>();
    for (const item of recentSales) {
      const key = variantKey(item);
      sold.set(key, (sold.get(key) ?? 0) + item.quantity);
    }

    return products
      .sort((a, b) => a.featuredRank - b.featuredRank)
      .map((p) => {
        const variants = p.colours.flatMap((c) =>
          p.sizes.map((size) => {
            const key = variantKey({ productId: p._id, colourKey: c.key, size });
            const row = byVariant.get(key);
            const onHand = row?.onHand ?? 0;
            const threshold = row?.lowStockThreshold ?? 0;
            return {
              key,
              colourKey: c.key,
              colourName: c.name,
              swatch: c.swatch,
              size,
              onHand,
              lowStockThreshold: row?.lowStockThreshold ?? null,
              sold30d: sold.get(key) ?? 0,
              status:
                onHand === 0 ? ("out" as const) : onHand <= threshold ? ("low" as const) : ("ok" as const),
            };
          }),
        );
        return {
          id: p._id,
          name: p.name,
          slug: p.slug,
          isActive: p.isActive,
          image: p.colours[0]?.image ?? null,
          totalOnHand: variants.reduce((n, v) => n + v.onHand, 0),
          lowCount: variants.filter((v) => v.status === "low").length,
          outCount: variants.filter((v) => v.status === "out").length,
          variants,
        };
      });
  },
});

async function productOr404(ctx: Pick<QueryCtx, "db">, id: Id<"products">) {
  const product = await ctx.db.get(id);
  if (!product) appError("NOT_FOUND", "Product not found.");
  return product;
}

/** Add, remove or set stock by hand, with a reason that shows in the history. */
export const adjust = adminZMutation({
  args: { productId: zid("products"), ...stockAdjustSchema.shape },
  handler: async (ctx, { productId, colourKey, size, mode, quantity, reason, note }) => {
    const product = await productOr404(ctx, productId);
    if (!product.colours.some((c) => c.key === colourKey) || !product.sizes.includes(size)) {
      appError("INVALID_VARIANT", "That colour and size isn't part of this product.");
    }
    const variant = { productId, colourKey, size };
    const current = (await findStock(ctx, variant))?.onHand ?? 0;
    const delta = mode === "add" ? quantity : mode === "remove" ? -quantity : quantity - current;
    if (delta === 0) return { onHand: current };
    const row = await changeStock(ctx, variant, delta, { reason, note, actorEmail: ctx.admin.email });
    return { onHand: row.onHand };
  },
});

export const setThreshold = adminZMutation({
  args: { productId: zid("products"), ...stockVariantSchema.shape, threshold: lowStockThresholdSchema },
  handler: async (ctx, { productId, colourKey, size, threshold }) => {
    await productOr404(ctx, productId);
    const variant = { productId, colourKey, size };
    const row =
      (await findStock(ctx, variant)) ?? (await changeStock(ctx, variant, 0, { reason: "recount" }));
    await ctx.db.patch(row._id, { lowStockThreshold: threshold, updatedAt: Date.now() });
  },
});

/** Stock history, newest first, optionally for one product. */
export const movements = adminQuery({
  args: { productId: v.optional(v.id("products")), paginationOpts: paginationOptsValidator },
  handler: async (ctx, { productId, paginationOpts }) => {
    const page = await (
      productId
        ? ctx.db
            .query("stockMovements")
            .withIndex("by_product_and_created_at", (q) => q.eq("productId", productId))
        : ctx.db.query("stockMovements").withIndex("by_created_at")
    )
      .order("desc")
      .paginate(paginationOpts);

    const names = new Map<string, Doc<"products"> | null>();
    const rows = await Promise.all(
      page.page.map(async (m) => {
        if (!names.has(m.productId)) names.set(m.productId, await ctx.db.get(m.productId));
        const product = names.get(m.productId);
        const order = m.orderId ? await ctx.db.get(m.orderId) : null;
        const batch = m.importId ? await ctx.db.get(m.importId) : null;
        return {
          id: m._id,
          productId: m.productId,
          productName: product?.name ?? "Deleted product",
          colourName: product?.colours.find((c) => c.key === m.colourKey)?.name ?? m.colourKey,
          size: m.size,
          delta: m.delta,
          balanceAfter: m.balanceAfter,
          reason: m.reason,
          note: m.note ?? null,
          orderNumber: order?.orderNumber ?? null,
          importId: m.importId ?? null,
          importReference: batch?.reference ?? null,
          actorEmail: m.actorEmail ?? null,
          createdAt: m.createdAt,
        };
      }),
    );
    return { ...page, page: rows };
  },
});
