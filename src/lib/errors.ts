import { ConvexError } from "convex/values";

const FALLBACK = "Something went wrong. Please try again.";

/**
 * Turns an error thrown by a Convex function or Better Auth into a message
 * that is safe to show. Server errors that aren't ConvexErrors are hidden.
 */
export function errorMessage(error: unknown, fallback = FALLBACK): string {
  if (error instanceof ConvexError) {
    const data = error.data as { message?: unknown } | string;
    if (typeof data === "string") return data;
    if (typeof data?.message === "string") return data.message;
  }
  return fallback;
}

export function errorCode(error: unknown): string | undefined {
  if (error instanceof ConvexError) {
    const data = error.data as { code?: unknown };
    return typeof data?.code === "string" ? data.code : undefined;
  }
  return undefined;
}
