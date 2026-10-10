import { zid } from "convex-helpers/server/zod4";
import { z } from "zod";
import type { Doc, Id } from "../_generated/dataModel";
import type { MutationCtx } from "../_generated/server";
import { buildSearchText } from "../lib/catalog";
import { appError } from "../lib/errors";
import { adminZMutation, adminZQuery } from "../lib/functions";
import { changeStock, findStock } from "../lib/inventory";
import { productFormSchema, type ProductFormValues } from "../../src/shared/schemas/admin";

const DAY = 24 * 60 * 60 * 1000;

export const list = adminZQuery({
  args: {},
  handler: async (ctx) => {
    const [products, stock, sales] = await Promise.all([
      ctx.db.query("products").collect(),
      ctx.db.query("inventory").collect(),
      ctx.db
        .query("orderItems")
        .withIndex("by_created_at", (q) => q.gte("createdAt", Date.now() - 30 * DAY))
        .collect(),
    ]);
    return products
      .sort((a, b) => a.featuredRank - b.featuredRank)
      .map((p) => ({
        id: p._id,
        name: p.name,
        slug: p.slug,
        type: p.type,
        tag: p.tag ?? null,
        price: p.price,
        isActive: p.isActive,
        featuredRank: p.featuredRank,
        image: p.colours[0]?.image ?? null,
        colourCount: p.colours.length,
        colours: p.colours.map((c) => ({ key: c.key, name: c.name, swatch: c.swatch })),
        onHand: stock.filter((s) => s.productId === p._id).reduce((n, s) => n + s.onHand, 0),
        sold30d: sales.filter((s) => s.productId === p._id).reduce((n, s) => n + s.quantity, 0),
      }));
  },
});

export const get = adminZQuery({
  args: { productId: zid("products") },
  handler: async (ctx, { productId }) => {
    const p = await ctx.db.get(productId);
    if (!p) return null;
    return {
      id: p._id,
      createdAt: p._creationTime,
      releasedAt: p.releasedAt,
      pairedProductId: p.pairedProductId ?? null,
      form: {
        name: p.name,
        slug: p.slug,
        tagline: p.tagline,
        description: p.description,
        type: p.type,
        tag: p.tag,
        vibe: p.vibe,
        genders: p.genders,
        price: p.price,
        sizes: p.sizes,
        colours: p.colours,
        measurements: p.measurements,
        featuredRank: p.featuredRank,
        isActive: p.isActive,
      },
    };
  },
});

async function assertSlugFree(ctx: MutationCtx, slug: string, except?: Id<"products">) {
  const clash = await ctx.db
    .query("products")
    .withIndex("by_slug", (q) => q.eq("slug", slug))
    .unique();
  if (clash && clash._id !== except) appError("CONFLICT", `Another product already uses the link /${slug}.`);
}

/** Makes sure every colour and size has a stock row, so it shows in inventory at 0. */
async function ensureStockRows(ctx: MutationCtx, productId: Id<"products">, form: ProductFormValues) {
  for (const c of form.colours) {
    for (const size of form.sizes) {
      const variant = { productId, colourKey: c.key, size };
      if (!(await findStock(ctx, variant))) await changeStock(ctx, variant, 0, { reason: "recount" });
    }
  }
}

function toDoc(form: ProductFormValues): Omit<Doc<"products">, "_id" | "_creationTime" | "releasedAt"> {
  return { ...form, searchText: buildSearchText(form) };
}

export const create = adminZMutation({
  args: { form: productFormSchema },
  handler: async (ctx, { form }) => {
    await assertSlugFree(ctx, form.slug);
    const productId = await ctx.db.insert("products", { ...toDoc(form), releasedAt: Date.now() });
    await ensureStockRows(ctx, productId, form);
    return { productId };
  },
});

export const update = adminZMutation({
  args: { productId: zid("products"), form: productFormSchema },
  handler: async (ctx, { productId, form }) => {
    const existing = await ctx.db.get(productId);
    if (!existing) appError("NOT_FOUND", "Product not found.");
    await assertSlugFree(ctx, form.slug, productId);
    await ctx.db.patch(productId, {
      ...toDoc(form),
      // Patching with undefined removes optional fields that were cleared in the form.
      tag: form.tag,
      measurements: form.measurements,
    });
    await ensureStockRows(ctx, productId, form);
  },
});

export const setActive = adminZMutation({
  args: { productId: zid("products"), isActive: z.boolean() },
  handler: async (ctx, { productId, isActive }) => {
    if (!(await ctx.db.get(productId))) appError("NOT_FOUND", "Product not found.");
    await ctx.db.patch(productId, { isActive });
  },
});

export const setPaired = adminZMutation({
  args: { productId: zid("products"), pairedProductId: zid("products").nullable() },
  handler: async (ctx, { productId, pairedProductId }) => {
    if (pairedProductId === productId) appError("BAD_REQUEST", "A product can't be paired with itself.");
    await ctx.db.patch(productId, { pairedProductId: pairedProductId ?? undefined });
  },
});

/** Product photo uploads go to Convex storage; the returned URL is saved on the colour. */
export const generateImageUploadUrl = adminZMutation({
  args: {},
  handler: async (ctx) => await ctx.storage.generateUploadUrl(),
});

export const imageUrl = adminZMutation({
  args: { storageId: zid("_storage") },
  handler: async (ctx, { storageId }) => {
    const url = await ctx.storage.getUrl(storageId);
    if (!url) appError("NOT_FOUND", "Upload not found.");
    return url;
  },
});
