import type { MetadataRoute } from "next";
import { connection } from "next/server";

import { siteOrigin } from "@/lib/seo";

// Production alone may be indexed: its composition sets SECONDBITE_INDEXABLE, and staging, a workstation or a test
// build never do (docs/runbooks/ci-cd.md). Staging and production run the same image, so the variable is read at
// request time; connection() keeps the answer from being fixed at build.
export default async function robots(): Promise<MetadataRoute.Robots> {
  await connection();
  return {
    rules:
      process.env.SECONDBITE_INDEXABLE === "true"
        ? { userAgent: "*", allow: "/" }
        : { userAgent: "*", disallow: "/" },
    sitemap: new URL("/sitemap.xml", siteOrigin).toString(),
  };
}
