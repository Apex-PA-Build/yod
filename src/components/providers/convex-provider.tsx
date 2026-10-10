"use client";

import { ConvexBetterAuthProvider, type AuthClient } from "@convex-dev/better-auth/react";
import { SessionProvider } from "convex-helpers/react/sessions";
import { ConvexReactClient } from "convex/react";
import type { ReactNode } from "react";
import { env } from "@/env";
import { authClient } from "@/lib/auth-client";
import { useLocalStorage } from "@/lib/use-local-storage";

const convex = new ConvexReactClient(env.NEXT_PUBLIC_CONVEX_URL);

// better-auth releases after 1.6.15 widened `useSession` types, which the
// adapter's `AuthClient` type doesn't accept yet. The runtime shape is the same.
const client = authClient as unknown as AuthClient;

export function ConvexClientProvider({ children }: { children: ReactNode }) {
  return (
    <ConvexBetterAuthProvider client={convex} authClient={client}>
      <SessionProvider useStorage={useLocalStorage} storageKey="yod-session" ssrFriendly>
        {children}
      </SessionProvider>
    </ConvexBetterAuthProvider>
  );
}
