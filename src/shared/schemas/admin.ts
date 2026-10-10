import { z } from "zod";
import { GENDERS, PRODUCT_TAGS, PRODUCT_TYPES, SIZES, VIBES } from "../catalog";
import { ADMIN_ROLES, MANUAL_STOCK_REASONS, SHIPMENT_STATUSES } from "../inventory";
import { ORDER_STATUSES } from "../orders";
import { colourKeySchema, sizeSchema, slugSchema } from "./catalog";
import { emailSchema } from "./checkout";

const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .transform((v) => v || undefined)
    .optional();

/** Whole units of stock in one change. */
export const stockQuantitySchema = z.number().int("Use whole units").min(0).max(100_000);

/** Paise amounts entered by staff (prices, unit costs). */
export const paiseSchema = z.number().int().min(0).max(100_000_000);

/** Timestamps in ms, not more than a day in the future. */
export const pastTimestampSchema = z
  .number()
  .int()
  .refine((t) => t <= Date.now() + 24 * 60 * 60 * 1000, "That date is in the future");

export const stockVariantSchema = z.object({ colourKey: colourKeySchema, size: sizeSchema });

export const STOCK_ADJUST_MODES = ["add", "remove", "set"] as const;

export const stockAdjustSchema = stockVariantSchema.extend({
  mode: z.enum(STOCK_ADJUST_MODES),
  quantity: stockQuantitySchema,
  reason: z.enum(MANUAL_STOCK_REASONS),
  note: optionalText(300),
});
export type StockAdjustValues = z.infer<typeof stockAdjustSchema>;

export const lowStockThresholdSchema = z.number().int().min(0).max(10_000);

export const stockImportLineSchema = stockVariantSchema.extend({
  quantity: stockQuantitySchema.min(1, "At least 1 unit"),
  unitCost: paiseSchema,
});

export const stockImportSchema = z.object({
  reference: z.string().trim().min(1, "Add the invoice or batch reference").max(60),
  supplier: z.string().trim().min(1, "Add the supplier").max(80),
  receivedAt: pastTimestampSchema,
  note: optionalText(500),
});
export type StockImportValues = z.infer<typeof stockImportSchema>;

export const MAX_IMPORT_LINES = 200;

export const adminOrderStatusFilterSchema = z.enum(["all", ...ORDER_STATUSES]).catch("all");

export const orderStatusUpdateSchema = z.object({ status: z.enum(ORDER_STATUSES) });

export const shipmentSchema = z.object({
  courier: z.string().trim().min(2, "Add the courier").max(60),
  trackingNumber: z
    .string()
    .trim()
    .min(4, "Add the tracking (AWB) number")
    .max(40)
    .regex(/^[A-Za-z0-9-]+$/, "Letters, numbers and dashes only"),
  trackingUrl: z
    .url("Enter a full link starting with https://")
    .max(300)
    .optional()
    .or(z.literal("").transform(() => undefined)),
  estimatedDelivery: z.number().int().optional(),
});
export type ShipmentValues = z.infer<typeof shipmentSchema>;

export const shipmentEventSchema = z.object({
  status: z.enum(SHIPMENT_STATUSES),
  location: z.string().trim().min(2, "Where was it scanned?").max(120),
  note: optionalText(300),
  at: pastTimestampSchema,
});
export type ShipmentEventValues = z.infer<typeof shipmentEventSchema>;

const hexColour = z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Use a hex colour like #1E8A4C");

export const productColourSchema = z.object({
  key: colourKeySchema,
  name: z.string().trim().min(1).max(40),
  swatch: hexColour,
  background: hexColour,
  image: z
    .string()
    .trim()
    .min(1, "Add an image")
    .max(500)
    .refine(
      (v) => v.startsWith("/") || v.startsWith("https://"),
      "Use a /products/… path or an https:// link",
    ),
  imageAlt: z.string().trim().min(3, "Describe the photo").max(160),
  focus: z
    .string()
    .trim()
    .regex(/^\d{1,3}% \d{1,3}%$/, "Like 50% 40%")
    .default("50% 45%"),
});

export const measurementSchema = z.object({
  size: sizeSchema,
  chestCm: z.number().positive().max(200),
  lengthCm: z.number().positive().max(200),
  shoulderCm: z.number().positive().max(200),
  sleeveCm: z.number().positive().max(200),
});

export const productFormSchema = z
  .object({
    name: z.string().trim().min(2).max(80),
    slug: slugSchema,
    tagline: z.string().trim().min(2).max(120),
    description: z.string().trim().min(20).max(2000),
    type: z.enum(PRODUCT_TYPES),
    tag: z.enum(PRODUCT_TAGS).optional(),
    vibe: z.enum(VIBES),
    genders: z.array(z.enum(GENDERS)).min(1, "Pick at least one range"),
    price: paiseSchema.min(100, "Price looks too low"),
    sizes: z.array(z.enum(SIZES)).min(1, "Pick at least one size"),
    colours: z.array(productColourSchema).min(1, "Add at least one colour").max(12),
    measurements: z.array(measurementSchema).max(SIZES.length).optional(),
    featuredRank: z.number().int().min(0).max(10_000),
    isActive: z.boolean(),
  })
  .refine((p) => new Set(p.colours.map((c) => c.key)).size === p.colours.length, {
    path: ["colours"],
    message: "Each colour needs a different key",
  });
export type ProductFormValues = z.infer<typeof productFormSchema>;
export type ProductFormInput = z.input<typeof productFormSchema>;

export const teamMemberSchema = z.object({ email: emailSchema, role: z.enum(ADMIN_ROLES) });
export type TeamMemberValues = z.infer<typeof teamMemberSchema>;

export const REPORT_RANGES = [7, 30, 90, 365] as const;
export const reportRangeSchema = z.object({
  from: z.number().int(),
  to: z.number().int(),
});
