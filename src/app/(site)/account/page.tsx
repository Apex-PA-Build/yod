import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { AccountOverview, RequireAuth } from "@/features/account";

export const metadata: Metadata = { title: "Your account", robots: { index: false } };

export default function AccountPage() {
  return (
    <>
      <PageHeader title="Your account" current="Account" />
      <div className="container-page pb-24">
        <RequireAuth>
          <AccountOverview />
        </RequireAuth>
      </div>
    </>
  );
}
