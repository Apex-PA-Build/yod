import { Banknote } from "lucide-react";

/**
 * Cash on delivery is the only method for now. Add online payments here
 * (and to PAYMENT_METHODS) when a payment gateway is connected.
 */
export function PaymentMethod() {
  return (
    <fieldset className="m-0 flex flex-col gap-4 border-0 p-0">
      <legend className="mb-5 text-[13px] font-bold tracking-[0.14em] uppercase">Payment</legend>
      <label className="flex cursor-pointer items-center gap-4 border-[1.5px] border-fg p-5">
        <input
          type="radio"
          name="paymentMethod"
          value="cod"
          defaultChecked
          className="size-4 accent-[var(--accent)]"
        />
        <Banknote aria-hidden className="size-5 text-accent" />
        <span className="flex flex-col">
          <span className="font-semibold">Cash on delivery</span>
          <span className="text-[13px] text-muted">Pay in cash or UPI when your order arrives.</span>
        </span>
      </label>
    </fieldset>
  );
}
