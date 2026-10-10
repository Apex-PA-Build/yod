import { Fragment } from "react";

const phrases = ["Drop Shoulder", "Oversized Fit", "Designer Tees", "Men & Women", "Made to Drape"];

export function Marquee() {
  const run = (
    <>
      {phrases.map((p) => (
        <Fragment key={p}>
          <span>{p}</span>
          <span className="text-accent">✺</span>
        </Fragment>
      ))}
    </>
  );
  return (
    <div aria-hidden className="overflow-hidden border-t border-line py-[26px]">
      <div className="flex w-max animate-marquee gap-10 text-[26px] font-medium tracking-[-0.01em] whitespace-nowrap">
        {run}
        {run}
      </div>
    </div>
  );
}
