import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/layout/page-header";
import { Prose } from "@/components/prose";

export const metadata: Metadata = { title: "Terms of service" };

export default function TermsPage() {
  return (
    <>
      <PageHeader title="Terms of service" current="Terms" description="[Last updated: date]" />
      <div className="container-page pb-24">
        <Prose>
          <p>
            <strong>[Template: have this reviewed by a lawyer before launch.]</strong>
          </p>
          <h2>Orders</h2>
          <p>
            Placing an order is an offer to buy. We confirm it once it&apos;s accepted and may cancel orders
            we can&apos;t fulfil, for example if an item sells out.
          </p>
          <h2>Prices and payment</h2>
          <p>
            Prices are in Indian rupees and include all taxes. Orders are currently paid by cash on delivery.
          </p>
          <h2>Delivery, returns and exchanges</h2>
          <p>
            See our <Link href="/shipping">Shipping</Link> and{" "}
            <Link href="/returns">Returns &amp; exchanges</Link> pages.
          </p>
          <h2>Reviews</h2>
          <p>
            Reviews must be your own honest experience. We may remove reviews that are abusive, off-topic or
            spam.
          </p>
          <h2>Contact</h2>
          <p>
            Questions about these terms? <Link href="/contact">Contact us</Link>.
          </p>
        </Prose>
      </div>
    </>
  );
}
