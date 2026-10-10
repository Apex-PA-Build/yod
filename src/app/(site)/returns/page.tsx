import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/layout/page-header";
import { Prose } from "@/components/prose";
import { storeConfig } from "@/shared/store-config";

export const metadata: Metadata = {
  title: "Returns & exchanges",
  description: "How to return or exchange a YOD tee.",
};

export default function ReturnsPage() {
  return (
    <>
      <PageHeader title="Returns & exchanges" current="Returns & exchanges" />
      <div className="container-page pb-24">
        <Prose>
          <h2>The short version</h2>
          <p>
            You can return or exchange unworn, unwashed tees with their tags on within{" "}
            <strong>{storeConfig.returnWindowDays} days</strong> of delivery.
          </p>
          <h2>How to start a return or exchange</h2>
          <ol>
            <li>
              <Link href="/contact">Contact us</Link> with your order number and the item you want to return
              or exchange.
            </li>
            <li>We&apos;ll confirm and arrange a pickup or share the return address.</li>
            <li>Once we receive and check the tee, we&apos;ll send your exchange or process your refund.</li>
          </ol>
          <h2>Refunds</h2>
          <p>
            [Add how cash on delivery refunds are paid, e.g. bank transfer or UPI, and how long they take.]
          </p>
          <h2>Items we can&apos;t accept</h2>
          <p>Tees that have been worn, washed or damaged after delivery.</p>
        </Prose>
      </div>
    </>
  );
}
