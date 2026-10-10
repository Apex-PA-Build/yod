import Image from "next/image";
import Link from "next/link";
import { RotatingBadge } from "@/components/brand/rotating-badge";
import { ArrowLink } from "@/components/ui/arrow-link";

const HERO_IMAGE = "/products/essential-bone.jpg";

export function Hero() {
  return (
    <section
      className="relative flex container-page flex-wrap items-stretch gap-10 pt-14 pb-[104px]"
      style={{ background: "radial-gradient(circle at 78% 30%, var(--glow), transparent 40%)" }}
    >
      <div className="flex min-w-0 flex-[1_1_440px] flex-col justify-between gap-10">
        <div className="flex flex-col gap-[22px]">
          <h1 className="m-0 text-[clamp(44px,5.4vw,76px)] leading-[1.12] font-medium tracking-[-0.02em]">
            Dropped Shoulders,
            <br />
            <span className="font-serif text-[1.18em] leading-[0.9] font-normal tracking-[-0.01em] text-accent italic">
              Designed
            </span>{" "}
            to Drape
          </h1>
          <p className="m-0 max-w-[470px] text-[15px] leading-relaxed text-muted">
            Discover designer drop shoulder tees with a relaxed, oversized cut — made for easy layering and
            effortless everyday style.
          </p>
          <ArrowLink href="/shop" tone="inverse" shape="pill" className="mt-3 self-start">
            View All Products
          </ArrowLink>
        </div>

        <div className="flex flex-wrap items-center gap-10">
          <Link href="/products/essential-drop-tee" className="flex w-[260px] flex-col gap-3.5 no-underline">
            <span className="relative block h-[180px] overflow-hidden rounded-[18px] bg-[#D9CFBF]">
              <Image
                src={HERO_IMAGE}
                alt="Bone drop shoulder tee on a wooden hanger"
                fill
                sizes="260px"
                className="object-cover"
                style={{ objectPosition: "55% 45%" }}
              />
            </span>
            <span>
              <span className="block text-[19px] font-semibold">Essential Drop Tee</span>
              <span className="mt-1 block text-[13px] text-muted">Oversized. Relaxed. Everyday design.</span>
            </span>
          </Link>
          <RotatingBadge
            href="/shop?type=new-drops"
            ringText="NEW DROP - NEW DROP - NEW DROP - "
            label="Shop the new drop"
          />
        </div>
      </div>

      <div className="flex min-w-0 flex-[1_1_520px] flex-col gap-[22px]">
        <svg width="0" height="0" aria-hidden className="absolute">
          <defs>
            <clipPath id="hero-notch" clipPathUnits="objectBoundingBox">
              <path d="M0.05,0 H0.95 Q1,0 1,0.0533 V0.9467 Q1,1 0.95,1 H0.2 Q0.15,1 0.15,0.9467 V0.7583 C0.15,0.6417 0,0.6833 0,0.55 V0.0533 Q0,0 0.05,0 Z" />
            </clipPath>
          </defs>
        </svg>
        <div
          className="relative aspect-[640/600] w-full bg-[#D9CFBF]"
          style={{ clipPath: "url(#hero-notch)" }}
        >
          <Image
            src={HERO_IMAGE}
            alt="Bone drop shoulder tee hanging against a warm plaster wall"
            fill
            priority
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
          />
        </div>
        <div aria-hidden className="flex justify-center gap-2 pl-[15%]">
          <span className="h-[5px] w-[70px] rounded-full bg-accent" />
          <span className="h-[5px] w-[26px] rounded-full bg-line-strong" />
          <span className="h-[5px] w-[26px] rounded-full bg-line-strong" />
        </div>
      </div>
    </section>
  );
}
