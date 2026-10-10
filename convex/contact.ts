import { getUser, zMutation } from "./lib/functions";
import { contactSchema } from "../src/shared/schemas/contact";

export const send = zMutation({
  args: contactSchema.shape,
  handler: async (ctx, message) => {
    const user = await getUser(ctx);
    await ctx.db.insert("contactMessages", {
      ...message,
      userId: user?.id,
      createdAt: Date.now(),
    });
  },
});
