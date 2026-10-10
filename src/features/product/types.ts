import type { api } from "@convex/_generated/api";
import type { FunctionReturnType } from "convex/server";

export type ProductPageData = NonNullable<FunctionReturnType<typeof api.products.getBySlug>>;
export type ProductData = ProductPageData["product"];
export type RatingSummary = ProductPageData["rating"];
