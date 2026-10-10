import Link from "next/link";
import { Button } from "@/components/ui/button";

export function ProductCta() {
  return (
    <section className="container-page pb-26">
      <div className="flex flex-wrap items-center justify-between gap-6 border border-accent p-10">
        <span className="text-[clamp(28px,3vw,44px)] leading-[1.05] font-semibold tracking-[-0.03em]">
          Ready to wear the drape?
        </span>
        <Button variant="accent" size="xl" caps asChild className="h-16">
          <Link href="#buy">Choose your size</Link>
        </Button>
      </div>
    </section>
  );
}
