import { customCtx, NoOp } from "convex-helpers/server/customFunctions";
import { zCustomMutation, zCustomQuery } from "convex-helpers/server/zod4";
import { SessionIdArg, type SessionId } from "convex-helpers/server/sessions";
import { ConvexError } from "convex/values";
import { internalMutation, mutation, query, type MutationCtx, type QueryCtx } from "../_generated/server";
import { authComponent } from "../auth";

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
