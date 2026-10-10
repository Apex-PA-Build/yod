import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { RequireAuth } from "@/features/account";
import { WishlistGrid } from "@/features/wishlist";

export const metadata: Metadata = { title: "Your wishlist", robots: { index: false } };

export default function WishlistPage() {
  return (
    <>
      <PageHeader title="Wishlist" current="Wishlist" crumbs={[{ label: "Account", href: "/account" }]} />
      <div className="container-page pb-24">
        <RequireAuth>
          <WishlistGrid />
        </RequireAuth>
      </div>
    </>
  );
}
