import Image from "next/image";
import type { ReactNode } from "react";

type Props = {
  eyebrow: string;
  title: string;
  subtitle: string;
  description: ReactNode;
  image: { src: string; alt: string; background: string; position?: string };
  badge: string;
};

export function CategoryBanner({ eyebrow, title, subtitle, description, image, badge }: Props) {
  return (
    <section className="flex container-page flex-wrap items-stretch gap-x-14 gap-y-10 pt-2 pb-14">
      <div className="flex min-w-0 flex-[1_1_520px] flex-col justify-end gap-[22px]">
        <span className="text-[13px] font-semibold tracking-[0.14em] text-accent uppercase">{eyebrow}</span>
        <h1 className="m-0 text-[clamp(64px,10vw,168px)] leading-[0.82] font-bold tracking-[-0.06em] uppercase">
          {title}
        </h1>
        <span className="font-serif text-[clamp(28px,3vw,44px)] leading-none text-accent italic">
          {subtitle}
        </span>
        <p className="m-0 max-w-[460px] text-[15px] leading-relaxed text-muted">{description}</p>
      </div>
      <div
        className="relative h-[420px] min-w-0 flex-[1_1_420px] overflow-hidden"
        style={{ background: image.background }}
      >
        <Image
          src={image.src}
          alt={image.alt}
          fill
          priority
          sizes="(min-width: 1024px) 45vw, 100vw"
          className="object-cover"
          style={{ objectPosition: image.position ?? "50% 35%" }}
        />
        <span className="absolute bottom-0 left-0 bg-accent px-5 py-3.5 text-[13px] font-bold tracking-[0.1em] text-on-accent uppercase">
          {badge}
        </span>
      </div>
    </section>
  );
}
