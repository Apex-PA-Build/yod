"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useId, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { errorProps, Field, Input } from "@/components/ui/field";
import { authClient } from "@/lib/auth-client";
import { signInSchema, type SignInValues } from "@/shared/schemas/account";
import { useRedirectTarget } from "../use-redirect-target";
import { GoogleButton } from "./google-button";

export function SignInForm() {
  const id = useId();
  const router = useRouter();
  const target = useRedirectTarget();
  const [formError, setFormError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInValues>({ resolver: zodResolver(signInSchema) });

  const onSubmit = handleSubmit(async (values) => {
    setFormError(null);
    const { error } = await authClient.signIn.email(values);
    if (error) {
      setFormError(
        error.status === 401
          ? "That email and password don't match."
          : (error.message ?? "Couldn't sign you in."),
      );
      return;
    }
    router.replace(target);
    router.refresh();
  });

  return (
    <div className="flex flex-col gap-6">
      <GoogleButton />
      <form onSubmit={onSubmit} noValidate className="flex flex-col gap-5">
        <Field label="Email" htmlFor={`${id}-email`} error={errors.email?.message}>
          <Input
            type="email"
            autoComplete="email"
            {...errorProps(`${id}-email`, errors.email?.message)}
            {...register("email")}
          />
        </Field>
        <Field label="Password" htmlFor={`${id}-password`} error={errors.password?.message}>
          <Input
            type="password"
            autoComplete="current-password"
            {...errorProps(`${id}-password`, errors.password?.message)}
            {...register("password")}
          />
        </Field>
        <Link
          href="/forgot-password"
          className="self-end text-[13px] text-muted underline-offset-4 hover:text-fg hover:underline"
        >
          Forgot password?
        </Link>
        {formError ? (
          <p role="alert" className="m-0 text-sm font-semibold text-accent">
            {formError}
          </p>
        ) : null}
        <Button type="submit" size="lg" caps disabled={isSubmitting}>
          {isSubmitting ? "Signing in…" : "Sign in"}
        </Button>
      </form>
    </div>
  );
}
