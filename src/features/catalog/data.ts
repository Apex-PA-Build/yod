import "server-only";
import { api } from "@convex/_generated/api";
import { fetchQuery } from "convex/nextjs";
import { cacheLife, cacheTag } from "next/cache";
import { env } from "@/env";
import { catalogFiltersSchema, type CatalogFiltersInput } from "@/shared/schemas/catalog";

/**
 * Catalog reads for Server Components. Results are cached for a few
 * minutes; carts, reviews and wishlists stay live on the client.
 */
export async function getCatalog(input: CatalogFiltersInput) {
  "use cache";
  cacheLife("minutes");
  cacheTag("products");
  const filters = catalogFiltersSchema.parse(input);
  return await fetchQuery(api.products.list, filters, { url: env.NEXT_PUBLIC_CONVEX_URL });
}

export async function searchProducts(q: string) {
  "use cache";
  cacheLife("minutes");
  cacheTag("products");
  return await fetchQuery(api.products.search, { q }, { url: env.NEXT_PUBLIC_CONVEX_URL });
}
