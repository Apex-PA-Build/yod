import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { CartPage } from "@/features/cart";

export const metadata: Metadata = { title: "Your cart", robots: { index: false } };

export default function Page() {
  return (
    <>
      <PageHeader title="Your cart" current="Cart" />
      <CartPage />
    </>
  );
}
