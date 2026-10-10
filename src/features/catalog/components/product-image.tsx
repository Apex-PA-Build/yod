import Image from "next/image";
import { cn } from "@/lib/utils";
import type { ProductCardData } from "../types";

type Props = {
  colour: ProductCardData["colour"];
  sizes: string;
  priority?: boolean;
  /** Cross-fade to a zoomed detail crop on hover, as in the design. */
  hoverZoom?: boolean;
  className?: string;
};

export function ProductImage({ colour, sizes, priority, hoverZoom = true, className }: Props) {
  return (
    <div
      className={cn("group/img relative overflow-hidden", className)}
      style={{ background: colour.background }}
    >
      <Image
        src={colour.image}
        alt={colour.imageAlt}
        fill
        sizes={sizes}
        priority={priority}
        className={cn(
          "object-cover transition-opacity duration-500",
          hoverZoom && "group-focus-within/card:opacity-0 group-hover/card:opacity-0",
        )}
      />
      {hoverZoom ? (
        <Image
          src={colour.image}
          alt=""
          aria-hidden
          fill
          sizes={sizes}
          className="scale-[1.9] object-cover opacity-0 transition-opacity duration-500 group-focus-within/card:opacity-100 group-hover/card:opacity-100"
          style={{ transformOrigin: colour.focus }}
        />
      ) : null}
    </div>
  );
}
