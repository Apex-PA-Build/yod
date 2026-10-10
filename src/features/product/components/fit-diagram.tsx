import { storeConfig } from "@/shared/store-config";

/** Flat tee sketch with the four measurement lines. Gold dashes mark the dropped seam. */
export function FitDiagram() {
  const label = "fill-accent text-base font-semibold";
  return (
    <figure className="m-0 flex min-w-0 flex-[1_1_380px] flex-col gap-5 border border-line bg-surface p-8">
      <svg
        viewBox="0 0 400 360"
        className="h-auto w-full"
        role="img"
        aria-label="Measurement guide: A chest, B length, C shoulder, D sleeve"
      >
        <path
          d="M150 40 Q200 68 250 40 L320 58 L385 155 L338 180 L322 148 L322 330 L78 330 L78 148 L62 180 L15 155 L80 58 Z"
          className="fill-surface-3 stroke-fg"
          strokeWidth={2}
          strokeLinejoin="round"
        />
        <path
          d="M92 56 Q86 105 78 148 M308 56 Q314 105 322 148"
          fill="none"
          className="stroke-accent"
          strokeWidth={3}
          strokeDasharray="7 6"
        />
        <g className="stroke-accent" strokeWidth={1.5}>
          <path d="M80 200 H320" />
          <path d="M350 58 V330" />
          <path d="M92 30 H308" />
          <path d="M320 60 L380 150" />
        </g>
        <text x="200" y="192" textAnchor="middle" className={label}>
          A
        </text>
        <text x="362" y="200" className={label}>
          B
        </text>
        <text x="200" y="22" textAnchor="middle" className={label}>
          C
        </text>
        <text x="364" y="96" className={label}>
          D
        </text>
      </svg>
      <figcaption className="text-[13px] leading-relaxed text-muted">
        Gold dashes mark the dropped shoulder seam. Model is {storeConfig.model.height} and wears size{" "}
        {storeConfig.model.wearsSize}.
      </figcaption>
    </figure>
  );
}
