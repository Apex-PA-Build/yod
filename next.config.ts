import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  typedRoutes: true,
  images: {
    formats: ["image/avif", "image/webp"],
    // Product photos uploaded from the admin app are served by Convex storage.
    remotePatterns: [{ protocol: "https", hostname: "*.convex.cloud" }],
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
