import { ExternalLink, MapPin } from "lucide-react";
import { SHIPMENT_STATUS_LABELS } from "@/shared/inventory";
import { formatDate, formatDateTime } from "../format";
import type { OrderStatusView } from "../types";

type Shipment = NonNullable<OrderStatusView["shipment"]>;

/** Courier, tracking number and the scan history for a shipped order. */
export function ShipmentTracking({ shipment }: { shipment: Shipment }) {
  return (
    <div className="flex flex-col gap-5 border-t border-line pt-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex flex-col gap-1 text-sm">
          <span className="text-[13px] font-bold tracking-[0.14em] uppercase">
            {SHIPMENT_STATUS_LABELS[shipment.status]}
          </span>
          <span className="text-muted">
            {shipment.courier} · AWB {shipment.trackingNumber}
          </span>
          {shipment.estimatedDelivery && shipment.status !== "delivered" ? (
            <span className="text-muted">Expected by {formatDate(shipment.estimatedDelivery)}</span>
          ) : null}
        </div>
        {shipment.trackingUrl ? (
          <a
            href={shipment.trackingUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-sm font-semibold underline underline-offset-4"
          >
            Track on {shipment.courier} <ExternalLink aria-hidden className="size-3.5" />
          </a>
        ) : null}
      </div>
      {shipment.events.length > 0 ? (
        <ol
          className="m-0 flex list-none flex-col gap-4 border-l border-line-strong p-0 pl-5"
          aria-label="Shipment updates"
        >
          {shipment.events.map((e, i) => (
            <li key={`${e.at}-${i}`} className="relative flex flex-col gap-0.5 text-sm">
              <span
                aria-hidden
                className={`absolute top-1.5 -left-[25px] size-2.5 ${i === 0 ? "bg-accent" : "bg-line-strong"}`}
              />
              <span className="font-semibold">{SHIPMENT_STATUS_LABELS[e.status]}</span>
              <span className="inline-flex items-center gap-1 text-muted">
                <MapPin aria-hidden className="size-3.5" />
                {e.location}
                {e.note ? ` · ${e.note}` : ""}
              </span>
              <time className="text-xs text-subtle" dateTime={new Date(e.at).toISOString()}>
                {formatDateTime(e.at)}
              </time>
            </li>
          ))}
        </ol>
      ) : null}
    </div>
  );
}
