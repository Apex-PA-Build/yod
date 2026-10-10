import { z } from "zod";
import { MAX_QTY_PER_LINE } from "../catalog";
import { colourKeySchema, sizeSchema } from "./catalog";

export const quantitySchema = z
  .number()
  .int()
  .min(1, "Quantity must be at least 1")
  .max(MAX_QTY_PER_LINE, `You can add up to ${MAX_QTY_PER_LINE} of each item`);

/** A product variant in the cart, without the product id (validated per layer). */
export const cartVariantSchema = z.object({
  colourKey: colourKeySchema,
  size: sizeSchema,
});

export const addToCartSchema = cartVariantSchema.extend({
  quantity: quantitySchema,
});
export type AddToCartInput = z.infer<typeof addToCartSchema>;
