import "server-only";
import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";
import { fetchQuery } from "convex/nextjs";
import { cacheLife, cacheTag } from "next/cache";
import { env } from "@/env";

/** The product page payload, cached for a few minutes per slug. */
export async function getProductPage(slug: string) {
  "use cache";
  cacheLife("minutes");
  cacheTag("products", `product:${slug}`);
  return await fetchQuery(api.products.getBySlug, { slug }, { url: env.NEXT_PUBLIC_CONVEX_URL });
}

export async function getRelatedProducts(productId: Id<"products">) {
  "use cache";
  cacheLife("minutes");
  cacheTag("products");
  return await fetchQuery(api.products.related, { productId, limit: 4 }, { url: env.NEXT_PUBLIC_CONVEX_URL });
}
