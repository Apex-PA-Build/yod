import type { api } from "@convex/_generated/api";
import type { FunctionReturnType } from "convex/server";

export type OrderDetail = NonNullable<FunctionReturnType<typeof api.orders.confirmation>>;
export type OrderStatusView = NonNullable<FunctionReturnType<typeof api.orders.track>>;
export type OrderSummary = FunctionReturnType<typeof api.orders.mine>[number];
