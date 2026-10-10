import { z } from "zod";
import { zMutation } from "./lib/functions";
import { newsletterSchema } from "../src/shared/schemas/contact";

export const subscribe = zMutation({
  args: { ...newsletterSchema.shape, source: z.enum(["home", "footer"]).default("home") },
  handler: async (ctx, { email, source }) => {
    const existing = await ctx.db
      .query("newsletterSubscribers")
      .withIndex("by_email", (q) => q.eq("email", email))
      .unique();
    if (existing) return { status: "already-subscribed" as const };
    await ctx.db.insert("newsletterSubscribers", { email, source, createdAt: Date.now() });
    return { status: "subscribed" as const };
  },
});
