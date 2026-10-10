import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { literals } from "convex-helpers/validators";
import { FIT_FEEDBACK, GENDERS, PRODUCT_TAGS, PRODUCT_TYPES, SIZES, VIBES } from "../src/shared/catalog";
import { ADMIN_ROLES, SHIPMENT_STATUSES, STOCK_REASONS } from "../src/shared/inventory";
import { ORDER_STATUSES } from "../src/shared/orders";

export const vSize = literals(...SIZES);
export const vGender = literals(...GENDERS);
export const vProductType = literals(...PRODUCT_TYPES);
export const vProductTag = literals(...PRODUCT_TAGS);
export const vVibe = literals(...VIBES);
export const vFitFeedback = literals(...FIT_FEEDBACK);
export const vOrderStatus = literals(...ORDER_STATUSES);
export const vShipmentStatus = literals(...SHIPMENT_STATUSES);
export const vStockReason = literals(...STOCK_REASONS);
export const vAdminRole = literals(...ADMIN_ROLES);

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
    .index("by_user", ["userId"])
    .index("by_email", ["email"])
    .index("by_created_at", ["createdAt"])
    .index("by_status_and_created_at", ["status", "createdAt"]),

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
    .index("by_created_at", ["createdAt"])
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
    /** Hidden by an admin; never shown on the store. */
    hidden: v.optional(v.boolean()),
    createdAt: v.number(),
  })
    .index("by_product", ["productId"])
    .index("by_product_and_rating", ["productId", "rating"])
    .index("by_product_and_has_photos", ["productId", "hasPhotos"])
    .index("by_user_and_product", ["userId", "productId"])
    .index("by_created_at", ["createdAt"]),

  newsletterSubscribers: defineTable({
    email: v.string(),
    source: v.string(),
    createdAt: v.number(),
  })
    .index("by_email", ["email"])
    .index("by_created_at", ["createdAt"]),

  contactMessages: defineTable({
    name: v.string(),
    email: v.string(),
    topic: v.string(),
    orderNumber: v.optional(v.string()),
    message: v.string(),
    userId: v.optional(v.string()),
    /** Set when an admin marks the message as handled. */
    resolvedAt: v.optional(v.number()),
    createdAt: v.number(),
  })
    .index("by_email", ["email"])
    .index("by_created_at", ["createdAt"]),

  /** Units on hand for one colour and size of a product. */
  inventory: defineTable({
    productId: v.id("products"),
    colourKey: v.string(),
    size: vSize,
    onHand: v.number(),
    lowStockThreshold: v.number(),
    updatedAt: v.number(),
  })
    .index("by_product", ["productId"])
    .index("by_variant", ["productId", "colourKey", "size"]),

  /** Every change to stock, so the history always adds up to what's on hand. */
  stockMovements: defineTable({
    productId: v.id("products"),
    colourKey: v.string(),
    size: vSize,
    delta: v.number(),
    balanceAfter: v.number(),
    reason: vStockReason,
    orderId: v.optional(v.id("orders")),
    importId: v.optional(v.id("stockImports")),
    note: v.optional(v.string()),
    actorEmail: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index("by_created_at", ["createdAt"])
    .index("by_order", ["orderId"])
    .index("by_product_and_created_at", ["productId", "createdAt"])
    .index("by_reason_and_created_at", ["reason", "createdAt"]),

  /** A batch of new stock received from a supplier. */
  stockImports: defineTable({
    reference: v.string(),
    supplier: v.string(),
    note: v.optional(v.string()),
    receivedAt: v.number(),
    lines: v.array(
      v.object({
        productId: v.id("products"),
        productName: v.string(),
        colourKey: v.string(),
        colourName: v.string(),
        size: vSize,
        quantity: v.number(),
        /** Cost per unit in paise. */
        unitCost: v.number(),
      }),
    ),
    totalUnits: v.number(),
    totalCost: v.number(),
    createdBy: v.string(),
    createdAt: v.number(),
  })
    .index("by_received_at", ["receivedAt"])
    .index("by_reference", ["reference"]),

  shipments: defineTable({
    orderId: v.id("orders"),
    orderNumber: v.string(),
    courier: v.string(),
    trackingNumber: v.string(),
    trackingUrl: v.optional(v.string()),
    status: vShipmentStatus,
    /** Where the parcel was last scanned, e.g. "Bengaluru hub". */
    currentLocation: v.optional(v.string()),
    destinationCity: v.string(),
    destinationState: v.string(),
    estimatedDelivery: v.optional(v.number()),
    deliveredAt: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_order", ["orderId"])
    .index("by_tracking_number", ["trackingNumber"])
    .index("by_status_and_updated_at", ["status", "updatedAt"])
    .index("by_updated_at", ["updatedAt"]),

  /** Scan history for a shipment: what happened, where and when. */
  shipmentEvents: defineTable({
    shipmentId: v.id("shipments"),
    status: vShipmentStatus,
    location: v.string(),
    note: v.optional(v.string()),
    at: v.number(),
    createdBy: v.optional(v.string()),
  }).index("by_shipment_and_at", ["shipmentId", "at"]),

  /** Who can open the admin dashboard. Matched on the signed-in user's email. */
  adminUsers: defineTable({
    email: v.string(),
    role: vAdminRole,
    addedBy: v.optional(v.string()),
    createdAt: v.number(),
  }).index("by_email", ["email"]),
});
