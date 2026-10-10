import { paginationOptsValidator } from "convex/server";
import { z } from "zod";
import { zid } from "convex-helpers/server/zod4";
import { appError } from "../lib/errors";
import { adminQuery, adminZMutation, adminZQuery } from "../lib/functions";
import { changeStock } from "../lib/inventory";
import { MAX_IMPORT_LINES, stockImportLineSchema, stockImportSchema } from "../../src/shared/schemas/admin";

/** Records a batch of stock received from a supplier and adds it to inventory. */
export const create = adminZMutation({
  args: {
    ...stockImportSchema.shape,
    lines: z
      .array(stockImportLineSchema.extend({ productId: zid("products") }))
      .min(1, "Add at least one line")
      .max(MAX_IMPORT_LINES),
  },
  handler: async (ctx, { lines, ...batch }) => {
    const duplicate = await ctx.db
      .query("stockImports")
      .withIndex("by_reference", (q) => q.eq("reference", batch.reference))
      .first();
    if (duplicate) appError("CONFLICT", `An import with reference ${batch.reference} already exists.`);

    const seen = new Set<string>();
    const resolved = await Promise.all(
      lines.map(async (line) => {
        const key = `${line.productId}:${line.colourKey}:${line.size}`;
        if (seen.has(key))
          appError("BAD_REQUEST", "The same colour and size is listed twice. Combine those lines.");
        seen.add(key);
        const product = await ctx.db.get(line.productId);
        const colour = product?.colours.find((c) => c.key === line.colourKey);
        if (!product || !colour || !product.sizes.includes(line.size)) {
          appError("INVALID_VARIANT", "One of the lines has a colour or size the product doesn't have.");
        }
        return { ...line, productName: product.name, colourName: colour.name };
      }),
    );

    const importId = await ctx.db.insert("stockImports", {
      ...batch,
      lines: resolved,
      totalUnits: resolved.reduce((n, l) => n + l.quantity, 0),
      totalCost: resolved.reduce((n, l) => n + l.quantity * l.unitCost, 0),
      createdBy: ctx.admin.email,
      createdAt: Date.now(),
    });

    for (const line of resolved) {
      await changeStock(ctx, line, line.quantity, {
        reason: "import",
        importId,
        note: `${batch.supplier} · ${batch.reference}`,
        actorEmail: ctx.admin.email,
      });
    }
    return { importId };
  },
});

export const list = adminQuery({
  args: { paginationOpts: paginationOptsValidator },
  handler: async (ctx, { paginationOpts }) => {
    const page = await ctx.db
      .query("stockImports")
      .withIndex("by_received_at")
      .order("desc")
      .paginate(paginationOpts);
    return {
      ...page,
      page: page.page.map((i) => ({
        id: i._id,
        reference: i.reference,
        supplier: i.supplier,
        receivedAt: i.receivedAt,
        totalUnits: i.totalUnits,
        totalCost: i.totalCost,
        lineCount: i.lines.length,
        createdBy: i.createdBy,
      })),
    };
  },
});

export const get = adminZQuery({
  args: { importId: zid("stockImports") },
  handler: async (ctx, { importId }) => {
    const batch = await ctx.db.get(importId);
    if (!batch) return null;
    return {
      id: batch._id,
      reference: batch.reference,
      supplier: batch.supplier,
      note: batch.note ?? null,
      receivedAt: batch.receivedAt,
      totalUnits: batch.totalUnits,
      totalCost: batch.totalCost,
      createdBy: batch.createdBy,
      createdAt: batch.createdAt,
      lines: batch.lines,
    };
  },
});
