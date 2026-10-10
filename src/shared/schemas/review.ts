import { z } from "zod";
import { FIT_FEEDBACK, REVIEW_FILTERS } from "../catalog";
import { colourKeySchema, sizeSchema } from "./catalog";

export const reviewFormSchema = z.object({
  rating: z.number().int().min(1, "Choose a rating").max(5),
  title: z.string().trim().min(3, "Add a short title").max(80),
  body: z.string().trim().min(20, "Tell us a little more (at least 20 characters)").max(2000),
  size: sizeSchema,
  colourKey: colourKeySchema,
  fit: z.enum(FIT_FEEDBACK).optional(),
});
export type ReviewFormValues = z.infer<typeof reviewFormSchema>;

export const reviewFilterSchema = z.enum(REVIEW_FILTERS);
