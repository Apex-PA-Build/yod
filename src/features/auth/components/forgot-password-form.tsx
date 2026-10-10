"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useId, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { errorProps, Field, Input } from "@/components/ui/field";
import { authClient } from "@/lib/auth-client";
import { forgotPasswordSchema, type ForgotPasswordValues } from "@/shared/schemas/account";

export function ForgotPasswordForm() {
  const id = useId();
  const [sentTo, setSentTo] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordValues>({ resolver: zodResolver(forgotPasswordSchema) });

  const onSubmit = handleSubmit(async ({ email }) => {
    // Always show the same message so the form doesn't reveal which emails have accounts.
    await authClient.requestPasswordReset({ email, redirectTo: "/reset-password" });
    setSentTo(email);
  });

  if (sentTo) {
    return (
      <p role="status" className="m-0 text-[15px] leading-relaxed">
        If an account exists for <strong>{sentTo}</strong>, a reset link is on its way. Check your inbox and
        spam folder.
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-5">
      <Field label="Email" htmlFor={`${id}-email`} error={errors.email?.message}>
        <Input
          type="email"
          autoComplete="email"
          {...errorProps(`${id}-email`, errors.email?.message)}
          {...register("email")}
        />
      </Field>
      <Button type="submit" size="lg" caps disabled={isSubmitting}>
        {isSubmitting ? "Sending…" : "Send reset link"}
      </Button>
    </form>
  );
}
