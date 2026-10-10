import type { Metadata } from "next";
import { Suspense } from "react";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { Skeleton } from "@/components/ui/skeleton";
import { ListingCard } from "@/features/catalog";
import { searchProducts } from "@/features/catalog/server";
import { searchQuerySchema } from "@/shared/schemas/catalog";

export const metadata: Metadata = { title: "Search", robots: { index: false } };

async function Results({ searchParams }: { searchParams: PageProps<"/search">["searchParams"] }) {
  const raw = (await searchParams).q;
  const parsed = searchQuerySchema.safeParse(Array.isArray(raw) ? raw[0] : raw);

  if (!parsed.success) {
    return <p className="m-0 text-muted">Type a colour, print or style in the search box to find a tee.</p>;
  }

  const products = await searchProducts(parsed.data);
  return (
    <div className="flex flex-col gap-7">
      <p aria-live="polite" className="m-0 text-sm text-muted">
        <b className="font-semibold text-fg">{products.length}</b>{" "}
        {products.length === 1 ? "result" : "results"} for “{parsed.data}”
      </p>
      {products.length === 0 ? (
        <p className="m-0 text-lg">
          No tees match that search. Try a colour like “black” or a style like “graphic”.
        </p>
      ) : (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,260px),1fr))] gap-x-5 gap-y-9">
          {products.map((p) => (
            <ListingCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function SearchPage({ searchParams }: PageProps<"/search">) {
  return (
    <>
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Search" }]} />
      <section className="flex container-page flex-col gap-10 pb-[104px]">
        <h1 className="m-0 text-[clamp(44px,6vw,96px)] leading-[0.9] font-semibold tracking-[-0.05em] uppercase">
          Search
        </h1>
        <Suspense fallback={<Skeleton className="h-96" />}>
          <Results searchParams={searchParams} />
        </Suspense>
      </section>
    </>
  );
}
