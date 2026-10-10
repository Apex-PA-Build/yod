import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/layout/page-header";
import { SerifAccent } from "@/components/ui/section-heading";
import { ContactForm } from "@/features/contact";
import { storeConfig } from "@/shared/store-config";

export const metadata: Metadata = {
  title: "Contact us",
  description: "Questions about sizing, an order or returns? Send the YOD team a message.",
};

export default function ContactPage() {
  return (
    <>
      <PageHeader
        title={
          <>
            Get in <SerifAccent>touch</SerifAccent>
          </>
        }
        current="Contact"
        description="Questions about sizing, an order or a return? Send us a message and we'll get back to you by email."
      />
      <div className="flex container-page flex-wrap items-start gap-x-20 gap-y-12 pb-24">
        <div className="min-w-0 flex-[2_1_520px]">
          <ContactForm />
        </div>
        <aside className="flex min-w-0 flex-[1_1_280px] flex-col gap-6 border border-line bg-surface p-7 text-sm">
          <div className="flex flex-col gap-1.5">
            <h2 className="m-0 text-[13px] font-bold tracking-[0.14em] uppercase">Email</h2>
            <span className="text-muted">{storeConfig.contact.email}</span>
          </div>
          <div className="flex flex-col gap-1.5">
            <h2 className="m-0 text-[13px] font-bold tracking-[0.14em] uppercase">Already ordered?</h2>
            <Link href="/track-order" className="font-semibold underline underline-offset-4">
              Track your order
            </Link>
          </div>
          <div className="flex flex-col gap-1.5">
            <h2 className="m-0 text-[13px] font-bold tracking-[0.14em] uppercase">Quick answers</h2>
            <Link href="/faq" className="font-semibold underline underline-offset-4">
              Read the FAQ
            </Link>
          </div>
        </aside>
      </div>
    </>
  );
}
