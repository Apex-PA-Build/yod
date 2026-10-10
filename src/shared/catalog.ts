/**
 * Catalog vocabulary shared by the Convex backend and the Next.js app.
 * Keep this file free of framework imports: Convex bundles it too.
 */

export const SIZES = ["XS", "S", "M", "L", "XL", "XXL"] as const;
export type Size = (typeof SIZES)[number];

export const GENDERS = ["men", "women"] as const;
export type Gender = (typeof GENDERS)[number];

export const PRODUCT_TYPES = ["essential", "graphic"] as const;
export type ProductType = (typeof PRODUCT_TYPES)[number];

export const PRODUCT_TAGS = ["bestseller", "new", "trending", "limited"] as const;
export type ProductTag = (typeof PRODUCT_TAGS)[number];

export const VIBES = ["minimal", "line-art", "earthy", "bold-graphic"] as const;
export type Vibe = (typeof VIBES)[number];

export const FITS = ["relaxed", "extra-oversized"] as const;
export type Fit = (typeof FITS)[number];

export const FIT_FEEDBACK = ["small", "true", "large"] as const;
export type FitFeedback = (typeof FIT_FEEDBACK)[number];

export const SORTS = ["featured", "newest", "price-asc", "price-desc"] as const;
export type Sort = (typeof SORTS)[number];

export const TYPE_FILTERS = ["all", "essential", "graphic", "new-drops"] as const;
export type TypeFilter = (typeof TYPE_FILTERS)[number];

/** Prices are stored in paise (1 INR = 100 paise). */
export const PRICE_RANGES = [
  { key: "under-1400", label: "Under ₹1,400", min: 0, max: 139_999 },
  { key: "1400-1600", label: "₹1,400 – ₹1,600", min: 140_000, max: 160_000 },
] as const;
export type PriceRangeKey = (typeof PRICE_RANGES)[number]["key"];
export const PRICE_RANGE_KEYS = PRICE_RANGES.map((r) => r.key) as [PriceRangeKey, ...PriceRangeKey[]];

export const REVIEW_FILTERS = ["all", "five-star", "with-photos", "fit"] as const;
export type ReviewFilter = (typeof REVIEW_FILTERS)[number];

export const MAX_QTY_PER_LINE = 10;
export const MAX_CART_LINES = 30;
export const MAX_REVIEW_PHOTOS = 4;

export const LABELS = {
  gender: { men: "Men", women: "Women" },
  type: { essential: "Essential", graphic: "Graphic" },
  typeFilter: {
    all: "All",
    essential: "Essentials",
    graphic: "Graphic",
    "new-drops": "New Drops",
  },
  tag: {
    bestseller: "Bestseller",
    new: "New",
    trending: "Trending",
    limited: "Limited",
  },
  vibe: {
    minimal: "Minimal",
    "line-art": "Line Art",
    earthy: "Earthy",
    "bold-graphic": "Bold Graphic",
  },
  fit: { relaxed: "Relaxed", "extra-oversized": "Extra Oversized" },
  fitFeedback: { small: "Runs small", true: "True to size", large: "Runs large" },
  sort: {
    featured: "Featured",
    newest: "Newest",
    "price-asc": "Price: low to high",
    "price-desc": "Price: high to low",
  },
  reviewFilter: {
    all: "All",
    "five-star": "5 stars",
    "with-photos": "With photos",
    fit: "Fit",
  },
} as const;

/** Tags that count as a "new drop" in listings. */
export const NEW_DROP_TAGS: readonly ProductTag[] = ["new", "limited"];
