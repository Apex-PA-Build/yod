"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useId, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { errorProps, Field, Input } from "@/components/ui/field";
import { authClient } from "@/lib/auth-client";
import { signUpSchema, type SignUpValues } from "@/shared/schemas/account";
import { useRedirectTarget } from "../use-redirect-target";
import { GoogleButton } from "./google-button";

export function SignUpForm() {
  const id = useId();
  const router = useRouter();
  const target = useRedirectTarget();
  const [formError, setFormError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpValues>({ resolver: zodResolver(signUpSchema) });

  const onSubmit = handleSubmit(async ({ name, email, password }) => {
    setFormError(null);
    const { error } = await authClient.signUp.email({ name, email, password });
    if (error) {
      setFormError(
        error.code === "USER_ALREADY_EXISTS" || error.status === 422
          ? "An account with this email already exists. Try signing in."
          : (error.message ?? "Couldn't create your account."),
      );
      return;
    }
    router.replace(target);
    router.refresh();
  });

  const input = (name: keyof SignUpValues) => ({
    ...errorProps(`${id}-${name}`, errors[name]?.message),
    ...register(name),
  });

  return (
    <div className="flex flex-col gap-6">
      <GoogleButton />
      <form onSubmit={onSubmit} noValidate className="flex flex-col gap-5">
        <Field label="Name" htmlFor={`${id}-name`} error={errors.name?.message}>
          <Input autoComplete="name" {...input("name")} />
        </Field>
        <Field label="Email" htmlFor={`${id}-email`} error={errors.email?.message}>
          <Input type="email" autoComplete="email" {...input("email")} />
        </Field>
        <Field
          label="Password"
          htmlFor={`${id}-password`}
          error={errors.password?.message}
          hint="At least 8 characters."
        >
          <Input type="password" autoComplete="new-password" {...input("password")} />
        </Field>
        <Field
          label="Confirm password"
          htmlFor={`${id}-confirmPassword`}
          error={errors.confirmPassword?.message}
        >
          <Input type="password" autoComplete="new-password" {...input("confirmPassword")} />
        </Field>
        {formError ? (
          <p role="alert" className="m-0 text-sm font-semibold text-accent">
            {formError}
          </p>
        ) : null}
        <Button type="submit" size="lg" caps disabled={isSubmitting}>
          {isSubmitting ? "Creating account…" : "Create account"}
        </Button>
        <p className="m-0 text-xs leading-relaxed text-subtle">
          By creating an account you agree to our{" "}
          <Link href="/terms" className="underline underline-offset-2">
            terms
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="underline underline-offset-2">
            privacy policy
          </Link>
          .
        </p>
      </form>
    </div>
  );
}
