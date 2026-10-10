import Image from "next/image";
import { ArrowLink } from "@/components/ui/arrow-link";

export function ClosingCta() {
  return (
    <section id="final-cta" className="px-4 pb-6 sm:px-6">
      <div className="flex flex-wrap items-stretch overflow-hidden bg-surface-2">
        <div className="flex min-w-0 flex-[1_1_440px] flex-col justify-center gap-7 p-[clamp(40px,6vw,88px)]">
          <h2 className="m-0 text-[clamp(44px,5.6vw,88px)] leading-none font-medium tracking-[-0.045em]">
            Your new
            <br />
            favourite tee
            <br />
            is waiting.
          </h2>
          <p className="m-0 max-w-[380px] text-base leading-relaxed text-muted">
            Designer drop shoulder tees for men and women. Pick yours and wear the drape.
          </p>
          <div className="flex flex-wrap gap-3">
            <ArrowLink href="/shop/men" tone="inverse" size="lg">
              Shop Men
            </ArrowLink>
            <ArrowLink href="/shop/women" tone="outline" size="lg">
              Shop Women
            </ArrowLink>
          </div>
        </div>
        <div className="flex min-h-[460px] min-w-0 flex-[1_1_420px] p-4">
          <div className="relative min-h-[428px] flex-1">
            <Image
              src="/products/clay-terracotta.jpg"
              alt="Terracotta drop shoulder tee hanging on a wooden hanger"
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover object-[50%_35%]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
