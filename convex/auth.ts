import { createClient, type GenericCtx } from "@convex-dev/better-auth";
import { convex } from "@convex-dev/better-auth/plugins";
import { betterAuth } from "better-auth/minimal";
import { components } from "./_generated/api";
import type { DataModel } from "./_generated/dataModel";
import { query } from "./_generated/server";
import authConfig from "./auth.config";
import { sendEmail } from "./lib/email";

const siteUrl = process.env.SITE_URL!;
/** The admin app's URL, e.g. https://admin.your-domain.com. Optional. */
const adminSiteUrl = process.env.ADMIN_SITE_URL;

export const authComponent = createClient<DataModel>(components.betterAuth);

const googleProvider =
  process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
    ? {
        google: {
          clientId: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        },
      }
    : undefined;

export const createAuth = (ctx: GenericCtx<DataModel>) =>
  betterAuth({
    baseURL: siteUrl,
    trustedOrigins: adminSiteUrl ? [siteUrl, adminSiteUrl] : [siteUrl],
    database: authComponent.adapter(ctx),
    emailAndPassword: {
      enabled: true,
      minPasswordLength: 8,
      maxPasswordLength: 128,
      requireEmailVerification: false,
      sendResetPassword: async ({ user, url }) => {
        await sendEmail({
          to: user.email,
          subject: "Reset your YOD password",
          text: `Hi ${user.name},\n\nUse this link to set a new password:\n${url}\n\nIf you didn't ask for this, you can ignore this email.`,
        });
      },
    },
    socialProviders: googleProvider,
    plugins: [convex({ authConfig })],
  });

/** The signed-in user, or null for guests. */
export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    const user = await authComponent.safeGetAuthUser(ctx);
    if (!user) return null;
    return {
      id: user._id,
      name: user.name,
      email: user.email,
      image: user.image ?? null,
      createdAt: user.createdAt,
    };
  },
});
