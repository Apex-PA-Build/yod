/**
 * Store policies shown across the site.
 *
 * Values in [brackets] are placeholders carried over from the design.
 * Replace them with your real policies before launch.
 */
export const storeConfig = {
  name: "YOD",
  tagline: "Designer drop shoulder tees for men and women. Relaxed by design, made to drape.",
  returnWindowDays: "[X]",
  dispatchDays: "[X]",
  deliveryWindowDays: "[X–Y]",
  /** Flat shipping fee in paise. 0 means free shipping. */
  shippingFeePaise: 0,
  fabric: {
    composition: "[Composition]",
    gsm: "[GSM]",
    finish: "[Finish]",
    madeIn: "[Country]",
  },
  model: { height: "[height]", wearsSize: "[L]" },
  contact: {
    email: "[hello@your-domain.com]",
    instagram: "#",
    whatsapp: "#",
  },
} as const;
