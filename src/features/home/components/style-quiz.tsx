"use client";

import { api } from "@convex/_generated/api";
import { useQuery } from "convex/react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { ArrowTile } from "@/components/ui/arrow-link";
import { Skeleton } from "@/components/ui/skeleton";
import { ToggleChip } from "@/components/ui/toggle-chip";
import { useCartActions } from "@/features/cart";
import { FITS, GENDERS, LABELS, SIZES, VIBES, type Size } from "@/shared/catalog";
import { formatPrice } from "@/shared/money";
import type { QuizAnswers } from "@/shared/schemas/catalog";

const questions = [
  { key: "gender", label: "Shopping for", options: GENDERS, labels: LABELS.gender },
  { key: "vibe", label: "Your vibe", options: VIBES, labels: LABELS.vibe },
  { key: "fit", label: "How oversized?", options: FITS, labels: LABELS.fit },
] as const;

export function StyleQuiz() {
  const [answers, setAnswers] = useState<QuizAnswers>({ gender: "men", vibe: "minimal", fit: "relaxed" });
  const [pickingSize, setPickingSize] = useState(false);
  const match = useQuery(api.products.quizMatch, { gender: answers.gender, vibe: answers.vibe });
  const { add } = useCartActions();

  async function addToCart(size: Size) {
    if (!match) return;
    const ok = await add({ productId: match.id, colourKey: match.colour.key, size, quantity: 1 });
    setPickingSize(false);
    if (ok !== null) toast.success(`Added ${match.name} (${size}) to your cart`);
  }

  return (
    <section
      id="personalize"
      className="flex container-page flex-wrap items-center gap-x-[72px] gap-y-14 border-t border-line py-24"
    >
      <div className="flex min-w-0 flex-[1_1_460px] flex-col gap-10">
        <div className="flex flex-col gap-4">
          <span className="text-sm font-medium text-accent">Personalize</span>
          <h2 className="m-0 text-[clamp(44px,5.6vw,84px)] leading-none font-medium tracking-[-0.04em]">
            Find your
            <br />
            perfect tee.
          </h2>
          <p className="m-0 max-w-[400px] text-[15px] leading-relaxed text-muted">
            Three quick picks. We&apos;ll match you with the drop that fits your style.
          </p>
        </div>

        <div className="flex flex-col gap-7">
          {questions.map((q, i) => (
            <div key={q.key} role="group" aria-label={q.label} className="flex flex-col gap-3">
              <span className="text-[13px] font-semibold tracking-[0.08em] uppercase">
                0{i + 1} · {q.label}
              </span>
              <div className="flex flex-wrap gap-2.5">
                {q.options.map((opt) => (
                  <ToggleChip
                    key={opt}
                    pressed={answers[q.key] === opt}
                    onClick={() => setAnswers((a) => ({ ...a, [q.key]: opt }))}
                    className="h-[52px] px-6 text-[15px] font-medium"
                  >
                    {(q.labels as Record<string, string>)[opt]}
                  </ToggleChip>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex min-w-0 flex-[1_1_420px] justify-center">
        <div className="flex w-full max-w-[520px] flex-col gap-5" aria-live="polite">
          {match === undefined ? (
            <Skeleton className="aspect-[4/5]" />
          ) : match === null ? (
            <p className="m-0 text-muted">New drops for this pick are on the way.</p>
          ) : (
            <>
              <Link
                href={`/products/${match.slug}`}
                className="relative block aspect-[4/5] overflow-hidden"
                style={{ background: match.colour.background }}
              >
                <Image
                  src={match.colour.image}
                  alt={match.colour.imageAlt}
                  fill
                  sizes="(min-width: 1024px) 520px, 100vw"
                  className="object-cover"
                />
                <span className="absolute top-6 right-6 bg-white px-[18px] py-2.5 text-[13px] font-medium text-[#111111]">
                  Your match
                </span>
              </Link>
              <div className="flex items-end justify-between gap-4">
                <div className="min-w-0">
                  <div className="text-[13px] text-muted">
                    For {LABELS.gender[answers.gender]} · {match.colour.name}
                  </div>
                  <div className="mt-1 text-[26px] font-semibold tracking-[-0.02em]">{match.name}</div>
                  <div className="mt-1.5 text-sm text-muted">
                    Size tip: {answers.fit === "relaxed" ? "take your usual size" : "go one size up"}
                  </div>
                </div>
                <div className="shrink-0 text-[26px] font-semibold">{formatPrice(match.price)}</div>
              </div>
              {pickingSize ? (
                <div role="group" aria-label="Choose your size" className="grid grid-cols-6 gap-1.5">
                  {SIZES.map((s) => (
                    <ToggleChip
                      key={s}
                      pressed={false}
                      onClick={() => void addToCart(s)}
                      className="h-[60px] px-0"
                    >
                      {s}
                    </ToggleChip>
                  ))}
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setPickingSize(true)}
                  className="group flex cursor-pointer items-center justify-between bg-inverse py-1.5 pr-1.5 pl-7 text-[15px] font-medium text-on-inverse [--arrow-bg:var(--accent)] [--arrow-fg:var(--on-accent)] [--arrow-size:3rem]"
                >
                  Add to Cart
                  <ArrowTile />
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
}
