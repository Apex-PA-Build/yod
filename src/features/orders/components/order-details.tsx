import Image from "next/image";
import Link from "next/link";
import { CartSummary } from "@/features/cart";
import { formatPrice } from "@/shared/money";
import type { OrderDetail } from "../types";

export function OrderDetails({ order }: { order: OrderDetail }) {
  const { address } = order;
  return (
    <div className="flex flex-wrap items-start gap-x-16 gap-y-10">
      <section aria-labelledby="order-items" className="min-w-0 flex-[2_1_480px]">
        <h2 id="order-items" className="m-0 mb-4 text-[13px] font-bold tracking-[0.14em] uppercase">
          Items
        </h2>
        <ul className="m-0 list-none border-t border-line p-0">
          {order.items.map((item) => (
            <li key={item.id} className="flex items-center gap-4 border-b border-line py-4">
              <div className="relative h-[100px] w-20 shrink-0 overflow-hidden bg-surface">
                <Image src={item.image} alt="" fill sizes="80px" className="object-cover" />
              </div>
              <div className="min-w-0 flex-1">
                <Link
                  href={`/products/${item.slug}`}
                  className="font-semibold no-underline hover:text-accent"
                >
                  {item.name}
                </Link>
                <div className="mt-1 text-[13px] text-muted">
                  {item.colourName} · Size {item.size} · Qty {item.quantity}
                </div>
              </div>
              <span className="font-semibold">{formatPrice(item.unitPrice * item.quantity)}</span>
            </li>
          ))}
        </ul>
      </section>
      <aside className="flex min-w-0 flex-[1_1_300px] flex-col gap-8 border border-line bg-surface p-7">
        <CartSummary subtotal={order.subtotal} />
        <div className="flex flex-col gap-1.5 text-sm">
          <h2 className="m-0 mb-1 text-[13px] font-bold tracking-[0.14em] uppercase">Delivering to</h2>
          <span className="font-semibold">{address.fullName}</span>
          <span className="text-muted">
            {address.line1}
            {address.line2 ? `, ${address.line2}` : ""}
          </span>
          <span className="text-muted">
            {address.city}, {address.state} {address.pincode}
          </span>
          <span className="text-muted">{address.phone}</span>
        </div>
        <div className="flex flex-col gap-1.5 text-sm">
          <h2 className="m-0 mb-1 text-[13px] font-bold tracking-[0.14em] uppercase">Payment</h2>
          <span className="text-muted">Cash on delivery</span>
        </div>
      </aside>
    </div>
  );
}
