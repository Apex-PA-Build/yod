import type { Metadata } from "next";
import { FaqList } from "@/components/faq-list";
import { PageHeader } from "@/components/layout/page-header";
import { ArrowLink } from "@/components/ui/arrow-link";
import { SerifAccent } from "@/components/ui/section-heading";
import { generalFaqs, productFaqs } from "@/content/faqs";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Answers about drop shoulder fit, sizing, delivery, returns and caring for your YOD tee.",
};

export default function FaqPage() {
  return (
    <>
      <PageHeader
        title={
          <>
            Questions? <SerifAccent>Answered.</SerifAccent>
          </>
        }
        current="FAQ"
        description="Everything you need to know about our drop shoulder tees."
      >
        <ArrowLink href="/contact">Contact us</ArrowLink>
      </PageHeader>
      <div className="flex container-page max-w-5xl flex-col gap-16 pb-24">
        <section aria-labelledby="faq-general" className="flex flex-col gap-6">
          <h2 id="faq-general" className="m-0 text-[13px] font-bold tracking-[0.14em] uppercase">
            Fit, delivery and returns
          </h2>
          <FaqList faqs={generalFaqs} />
        </section>
        <section aria-labelledby="faq-product" className="flex flex-col gap-6">
          <h2 id="faq-product" className="m-0 text-[13px] font-bold tracking-[0.14em] uppercase">
            Fabric and sizing
          </h2>
          <FaqList faqs={productFaqs} numbered={false} />
        </section>
      </div>
    </>
  );
}
