import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { Skeleton } from "@/components/ui/skeleton";
import { AccountOrder, RequireAuth } from "@/features/account";
import { orderNumberSchema } from "@/shared/schemas/checkout";

export const metadata: Metadata = { title: "Order details", robots: { index: false } };

async function OrderContent({ params }: { params: Promise<{ orderNumber: string }> }) {
  const parsed = orderNumberSchema.safeParse((await params).orderNumber);
  if (!parsed.success) notFound();
  return (
    <>
      <PageHeader
        title={parsed.data}
        current={parsed.data}
        crumbs={[{ label: "Account", href: "/account" }]}
      />
      <div className="container-page pb-24">
        <RequireAuth>
          <AccountOrder orderNumber={parsed.data} />
        </RequireAuth>
      </div>
    </>
  );
}

export default function OrderPage({ params }: PageProps<"/account/orders/[orderNumber]">) {
  return (
    <Suspense fallback={<Skeleton className="mt-16 h-80 container-page" />}>
      <OrderContent params={params} />
    </Suspense>
  );
}
