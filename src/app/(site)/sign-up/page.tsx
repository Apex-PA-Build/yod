import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { AuthCard, SignUpForm } from "@/features/auth";

export const metadata: Metadata = { title: "Create an account", robots: { index: false } };

export default function SignUpPage() {
  return (
    <AuthCard
      title="Create account"
      description="One account for your orders, reviews and wishlist."
      footer={
        <>
          Already have an account?{" "}
          <Link href="/sign-in" className="font-semibold text-fg underline underline-offset-4">
            Sign in
          </Link>
        </>
      }
    >
      <Suspense fallback={<Skeleton className="h-96" />}>
        <SignUpForm />
      </Suspense>
    </AuthCard>
  );
}
