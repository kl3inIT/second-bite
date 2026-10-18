import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

// The browser reaches the Go server under /api on the web's own origin, so the session cookie stays
// first-party. When deployed, the reverse proxy in front of both routes /api; during local development
// Next.js forwards it, dropping the /api prefix the Go routes do not have.
const apiOrigin = process.env.SECONDBITE_API_ORIGIN;

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  async rewrites() {
    if (process.env.NODE_ENV !== "development") {
      return [];
    }
    if (!apiOrigin) {
      throw new Error(
        "SECONDBITE_API_ORIGIN must be set for local development; see .env.development.",
      );
    }
    return [{ source: "/api/:path*", destination: `${apiOrigin}/:path*` }];
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

export default createNextIntlPlugin()(nextConfig);
