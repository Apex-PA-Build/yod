"use client";

import Link from "next/link";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex container-page flex-col items-start gap-8 py-32">
      <h1 className="m-0 text-[clamp(2.5rem,5vw,4.5rem)] leading-[0.95] font-semibold tracking-[-0.05em] uppercase">
        Something went wrong
      </h1>
      <p className="m-0 max-w-md text-[15px] leading-relaxed text-muted">
        Sorry about that. Try again, and if it keeps happening, let us know.
        {error.digest ? (
          <span className="mt-2 block text-xs text-subtle">Reference: {error.digest}</span>
        ) : null}
      </p>
      <div className="flex flex-wrap gap-3">
        <Button size="lg" caps onClick={reset}>
          Try again
        </Button>
        <Button asChild variant="outline" size="lg" caps>
          <Link href="/contact">Contact us</Link>
        </Button>
      </div>
    </div>
  );
}
