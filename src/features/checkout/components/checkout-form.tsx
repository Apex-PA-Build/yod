"use client";

import { api } from "@convex/_generated/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "convex/react";
import { useSessionMutation } from "convex-helpers/react/sessions";
import { Lock } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useCart } from "@/features/cart";
import { errorCode, errorMessage } from "@/lib/errors";
import {
  shippingAddressSchema,
  type ShippingAddress,
  type ShippingAddressInput,
} from "@/shared/schemas/checkout";
import { rememberLastOrder } from "../last-order";
import { AddressFields } from "./address-fields";
import { OrderReview } from "./order-review";
import { PaymentMethod } from "./payment-method";

export function CheckoutForm() {
  const router = useRouter();
  const cart = useCart();
  const user = useQuery(api.auth.getCurrentUser);
  const placeOrder = useSessionMutation(api.orders.place);
  const [formError, setFormError] = useState<string | null>(null);

  const form = useForm<ShippingAddressInput, unknown, ShippingAddress>({
    resolver: zodResolver(shippingAddressSchema),
    defaultValues: { fullName: "", email: "", phone: "", line1: "", line2: "", city: "", pincode: "" },
  });

  // Prefill contact details for signed-in shoppers without overwriting anything typed.
  const { getValues, setValue } = form;
  useEffect(() => {
    if (!user) return;
    if (!getValues("fullName")) setValue("fullName", user.name);
    if (!getValues("email")) setValue("email", user.email);
  }, [user, getValues, setValue]);

  const onSubmit = form.handleSubmit(async (address) => {
    setFormError(null);
    try {
      const { orderNumber } = await placeOrder({ address, paymentMethod: "cod" });
      rememberLastOrder({ orderNumber, email: address.email });
      router.replace(`/checkout/confirmation?order=${orderNumber}`);
    } catch (error) {
      const code = errorCode(error);
      setFormError(
        code === "INVALID_VARIANT" || code === "CART_EMPTY"
          ? errorMessage(error)
          : errorMessage(error, "We couldn't place your order. Please check your details and try again."),
      );
    }
  });

  if (cart === undefined) {
    return (
      <div className="flex container-page flex-wrap gap-12 pb-24" aria-busy>
        <Skeleton className="h-[520px] flex-[2_1_520px]" />
        <Skeleton className="h-80 flex-[1_1_320px]" />
      </div>
    );
  }

  if (cart.lines.length === 0 && !form.formState.isSubmitSuccessful) {
    return (
      <div className="flex container-page flex-col items-start gap-6 pb-24">
        <p className="m-0 text-xl text-muted">
          Your cart is empty, so there&apos;s nothing to check out yet.
        </p>
        <Button asChild size="lg" caps>
          <Link href="/shop">Start shopping</Link>
        </Button>
      </div>
    );
  }

  return (
    <FormProvider {...form}>
      <form
        onSubmit={onSubmit}
        noValidate
        className="flex container-page flex-wrap items-start gap-x-16 gap-y-10 pb-24"
      >
        <div className="flex min-w-0 flex-[2_1_520px] flex-col gap-12">
          {user === null ? (
            <p className="m-0 border border-line bg-surface p-5 text-sm text-muted">
              Checking out as a guest.{" "}
              <Link
                href="/sign-in?redirect=/checkout"
                className="font-semibold text-fg underline underline-offset-4"
              >
                Sign in
              </Link>{" "}
              to see this order in your account later.
            </p>
          ) : null}
          <AddressFields />
          <PaymentMethod />
        </div>

        <aside className="flex min-w-0 flex-[1_1_340px] flex-col gap-6 border border-line bg-surface p-7 lg:sticky lg:top-6">
          <OrderReview cart={cart} />
          {formError ? (
            <p role="alert" className="m-0 text-sm font-semibold text-accent">
              {formError}
            </p>
          ) : null}
          <Button type="submit" variant="accent" size="lg" caps disabled={form.formState.isSubmitting}>
            <Lock aria-hidden className="size-4" />
            {form.formState.isSubmitting ? "Placing order…" : "Place order"}
          </Button>
          <p className="m-0 text-xs leading-relaxed text-subtle">
            By placing your order you agree to our{" "}
            <Link href="/terms" className="underline underline-offset-2">
              terms
            </Link>{" "}
            and{" "}
            <Link href="/returns" className="underline underline-offset-2">
              returns policy
            </Link>
            .
          </p>
        </aside>
      </form>
    </FormProvider>
  );
}
