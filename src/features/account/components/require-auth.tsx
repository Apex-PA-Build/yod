"use client";

import { useConvexAuth } from "convex/react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Client-side guard for account pages. The proxy already redirects requests
 * without a session cookie; this covers expired sessions and client navigation.
 */
export function RequireAuth({ children }: { children: ReactNode }) {
  const { isLoading, isAuthenticated } = useConvexAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace(`/sign-in?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [isLoading, isAuthenticated, router, pathname]);

  if (isLoading || !isAuthenticated) {
    return (
      <div className="flex flex-col gap-4" aria-busy>
        <span className="sr-only">Loading your account…</span>
        <Skeleton className="h-24" />
        <Skeleton className="h-48" />
      </div>
    );
  }
  return children;
}
