"use client";

import { api } from "@convex/_generated/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useConvex } from "convex/react";
import { useId, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { errorProps, Field, Input } from "@/components/ui/field";
import { errorMessage } from "@/lib/errors";
import { trackOrderSchema, type TrackOrderInput } from "@/shared/schemas/checkout";
import { ORDER_STATUS_LABELS } from "@/shared/orders";
import { formatDate } from "../format";
import type { OrderStatusView } from "../types";
import { OrderTimeline } from "./order-timeline";
import { ShipmentTracking } from "./shipment-tracking";

type Result =
  { kind: "found"; order: OrderStatusView } | { kind: "missing" } | { kind: "error"; message: string };

export function TrackOrderForm({ defaultOrderNumber = "" }: { defaultOrderNumber?: string }) {
  const id = useId();
  const convex = useConvex();
  const [result, setResult] = useState<Result | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TrackOrderInput>({
    resolver: zodResolver(trackOrderSchema),
    defaultValues: { orderNumber: defaultOrderNumber, email: "" },
  });

  const onSubmit = handleSubmit(async (values) => {
    try {
      const order = await convex.query(api.orders.track, values);
      setResult(order ? { kind: "found", order } : { kind: "missing" });
    } catch (error) {
      setResult({ kind: "error", message: errorMessage(error) });
    }
  });

  return (
    <div className="flex flex-col gap-12">
      <form onSubmit={onSubmit} noValidate className="flex max-w-2xl flex-wrap items-start gap-4">
        <Field
          label="Order number"
          htmlFor={`${id}-order`}
          error={errors.orderNumber?.message}
          className="flex-[1_1_220px]"
        >
          <Input
            placeholder="YOD-AB12CD34"
            autoCapitalize="characters"
            {...errorProps(`${id}-order`, errors.orderNumber?.message)}
            {...register("orderNumber")}
          />
        </Field>
        <Field
          label="Email used to order"
          htmlFor={`${id}-email`}
          error={errors.email?.message}
          className="flex-[1_1_260px]"
        >
          <Input
            type="email"
            autoComplete="email"
            {...errorProps(`${id}-email`, errors.email?.message)}
            {...register("email")}
          />
        </Field>
        <Button type="submit" size="md" caps disabled={isSubmitting} className="mt-[29px]">
          {isSubmitting ? "Checking…" : "Track"}
        </Button>
      </form>

      <div aria-live="polite">
        {result?.kind === "found" ? (
          <section className="flex max-w-3xl flex-col gap-8 border border-line bg-surface p-7">
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <h2 className="m-0 text-xl font-semibold">{result.order.orderNumber}</h2>
              <span className="text-sm text-muted">
                Placed {formatDate(result.order.createdAt)} · {ORDER_STATUS_LABELS[result.order.status]}
              </span>
            </div>
            <OrderTimeline order={result.order} />
            {result.order.shipment ? <ShipmentTracking shipment={result.order.shipment} /> : null}
          </section>
        ) : result?.kind === "missing" ? (
          <p role="alert" className="m-0 text-sm font-semibold text-accent">
            We couldn&apos;t find an order with that number and email. Check both and try again.
          </p>
        ) : result?.kind === "error" ? (
          <p role="alert" className="m-0 text-sm font-semibold text-accent">
            {result.message}
          </p>
        ) : null}
      </div>
    </div>
  );
}
