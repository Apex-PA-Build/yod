import Link from "next/link";
import { formatPrice } from "@/shared/money";
import { ORDER_STATUS_LABELS } from "@/shared/orders";
import { formatDate } from "../format";
import type { OrderSummary } from "../types";

export function OrderList({ orders }: { orders: OrderSummary[] }) {
  if (orders.length === 0) {
    return (
      <p className="m-0 text-[15px] text-muted">
        No orders yet.{" "}
        <Link href="/shop" className="text-fg underline underline-offset-4">
          Find your first tee
        </Link>
        .
      </p>
    );
  }
  return (
    <ul className="m-0 list-none border-t border-line p-0">
      {orders.map((o) => (
        <li key={o.orderNumber}>
          <Link
            href={`/account/orders/${o.orderNumber}`}
            className="flex flex-wrap items-center justify-between gap-4 border-b border-line py-5 no-underline hover:bg-surface"
          >
            <span className="flex flex-col gap-1">
              <span className="font-semibold">{o.orderNumber}</span>
              <span className="text-[13px] text-muted">Placed {formatDate(o.createdAt)}</span>
            </span>
            <span className="flex items-center gap-6">
              <span className="bg-surface-3 px-2.5 py-1.5 text-xs font-semibold">
                {ORDER_STATUS_LABELS[o.status]}
              </span>
              <span className="font-semibold">{formatPrice(o.total)}</span>
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
