import { zid } from "convex-helpers/server/zod4";
import { query } from "../_generated/server";
import { appError } from "../lib/errors";
import { adminZQuery, getAdmin, ownerZMutation, zInternalMutation } from "../lib/functions";
import { teamMemberSchema } from "../../src/shared/schemas/admin";

/** The signed-in admin, or null. The admin app uses this to decide what to show. */
export const me = query({
  args: {},
  handler: async (ctx) => {
    const admin = await getAdmin(ctx);
    return admin && { email: admin.email, name: admin.name, role: admin.role };
  },
});

export const list = adminZQuery({
  args: {},
  handler: async (ctx) => {
    const members = await ctx.db.query("adminUsers").collect();
    return members
      .map((m) => ({
        id: m._id,
        email: m.email,
        role: m.role,
        addedBy: m.addedBy ?? null,
        createdAt: m.createdAt,
      }))
      .sort((a, b) => a.createdAt - b.createdAt);
  },
});

export const add = ownerZMutation({
  args: teamMemberSchema.shape,
  handler: async (ctx, { email, role }) => {
    const existing = await ctx.db
      .query("adminUsers")
      .withIndex("by_email", (q) => q.eq("email", email))
      .unique();
    if (existing) {
      await ctx.db.patch(existing._id, { role });
      return;
    }
    await ctx.db.insert("adminUsers", { email, role, addedBy: ctx.admin.email, createdAt: Date.now() });
  },
});

export const remove = ownerZMutation({
  args: { id: zid("adminUsers") },
  handler: async (ctx, { id }) => {
    const member = await ctx.db.get(id);
    if (!member) return;
    if (member.email === ctx.admin.email.toLowerCase()) appError("CONFLICT", "You can't remove yourself.");
    await ctx.db.delete(id);
  },
});

/**
 * Gives someone admin access from the CLI. Use it once to add the first owner:
 * `npx convex run admin/team:grant '{"email":"you@example.com","role":"owner"}'`
 * They sign up on the store (or admin app) with that email.
 */
export const grant = zInternalMutation({
  args: teamMemberSchema.shape,
  handler: async (ctx, { email, role }) => {
    const existing = await ctx.db
      .query("adminUsers")
      .withIndex("by_email", (q) => q.eq("email", email))
      .unique();
    if (existing) await ctx.db.patch(existing._id, { role });
    else await ctx.db.insert("adminUsers", { email, role, addedBy: "cli", createdAt: Date.now() });
  },
});
