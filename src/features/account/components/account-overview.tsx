"use client";

import { api } from "@convex/_generated/api";
import { useQuery } from "convex/react";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { SignOutButton } from "@/features/auth";
import { formatDate, OrderList } from "@/features/orders";

export function AccountOverview() {
  const user = useQuery(api.auth.getCurrentUser);
  const orders = useQuery(api.orders.mine);

  return (
    <div className="flex flex-wrap items-start gap-x-16 gap-y-10">
      <section aria-labelledby="orders-title" className="min-w-0 flex-[2_1_520px]">
        <h2 id="orders-title" className="m-0 mb-4 text-[13px] font-bold tracking-[0.14em] uppercase">
          Your orders
        </h2>
        {orders === undefined ? <Skeleton className="h-40" /> : <OrderList orders={orders} />}
      </section>
      <aside className="flex min-w-0 flex-[1_1_300px] flex-col gap-6 border border-line bg-surface p-7">
        <h2 className="m-0 text-[13px] font-bold tracking-[0.14em] uppercase">Profile</h2>
        {user ? (
          <dl className="m-0 flex flex-col gap-4 text-sm">
            <div>
              <dt className="text-subtle">Name</dt>
              <dd className="m-0 font-semibold">{user.name}</dd>
            </div>
            <div>
              <dt className="text-subtle">Email</dt>
              <dd className="m-0 font-semibold break-all">{user.email}</dd>
            </div>
            <div>
              <dt className="text-subtle">Member since</dt>
              <dd className="m-0 font-semibold">{formatDate(user.createdAt)}</dd>
            </div>
          </dl>
        ) : (
          <Skeleton className="h-32" />
        )}
        <div className="flex flex-col gap-3 border-t border-line pt-6">
          <Link href="/wishlist" className="text-sm font-semibold underline-offset-4 hover:underline">
            Your wishlist
          </Link>
          <Link href="/track-order" className="text-sm font-semibold underline-offset-4 hover:underline">
            Track a guest order
          </Link>
        </div>
        <SignOutButton />
      </aside>
    </div>
  );
}
