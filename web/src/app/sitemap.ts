import type { MetadataRoute } from "next";

import { legalUpdated } from "@/features/legal/legal";
import { routing } from "@/i18n/routing";
import { absoluteUrl } from "@/lib/seo";

// The public pages a search engine should know, each in both languages and linked to its translation. The
// account, sign-in and error pages are private or passing and stay out (SEC-52).
const pages: {
  path: "" | `/${string}`;
  lastModified?: string;
  changeFrequency: "daily" | "yearly";
}[] = [
  { path: "", changeFrequency: "daily" },
  { path: "/terms", lastModified: legalUpdated, changeFrequency: "yearly" },
  { path: "/privacy", lastModified: legalUpdated, changeFrequency: "yearly" },
  { path: "/delete-account", changeFrequency: "yearly" },
];

export default function sitemap(): MetadataRoute.Sitemap {
  return pages.flatMap(({ path, lastModified, changeFrequency }) =>
    routing.locales.map((locale) => ({
      url: absoluteUrl(locale, path),
      lastModified,
      changeFrequency,
      alternates: {
        languages: Object.fromEntries(
          routing.locales.map((other) => [other, absoluteUrl(other, path)]),
        ),
      },
    })),
  );
}
