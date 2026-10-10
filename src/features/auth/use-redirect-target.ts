"use client";

import type { Route } from "next";
import { useSearchParams } from "next/navigation";
import { redirectPathSchema } from "@/shared/schemas/account";

/** Where to go after signing in: a safe, same-site `?redirect=` or the account page. */
export function useRedirectTarget(): Route {
  const params = useSearchParams();
  return redirectPathSchema.parse(params.get("redirect") ?? "/account") as Route;
}
