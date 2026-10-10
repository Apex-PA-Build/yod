import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ProductView, ProductViewSkeleton } from "@/features/product";
import { getProductPage, getRelatedProducts } from "@/features/product/server";
import { formatPrice } from "@/shared/money";
import { slugSchema } from "@/shared/schemas/catalog";

async function loadProduct(params: Promise<{ slug: string }>) {
  const slug = slugSchema.safeParse((await params).slug);
  if (!slug.success) return null;
  return await getProductPage(slug.data);
}

export async function generateMetadata({ params }: PageProps<"/products/[slug]">): Promise<Metadata> {
  const data = await loadProduct(params);
  if (!data) return { title: "Tee not found" };
  const { product } = data;
  const colour = product.colours[0];
  const description = `${product.tagline} ${formatPrice(product.price)}. ${product.description}`;
  return {
    title: product.name,
    description,
    alternates: { canonical: `/products/${product.slug}` },
    openGraph: {
      title: product.name,
      description,
      type: "website",
      images: colour ? [{ url: colour.image, alt: colour.imageAlt }] : undefined,
    },
  };
}

async function ProductContent({ params }: { params: Promise<{ slug: string }> }) {
  const data = await loadProduct(params);
  if (!data) notFound();
  const related = await getRelatedProducts(data.product.id);
  return <ProductView data={data} related={related} />;
}

export default function ProductPage({ params }: PageProps<"/products/[slug]">) {
  return (
    <Suspense fallback={<ProductViewSkeleton />}>
      <ProductContent params={params} />
    </Suspense>
  );
}
