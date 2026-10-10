import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SerifAccent } from "@/components/ui/section-heading";

export default function NotFound() {
  return (
    <div className="flex container-page flex-col items-start gap-8 py-32">
      <span className="text-sm font-medium text-accent">404</span>
      <h1 className="m-0 text-[clamp(2.75rem,6vw,6rem)] leading-[0.9] font-semibold tracking-[-0.05em] uppercase">
        Lost the <SerifAccent>drop?</SerifAccent>
      </h1>
      <p className="m-0 max-w-md text-[15px] leading-relaxed text-muted">
        We couldn&apos;t find that page. It may have moved, or the tee may have sold out.
      </p>
      <div className="flex flex-wrap gap-3">
        <Button asChild size="lg" caps>
          <Link href="/shop">Shop all tees</Link>
        </Button>
        <Button asChild variant="outline" size="lg" caps>
          <Link href="/">Go home</Link>
        </Button>
      </div>
    </div>
  );
}
