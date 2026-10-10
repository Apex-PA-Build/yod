import type { api } from "@convex/_generated/api";
import type { FunctionReturnType } from "convex/server";

export type ProductCardData = FunctionReturnType<typeof api.products.trending>[number];
export type CatalogResult = FunctionReturnType<typeof api.products.list>;
