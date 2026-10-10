import type { Doc, Id } from "../_generated/dataModel";
import { NEW_DROP_TAGS, PRICE_RANGES, TYPE_FILTERS, type TypeFilter } from "../../src/shared/catalog";
import type { CatalogFilters } from "../../src/shared/schemas/catalog";

export type ProductCard = {
  id: Id<"products">;
  slug: string;
  name: string;
  tag: Doc<"products">["tag"];
  type: Doc<"products">["type"];
  price: number;
  colour: Doc<"products">["colours"][number];
  colourCount: number;
};

export function toProductCard(p: Doc<"products">): ProductCard {
  const colour = p.colours[0];
  if (!colour) throw new Error(`Product ${p.slug} has no colours`);
  return {
    id: p._id,
    slug: p.slug,
    name: p.name,
    tag: p.tag,
    type: p.type,
    price: p.price,
    colour,
    colourCount: p.colours.length,
  };
}

export function matchesType(p: Doc<"products">, type: TypeFilter): boolean {
  if (type === "all") return true;
  if (type === "new-drops") return p.tag !== undefined && NEW_DROP_TAGS.includes(p.tag);
  return p.type === type;
}

const sorters = {
  featured: (a, b) => a.featuredRank - b.featuredRank,
  newest: (a, b) => b.releasedAt - a.releasedAt,
  "price-asc": (a, b) => a.price - b.price || a.featuredRank - b.featuredRank,
  "price-desc": (a, b) => b.price - a.price || a.featuredRank - b.featuredRank,
} satisfies Record<CatalogFilters["sort"], (a: Doc<"products">, b: Doc<"products">) => number>;

/**
 * Applies listing filters to the active catalog. The catalog is small
 * (tens of products), so filtering in memory after one indexed read is
 * simpler and cheaper than one index per filter combination.
 */
export function filterCatalog(products: Doc<"products">[], filters: CatalogFilters) {
  const inGender = products.filter((p) => !filters.gender || p.genders.includes(filters.gender));

  const typeCounts = Object.fromEntries(
    TYPE_FILTERS.map((t) => [t, inGender.filter((p) => matchesType(p, t)).length]),
  ) as Record<TypeFilter, number>;

  const range = PRICE_RANGES.find((r) => r.key === filters.price);
  const results = inGender
    .filter((p) => matchesType(p, filters.type))
    .filter((p) => filters.colours.length === 0 || p.colours.some((c) => filters.colours.includes(c.key)))
    .filter((p) => filters.sizes.length === 0 || p.sizes.some((s) => filters.sizes.includes(s)))
    .filter((p) => !range || (p.price >= range.min && p.price <= range.max))
    .sort(sorters[filters.sort]);

  return { results, typeCounts, total: inGender.length };
}

/** Distinct colours across the given products, for the colour filter. */
export function colourFacets(products: Doc<"products">[]) {
  const seen = new Map<string, { key: string; name: string; swatch: string }>();
  for (const p of products) {
    for (const c of p.colours) {
      if (!seen.has(c.key)) seen.set(c.key, { key: c.key, name: c.name, swatch: c.swatch });
    }
  }
  return [...seen.values()];
}

export function buildSearchText(p: Pick<Doc<"products">, "name" | "colours" | "type" | "vibe" | "genders">) {
  return [p.name, p.type, p.vibe.replace("-", " "), ...p.genders, ...p.colours.map((c) => c.name)]
    .join(" ")
    .toLowerCase();
}
