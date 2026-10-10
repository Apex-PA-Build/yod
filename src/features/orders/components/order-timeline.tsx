import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { ORDER_STATUS_LABELS, ORDER_TIMELINE } from "@/shared/orders";
import { formatDateTime } from "../format";
import type { OrderStatusView } from "../types";

/** Ordered → Packed → Shipped → Delivered, with the time each step happened. */
export function OrderTimeline({ order }: { order: Pick<OrderStatusView, "status" | "statusHistory"> }) {
  if (order.status === "cancelled") {
    const at = order.statusHistory.findLast((h) => h.status === "cancelled")?.at;
    return (
      <p className="m-0 border border-line bg-surface p-5 text-sm">
        This order was cancelled{at ? ` on ${formatDateTime(at)}` : ""}. Contact us if you have questions.
      </p>
    );
  }

  const reached = ORDER_TIMELINE.indexOf(order.status);
  return (
    <ol className="m-0 grid list-none grid-cols-4 gap-2 p-0" aria-label="Order progress">
      {ORDER_TIMELINE.map((step, i) => {
        const done = i <= reached;
        const at = order.statusHistory.find((h) => h.status === step)?.at;
        return (
          <li key={step} className="flex flex-col gap-3" aria-current={i === reached ? "step" : undefined}>
            <div className="flex items-center">
              <span
                className={cn(
                  "grid size-8 shrink-0 place-items-center border-[1.5px]",
                  done ? "border-accent bg-accent text-on-accent" : "border-line-strong text-subtle",
                )}
              >
                {done ? <Check aria-hidden className="size-4" /> : <span className="text-xs">{i + 1}</span>}
              </span>
              {i < ORDER_TIMELINE.length - 1 ? (
                <span aria-hidden className={cn("h-0.5 flex-1", i < reached ? "bg-accent" : "bg-line")} />
              ) : null}
            </div>
            <div className="flex flex-col gap-0.5 pr-2">
              <span className={cn("text-sm font-semibold", !done && "text-subtle")}>
                {ORDER_STATUS_LABELS[step]}
                <span className="sr-only">{done ? " (done)" : " (pending)"}</span>
              </span>
              {at ? <span className="text-xs text-subtle">{formatDateTime(at)}</span> : null}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
