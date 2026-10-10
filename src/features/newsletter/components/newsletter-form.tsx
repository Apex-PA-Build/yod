"use client";

import { api } from "@convex/_generated/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "convex/react";
import { useId, useState } from "react";
import { useForm } from "react-hook-form";
import { errorMessage } from "@/lib/errors";
import { newsletterSchema, type NewsletterValues } from "@/shared/schemas/contact";

export function NewsletterForm() {
  const id = useId();
  const subscribe = useMutation(api.newsletter.subscribe);
  const [status, setStatus] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<NewsletterValues>({ resolver: zodResolver(newsletterSchema) });

  const onSubmit = handleSubmit(async ({ email }) => {
    try {
      const result = await subscribe({ email, source: "home" });
      setStatus(
        result.status === "subscribed"
          ? "You're on the list. We'll email you when the next drop lands."
          : "You're already on the list. See you at the next drop.",
      );
      reset();
    } catch (error) {
      setStatus(errorMessage(error));
    }
  });

  const error = errors.email?.message;

  return (
    <form onSubmit={onSubmit} noValidate className="flex min-w-0 flex-[0_1_480px] flex-col gap-2">
      <div className="flex gap-1.5 bg-white p-1.5">
        <label htmlFor={id} className="sr-only">
          Email address
        </label>
        <input
          id={id}
          type="email"
          autoComplete="email"
          placeholder="Your email address"
          aria-invalid={error ? true : undefined}
          aria-describedby={error || status ? `${id}-msg` : undefined}
          className="min-w-0 flex-1 border-0 bg-transparent pl-5 text-[15px] text-[#111111] outline-none placeholder:text-[#767676]"
          {...register("email")}
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className="h-12 shrink-0 cursor-pointer bg-[#111111] px-[26px] text-[15px] font-medium text-white hover:bg-[#333333] disabled:opacity-60"
        >
          {isSubmitting ? "Adding…" : "Notify me"}
        </button>
      </div>
      <p id={`${id}-msg`} role={error ? "alert" : "status"} className="m-0 min-h-5 text-[13px] text-muted">
        {error ?? status}
      </p>
    </form>
  );
}
