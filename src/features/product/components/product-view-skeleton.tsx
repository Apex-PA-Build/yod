import { Skeleton } from "@/components/ui/skeleton";

export function ProductViewSkeleton() {
  return (
    <div aria-busy className="flex container-page flex-wrap items-start gap-x-16 gap-y-10 pt-[62px] pb-24">
      <span className="sr-only">Loading product…</span>
      <Skeleton className="aspect-[4/5] min-w-0 flex-[1_1_560px]" />
      <div className="flex min-w-0 flex-[1_1_440px] flex-col gap-6">
        <Skeleton className="h-6 w-56" />
        <Skeleton className="h-28 w-4/5" />
        <Skeleton className="h-10 w-40" />
        <Skeleton className="h-14 w-64" />
        <Skeleton className="h-[52px] w-full" />
        <Skeleton className="h-16 w-full" />
      </div>
    </div>
  );
}
