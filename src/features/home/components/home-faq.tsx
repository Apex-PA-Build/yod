import { ArrowLink } from "@/components/ui/arrow-link";
import type { Faq } from "@/content/faqs";
import { FaqList } from "@/components/faq-list";

export function HomeFaq({ faqs }: { faqs: Faq[] }) {
  return (
    <section
      id="faq"
      className="flex container-page scroll-mt-8 flex-wrap items-start gap-x-20 gap-y-12 py-24"
    >
      <div className="flex min-w-0 flex-[1_1_340px] flex-col gap-5">
        <span className="text-sm font-medium text-accent">FAQ</span>
        <h2 className="m-0 text-[clamp(44px,5.2vw,76px)] leading-none font-medium tracking-[-0.04em]">
          Questions?
          <br />
          Answered.
        </h2>
        <p className="m-0 max-w-[360px] text-[15px] leading-relaxed text-muted">
          Everything you need to know about our drop shoulder tees. Can&apos;t find your answer? We&apos;re
          happy to help.
        </p>
        <ArrowLink href="/contact" className="mt-2 self-start">
          Contact Us
        </ArrowLink>
      </div>
      <div className="min-w-0 flex-[2_1_520px]">
        <FaqList faqs={faqs} />
      </div>
    </section>
  );
}
