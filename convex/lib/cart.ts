import type { Doc } from "../_generated/dataModel";
import type { MutationCtx, QueryCtx } from "../_generated/server";
import { appError } from "./errors";
import { getUser } from "./functions";
import { MAX_CART_LINES, MAX_QTY_PER_LINE } from "../../src/shared/catalog";

export type CartItem = Doc<"carts">["items"][number];
export type Variant = Pick<CartItem, "productId" | "colourKey" | "size">;

export const sameVariant = (a: Variant, b: Variant) =>
  a.productId === b.productId && a.colourKey === b.colourKey && a.size === b.size;

export async function ownerKey(ctx: QueryCtx | MutationCtx, sessionId: string) {
  const user = await getUser(ctx);
  return user ? `user:${user.id}` : `session:${sessionId}`;
}

export async function findCart(ctx: QueryCtx | MutationCtx, key: string) {
  return await ctx.db
    .query("carts")
    .withIndex("by_owner_key", (q) => q.eq("ownerKey", key))
    .unique();
}

export async function writeItems(
  ctx: MutationCtx,
  key: string,
  cart: Doc<"carts"> | null,
  items: CartItem[],
) {
  if (items.length > MAX_CART_LINES) {
    appError("CART_FULL", `Your cart can hold up to ${MAX_CART_LINES} different items.`);
  }
  if (cart) {
    await ctx.db.patch(cart._id, { items, updatedAt: Date.now() });
  } else {
    await ctx.db.insert("carts", { ownerKey: key, items, updatedAt: Date.now() });
  }
}

/** Throws unless the product is on sale in that colour and size. */
export async function assertVariant(ctx: MutationCtx, v: Variant) {
  const product = await ctx.db.get(v.productId);
  if (!product || !product.isActive) appError("NOT_FOUND", "This product is no longer available.");
  if (!product.colours.some((c) => c.key === v.colourKey) || !product.sizes.includes(v.size)) {
    appError("INVALID_VARIANT", "That colour and size combination isn't available.");
  }
}

export function mergeLine(items: CartItem[], line: Omit<CartItem, "addedAt">): CartItem[] {
  const existing = items.find((i) => sameVariant(i, line));
  if (!existing) return [...items, { ...line, addedAt: Date.now() }];
  return items.map((i) =>
    sameVariant(i, line) ? { ...i, quantity: Math.min(MAX_QTY_PER_LINE, i.quantity + line.quantity) } : i,
  );
}
