import type { MetadataRoute } from "next";

import { siteOrigin } from "@/lib/seo";

// No address is public yet: staging must never be indexed (docs/runbooks/ci-cd.md). The production address,
// when it is chosen, opens this to crawlers on that host alone; the sitemap is already named for that day.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", disallow: "/" },
    sitemap: new URL("/sitemap.xml", siteOrigin).toString(),
  };
}
