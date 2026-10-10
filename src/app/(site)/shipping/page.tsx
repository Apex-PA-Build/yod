import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/layout/page-header";
import { Prose } from "@/components/prose";
import { formatPrice } from "@/shared/money";
import { storeConfig } from "@/shared/store-config";

export const metadata: Metadata = {
  title: "Shipping",
  description: "How and when YOD orders are dispatched and delivered across India.",
};

export default function ShippingPage() {
  const fee = storeConfig.shippingFeePaise;
  return (
    <>
      <PageHeader title="Shipping" current="Shipping" />
      <div className="container-page pb-24">
        <Prose>
          <h2>Where we deliver</h2>
          <p>
            We deliver across India. Check your PIN code on any product page to see the delivery estimate.
          </p>
          <h2>Dispatch and delivery times</h2>
          <ul>
            <li>Orders are dispatched within {storeConfig.dispatchDays} business days.</li>
            <li>Delivery usually takes {storeConfig.deliveryWindowDays} business days after dispatch.</li>
          </ul>
          <h2>Shipping cost</h2>
          <p>
            {fee === 0
              ? "Shipping is free on every order."
              : `Shipping is a flat ${formatPrice(fee)} per order.`}
          </p>
          <h2>Payment</h2>
          <p>We currently accept cash on delivery. You can pay the delivery partner in cash or by UPI.</p>
          <h2>Tracking</h2>
          <p>
            Use your order number and email on the <Link href="/track-order">Track order</Link> page to see
            where your order is.
          </p>
        </Prose>
      </div>
    </>
  );
}
