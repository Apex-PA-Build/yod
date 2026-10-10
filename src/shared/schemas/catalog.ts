import { z } from "zod";
import { FITS, GENDERS, PRICE_RANGE_KEYS, SIZES, SORTS, TYPE_FILTERS, VIBES } from "../catalog";

export const sizeSchema = z.enum(SIZES);
export const genderSchema = z.enum(GENDERS);
export const slugSchema = z
  .string()
  .min(1)
  .max(80)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Invalid product link");
export const colourKeySchema = z
  .string()
  .min(1)
  .max(40)
  .regex(/^[a-z0-9-]+$/);

export const catalogFiltersSchema = z.object({
  gender: genderSchema.optional(),
  type: z.enum(TYPE_FILTERS).default("all"),
  colours: z.array(colourKeySchema).max(20).default([]),
  sizes: z.array(sizeSchema).max(SIZES.length).default([]),
  price: z.enum(PRICE_RANGE_KEYS).optional(),
  sort: z.enum(SORTS).default("featured"),
});
export type CatalogFilters = z.infer<typeof catalogFiltersSchema>;
export type CatalogFiltersInput = z.input<typeof catalogFiltersSchema>;

export const searchQuerySchema = z.string().trim().min(1).max(80);

export const quizAnswersSchema = z.object({
  gender: genderSchema,
  vibe: z.enum(VIBES),
  fit: z.enum(FITS),
});
export type QuizAnswers = z.infer<typeof quizAnswersSchema>;
