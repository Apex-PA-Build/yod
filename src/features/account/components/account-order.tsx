"use client";

import { api } from "@convex/_generated/api";
import { useQuery } from "convex/react";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate, OrderDetails, OrderTimeline, ShipmentTracking } from "@/features/orders";
import { ORDER_STATUS_LABELS } from "@/shared/orders";

export function AccountOrder({ orderNumber }: { orderNumber: string }) {
  const order = useQuery(api.orders.getMine, { orderNumber });

  if (order === undefined) return <Skeleton className="h-80" />;
  if (order === null) {
    return (
      <p className="m-0 text-[15px] text-muted">
        We couldn&apos;t find that order in your account.{" "}
        <Link href="/account" className="text-fg underline underline-offset-4">
          Back to your orders
        </Link>
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-12">
      <div className="flex max-w-3xl flex-col gap-6 border border-line bg-surface p-7">
        <p className="m-0 text-sm text-muted">
          Placed {formatDate(order.createdAt)} · {ORDER_STATUS_LABELS[order.status]}
        </p>
        <OrderTimeline order={order} />
        {order.shipment ? <ShipmentTracking shipment={order.shipment} /> : null}
      </div>
      <OrderDetails order={order} />
    </div>
  );
}
