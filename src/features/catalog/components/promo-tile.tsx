import Link from "next/link";

/** "Oversized on purpose" tile mixed into the product grid. */
export function PromoTile() {
  return (
    <Link
      href="/size-guide"
      className="flex aspect-[4/5] flex-col justify-between bg-accent p-7 text-on-accent no-underline"
    >
      <span className="text-xs font-bold tracking-[0.14em] uppercase">The fit</span>
      <span className="text-[clamp(28px,2.4vw,40px)] leading-[0.95] font-bold tracking-[-0.04em] uppercase">
        Oversized
        <br />
        on purpose.
      </span>
      <span className="text-sm leading-normal">
        Take your usual size for a relaxed drape — or size up for more room. <b>See the size guide →</b>
      </span>
    </Link>
  );
}
