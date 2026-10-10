"use client";

import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";
import { useSessionMutation, useSessionQuery } from "convex-helpers/react/sessions";
import { useCallback } from "react";
import { toast } from "sonner";
import { errorMessage } from "@/lib/errors";
import type { Size } from "@/shared/catalog";

export type CartLineVariant = { productId: Id<"products">; colourKey: string; size: Size };

/** The shopper's cart. `undefined` while loading. */
export function useCart() {
  return useSessionQuery(api.cart.get);
}

export function useCartActions() {
  const add = useSessionMutation(api.cart.add);
  const addMany = useSessionMutation(api.cart.addMany);
  const setQuantity = useSessionMutation(api.cart.setQuantity);
  const remove = useSessionMutation(api.cart.remove);

  const run = useCallback(async <T>(action: () => Promise<T>): Promise<T | null> => {
    try {
      return await action();
    } catch (error) {
      toast.error(errorMessage(error));
      return null;
    }
  }, []);

  return {
    add: (line: CartLineVariant & { quantity: number }) => run(() => add(line)),
    addMany: (lines: (CartLineVariant & { quantity: number })[]) => run(() => addMany({ lines })),
    setQuantity: (line: CartLineVariant, quantity: number) => run(() => setQuantity({ ...line, quantity })),
    remove: (line: CartLineVariant) => run(() => remove(line)),
  };
}
