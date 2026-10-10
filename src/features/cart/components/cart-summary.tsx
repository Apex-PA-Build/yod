import { formatPrice } from "@/shared/money";
import { storeConfig } from "@/shared/store-config";

export function CartSummary({ subtotal }: { subtotal: number }) {
  const shipping = storeConfig.shippingFeePaise;
  return (
    <dl className="m-0 flex flex-col gap-3 text-sm">
      <div className="flex justify-between">
        <dt className="text-muted">Subtotal</dt>
        <dd className="m-0 font-semibold">{formatPrice(subtotal)}</dd>
      </div>
      <div className="flex justify-between">
        <dt className="text-muted">Shipping</dt>
        <dd className="m-0 font-semibold">{shipping === 0 ? "Free" : formatPrice(shipping)}</dd>
      </div>
      <div className="flex justify-between border-t border-line pt-3 text-base">
        <dt className="font-semibold">Total</dt>
        <dd className="m-0 font-semibold">{formatPrice(subtotal + shipping)}</dd>
      </div>
      <p className="m-0 text-xs text-subtle">Prices include all taxes.</p>
    </dl>
  );
}
