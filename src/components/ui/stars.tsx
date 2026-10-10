import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

/** Read-only star rating. Rounds to the nearest whole star. */
export function Stars({
  rating,
  size = 16,
  className,
}: {
  rating: number;
  size?: number;
  className?: string;
}) {
  const filled = Math.round(rating);
  return (
    <span className={cn("inline-flex gap-0.5", className)} role="img" aria-label={`Rated ${rating} out of 5`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          aria-hidden
          width={size}
          height={size}
          strokeWidth={0}
          className={n <= filled ? "fill-accent" : "fill-line-strong"}
        />
      ))}
    </span>
  );
}
