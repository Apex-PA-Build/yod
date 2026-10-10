import { ConvexError } from "convex/values";

export type AppErrorCode =
  | "UNAUTHENTICATED"
  | "NOT_FOUND"
  | "INVALID_VARIANT"
  | "OUT_OF_RANGE"
  | "CART_EMPTY"
  | "CART_FULL"
  | "ALREADY_REVIEWED"
  | "OUT_OF_STOCK"
  | "FORBIDDEN"
  | "CONFLICT"
  | "BAD_REQUEST";

export function appError(code: AppErrorCode, message: string): never {
  throw new ConvexError({ code, message });
}
