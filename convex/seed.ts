import type { WithoutSystemFields } from "convex/server";
import type { Doc } from "./_generated/dataModel";
import { internalMutation } from "./_generated/server";
import { buildSearchText } from "./lib/catalog";
import { changeStock } from "./lib/inventory";
import { SIZES } from "../src/shared/catalog";

const DAY = 24 * 60 * 60 * 1000;

const DESCRIPTION =
  "Our signature drop shoulder tee. A boxy, relaxed silhouette with a lowered shoulder seam, wider sleeves and a straight hem — designed to drape, not cling.";

const colour = {
  bone: {
    key: "bone",
    name: "Bone",
    swatch: "#E9E3D6",
    background: "#D9CFBF",
    image: "/products/essential-bone.jpg",
    imageAlt: "Bone drop shoulder tee on a wooden hanger",
    focus: "50% 45%",
  },
  terracotta: {
    key: "terracotta",
    name: "Terracotta",
    swatch: "#A55E40",
    background: "#C9B9A6",
    image: "/products/clay-terracotta.jpg",
    imageAlt: "Terracotta drop shoulder tee on a wooden hanger",
    focus: "45% 30%",
  },
  washedBlack: {
    key: "washed-black",
    name: "Washed Black",
    swatch: "#2B2A28",
    background: "#CFC4B4",
    image: "/products/line-art-black.jpg",
    imageAlt: "Washed black drop shoulder tee with a line art print",
    focus: "60% 36%",
  },
  sage: {
    key: "sage",
    name: "Sage",
    swatch: "#5E6B4A",
    background: "#5E6B4A",
    image: "/products/abstract-sage.jpg",
    imageAlt: "Sage drop shoulder tee with an abstract print",
    focus: "50% 45%",
  },
  coral: {
    key: "coral-red",
    name: "Coral Red",
    swatch: "#C44A4F",
    background: "#C44A4F",
    image: "/products/coral-red.png",
    imageAlt: "Model wearing the Coral Red drop tee",
    focus: "50% 42%",
  },
  emerald: {
    key: "emerald",
    name: "Emerald",
    swatch: "#1E8A4C",
    background: "#1E8A4C",
    image: "/products/emerald.png",
    imageAlt: "Model wearing the Emerald drop tee",
    focus: "45% 42%",
  },
} as const;

type SeedProduct = Omit<WithoutSystemFields<Doc<"products">>, "searchText" | "pairedProductId">;

function products(now: number): SeedProduct[] {
  const base = {
    tagline: "Oversized. Relaxed. Everyday design.",
    description: DESCRIPTION,
    genders: ["men", "women"] as const,
    sizes: [...SIZES],
    isActive: true,
  };
  return [
    {
      ...base,
      slug: "essential-drop-tee",
      name: "Essential Drop Tee",
      type: "essential",
      tag: "bestseller",
      vibe: "minimal",
      price: 129_900,
      colours: [colour.bone, colour.terracotta, colour.washedBlack],
      featuredRank: 1,
      releasedAt: now - 3 * DAY,
      genders: [...base.genders],
    },
    {
      ...base,
      slug: "line-art-drop-tee",
      name: "Line Art Drop Tee",
      type: "graphic",
      tag: "new",
      vibe: "line-art",
      price: 149_900,
      colours: [colour.washedBlack],
      featuredRank: 2,
      releasedAt: now - 6 * DAY,
      genders: [...base.genders],
    },
    {
      ...base,
      slug: "coral-drop-tee",
      name: "Coral Drop Tee",
      type: "essential",
      tag: "trending",
      vibe: "minimal",
      price: 139_900,
      colours: [colour.coral],
      featuredRank: 3,
      releasedAt: now - 1 * DAY,
      genders: [...base.genders],
    },
    {
      ...base,
      slug: "emerald-drop-tee",
      name: "Emerald Drop Tee",
      type: "essential",
      tag: "limited",
      vibe: "minimal",
      price: 159_900,
      colours: [colour.emerald],
      featuredRank: 4,
      releasedAt: now - 4 * DAY,
      genders: [...base.genders],
    },
    {
      ...base,
      slug: "clay-drop-tee",
      name: "Clay Drop Tee",
      type: "essential",
      tag: "trending",
      vibe: "earthy",
      price: 139_900,
      colours: [colour.terracotta],
      featuredRank: 5,
      releasedAt: now - 2 * DAY,
      genders: [...base.genders],
    },
    {
      ...base,
      slug: "abstract-print-tee",
      name: "Abstract Print Tee",
      type: "graphic",
      tag: "limited",
      vibe: "bold-graphic",
      price: 159_900,
      colours: [colour.sage],
      featuredRank: 6,
      releasedAt: now - 5 * DAY,
      genders: [...base.genders],
    },
  ];
}

/**
 * Loads the six tees from the design with opening stock. Safe to run more than once:
 * `npx convex run seed:run`
 */
export const run = internalMutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db.query("products").first();
    if (existing) return { inserted: 0 };

    const ids = new Map<string, Doc<"products">["_id"]>();
    for (const p of products(Date.now())) {
      ids.set(p.slug, await ctx.db.insert("products", { ...p, searchText: buildSearchText(p) }));
    }

    // Opening stock: 25 of every colour and size, recorded as a stock count.
    for (const p of products(Date.now())) {
      const productId = ids.get(p.slug)!;
      for (const c of p.colours) {
        for (const size of p.sizes) {
          await changeStock(ctx, { productId, colourKey: c.key, size }, 25, {
            reason: "recount",
            note: "Opening stock",
          });
        }
      }
    }

    const essential = ids.get("essential-drop-tee");
    const lineArt = ids.get("line-art-drop-tee");
    if (essential && lineArt) await ctx.db.patch(essential, { pairedProductId: lineArt });

    return { inserted: ids.size };
  },
});
