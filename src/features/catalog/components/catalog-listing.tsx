import type { SearchParams } from "nuqs/server";
import { Skeleton } from "@/components/ui/skeleton";
import type { Gender } from "@/shared/catalog";
import { loadCatalogSearchParams } from "../search-params";
import { getCatalog } from "../data";
import { FilterSidebar } from "./filter-sidebar";
import { ProductGrid } from "./product-grid";
import { ResultsToolbar } from "./results-toolbar";
import { TypeTabs } from "./type-tabs";

type Props = { gender?: Gender; searchParams: Promise<SearchParams> };

/** Filters, tabs and results for a listing. Reads the URL, so render it inside <Suspense>. */
export async function CatalogListing({ gender, searchParams }: Props) {
  const { type, colour, size, price, sort } = await loadCatalogSearchParams(searchParams);
  const catalog = await getCatalog({
    gender,
    type,
    colours: colour,
    sizes: size,
    price: price ?? undefined,
    sort,
  });

  return (
    <>
      <TypeTabs counts={catalog.typeCounts} />
      <section className="flex container-page flex-col gap-x-12 gap-y-10 pt-10 pb-[104px] lg:flex-row lg:items-start">
        <FilterSidebar colours={catalog.colours} />
        <div className="flex min-w-0 flex-[999_1_560px] flex-col gap-7">
          <ResultsToolbar count={catalog.products.length} colours={catalog.colours} />
          <ProductGrid products={catalog.products} />
          {catalog.products.length > 0 ? (
            <div className="flex flex-col items-center gap-3.5 pt-6">
              <span className="text-[13px] text-subtle">
                Showing {catalog.products.length} of {catalog.products.length}
              </span>
              <div className="h-[3px] w-[220px] bg-accent" aria-hidden />
            </div>
          ) : null}
        </div>
      </section>
    </>
  );
}

export function CatalogListingSkeleton() {
  return (
    <>
      <div className="flex container-page gap-2.5 border-b border-line pb-8">
        {[0, 1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-12 w-28" />
        ))}
      </div>
      <section className="flex container-page gap-12 pt-10 pb-[104px]">
        <Skeleton className="hidden h-[520px] w-[260px] lg:block" />
        <div className="grid flex-1 grid-cols-[repeat(auto-fill,minmax(min(100%,280px),1fr))] gap-x-5 gap-y-9">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="aspect-[4/5]" />
          ))}
        </div>
      </section>
    </>
  );
}
