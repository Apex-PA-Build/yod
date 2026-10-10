import {
  createLoader,
  parseAsArrayOf,
  parseAsBoolean,
  parseAsString,
  parseAsStringLiteral,
} from "nuqs/server";
import { PRICE_RANGE_KEYS, SIZES, SORTS, TYPE_FILTERS } from "@/shared/catalog";

/** URL state for listings. Shared by the server loader and client hooks. */
export const catalogSearchParams = {
  type: parseAsStringLiteral(TYPE_FILTERS).withDefault("all"),
  colour: parseAsArrayOf(parseAsString).withDefault([]),
  size: parseAsArrayOf(parseAsStringLiteral(SIZES)).withDefault([]),
  price: parseAsStringLiteral(PRICE_RANGE_KEYS),
  sort: parseAsStringLiteral(SORTS).withDefault("featured"),
  compact: parseAsBoolean.withDefault(false),
};

export const loadCatalogSearchParams = createLoader(catalogSearchParams);
