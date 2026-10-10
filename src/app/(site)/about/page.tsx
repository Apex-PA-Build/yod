import type { Metadata } from "next";
import Image from "next/image";
import { PageHeader } from "@/components/layout/page-header";
import { ArrowLink } from "@/components/ui/arrow-link";
import { SerifAccent } from "@/components/ui/section-heading";

export const metadata: Metadata = {
  title: "About",
  description: "YOD makes designer drop shoulder tees for men and women. Relaxed by design, made to drape.",
};

const values = [
  {
    title: "One silhouette, done right",
    body: "We only make drop shoulder tees, so every pattern, seam and sleeve is tuned for the drape.",
  },
  {
    title: "Designed to wear daily",
    body: "Essentials and graphics that work loose, half-tucked or layered, with everything you already own.",
  },
  {
    title: "Small drops, made carefully",
    body: "Every tee is checked, folded and packed by our team before it ships.",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHeader
        title={
          <>
            Relaxed by <SerifAccent>design</SerifAccent>
          </>
        }
        current="About"
        description="YOD makes designer drop shoulder tees for men and women. [Add your brand story here: who you are, why you started and what makes your tees different.]"
      />
      <div className="flex container-page flex-col gap-24 pb-24">
        <div className="relative aspect-[16/7] min-h-[280px] overflow-hidden bg-surface">
          <Image
            src="/products/clay-terracotta.jpg"
            alt="Terracotta drop shoulder tee hanging on a wooden hanger"
            fill
            sizes="100vw"
            className="object-cover object-[50%_35%]"
          />
        </div>
        <ul className="m-0 grid list-none gap-px border border-line bg-line p-0 md:grid-cols-3">
          {values.map((v, i) => (
            <li key={v.title} className="flex flex-col gap-4 bg-bg p-8">
              <span className="font-serif text-3xl text-accent italic">{String(i + 1).padStart(2, "0")}</span>
              <h2 className="m-0 text-xl font-semibold">{v.title}</h2>
              <p className="m-0 text-[15px] leading-relaxed text-muted">{v.body}</p>
            </li>
          ))}
        </ul>
        <div className="flex flex-wrap gap-3">
          <ArrowLink href="/shop/men" tone="inverse" size="lg">
            Shop Men
          </ArrowLink>
          <ArrowLink href="/shop/women" tone="outline" size="lg">
            Shop Women
          </ArrowLink>
        </div>
      </div>
    </>
  );
}
