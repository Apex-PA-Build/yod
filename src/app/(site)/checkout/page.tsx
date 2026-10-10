import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { CheckoutForm } from "@/features/checkout";

export const metadata: Metadata = { title: "Checkout", robots: { index: false } };

export default function CheckoutPage() {
  return (
    <>
      <PageHeader title="Checkout" current="Checkout" crumbs={[{ label: "Cart", href: "/cart" }]} />
      <CheckoutForm />
    </>
  );
}
