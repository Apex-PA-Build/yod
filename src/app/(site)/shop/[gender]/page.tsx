import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { CategoryBanner, categoryContent } from "@/features/catalog";
import { CatalogListing, CatalogListingSkeleton } from "@/features/catalog/server";
import { GENDERS } from "@/shared/catalog";
import { genderSchema } from "@/shared/schemas/catalog";

export function generateStaticParams() {
  return GENDERS.map((gender) => ({ gender }));
}

export async function generateMetadata({ params }: PageProps<"/shop/[gender]">): Promise<Metadata> {
  const gender = genderSchema.safeParse((await params).gender);
  if (!gender.success) return {};
  const content = categoryContent[gender.data];
  return {
    title: `${content.title}'s drop shoulder tees`,
    description: content.metaDescription,
  };
}

export default async function CategoryPage({ params, searchParams }: PageProps<"/shop/[gender]">) {
  const parsed = genderSchema.safeParse((await params).gender);
  if (!parsed.success) notFound();
  const gender = parsed.data;
  const content = categoryContent[gender];

  return (
    <>
      <Breadcrumb
        items={[{ label: "Home", href: "/" }, { label: "Shop", href: "/shop" }, { label: content.title }]}
      />
      <CategoryBanner {...content} badge={`${content.eyebrow.split(" / ")[1]}`} />
      <Suspense fallback={<CatalogListingSkeleton />}>
        <CatalogListing gender={gender} searchParams={searchParams} />
      </Suspense>
    </>
  );
}
