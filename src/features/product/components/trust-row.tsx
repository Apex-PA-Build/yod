import { Lock, Package, RotateCcw } from "lucide-react";
import { storeConfig } from "@/shared/store-config";

const items = [
  { Icon: Lock, label: "Secure checkout" },
  { Icon: RotateCcw, label: `${storeConfig.returnWindowDays}-day easy returns` },
  { Icon: Package, label: "Quality checked" },
];

export function TrustRow() {
  return (
    <ul className="m-0 grid list-none grid-cols-3 gap-px border border-line bg-line p-0">
      {items.map(({ Icon, label }) => (
        <li key={label} className="flex flex-col gap-2 bg-bg p-4 text-[13px]">
          <Icon className="size-[22px] text-accent" strokeWidth={1.8} aria-hidden />
          {label}
        </li>
      ))}
    </ul>
  );
}
