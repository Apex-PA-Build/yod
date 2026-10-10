import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { AuthCard, SignInForm } from "@/features/auth";

export const metadata: Metadata = { title: "Sign in", robots: { index: false } };

export default function SignInPage() {
  return (
    <AuthCard
      title="Sign in"
      description="Track orders, save tees to your wishlist and check out faster."
      footer={
        <>
          New to YOD?{" "}
          <Link href="/sign-up" className="font-semibold text-fg underline underline-offset-4">
            Create an account
          </Link>
        </>
      }
    >
      <Suspense fallback={<Skeleton className="h-72" />}>
        <SignInForm />
      </Suspense>
    </AuthCard>
  );
}
