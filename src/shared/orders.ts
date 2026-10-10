export const ORDER_STATUSES = ["placed", "packed", "shipped", "delivered", "cancelled"] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];

/** The happy path shown as a timeline, in order. */
export const ORDER_TIMELINE = ["placed", "packed", "shipped", "delivered"] as const;

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  placed: "Ordered",
  packed: "Packed",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
};
