import { customCtx, customMutation, customQuery, NoOp } from "convex-helpers/server/customFunctions";
import { zCustomMutation, zCustomQuery } from "convex-helpers/server/zod4";
import { SessionIdArg, type SessionId } from "convex-helpers/server/sessions";
import { ConvexError } from "convex/values";
import { internalMutation, mutation, query, type MutationCtx, type QueryCtx } from "../_generated/server";
import { authComponent } from "../auth";
import type { AdminRole } from "../../src/shared/inventory";

/**
 * Function builders whose `args` are Zod schemas. Every public function in
 * this app is defined with one of these so input is validated on the server
 * with the same schemas the forms use.
 */
export const zQuery = zCustomQuery(query, NoOp);
export const zMutation = zCustomMutation(mutation, NoOp);
export const zInternalMutation = zCustomMutation(internalMutation, NoOp);

export type AuthUser = { id: string; name: string; email: string };

export async function getUser(ctx: QueryCtx | MutationCtx): Promise<AuthUser | null> {
  const user = await authComponent.safeGetAuthUser(ctx);
  if (!user) return null;
  return { id: user._id, name: user.name, email: user.email };
}

export async function requireUser(ctx: QueryCtx | MutationCtx): Promise<AuthUser> {
  const user = await getUser(ctx);
  if (!user) {
    throw new ConvexError({ code: "UNAUTHENTICATED", message: "Please sign in to continue." });
  }
  return user;
}

export type AdminUser = AuthUser & { role: AdminRole };

/** The signed-in user if they are on the admin team, otherwise null. */
export async function getAdmin(ctx: QueryCtx | MutationCtx): Promise<AdminUser | null> {
  const user = await getUser(ctx);
  if (!user) return null;
  const member = await ctx.db
    .query("adminUsers")
    .withIndex("by_email", (q) => q.eq("email", user.email.toLowerCase()))
    .unique();
  return member ? { ...user, role: member.role } : null;
}

export async function requireAdmin(ctx: QueryCtx | MutationCtx, role?: "owner"): Promise<AdminUser> {
  const user = await requireUser(ctx);
  const admin = await getAdmin(ctx);
  if (!admin) {
    throw new ConvexError({ code: "FORBIDDEN", message: `${user.email} doesn't have admin access.` });
  }
  if (role === "owner" && admin.role !== "owner") {
    throw new ConvexError({ code: "FORBIDDEN", message: "Only owners can do that." });
  }
  return admin;
}

/** Admin-only builders. Every admin function uses one, so access is checked on the server. */
export const adminZQuery = zCustomQuery(
  query,
  customCtx(async (ctx) => ({ admin: await requireAdmin(ctx) })),
);
export const adminZMutation = zCustomMutation(
  mutation,
  customCtx(async (ctx) => ({ admin: await requireAdmin(ctx) })),
);
export const ownerZMutation = zCustomMutation(
  mutation,
  customCtx(async (ctx) => ({ admin: await requireAdmin(ctx, "owner") })),
);
/** For paginated admin queries, whose pagination args aren't Zod schemas. */
export const adminQuery = customQuery(
  query,
  customCtx(async (ctx) => ({ admin: await requireAdmin(ctx) })),
);
export const adminMutation = customMutation(
  mutation,
  customCtx(async (ctx) => ({ admin: await requireAdmin(ctx) })),
);

/** Zod query that requires a signed-in user and exposes it as `ctx.user`. */
export const authedZQuery = zCustomQuery(
  query,
  customCtx(async (ctx) => ({ user: await requireUser(ctx) })),
);

/** Zod mutation that requires a signed-in user and exposes it as `ctx.user`. */
export const authedZMutation = zCustomMutation(
  mutation,
  customCtx(async (ctx) => ({ user: await requireUser(ctx) })),
);

/** Guest session ids come from the browser; reject anything that isn't a short opaque token. */
function checkSessionId(sessionId: SessionId) {
  if (sessionId.length < 8 || sessionId.length > 64) {
    throw new ConvexError({ code: "BAD_REQUEST", message: "Invalid session." });
  }
  return { ctx: { sessionId }, args: {} };
}

/**
 * Zod query/mutation that also receive the browser's guest session id
 * (from convex-helpers' SessionProvider) as `ctx.sessionId`.
 */
export const sessionZQuery = zCustomQuery(query, {
  args: SessionIdArg,
  input: async (_ctx, { sessionId }) => checkSessionId(sessionId),
});

export const sessionZMutation = zCustomMutation(mutation, {
  args: SessionIdArg,
  input: async (_ctx, { sessionId }) => checkSessionId(sessionId),
});
