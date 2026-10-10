import { LABELS, NEW_DROP_TAGS } from "@/shared/catalog";
import { cn } from "@/lib/utils";
import type { ProductCardData } from "../types";

export function ProductTag({ tag, className }: { tag: ProductCardData["tag"]; className?: string }) {
  if (!tag) return null;
  const highlight = NEW_DROP_TAGS.includes(tag);
  return (
    <span
      className={cn(
        "absolute top-0 left-0 px-3 py-2 text-[11px] font-bold tracking-[0.1em] uppercase",
        highlight ? "bg-accent text-on-accent" : "bg-inverse text-on-inverse",
        className,
      )}
    >
      {LABELS.tag[tag]}
    </span>
  );
}
