import { z } from "zod";
import { trackOrderSchema, type TrackOrderInput } from "@/shared/schemas/checkout";

const KEY = "yod-last-order";

/**
 * Remembers the order just placed for the confirmation page, so the email
 * never has to travel in the URL. Session storage only: it's gone when the tab closes.
 */
export function rememberLastOrder(order: TrackOrderInput) {
  try {
    sessionStorage.setItem(KEY, JSON.stringify(order));
  } catch {
    // Storage can be unavailable (private mode). The page falls back to the tracking form.
  }
}

/** Raw stored value, stable between calls so it can back useSyncExternalStore. */
export function readLastOrderRaw(): string | null {
  try {
    return sessionStorage.getItem(KEY);
  } catch {
    return null;
  }
}

export function parseLastOrder(raw: string | null, orderNumber: string): TrackOrderInput | null {
  try {
    if (!raw) return null;
    const parsed = trackOrderSchema.safeParse(JSON.parse(raw) as unknown);
    return parsed.success && parsed.data.orderNumber === orderNumber ? parsed.data : null;
  } catch {
    return null;
  }
}

export const confirmationParamsSchema = z.object({
  order: trackOrderSchema.shape.orderNumber,
});
