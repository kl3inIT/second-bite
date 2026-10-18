import type { MetadataRoute } from "next";

// No address is public yet: staging must never be indexed (docs/runbooks/ci-cd.md). The production address,
// when it is chosen, opens this to crawlers on that host alone.
export default function robots(): MetadataRoute.Robots {
  return { rules: { userAgent: "*", disallow: "/" } };
}
