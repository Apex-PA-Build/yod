import type { Metadata } from "next";
import { Suspense } from "react";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { CategoryBanner, categoryContent } from "@/features/catalog";
import { CatalogListing, CatalogListingSkeleton } from "@/features/catalog/server";

const content = categoryContent.all;

export const metadata: Metadata = {
  title: "Shop all drop shoulder tees",
  description: content.metaDescription,
};

export default function ShopPage({ searchParams }: PageProps<"/shop">) {
  return (
    <>
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Shop" }]} />
      <CategoryBanner {...content} badge="Men & Women" />
      <Suspense fallback={<CatalogListingSkeleton />}>
        <CatalogListing searchParams={searchParams} />
      </Suspense>
    </>
  );
}
