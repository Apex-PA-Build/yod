"use client";

import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";
import { useQuery } from "convex/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import type { Size } from "@/shared/catalog";
import { ReviewForm } from "./review-form";

type Props = {
  productId: Id<"products">;
  productName: string;
  colours: { key: string; name: string }[];
  sizes: Size[];
};

/** "Write a review": sign-in prompt for guests, a form in a side panel for everyone else. */
export function WriteReview({ productId, productName, colours, sizes }: Props) {
  const pathname = usePathname();
  const status = useQuery(api.reviews.myStatus, { productId });
  const [open, setOpen] = useState(false);

  const triggerClass = "h-14";

  if (status === undefined) {
    return (
      <Button variant="outline" size="lg" caps className={triggerClass} disabled>
        Write a review
      </Button>
    );
  }

  if (!status.signedIn) {
    return (
      <Button variant="outline" size="lg" caps className={triggerClass} asChild>
        <Link href={`/sign-in?redirect=${encodeURIComponent(`${pathname}#reviews`)}`}>Sign in to review</Link>
      </Button>
    );
  }

  if (status.hasReviewed) {
    return (
      <Button variant="outline" size="lg" caps className={triggerClass} disabled>
        Thanks for your review
      </Button>
    );
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="lg" caps className={triggerClass}>
          Write a review
        </Button>
      </SheetTrigger>
      <SheetContent title={`Review the ${productName}`} className="max-w-lg">
        <div className="flex-1 overflow-y-auto px-6 py-6">
          <ReviewForm
            productId={productId}
            colours={colours}
            sizes={sizes}
            onDone={() => {
              setOpen(false);
              toast.success("Thanks! Your review is live.");
            }}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}
