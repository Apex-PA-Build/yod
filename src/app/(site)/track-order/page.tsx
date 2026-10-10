import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { TrackOrderForm } from "@/features/orders";

export const metadata: Metadata = {
  title: "Track your order",
  description: "Check the status of your YOD order with your order number and email.",
};

export default function TrackOrderPage() {
  return (
    <>
      <PageHeader
        title="Track your order"
        current="Track order"
        description="Your order number is in your confirmation email. It looks like YOD-AB12CD34."
      />
      <div className="container-page pb-24">
        <TrackOrderForm />
      </div>
    </>
  );
}
