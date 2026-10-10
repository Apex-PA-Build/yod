/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as admin_customers from "../admin/customers.js";
import type * as admin_dashboard from "../admin/dashboard.js";
import type * as admin_imports from "../admin/imports.js";
import type * as admin_inbox from "../admin/inbox.js";
import type * as admin_inventory from "../admin/inventory.js";
import type * as admin_orders from "../admin/orders.js";
import type * as admin_products from "../admin/products.js";
import type * as admin_reports from "../admin/reports.js";
import type * as admin_reviews from "../admin/reviews.js";
import type * as admin_shipments from "../admin/shipments.js";
import type * as admin_team from "../admin/team.js";
import type * as auth from "../auth.js";
import type * as cart from "../cart.js";
import type * as contact from "../contact.js";
import type * as http from "../http.js";
import type * as lib_analytics from "../lib/analytics.js";
import type * as lib_cart from "../lib/cart.js";
import type * as lib_catalog from "../lib/catalog.js";
import type * as lib_email from "../lib/email.js";
import type * as lib_errors from "../lib/errors.js";
import type * as lib_functions from "../lib/functions.js";
import type * as lib_inventory from "../lib/inventory.js";
import type * as lib_orders from "../lib/orders.js";
import type * as lib_reviews from "../lib/reviews.js";
import type * as lib_shipments from "../lib/shipments.js";
import type * as newsletter from "../newsletter.js";
import type * as orders from "../orders.js";
import type * as products from "../products.js";
import type * as reviews from "../reviews.js";
import type * as seed from "../seed.js";
import type * as wishlist from "../wishlist.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  "admin/customers": typeof admin_customers;
  "admin/dashboard": typeof admin_dashboard;
  "admin/imports": typeof admin_imports;
  "admin/inbox": typeof admin_inbox;
  "admin/inventory": typeof admin_inventory;
  "admin/orders": typeof admin_orders;
  "admin/products": typeof admin_products;
  "admin/reports": typeof admin_reports;
  "admin/reviews": typeof admin_reviews;
  "admin/shipments": typeof admin_shipments;
  "admin/team": typeof admin_team;
  auth: typeof auth;
  cart: typeof cart;
  contact: typeof contact;
  http: typeof http;
  "lib/analytics": typeof lib_analytics;
  "lib/cart": typeof lib_cart;
  "lib/catalog": typeof lib_catalog;
  "lib/email": typeof lib_email;
  "lib/errors": typeof lib_errors;
  "lib/functions": typeof lib_functions;
  "lib/inventory": typeof lib_inventory;
  "lib/orders": typeof lib_orders;
  "lib/reviews": typeof lib_reviews;
  "lib/shipments": typeof lib_shipments;
  newsletter: typeof newsletter;
  orders: typeof orders;
  products: typeof products;
  reviews: typeof reviews;
  seed: typeof seed;
  wishlist: typeof wishlist;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {
  betterAuth: import("@convex-dev/better-auth/_generated/component.js").ComponentApi<"betterAuth">;
};
