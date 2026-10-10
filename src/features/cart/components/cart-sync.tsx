"use client";

import { api } from "@convex/_generated/api";
import { useSessionMutation } from "convex-helpers/react/sessions";
import { useConvexAuth } from "convex/react";
import { useEffect, useRef } from "react";

/** Moves the guest cart into the account as soon as the shopper signs in. */
export function CartSync() {
  const { isAuthenticated } = useConvexAuth();
  const merge = useSessionMutation(api.cart.mergeGuestCart);
  const merged = useRef(false);

  useEffect(() => {
    if (!isAuthenticated) {
      merged.current = false;
      return;
    }
    if (merged.current) return;
    merged.current = true;
    merge().catch(() => {
      merged.current = false;
    });
  }, [isAuthenticated, merge]);

  return null;
}
