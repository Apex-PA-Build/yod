import type { Metadata } from "next";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { AuthCard, ResetPasswordForm } from "@/features/auth";

export const metadata: Metadata = { title: "Set a new password", robots: { index: false } };

export default function ResetPasswordPage() {
  return (
    <AuthCard title="New password" description="Choose a new password for your account.">
      <Suspense fallback={<Skeleton className="h-56" />}>
        <ResetPasswordForm />
      </Suspense>
    </AuthCard>
  );
}
