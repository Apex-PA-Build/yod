"use client";

import { api } from "@convex/_generated/api";
import { useQuery } from "convex/react";
import { CircleCheck } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo, useSyncExternalStore } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { confirmationParamsSchema, parseLastOrder, readLastOrderRaw } from "@/features/checkout/last-order";
import { storeConfig } from "@/shared/store-config";
import { OrderDetails } from "./order-details";
import { OrderTimeline } from "./order-timeline";
import { TrackOrderForm } from "./track-order-form";

const noSubscribe = () => () => {};

export function OrderConfirmation() {
  const params = useSearchParams();
  const parsed = confirmationParamsSchema.safeParse({ order: params.get("order") });
  const orderNumber = parsed.success ? parsed.data.order : null;
  // undefined on the server, the stored order (or null) in the browser.
  const raw = useSyncExternalStore(noSubscribe, readLastOrderRaw, () => undefined);
  const lookup = useMemo(
    () => (raw === undefined || !orderNumber ? null : parseLastOrder(raw, orderNumber)),
    [raw, orderNumber],
  );
  const order = useQuery(api.orders.confirmation, lookup ?? "skip");

  if (raw === undefined) return <Skeleton className="h-64" />;

  if (!lookup) {
    return (
      <div className="flex flex-col gap-8">
        <p className="m-0 max-w-xl text-[15px] text-muted">
          Enter your order number and email to see its status.
        </p>
        <TrackOrderForm defaultOrderNumber={orderNumber ?? ""} />
      </div>
    );
  }

  if (order === undefined) {
    return (
      <div className="flex flex-col gap-6" aria-busy>
        <Skeleton className="h-24 max-w-3xl" />
        <Skeleton className="h-64" />
      </div>
    );
  }

  if (order === null) {
    return <TrackOrderForm defaultOrderNumber={lookup.orderNumber} />;
  }

  return (
    <div className="flex flex-col gap-12">
      <div className="flex max-w-3xl flex-col gap-6 border border-accent p-7">
        <div className="flex items-center gap-3">
          <CircleCheck aria-hidden className="size-7 text-accent" />
          <p className="m-0 text-lg font-semibold">
            Order {order.orderNumber} is confirmed. Updates will go to {order.email}.
          </p>
        </div>
        <p className="m-0 text-sm text-muted">
          We dispatch within {storeConfig.dispatchDays} days. Keep your order number handy to track it any
          time.
        </p>
        <OrderTimeline order={order} />
      </div>
      <OrderDetails order={order} />
      <div className="flex flex-wrap gap-3">
        <Button asChild size="lg" caps>
          <Link href="/shop">Keep shopping</Link>
        </Button>
        <Button asChild variant="outline" size="lg" caps>
          <Link href="/track-order">Track an order</Link>
        </Button>
      </div>
    </div>
  );
}
