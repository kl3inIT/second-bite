import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

// The browser reaches the Go server under /api on the web's own origin, so the session cookie stays
// first-party. When deployed, the reverse proxy in front of both routes /api before Next.js sees it;
// wherever SECONDBITE_API_ORIGIN is set (development, browser tests) Next.js forwards it, dropping the
// /api prefix the Go routes do not have.
const apiOrigin = process.env.SECONDBITE_API_ORIGIN;

const nextConfig: NextConfig = {
  // The server and only the modules it traces, for the image in web/Dockerfile.
  output: "standalone",
  reactCompiler: true,
  cacheComponents: true,
  partialPrefetching: true,
  // Baseline headers, as BeyondPilot sets them; a Content Security Policy with nonces is a decision of its own.
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          // Location stays allowed for this site alone: finding offers near a point is designed (SEC-11).
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(self)" },
        ],
      },
      {
        // The admin pages are never indexed, whoever asks and whatever the page renders (SEC-62). A header
        // rather than the layout's metadata, which would add a second robots tag beside the one Next.js writes
        // on a not-found page.
        source: "/:locale(vi|en)/admin/:path*",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
    ];
  },
  async rewrites() {
    if (!apiOrigin) {
      if (process.env.NODE_ENV === "development") {
        throw new Error(
          "SECONDBITE_API_ORIGIN must be set for local development; see .env.development.",
        );
      }
      return [];
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
