"use client";

import Image from "next/image";
import { useState } from "react";
import { WishlistButton } from "@/features/wishlist";
import { cn } from "@/lib/utils";
import { useProductSelection } from "../selection";

/** Zoomed crops of the same photo, as in the design. Replace with real detail shots when you have them. */
const views = [
  { label: "Front", zoom: 1, origin: "50% 50%" },
  { label: "Collar", zoom: 2.3, origin: "50% 24%" },
  { label: "Dropped seam", zoom: 2.5, origin: "24% 36%" },
  { label: "Hem & fabric", zoom: 2.1, origin: "50% 82%" },
];

export function ProductGallery({ isNew }: { isNew: boolean }) {
  const { product, colour } = useProductSelection();
  const [viewIndex, setViewIndex] = useState(0);
  const view = views[viewIndex] ?? views[0]!;

  return (
    <div className="flex min-w-0 flex-[1_1_560px] flex-col gap-3.5">
      <div className="relative aspect-[4/5] overflow-hidden" style={{ background: colour.background }}>
        <Image
          key={colour.key}
          src={colour.image}
          alt={`${colour.name} ${product.name} — ${view.label} view`}
          fill
          priority
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-cover transition-transform duration-500 ease-[cubic-bezier(.2,.7,.2,1)]"
          style={{
            objectPosition: colour.focus,
            transform: `scale(${view.zoom})`,
            transformOrigin: view.origin,
          }}
        />
        {isNew ? (
          <span className="absolute top-5 left-5 bg-accent px-3.5 py-2 text-xs font-semibold tracking-[0.1em] text-on-accent uppercase">
            New Drop
          </span>
        ) : null}
        <span className="absolute bottom-5 left-5 bg-bg/85 px-3.5 py-2 text-[13px] font-medium">
          {view.label} · {viewIndex + 1} / {views.length}
        </span>
        <WishlistButton
          productId={product.id}
          productName={product.name}
          tone="gallery"
          className="absolute top-3.5 right-3.5"
        />
      </div>
      <div className="grid grid-cols-4 gap-3.5">
        {views.map((v, i) => (
          <button
            key={v.label}
            type="button"
            aria-label={`Show ${v.label} view`}
            aria-pressed={i === viewIndex}
            onClick={() => setViewIndex(i)}
            className={cn(
              "relative aspect-square cursor-pointer overflow-hidden border-2 transition-opacity hover:opacity-100",
              i === viewIndex ? "border-accent opacity-100" : "border-line opacity-60",
            )}
            style={{ background: colour.background }}
          >
            <Image
              src={colour.image}
              alt=""
              fill
              sizes="120px"
              className="object-cover"
              style={{
                objectPosition: colour.focus,
                transform: `scale(${v.zoom})`,
                transformOrigin: v.origin,
              }}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
