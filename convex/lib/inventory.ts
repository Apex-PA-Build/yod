import type { Doc, Id } from "../_generated/dataModel";
import type { MutationCtx, QueryCtx } from "../_generated/server";
import { appError } from "./errors";
import { DEFAULT_LOW_STOCK, type StockReason } from "../../src/shared/inventory";
import type { Size } from "../../src/shared/catalog";

export type StockVariant = { productId: Id<"products">; colourKey: string; size: Size };

export async function findStock(ctx: QueryCtx | MutationCtx, v: StockVariant) {
  return await ctx.db
    .query("inventory")
    .withIndex("by_variant", (q) =>
      q.eq("productId", v.productId).eq("colourKey", v.colourKey).eq("size", v.size),
    )
    .unique();
}

/** Units available to sell. Variants that were never stocked have none. */
export async function availableUnits(ctx: QueryCtx | MutationCtx, v: StockVariant) {
  return (await findStock(ctx, v))?.onHand ?? 0;
}

type Movement = {
  reason: StockReason;
  orderId?: Id<"orders">;
  importId?: Id<"stockImports">;
  note?: string;
  actorEmail?: string;
};

/**
 * Changes stock for one variant and records the movement. Refuses to go
 * below zero so oversells surface as errors instead of negative stock.
 */
export async function changeStock(
  ctx: MutationCtx,
  variant: StockVariant,
  delta: number,
  movement: Movement,
): Promise<Doc<"inventory">> {
  const now = Date.now();
  // Callers pass cart or order rows; keep only the variant fields.
  const v = { productId: variant.productId, colourKey: variant.colourKey, size: variant.size };
  const row = await findStock(ctx, v);
  const balance = (row?.onHand ?? 0) + delta;
  if (balance < 0) {
    appError("OUT_OF_STOCK", "There isn't enough stock for that change.");
  }

  let id: Id<"inventory">;
  if (row) {
    await ctx.db.patch(row._id, { onHand: balance, updatedAt: now });
    id = row._id;
  } else {
    id = await ctx.db.insert("inventory", {
      ...v,
      onHand: balance,
      lowStockThreshold: DEFAULT_LOW_STOCK,
      updatedAt: now,
    });
  }

  if (delta !== 0) {
    await ctx.db.insert("stockMovements", {
      ...v,
      delta,
      balanceAfter: balance,
      ...movement,
      createdAt: now,
    });
  }
  return (await ctx.db.get(id))!;
}
