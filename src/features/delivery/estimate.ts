import { pincodeSchema } from "@/shared/schemas/checkout";
import { storeConfig } from "@/shared/store-config";

export type DeliveryEstimate =
  { ok: true; pincode: string; message: string } | { ok: false; message: string };

/**
 * Delivery estimate for a PIN code. Uses the store's standard window for
 * every valid PIN; plug a courier serviceability API in here when you have one.
 */
export function estimateDelivery(input: unknown): DeliveryEstimate {
  const parsed = pincodeSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? "Enter a valid 6-digit PIN code" };
  }
  return {
    ok: true,
    pincode: parsed.data,
    message: `Delivery to ${parsed.data}: estimated in ${storeConfig.deliveryWindowDays} business days.`,
  };
}
