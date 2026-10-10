import Link from "next/link";
import { FaqList } from "@/components/faq-list";
import { Button } from "@/components/ui/button";
import { SerifAccent } from "@/components/ui/section-heading";
import type { Faq } from "@/content/faqs";

export function ProductFaq({ faqs }: { faqs: Faq[] }) {
  return (
    <section
      aria-labelledby="product-faq-title"
      className="flex container-page flex-wrap items-start gap-x-20 gap-y-12 border-t border-line py-24"
    >
      <div className="flex min-w-0 flex-[1_1_320px] flex-col gap-5">
        <h2
          id="product-faq-title"
          className="m-0 text-[clamp(2.75rem,5vw,5rem)] leading-[0.9] font-semibold tracking-[-0.05em] uppercase"
        >
          Still
          <br />
          <SerifAccent>unsure?</SerifAccent>
        </h2>
        <p className="m-0 max-w-[320px] text-[15px] leading-relaxed text-muted">
          Quick answers about this tee. Anything else, we&apos;re one message away.
        </p>
        <Button variant="outline" size="lg" caps asChild className="h-[52px] self-start">
          <Link href="/contact">Contact us</Link>
        </Button>
      </div>
      <div className="min-w-0 flex-[2_1_520px]">
        <FaqList faqs={faqs} numbered={false} />
      </div>
    </section>
  );
}
