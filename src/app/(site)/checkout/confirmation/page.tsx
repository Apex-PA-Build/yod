import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { Skeleton } from "@/components/ui/skeleton";
import { OrderConfirmation } from "@/features/orders";

export const metadata: Metadata = { title: "Order confirmed", robots: { index: false } };

export default function ConfirmationPage() {
  return (
    <>
      <PageHeader title="Thank you" eyebrow="Order placed" current="Order confirmed" />
      <div className="container-page pb-24">
        <Suspense fallback={<Skeleton className="h-64" />}>
          <OrderConfirmation />
        </Suspense>
      </div>
    </>
  );
}
