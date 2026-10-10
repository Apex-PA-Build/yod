const inr = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

/** Formats a paise amount as rupees, e.g. 129900 -> "₹1,299". */
export function formatPrice(paise: number): string {
  return inr.format(paise / 100);
}
