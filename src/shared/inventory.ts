/** Default "low stock" alert level for a size, used until one is set per variant. */
export const DEFAULT_LOW_STOCK = 5;

/** Product pages say "Only N left" at or below this many units. */
export const SHOW_STOCK_LEFT_AT = 5;

export const STOCK_REASONS = [
  "import",
  "adjustment",
  "sale",
  "cancellation",
  "return",
  "damaged",
  "recount",
] as const;
export type StockReason = (typeof STOCK_REASONS)[number];

export const STOCK_REASON_LABELS: Record<StockReason, string> = {
  import: "Stock import",
  adjustment: "Manual adjustment",
  sale: "Sold",
  cancellation: "Order cancelled",
  return: "Customer return",
  damaged: "Damaged / written off",
  recount: "Stock count correction",
};

/** Reasons an admin can pick when adjusting stock by hand. */
export const MANUAL_STOCK_REASONS = ["adjustment", "return", "damaged", "recount"] as const;

export const SHIPMENT_STATUSES = [
  "label_created",
  "picked_up",
  "in_transit",
  "out_for_delivery",
  "delivered",
  "delivery_failed",
  "returned_to_origin",
] as const;
export type ShipmentStatus = (typeof SHIPMENT_STATUSES)[number];

export const SHIPMENT_STATUS_LABELS: Record<ShipmentStatus, string> = {
  label_created: "Label created",
  picked_up: "Picked up",
  in_transit: "In transit",
  out_for_delivery: "Out for delivery",
  delivered: "Delivered",
  delivery_failed: "Delivery failed",
  returned_to_origin: "Returned to origin",
};

/** Shipment statuses that mean the parcel is still moving. */
export const ACTIVE_SHIPMENT_STATUSES: readonly ShipmentStatus[] = [
  "label_created",
  "picked_up",
  "in_transit",
  "out_for_delivery",
  "delivery_failed",
];

/** Suggestions for the courier field. Any name is allowed. */
export const COMMON_COURIERS = [
  "Delhivery",
  "Blue Dart",
  "DTDC",
  "Ecom Express",
  "Xpressbees",
  "Shadowfax",
  "India Post",
] as const;

export const ADMIN_ROLES = ["owner", "staff"] as const;
export type AdminRole = (typeof ADMIN_ROLES)[number];

export const variantKey = (v: { productId: string; colourKey: string; size: string }) =>
  `${v.productId}:${v.colourKey}:${v.size}`;
