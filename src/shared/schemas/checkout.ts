import { z } from "zod";

export const INDIAN_STATES = [
  "Andaman and Nicobar Islands",
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chandigarh",
  "Chhattisgarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jammu and Kashmir",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Ladakh",
  "Lakshadweep",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Puducherry",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
] as const;

export const pincodeSchema = z
  .string()
  .trim()
  .regex(/^[1-9][0-9]{5}$/, "Enter a valid 6-digit PIN code");

export const phoneSchema = z
  .string()
  .trim()
  .transform((v) => v.replace(/[\s-]/g, "").replace(/^(\+91|0)/, ""))
  .pipe(z.string().regex(/^[6-9][0-9]{9}$/, "Enter a valid 10-digit mobile number"));

export const emailSchema = z.email("Enter a valid email address").trim().toLowerCase().max(254);

export const shippingAddressSchema = z.object({
  fullName: z.string().trim().min(2, "Enter your full name").max(80),
  email: emailSchema,
  phone: phoneSchema,
  line1: z.string().trim().min(3, "Enter your address").max(120),
  line2: z
    .string()
    .trim()
    .max(120)
    .transform((v) => v || undefined)
    .optional(),
  city: z.string().trim().min(2, "Enter your city").max(60),
  state: z.enum(INDIAN_STATES, { error: "Choose your state" }),
  pincode: pincodeSchema,
});
export type ShippingAddress = z.infer<typeof shippingAddressSchema>;
export type ShippingAddressInput = z.input<typeof shippingAddressSchema>;

export const PAYMENT_METHODS = ["cod"] as const;

export const placeOrderSchema = z.object({
  address: shippingAddressSchema,
  paymentMethod: z.enum(PAYMENT_METHODS),
});

export const orderNumberSchema = z
  .string()
  .trim()
  .toUpperCase()
  .regex(/^YOD-[0-9A-Z]{8}$/, "Order numbers look like YOD-AB12CD34");

export const trackOrderSchema = z.object({
  orderNumber: orderNumberSchema,
  email: emailSchema,
});
export type TrackOrderInput = z.infer<typeof trackOrderSchema>;
