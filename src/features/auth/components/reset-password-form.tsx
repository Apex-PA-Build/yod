"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useId, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { errorProps, Field, Input } from "@/components/ui/field";
import { authClient } from "@/lib/auth-client";
import { resetPasswordSchema, type ResetPasswordValues } from "@/shared/schemas/account";

export function ResetPasswordForm() {
  const id = useId();
  const router = useRouter();
  const params = useSearchParams();
  const token = params.get("token");
  const linkError = params.get("error");
  const [formError, setFormError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordValues>({ resolver: zodResolver(resetPasswordSchema) });

  if (!token || linkError) {
    return (
      <div className="flex flex-col gap-5">
        <p role="alert" className="m-0 text-[15px]">
          This reset link is invalid or has expired.
        </p>
        <Button asChild size="lg" caps>
          <Link href="/forgot-password">Get a new link</Link>
        </Button>
      </div>
    );
  }

  const onSubmit = handleSubmit(async ({ password }) => {
    setFormError(null);
    const { error } = await authClient.resetPassword({ newPassword: password, token });
    if (error) {
      setFormError("This reset link is invalid or has expired. Request a new one.");
      return;
    }
    toast.success("Password updated. Sign in with your new password.");
    router.replace("/sign-in");
  });

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-5">
      <Field
        label="New password"
        htmlFor={`${id}-password`}
        error={errors.password?.message}
        hint="At least 8 characters."
      >
        <Input
          type="password"
          autoComplete="new-password"
          {...errorProps(`${id}-password`, errors.password?.message)}
          {...register("password")}
        />
      </Field>
      <Field label="Confirm password" htmlFor={`${id}-confirm`} error={errors.confirmPassword?.message}>
        <Input
          type="password"
          autoComplete="new-password"
          {...errorProps(`${id}-confirm`, errors.confirmPassword?.message)}
          {...register("confirmPassword")}
        />
      </Field>
      {formError ? (
        <p role="alert" className="m-0 text-sm font-semibold text-accent">
          {formError}
        </p>
      ) : null}
      <Button type="submit" size="lg" caps disabled={isSubmitting}>
        {isSubmitting ? "Saving…" : "Set new password"}
      </Button>
    </form>
  );
}
