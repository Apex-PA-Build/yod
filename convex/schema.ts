import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { literals } from "convex-helpers/validators";
import { FIT_FEEDBACK, GENDERS, PRODUCT_TAGS, PRODUCT_TYPES, SIZES, VIBES } from "../src/shared/catalog";
import { ORDER_STATUSES } from "../src/shared/orders";

export const vSize = literals(...SIZES);
export const vGender = literals(...GENDERS);
export const vProductType = literals(...PRODUCT_TYPES);
export const vProductTag = literals(...PRODUCT_TAGS);
export const vVibe = literals(...VIBES);
export const vFitFeedback = literals(...FIT_FEEDBACK);
export const vOrderStatus = literals(...ORDER_STATUSES);

export const vColour = v.object({
  key: v.string(),
  name: v.string(),
  /** Swatch chip colour. */
  swatch: v.string(),
  /** Backdrop shown behind the product photo while it loads. */
  background: v.string(),
  image: v.string(),
  imageAlt: v.string(),
  /** CSS object-position / transform-origin for crops and zooms. */
  focus: v.string(),
});

export const vMeasurement = v.object({
  size: vSize,
  chestCm: v.number(),
  lengthCm: v.number(),
  shoulderCm: v.number(),
  sleeveCm: v.number(),
});

export const vAddress = v.object({
  fullName: v.string(),
  email: v.string(),
  phone: v.string(),
  line1: v.string(),
  line2: v.optional(v.string()),
  city: v.string(),
  state: v.string(),
  pincode: v.string(),
});

export const vCartItem = v.object({
  productId: v.id("products"),
  colourKey: v.string(),
  size: vSize,
  quantity: v.number(),
  addedAt: v.number(),
});

export default defineSchema({
  products: defineTable({
    slug: v.string(),
    name: v.string(),
    tagline: v.string(),
    description: v.string(),
    type: vProductType,
    tag: v.optional(vProductTag),
    vibe: vVibe,
    genders: v.array(vGender),
    /** Price in paise. */
    price: v.number(),
    colours: v.array(vColour),
    sizes: v.array(vSize),
    measurements: v.optional(v.array(vMeasurement)),
    /** Product suggested in "Frequently bought together". */
    pairedProductId: v.optional(v.id("products")),
    featuredRank: v.number(),
    releasedAt: v.number(),
    isActive: v.boolean(),
    /** Denormalised text for the search index. */
    searchText: v.string(),
  })
    .index("by_slug", ["slug"])
    .index("by_active_and_featured_rank", ["isActive", "featuredRank"])
    .searchIndex("search_text", {
      searchField: "searchText",
      filterFields: ["isActive"],
    }),

  carts: defineTable({
    /** `user:<id>` for signed-in shoppers, `session:<id>` for guests. */
    ownerKey: v.string(),
    items: v.array(vCartItem),
    updatedAt: v.number(),
  }).index("by_owner_key", ["ownerKey"]),

  wishlistItems: defineTable({
    userId: v.string(),
    productId: v.id("products"),
    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_user_and_product", ["userId", "productId"]),

  orders: defineTable({
    orderNumber: v.string(),
    userId: v.optional(v.string()),
    email: v.string(),
    address: vAddress,
    paymentMethod: v.literal("cod"),
    subtotal: v.number(),
    shippingFee: v.number(),
    total: v.number(),
    status: vOrderStatus,
    statusHistory: v.array(v.object({ status: vOrderStatus, at: v.number() })),
    createdAt: v.number(),
  })
    .index("by_order_number", ["orderNumber"])
    .index("by_user", ["userId"]),

  orderItems: defineTable({
    orderId: v.id("orders"),
    productId: v.id("products"),
    userId: v.optional(v.string()),
    /** Snapshot of the product at purchase time. */
    name: v.string(),
    slug: v.string(),
    colourKey: v.string(),
    colourName: v.string(),
    image: v.string(),
    size: vSize,
    quantity: v.number(),
    unitPrice: v.number(),
    createdAt: v.number(),
  })
    .index("by_order", ["orderId"])
    .index("by_product_and_created_at", ["productId", "createdAt"])
    .index("by_user_and_product", ["userId", "productId"]),

  reviews: defineTable({
    productId: v.id("products"),
    userId: v.string(),
    authorName: v.string(),
    rating: v.number(),
    title: v.string(),
    body: v.string(),
    size: vSize,
    colourKey: v.string(),
    colourName: v.string(),
    fit: v.optional(vFitFeedback),
    photoIds: v.array(v.id("_storage")),
    hasPhotos: v.boolean(),
    verifiedBuyer: v.boolean(),
    createdAt: v.number(),
  })
    .index("by_product", ["productId"])
    .index("by_product_and_rating", ["productId", "rating"])
    .index("by_product_and_has_photos", ["productId", "hasPhotos"])
    .index("by_user_and_product", ["userId", "productId"]),

  newsletterSubscribers: defineTable({
    email: v.string(),
    source: v.string(),
    createdAt: v.number(),
  }).index("by_email", ["email"]),

  contactMessages: defineTable({
    name: v.string(),
    email: v.string(),
    topic: v.string(),
    orderNumber: v.optional(v.string()),
    message: v.string(),
    userId: v.optional(v.string()),
    createdAt: v.number(),
  }).index("by_email", ["email"]),
});
