# YOD

Storefront for YOD designer drop shoulder tees. Built with Next.js 16 (App Router, Cache Components), Convex, Better Auth and Zod.

## What's inside

| Area                                      | Where                                          |
| ----------------------------------------- | ---------------------------------------------- |
| Pages and routing                         | `src/app` (`(site)` route group)               |
| Feature modules (components, hooks, data) | `src/features/<feature>`                       |
| Shared UI primitives                      | `src/components/ui`                            |
| Layout (header, footer, breadcrumb)       | `src/components/layout`                        |
| Zod schemas, constants, store config      | `src/shared` (used by both the app and Convex) |
| Database schema and server functions      | `convex/`                                      |

Every public Convex function takes Zod-validated arguments (`convex/lib/functions.ts`), using the same schemas as the forms in the browser. Prices are stored in paise and always re-read on the server at checkout.

Pages: home, shop, men, women, search, product (gallery, buy box, reviews with photos, size guide, comparison, cross-sell, FAQ), cart, checkout (cash on delivery), order confirmation, order tracking, account and order details, wishlist, sign in, sign up, forgot and reset password, about, contact, FAQ, size guide, shipping, returns, privacy, terms, 404.

## Setup

Requires Node 20+ and pnpm.

```bash
pnpm install
cp .env.example .env.local

# 1. Start Convex. The first run creates a deployment and fills CONVEX_DEPLOYMENT
#    and NEXT_PUBLIC_CONVEX_URL in .env.local.
pnpm dev:convex

# 2. In another terminal, set the Convex environment variables:
npx convex env set BETTER_AUTH_SECRET "$(openssl rand -base64 32)"
npx convex env set SITE_URL http://localhost:3000

# 3. Add NEXT_PUBLIC_CONVEX_SITE_URL to .env.local (your Convex URL ending in .convex.site),
#    then load the six tees from the design:
pnpm seed

# 4. Run the site
pnpm dev
```

Optional:

- **Google sign-in**: `npx convex env set GOOGLE_CLIENT_ID …`, `npx convex env set GOOGLE_CLIENT_SECRET …`, then set `NEXT_PUBLIC_GOOGLE_AUTH=true`.
- **Password reset emails**: `npx convex env set RESEND_API_KEY …` and `npx convex env set EMAIL_FROM "YOD <hello@your-domain.com>"`. Without these, reset links are logged in the Convex dashboard instead of emailed.

## Before launch

- Replace the bracketed placeholders from the design (`[X]`-day returns, `[GSM]`, fabric, model height, contact email, delivery window) in `src/shared/store-config.ts`, `src/content/faqs.ts` and the policy pages.
- Add real garment measurements to each product (`measurements` field) so the size chart fills in.
- Have the privacy policy and terms reviewed.
- Checkout supports **cash on delivery only**. Online payments need a gateway such as Razorpay.

## Managing orders

Orders move through `placed → packed → shipped → delivered` (or `cancelled`). Update one from the Convex dashboard or CLI:

```bash
npx convex run orders:setStatus '{"orderNumber":"YOD-AB12CD34","status":"shipped"}'
```

## Scripts

| Command                        | What it does                                                                    |
| ------------------------------ | ------------------------------------------------------------------------------- |
| `pnpm dev` / `pnpm dev:convex` | Next.js and Convex dev servers                                                  |
| `pnpm typecheck`               | Route types, app and Convex type checks                                         |
| `pnpm lint`                    | ESLint                                                                          |
| `pnpm test`                    | Vitest: schema and helper unit tests plus Convex function tests (`convex-test`) |
| `pnpm format`                  | Prettier with Tailwind class sorting                                            |
| `pnpm build`                   | Production build                                                                |

## Deploying

Deploy Convex with `npx convex deploy` and the site to Vercel (or any Node host). On Vercel, set the build command to `npx convex deploy --cmd 'pnpm build'` and add `CONVEX_DEPLOY_KEY`, plus `NEXT_PUBLIC_SITE_URL` and `NEXT_PUBLIC_CONVEX_SITE_URL`. Set `SITE_URL` on the production Convex deployment to your live domain.

## Notes

- `ConvexBetterAuthProvider` is passed the auth client with a type cast (`src/components/providers/convex-provider.tsx`) because of a type mismatch between `better-auth` 1.6.16+ and `@convex-dev/better-auth` 0.12.5. It works at runtime; remove the cast once the packages line up.
- `scripts/codegen-offline.mjs` regenerates `convex/_generated` without a deployment (used where Convex's servers aren't reachable). Normally `pnpm dev:convex` does this for you.
