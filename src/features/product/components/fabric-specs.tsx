import { storeConfig } from "@/shared/store-config";

const SPECS = [
  { label: "Fabric", value: storeConfig.fabric.composition },
  { label: "Weight", value: `${storeConfig.fabric.gsm} GSM` },
  { label: "Finish", value: storeConfig.fabric.finish },
  { label: "Made in", value: storeConfig.fabric.madeIn },
];

export function FabricSpecs() {
  return (
    <dl className="m-0 grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-px border border-line bg-line">
      {SPECS.map((s) => (
        <div key={s.label} className="flex flex-col gap-1.5 bg-bg p-[18px]">
          <dt className="text-xs tracking-[0.1em] text-subtle uppercase">{s.label}</dt>
          <dd className="m-0 text-[15px] font-semibold">{s.value}</dd>
        </div>
      ))}
    </dl>
  );
}
