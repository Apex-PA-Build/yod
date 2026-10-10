import Image from "next/image";
import { Stars } from "@/components/ui/stars";
import { LABELS } from "@/shared/catalog";
import type { PublicReview } from "../types";

const dateFormat = new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric" });

export function ReviewCard({ review }: { review: PublicReview }) {
  return (
    <article className="flex flex-col gap-3 border-t border-line py-7">
      <div className="flex flex-wrap justify-between gap-3">
        <Stars rating={review.rating} />
        <time dateTime={new Date(review.createdAt).toISOString()} className="text-xs text-subtle">
          {dateFormat.format(review.createdAt)}
        </time>
      </div>
      <h3 className="m-0 text-lg font-semibold">{review.title}</h3>
      <p className="m-0 text-[15px] leading-[1.7] whitespace-pre-line text-muted">{review.body}</p>
      {review.photoUrls.length > 0 ? (
        <ul className="m-0 flex list-none flex-wrap gap-2 p-0">
          {review.photoUrls.map((url, i) => (
            <li key={url}>
              <a href={url} target="_blank" rel="noreferrer" className="block">
                <Image
                  src={url}
                  alt={`Photo ${i + 1} from ${review.authorName}`}
                  width={88}
                  height={88}
                  unoptimized
                  className="size-[88px] object-cover"
                />
              </a>
            </li>
          ))}
        </ul>
      ) : null}
      <div className="flex flex-wrap gap-2 text-xs">
        <span className="bg-surface-3 px-2.5 py-1.5">{review.authorName}</span>
        <span className="bg-surface-3 px-2.5 py-1.5">Size {review.size}</span>
        <span className="bg-surface-3 px-2.5 py-1.5">{review.colourName}</span>
        {review.fit ? (
          <span className="bg-surface-3 px-2.5 py-1.5">{LABELS.fitFeedback[review.fit]}</span>
        ) : null}
        {review.verifiedBuyer ? (
          <span className="bg-[var(--glow)] px-2.5 py-1.5 text-accent">Verified buyer</span>
        ) : null}
      </div>
    </article>
  );
}
