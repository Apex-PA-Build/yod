import { zid } from "convex-helpers/server/zod4";
import { z } from "zod";
import { assertVariant, findCart, mergeLine, ownerKey, sameVariant, writeItems } from "./lib/cart";
import { requireUser, sessionZMutation, sessionZQuery } from "./lib/functions";
import { MAX_CART_LINES, MAX_QTY_PER_LINE } from "../src/shared/catalog";
import { addToCartSchema, cartVariantSchema } from "../src/shared/schemas/cart";

const lineSchema = { productId: zid("products"), ...cartVariantSchema.shape };

/** The current shopper's cart with live product data and totals. */
export const get = sessionZQuery({
  args: {},
  handler: async (ctx) => {
    const cart = await findCart(ctx, await ownerKey(ctx, ctx.sessionId));
    const items = cart?.items ?? [];

    const lines = (
      await Promise.all(
        items.map(async (item) => {
          const product = await ctx.db.get(item.productId);
          const colour = product?.colours.find((c) => c.key === item.colourKey);
          if (!product || !product.isActive || !colour) return null;
          return {
            key: `${item.productId}:${item.colourKey}:${item.size}`,
            productId: item.productId,
            slug: product.slug,
            name: product.name,
            colour,
            size: item.size,
            quantity: item.quantity,
            unitPrice: product.price,
            lineTotal: product.price * item.quantity,
          };
        }),
      )
    ).filter((l) => l !== null);

    return {
      lines,
      itemCount: lines.reduce((n, l) => n + l.quantity, 0),
      subtotal: lines.reduce((n, l) => n + l.lineTotal, 0),
    };
  },
});

export const add = sessionZMutation({
  args: { productId: zid("products"), ...addToCartSchema.shape },
  handler: async (ctx, line) => {
    await assertVariant(ctx, line);
    const key = await ownerKey(ctx, ctx.sessionId);
    const cart = await findCart(ctx, key);
    await writeItems(ctx, key, cart, mergeLine(cart?.items ?? [], line));
  },
});

/** Adds several lines at once, e.g. a "frequently bought together" bundle. */
export const addMany = sessionZMutation({
  args: {
    lines: z
      .array(z.object({ productId: zid("products"), ...addToCartSchema.shape }))
      .min(1)
      .max(4),
  },
  handler: async (ctx, { lines }) => {
    for (const line of lines) await assertVariant(ctx, line);
    const key = await ownerKey(ctx, ctx.sessionId);
    const cart = await findCart(ctx, key);
    const items = lines.reduce(mergeLine, cart?.items ?? []);
    await writeItems(ctx, key, cart, items);
  },
});

export const setQuantity = sessionZMutation({
  args: {
    ...lineSchema,
    quantity: z.number().int().min(0).max(MAX_QTY_PER_LINE),
  },
  handler: async (ctx, { quantity, ...variant }) => {
    const key = await ownerKey(ctx, ctx.sessionId);
    const cart = await findCart(ctx, key);
    if (!cart) return;
    const items =
      quantity === 0
        ? cart.items.filter((i) => !sameVariant(i, variant))
        : cart.items.map((i) => (sameVariant(i, variant) ? { ...i, quantity } : i));
    await writeItems(ctx, key, cart, items);
  },
});

export const remove = sessionZMutation({
  args: lineSchema,
  handler: async (ctx, variant) => {
    const key = await ownerKey(ctx, ctx.sessionId);
    const cart = await findCart(ctx, key);
    if (!cart) return;
    await writeItems(
      ctx,
      key,
      cart,
      cart.items.filter((i) => !sameVariant(i, variant)),
    );
  },
});

/** Moves a guest cart into the signed-in user's cart after they sign in. */
export const mergeGuestCart = sessionZMutation({
  args: {},
  handler: async (ctx) => {
    const user = await requireUser(ctx);
    const guest = await findCart(ctx, `session:${ctx.sessionId}`);
    if (!guest || guest.items.length === 0) return;
    const key = `user:${user.id}`;
    const cart = await findCart(ctx, key);
    const items = guest.items.reduce(mergeLine, cart?.items ?? []).slice(0, MAX_CART_LINES);
    await writeItems(ctx, key, cart, items);
    await ctx.db.delete(guest._id);
  },
});
