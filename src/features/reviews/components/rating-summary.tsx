import { Stars } from "@/components/ui/stars";
import { LABELS } from "@/shared/catalog";
import type { RatingSummary as Summary } from "../types";

export function RatingSummary({ summary }: { summary: Summary }) {
  const { average, count, distribution, fitScore, fitLabel } = summary;

  return (
    <div className="flex min-w-0 flex-[1_1_320px] flex-col gap-6 border border-line bg-surface p-8">
      <div className="flex items-end gap-4">
        <span className="text-[88px] leading-[0.85] font-semibold tracking-[-0.05em]">
          {average === null ? "–" : average.toFixed(1)}
        </span>
        <div className="flex flex-col gap-1.5 pb-1">
          <Stars rating={average ?? 0} size={18} />
          <span className="text-[13px] text-muted">
            {count === 0 ? "No reviews yet" : `${count} review${count === 1 ? "" : "s"}`}
          </span>
        </div>
      </div>

      <ul className="m-0 flex list-none flex-col gap-2.5 p-0" aria-label="Rating breakdown">
        {distribution.map((row) => {
          const share = count === 0 ? 0 : (row.count / count) * 100;
          return (
            <li key={row.stars} className="flex items-center gap-3 text-[13px]">
              <span className="w-6 text-muted">{row.stars}★</span>
              <span className="relative h-1.5 flex-1 bg-line" aria-hidden>
                <span className="absolute inset-y-0 left-0 bg-accent" style={{ width: `${share}%` }} />
              </span>
              <span className="w-9 text-right text-subtle">
                {row.count}
                <span className="sr-only"> reviews with {row.stars} stars</span>
              </span>
            </li>
          );
        })}
      </ul>

      <div className="flex flex-col gap-2.5 border-t border-line pt-5">
        <span className="text-[13px] font-semibold tracking-[0.1em] uppercase">How it fits</span>
        {fitScore === null || fitLabel === null ? (
          <p className="m-0 text-[13px] text-subtle">Not enough fit feedback yet.</p>
        ) : (
          <>
            <div className="relative h-1.5 bg-line" aria-hidden>
              <span
                className="absolute -top-[5px] -ml-2 size-4 bg-accent"
                style={{ left: `${Math.round(fitScore * 100)}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-subtle">
              {(["small", "true", "large"] as const).map((f) => (
                <span key={f} className={f === fitLabel ? "text-fg" : undefined}>
                  {LABELS.fitFeedback[f]}
                </span>
              ))}
            </div>
            <span className="sr-only">
              Most reviewers say it is {LABELS.fitFeedback[fitLabel].toLowerCase()}.
            </span>
          </>
        )}
      </div>
    </div>
  );
}
