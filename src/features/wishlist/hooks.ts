"use client";

import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";
import { useConvexAuth, useMutation, useQuery } from "convex/react";
import { usePathname, useRouter } from "next/navigation";
import { useMemo } from "react";
import { toast } from "sonner";
import { errorMessage } from "@/lib/errors";

export function useWishlist() {
  const { isAuthenticated } = useConvexAuth();
  const ids = useQuery(api.wishlist.ids);
  const toggleMutation = useMutation(api.wishlist.toggle);
  const router = useRouter();
  const pathname = usePathname();

  const saved = useMemo(() => new Set(ids ?? []), [ids]);

  async function toggle(productId: Id<"products">, name: string) {
    if (!isAuthenticated) {
      toast("Sign in to save tees to your wishlist.");
      router.push(`/sign-in?redirect=${encodeURIComponent(pathname)}`);
      return;
    }
    try {
      const { saved: nowSaved } = await toggleMutation({ productId });
      toast.success(nowSaved ? `${name} saved to your wishlist` : `${name} removed from your wishlist`);
    } catch (error) {
      toast.error(errorMessage(error));
    }
  }

  return { isSaved: (id: Id<"products">) => saved.has(id), toggle };
}
