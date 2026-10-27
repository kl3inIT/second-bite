import type { Metadata, Viewport } from "next";
import { Be_Vietnam_Pro, Bricolage_Grotesque } from "next/font/google";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getLocale, getTranslations } from "next-intl/server";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { Suspense } from "react";

import { BottomNav } from "@/components/bottom-nav";
import { JsonLd } from "@/components/json-ld";
import { QueryProvider } from "@/components/query-provider";
import { SiteFooter } from "@/components/site-footer";
import { Splash } from "@/components/splash";
import { Toaster } from "@/components/ui/toast";
import { CountView } from "@/features/stats/count-view";
import { clientMessages } from "@/i18n/client-messages";
import { routing } from "@/i18n/routing";
import { absoluteUrl, siteIds, siteOrigin } from "@/lib/seo";

import "../globals.css";

// The typefaces of DESIGN.md, served by next/font from our own origin, Latin and Vietnamese only:
// Be Vietnam Pro for text, Bricolage Grotesque for prices and figures only. Only the text's files are preloaded:
// Bricolage's variable file weighs about 41 KB a subset, and a page without a price never needs it, so it comes
// when a price is drawn, over its size-adjusted fallback (SEC-166).
const beVietnamPro = Be_Vietnam_Pro({
  weight: ["400", "600", "700"],
  subsets: ["latin", "vietnamese"],
  variable: "--font-be-vietnam-pro",
});
const bricolage = Bricolage_Grotesque({
  subsets: ["latin", "vietnamese"],
  variable: "--font-bricolage",
  preload: false,
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

// The page runs under a phone's home indicator, so the bottom bar can float clear of it (bottom-safe-4).
export const viewport: Viewport = { viewportFit: "cover" };

// Every page's title ends in the name; addresses for search engines are absolute on the public origin
// (lib/seo.ts). Canonical and language links are each page's own, never inherited from here.
export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Metadata");
  return {
    metadataBase: siteOrigin,
    title: { default: t("title"), template: `%s · ${t("title")}` },
    description: t("description"),
    applicationName: t("title"),
    // Added to an iPhone's Home Screen, the site opens as an app, the only way it gets push there (SEC-25).
    appleWebApp: { capable: true, title: t("title") },
    icons: { apple: "/icons/apple-touch-icon.png" },
  };
}

// The root layout: every page lives under [locale], so the document's language is the page's.
export default async function LocaleLayout({ children }: LayoutProps<"/[locale]">) {
  const locale = await getLocale();
  const [t, failure, messages] = await Promise.all([
    getTranslations("Metadata"),
    getTranslations("Failure"),
    clientMessages("site"),
  ]);
  const lang = hasLocale(routing.locales, locale) ? locale : routing.defaultLocale;

  return (
    <html
      lang={lang}
      className={`${beVietnamPro.variable} ${bricolage.variable} h-full antialiased`}
      // The splash's script marks a visit's later pages before React hydrates.
      suppressHydrationWarning
    >
      <body className="group/body flex min-h-full flex-col">
        {/* Who runs the site and what it is, for search and answer engines; each page adds its own. */}
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "Organization",
                "@id": siteIds.organization,
                name: t("title"),
                url: siteOrigin.toString(),
                description: t("organization"),
                areaServed: { "@type": "Place", name: t("area") },
              },
              {
                "@type": "WebSite",
                "@id": siteIds.website,
                name: t("title"),
                url: absoluteUrl(lang),
                inLanguage: lang,
                description: t("description"),
                publisher: { "@id": siteIds.organization },
                potentialAction: {
                  "@type": "SearchAction",
                  target: {
                    "@type": "EntryPoint",
                    urlTemplate: `${absoluteUrl(lang)}?q={search_term_string}`,
                  },
                  "query-input": "required name=search_term_string",
                },
              },
            ],
          }}
        />
        {/* Only what client components read, never the whole catalog (SEC-166). */}
        <NextIntlClientProvider messages={messages}>
          {/* Every page may keep a list's filters in the address and say what an action did in a toast
              (docs/guidelines/web.md › Lists and filters, › Feedback). */}
          <NuqsAdapter>
            <Toaster closeLabel={failure("closeToast")}>
              <QueryProvider>
                <Splash />
                {children}
                <SiteFooter />
                {/* The bar reads the address, which a page with a dynamic segment knows only at request time. */}
                <Suspense>
                  <BottomNav />
                </Suspense>
                {/* Reads the address's utm_source, known only at request time, like the bar. */}
                <Suspense>
                  <CountView />
                </Suspense>
              </QueryProvider>
            </Toaster>
          </NuqsAdapter>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
