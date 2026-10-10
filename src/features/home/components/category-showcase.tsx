import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { SerifAccent } from "@/components/ui/section-heading";

const categories = [
  {
    href: "/shop/men",
    name: "Men",
    index: "01",
    edit: "His Edit",
    line: "Relaxed drop shoulder tees for him",
    background: "#2B2A28",
    image: "/products/line-art-black.jpg",
    alt: "Men’s drop shoulder tees",
  },
  {
    href: "/shop/women",
    name: "Women",
    index: "02",
    edit: "Her Edit",
    line: "Oversized drop shoulder tees for her",
    background: "#5E6B4A",
    image: "/products/abstract-sage.jpg",
    alt: "Women’s drop shoulder tees",
  },
] as const;

export function CategoryShowcase() {
  return (
    <section id="categories" className="flex flex-col gap-14 pt-[104px] text-fg">
      <div className="flex container-page flex-wrap items-end justify-between gap-7">
        <h2 className="m-0 text-[clamp(56px,9vw,148px)] leading-[0.86] font-semibold tracking-[-0.055em] uppercase">
          Shop by
          <br />
          <SerifAccent>Category</SerifAccent>
        </h2>
        <div className="flex max-w-[340px] flex-col gap-3.5 pb-2.5">
          <span aria-hidden className="block h-[3px] w-14 bg-accent" />
          <p className="m-0 text-base leading-relaxed text-muted">
            Two edits. One silhouette. Designer drop shoulder tees cut for him and for her.
          </p>
        </div>
      </div>

      <div className="group/cats grid grid-cols-[repeat(auto-fit,minmax(min(100%,340px),1fr))] gap-[3px]">
        {categories.map((c) => (
          <Link
            key={c.name}
            href={c.href}
            className="group/cat relative block h-[clamp(520px,56vw,780px)] overflow-hidden text-white no-underline focus-visible:outline-3 focus-visible:-outline-offset-3"
            style={{ background: c.background }}
          >
            <Image
              src={c.image}
              alt={c.alt}
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover object-[50%_30%] transition-[transform,filter] duration-1000 ease-[cubic-bezier(.2,.7,.2,1)] group-hover/cat:scale-[1.07] group-hover/cats:[&:not(:hover)]:grayscale"
            />
            <span
              aria-hidden
              className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,.35)_0%,transparent_28%,transparent_48%,rgba(0,0,0,.78)_100%)] transition-colors group-hover/cat:bg-transparent group-hover/cats:bg-black/30"
            />
            <span className="absolute inset-x-8 top-7 flex items-center justify-between text-[13px] font-semibold tracking-[0.14em] uppercase">
              <span>
                {c.index} / {c.edit}
              </span>
              <span className="text-[#D4AF5A]">Drop Shoulder</span>
            </span>
            <span className="absolute inset-x-7 bottom-7 flex items-end justify-between gap-5">
              <span className="flex min-w-0 flex-col gap-3.5">
                <span className="inline-block text-[clamp(72px,9vw,160px)] leading-[0.8] font-bold tracking-[-0.06em] uppercase transition-transform duration-500 group-hover/cat:translate-x-2.5">
                  {c.name}
                </span>
                <span className="text-[15px] text-[#E2E2E2]">{c.line}</span>
              </span>
              <span className="grid size-[76px] shrink-0 place-items-center bg-white text-[#111111] transition-colors group-hover/cat:bg-[#D4AF5A]">
                <ArrowUpRight className="size-6" strokeWidth={2.2} aria-hidden />
              </span>
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
