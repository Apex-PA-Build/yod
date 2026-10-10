import { api } from "@convex/_generated/api";
import { fetchQuery } from "convex/nextjs";
import type { MetadataRoute } from "next";
import { cacheLife } from "next/cache";
import { env } from "@/env";

const STATIC_PATHS = [
  "",
  "/shop",
  "/shop/men",
  "/shop/women",
  "/about",
  "/contact",
  "/faq",
  "/size-guide",
  "/shipping",
  "/returns",
  "/track-order",
  "/privacy",
  "/terms",
];

async function productSlugs() {
  "use cache";
  cacheLife("hours");
  try {
    return await fetchQuery(api.products.slugs, {}, { url: env.NEXT_PUBLIC_CONVEX_URL });
  } catch (error) {
    // Keep the sitemap serving static pages if Convex is unreachable.
    console.error("sitemap: could not load product slugs", error);
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = env.NEXT_PUBLIC_SITE_URL;
  const products = await productSlugs();
  return [
    ...STATIC_PATHS.map((path) => ({ url: `${base}${path}` })),
    ...products.map((p) => ({ url: `${base}/products/${p.slug}`, lastModified: new Date(p.updatedAt) })),
  ];
}
