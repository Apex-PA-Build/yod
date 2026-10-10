"use client";

import Image from "next/image";
import Link from "next/link";
import { QuantityStepper } from "@/components/ui/quantity-stepper";
import { MAX_QTY_PER_LINE } from "@/shared/catalog";
import { formatPrice } from "@/shared/money";
import { useCartActions, type useCart } from "../hooks";

type Line = NonNullable<ReturnType<typeof useCart>>["lines"][number];

export function CartLine({ line }: { line: Line }) {
  const { setQuantity, remove } = useCartActions();
  const variant = { productId: line.productId, colourKey: line.colour.key, size: line.size };

  return (
    <li className="flex gap-4 border-b border-line py-5">
      <Link
        href={`/products/${line.slug}`}
        className="relative block h-[100px] w-20 shrink-0 overflow-hidden"
        style={{ background: line.colour.background }}
      >
        <Image
          src={line.colour.image}
          alt={line.colour.imageAlt}
          fill
          sizes="80px"
          className="object-cover"
          style={{ objectPosition: line.colour.focus }}
        />
      </Link>
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <Link href={`/products/${line.slug}`} className="font-semibold no-underline hover:text-accent">
              {line.name}
            </Link>
            <p className="m-0 mt-1 text-[13px] text-muted">
              {line.colour.name} · Size {line.size}
            </p>
            {line.available < line.quantity ? (
              <p role="alert" className="m-0 mt-1 text-[13px] font-semibold text-accent">
                {line.available === 0
                  ? "Sold out. Remove it to check out."
                  : `Only ${line.available} left. Lower the quantity.`}
              </p>
            ) : null}
          </div>
          <span className="shrink-0 font-semibold">{formatPrice(line.lineTotal)}</span>
        </div>
        <div className="mt-auto flex items-center justify-between gap-3">
          <QuantityStepper
            value={line.quantity}
            max={Math.max(1, Math.min(MAX_QTY_PER_LINE, line.available))}
            onChange={(q) => void setQuantity(variant, q)}
          />
          <button
            type="button"
            onClick={() => void remove(variant)}
            className="cursor-pointer text-[13px] text-subtle underline-offset-4 hover:text-fg hover:underline"
          >
            Remove<span className="sr-only"> {line.name}</span>
          </button>
        </div>
      </div>
    </li>
  );
}
