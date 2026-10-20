import type { Metadata } from "next";

import { routing } from "@/i18n/routing";

/**
 * The public origin the absolute addresses of search engines are built on: canonical and alternate links,
 * Open Graph and the sitemap. Set at build time; until a production address is chosen it is staging's, the
 * only public host (docs/increments/active/sec-52-legal-error-account-screens/design.md).
 */
export const siteOrigin = new URL(
  process.env.SECONDBITE_SITE_ORIGIN ?? "https://secondbite.vadan.app",
);

/** A page's address in one language: `/vi`, `/en/terms`. */
export function localePath(locale: string, path: `/${string}` | "" = ""): string {
  return `/${locale}${path}`;
}

/** The absolute address of a page in one language. */
export function absoluteUrl(locale: string, path: `/${string}` | "" = ""): string {
  return new URL(localePath(locale, path), siteOrigin).toString();
}

const ogLocales: Record<string, string> = { vi: "vi_VN", en: "en_US" };

/**
 * The metadata a public page gives search and answer engines: its title and description, its canonical
 * address, the same page in the other language (and `x-default`, the Vietnamese one), and Open Graph for a
 * shared link. A private page passes `index: false` and gets `noindex` instead of alternates.
 */
export function pageMetadata({
  locale,
  path = "",
  title,
  description,
  index = true,
}: {
  locale: string;
  path?: `/${string}` | "";
  title?: string;
  description?: string;
  index?: boolean;
}): Metadata {
  // A key left undefined would wipe the layout's title or description instead of inheriting it.
  const own: Metadata = {
    ...(title !== undefined && { title }),
    ...(description !== undefined && { description }),
  };
  if (!index) {
    return { ...own, robots: { index: false, follow: true } };
  }
  return {
    ...own,
    alternates: {
      canonical: localePath(locale, path),
      languages: {
        ...Object.fromEntries(routing.locales.map((other) => [other, localePath(other, path)])),
        "x-default": localePath(routing.defaultLocale, path),
      },
    },
    openGraph: {
      type: "website",
      siteName: "Second Bite",
      url: localePath(locale, path),
      title: title ?? "Second Bite",
      description,
      locale: ogLocales[locale],
      alternateLocale: routing.locales
        .filter((other) => other !== locale)
        .map((other) => ogLocales[other]),
    },
    twitter: { card: "summary", title: title ?? "Second Bite", description },
  };
}

/**
 * JSON-LD for a `<script type="application/ld+json">`, with `<` escaped so the text of a page can never
 * close the script (the Next.js JSON-LD guide).
 */
export function jsonLd(data: Record<string, unknown>): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

/** The identifiers the site's own entities are known by, so pages can point at them. */
export const siteIds = {
  website: new URL("/#website", siteOrigin).toString(),
  organization: new URL("/#organization", siteOrigin).toString(),
};
