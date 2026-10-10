import type { api } from "@convex/_generated/api";
import type { FunctionReturnType } from "convex/server";

export type RatingSummary = FunctionReturnType<typeof api.reviews.summary>;
export type PublicReview = FunctionReturnType<typeof api.reviews.list>["page"][number];
