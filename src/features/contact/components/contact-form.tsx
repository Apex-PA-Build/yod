"use client";

import { api } from "@convex/_generated/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "convex/react";
import { useId, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { errorProps, Field, Input, NativeSelect, Textarea } from "@/components/ui/field";
import { errorMessage } from "@/lib/errors";
import { CONTACT_TOPICS, contactSchema, type ContactValues } from "@/shared/schemas/contact";

const TOPIC_LABELS: Record<(typeof CONTACT_TOPICS)[number], string> = {
  order: "An order",
  sizing: "Sizing and fit",
  returns: "Returns and exchanges",
  other: "Something else",
};

export function ContactForm() {
  const id = useId();
  const send = useMutation(api.contact.send);
  const [sent, setSent] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<ContactValues>({ resolver: zodResolver(contactSchema), defaultValues: { topic: "order" } });

  const topic = useWatch({ control, name: "topic" });

  const onSubmit = handleSubmit(async (values) => {
    setFormError(null);
    try {
      await send({ ...values, orderNumber: values.orderNumber || undefined });
      setSent(true);
    } catch (error) {
      setFormError(errorMessage(error));
    }
  });

  if (sent) {
    return (
      <p role="status" className="m-0 border border-accent p-7 text-lg">
        Thanks, your message is with us. We&apos;ll reply by email.
      </p>
    );
  }

  const input = (name: keyof ContactValues) => ({
    ...errorProps(`${id}-${name}`, errors[name]?.message),
    ...register(name),
  });

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Name" htmlFor={`${id}-name`} error={errors.name?.message}>
          <Input autoComplete="name" {...input("name")} />
        </Field>
        <Field label="Email" htmlFor={`${id}-email`} error={errors.email?.message}>
          <Input type="email" autoComplete="email" {...input("email")} />
        </Field>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Topic" htmlFor={`${id}-topic`} error={errors.topic?.message}>
          <NativeSelect {...input("topic")}>
            {CONTACT_TOPICS.map((t) => (
              <option key={t} value={t}>
                {TOPIC_LABELS[t]}
              </option>
            ))}
          </NativeSelect>
        </Field>
        {topic === "order" || topic === "returns" ? (
          <Field
            label="Order number (optional)"
            htmlFor={`${id}-orderNumber`}
            error={errors.orderNumber?.message}
          >
            <Input placeholder="YOD-AB12CD34" {...input("orderNumber")} />
          </Field>
        ) : null}
      </div>
      <Field label="Message" htmlFor={`${id}-message`} error={errors.message?.message}>
        <Textarea rows={6} maxLength={2000} {...input("message")} />
      </Field>
      {formError ? (
        <p role="alert" className="m-0 text-sm font-semibold text-accent">
          {formError}
        </p>
      ) : null}
      <Button type="submit" size="lg" caps disabled={isSubmitting} className="self-start">
        {isSubmitting ? "Sending…" : "Send message"}
      </Button>
    </form>
  );
}
