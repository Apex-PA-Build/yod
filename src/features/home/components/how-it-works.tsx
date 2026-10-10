"use client";

import { ChevronDown, ChevronUp } from "lucide-react";
import Image from "next/image";
import { useRef, useState, type UIEvent } from "react";
import { ArrowLink } from "@/components/ui/arrow-link";
import { cn } from "@/lib/utils";
import { ORDER_STATUS_LABELS, ORDER_TIMELINE } from "@/shared/orders";

const steps = [
  {
    title: "Pick your drop",
    body: "Browse our designer drop shoulder tees — from clean everyday essentials to bold graphic prints. Find the one that feels like you.",
  },
  {
    title: "Find your fit",
    body: "Drop shoulder tees are cut roomy on purpose. Check the size guide to choose your drape — your usual size for relaxed, one size up for extra oversized.",
  },
  {
    title: "Packed with care",
    body: "Every tee is checked, folded and packed by our team before it leaves us, so it arrives looking the way it should.",
  },
  {
    title: "Delivered. Ready to wear.",
    body: "Track your order right to your door. Then style it your way — loose, half-tucked or layered.",
  },
];

const num = (i: number) => `0${i + 1}`;

function FitDiagram() {
  return (
    <div className="flex w-full flex-col items-center gap-[22px] p-6">
      <svg viewBox="0 0 400 330" className="h-auto w-[min(86%,420px)]" aria-hidden>
        <path
          d="M150 30 Q200 58 250 30 L320 48 L385 145 L338 170 L322 138 L322 320 L78 320 L78 138 L62 170 L15 145 L80 48 Z"
          className="fill-bg stroke-fg"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        <path d="M158 33 Q200 64 242 33" fill="none" className="stroke-fg" strokeWidth="2.5" />
        <path
          d="M92 46 Q86 95 78 138 M308 46 Q314 95 322 138"
          fill="none"
          className="stroke-accent"
          strokeWidth="4"
          strokeDasharray="8 7"
        />
        <circle cx="312" cy="90" r="6" className="fill-accent" />
        <path d="M312 90 L352 62" className="stroke-fg" strokeWidth="1.5" />
        <text x="300" y="52" fontSize="13" fontWeight="500" className="fill-fg font-sans">
          Dropped seam
        </text>
        <path d="M78 300 L322 300" className="stroke-fg" strokeWidth="1.5" strokeDasharray="3 4" />
        <text
          x="200"
          y="290"
          textAnchor="middle"
          fontSize="13"
          fontWeight="500"
          className="fill-muted font-sans"
        >
          Boxy, relaxed body
        </text>
      </svg>
      <div className="flex flex-wrap justify-center gap-2">
        {["S", "M", "L", "XL", "XXL"].map((s) => (
          <span
            key={s}
            className={cn(
              "grid h-11 w-12 place-items-center border-[1.5px] text-sm font-medium",
              s === "L" ? "border-inverse bg-inverse text-on-inverse" : "border-line-strong bg-bg",
            )}
          >
            {s}
          </span>
        ))}
      </div>
    </div>
  );
}

function OrderStatusCard() {
  return (
    <div className="absolute bottom-[84px] left-5 flex min-w-[220px] flex-col gap-3 bg-bg px-[22px] py-[18px] shadow-xl">
      <div className="text-[13px] font-semibold">Order status</div>
      {ORDER_TIMELINE.map((s, i) => {
        const last = i === ORDER_TIMELINE.length - 1;
        return (
          <div key={s} className={cn("flex items-center gap-2.5 text-[13px]", last && "font-semibold")}>
            <span className={cn("size-2.5", last ? "bg-accent shadow-[0_0_0_4px_var(--glow)]" : "bg-fg")} />
            {ORDER_STATUS_LABELS[s]}
          </div>
        );
      })}
    </div>
  );
}

const layers = [
  <Image
    key="0"
    src="/products/abstract-sage.jpg"
    alt=""
    fill
    sizes="50vw"
    className="object-cover object-[50%_40%]"
  />,
  <div key="1" className="grid size-full place-items-center bg-surface-2">
    <FitDiagram />
  </div>,
  <Image
    key="2"
    src="/products/clay-terracotta.jpg"
    alt=""
    fill
    sizes="50vw"
    className="object-cover object-[50%_35%]"
  />,
  <div key="3" className="relative size-full">
    <Image
      src="/products/essential-bone.jpg"
      alt=""
      fill
      sizes="50vw"
      className="object-cover object-[50%_40%]"
    />
    <OrderStatusCard />
  </div>,
];

/** Four-step scroll story. Scrolling the step list (or the arrows) swaps the visual. */
export function HowItWorks() {
  const [active, setActive] = useState(0);
  const listRef = useRef<HTMLOListElement>(null);

  function goTo(i: number) {
    const n = Math.max(0, Math.min(steps.length - 1, i));
    setActive(n);
    const box = listRef.current;
    box?.scrollTo({ top: n * box.clientHeight, behavior: "smooth" });
  }

  function onScroll(e: UIEvent<HTMLOListElement>) {
    const box = e.currentTarget;
    const n = Math.round(box.scrollTop / (box.clientHeight || 1));
    if (n !== active) setActive(Math.max(0, Math.min(steps.length - 1, n)));
  }

  return (
    <section id="how-it-works" className="flex container-page flex-col gap-14 pt-[104px] pb-24">
      <div className="flex flex-wrap items-end justify-between gap-5">
        <h2 className="m-0 text-[clamp(40px,5vw,72px)] leading-[1.05] font-medium tracking-[-0.03em]">
          How It
          <br />
          Works
        </h2>
        <p className="m-0 max-w-[360px] text-[15px] leading-relaxed text-muted">
          From picking your drop to wearing it out — four simple steps. Scroll to follow along.
        </p>
      </div>

      <div className="flex flex-wrap items-stretch gap-x-[72px] gap-y-8">
        <div className="min-w-0 flex-[1_1_480px]">
          <div className="relative h-[clamp(420px,50vw,600px)] overflow-hidden bg-surface-2">
            {layers.map((layer, i) => (
              <div
                key={i}
                aria-hidden={i !== active}
                className={cn(
                  "absolute inset-0 transition-[opacity,transform] duration-1000 ease-[cubic-bezier(.2,.7,.2,1)]",
                  i === active ? "scale-100 opacity-100" : "scale-[1.08] opacity-0",
                )}
              >
                {layer}
              </div>
            ))}
            <span className="absolute top-5 left-5 bg-bg px-4 py-2 text-[13px] font-medium">
              Step {num(active)} / 04
            </span>
            <div className="absolute inset-x-5 bottom-5 flex gap-2 bg-bg/85 px-2.5 py-1.5">
              {steps.map((s, i) => (
                <button
                  key={s.title}
                  type="button"
                  aria-label={`Go to step ${num(i)}: ${s.title}`}
                  aria-current={i === active ? "step" : undefined}
                  onClick={() => goTo(i)}
                  className="grid h-8 flex-1 cursor-pointer items-center"
                >
                  <span
                    className={cn(
                      "block h-[5px] transition-colors duration-500",
                      i === active ? "bg-accent" : i < active ? "bg-fg" : "bg-line-strong",
                    )}
                  />
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex min-w-0 flex-[1_1_380px] flex-col gap-4">
          <ol
            ref={listRef}
            onScroll={onScroll}
            tabIndex={0}
            aria-label="How it works steps — scroll to move through them"
            className="m-0 no-scrollbar h-[clamp(360px,40vw,520px)] snap-y snap-mandatory list-none overflow-y-auto overscroll-contain p-0 focus-visible:outline-offset-4"
          >
            {steps.map((s, i) => (
              <li
                key={s.title}
                className={cn(
                  "flex h-full snap-start flex-col justify-center gap-[18px] px-1 py-2 transition-[opacity,transform] duration-500",
                  i === active ? "translate-y-0 opacity-100" : "translate-y-4 opacity-25",
                )}
              >
                <span
                  className={cn(
                    "text-[clamp(56px,6vw,96px)] leading-none font-medium tracking-[-0.05em]",
                    i === active ? "text-accent" : "text-line-strong",
                  )}
                >
                  {num(i)}
                </span>
                <h3 className="m-0 text-[clamp(30px,3vw,44px)] leading-[1.1] font-medium tracking-[-0.02em]">
                  {s.title}
                </h3>
                <p className="m-0 max-w-[420px] text-base leading-[1.7] text-muted">{s.body}</p>
              </li>
            ))}
          </ol>
          <div className="flex h-16 items-center justify-between gap-3">
            <span className="inline-flex items-center gap-2.5 text-[13px] text-muted">
              <svg
                width="16"
                height="22"
                viewBox="0 0 16 22"
                fill="none"
                className="stroke-muted"
                strokeWidth="1.6"
                aria-hidden
              >
                <rect x="1" y="1" width="14" height="20" rx="7" />
                <path className="animate-wheel" d="M8 5v4" strokeLinecap="round" />
              </svg>
              Scroll here, or use the arrows
            </span>
            <span className="flex gap-2.5">
              <button
                type="button"
                aria-label="Previous step"
                onClick={() => goTo(active - 1)}
                disabled={active === 0}
                className="grid size-12 cursor-pointer place-items-center border-[1.5px] border-line-strong bg-bg disabled:opacity-40"
              >
                <ChevronUp className="size-4" strokeWidth={2.2} aria-hidden />
              </button>
              <button
                type="button"
                aria-label="Next step"
                onClick={() => goTo(active + 1)}
                disabled={active === steps.length - 1}
                className="grid size-12 cursor-pointer place-items-center bg-inverse text-on-inverse disabled:opacity-40"
              >
                <ChevronDown className="size-4" strokeWidth={2.2} aria-hidden />
              </button>
            </span>
          </div>
        </div>
      </div>

      <div className="flex justify-center pt-6">
        <ArrowLink href="/shop">Start Shopping</ArrowLink>
      </div>
    </section>
  );
}
