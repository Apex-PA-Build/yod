import { SectionHeading, SerifAccent } from "@/components/ui/section-heading";
import { storeConfig } from "@/shared/store-config";

const benefits = [
  { title: "Looks effortless, never sloppy", because: "dropped shoulder seam and a boxy, balanced cut." },
  { title: "Moves with you all day", because: "roomy armholes and a relaxed body that never pulls." },
  {
    title: "Styles with everything you own",
    because: "a straight hem that works loose, half-tucked or layered.",
  },
  {
    title: "Keeps its shape, wash after wash",
    because: `${storeConfig.fabric.composition} at ${storeConfig.fabric.gsm} GSM.`,
  },
];

export function Benefits() {
  return (
    <section className="flex container-page flex-col gap-14 border-t border-line pt-24 pb-[120px]">
      <SectionHeading
        title={
          <>
            Why you&apos;ll
            <br />
            <SerifAccent>live in it</SerifAccent>
          </>
        }
        description="What it does for you — and the detail that makes it happen."
      />
      <ul className="m-0 grid list-none grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-px border border-line bg-line p-0">
        {benefits.map((b, i) => (
          <li
            key={b.title}
            className="flex min-h-[300px] flex-col gap-4 bg-bg px-7 py-9 transition-colors hover:bg-surface"
          >
            <span className="text-[56px] leading-none font-semibold tracking-[-0.05em] text-accent">
              0{i + 1}
            </span>
            <span className="text-2xl leading-[1.15] font-semibold tracking-[-0.02em]">{b.title}</span>
            <span className="mt-auto border-t border-line pt-4 text-[13px] text-subtle">
              <b className="font-semibold text-muted">Because:</b> {b.because}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
