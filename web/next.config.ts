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
      // The service worker (SEC-25), as the Next.js guide to PWAs serves it: never cached, so a change reaches every
      // browser at its next visit, and allowed to load nothing but this site's scripts.
      {
        source: "/sw.js",
        headers: [
          { key: "Content-Type", value: "application/javascript; charset=utf-8" },
          { key: "Cache-Control", value: "no-cache, no-store, must-revalidate" },
          { key: "Content-Security-Policy", value: "default-src 'self'; script-src 'self'" },
        ],
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
