import type { Metadata, Viewport } from "next";
import { Be_Vietnam_Pro, Bricolage_Grotesque } from "next/font/google";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getLocale, getTranslations } from "next-intl/server";
import { Suspense } from "react";

import { BottomNav } from "@/components/bottom-nav";
import { SiteFooter } from "@/components/site-footer";
import { Splash } from "@/components/splash";
import { routing } from "@/i18n/routing";

import "../globals.css";

// The typefaces of DESIGN.md, served by next/font from our own origin, Latin and Vietnamese only:
// Be Vietnam Pro for text, Bricolage Grotesque for prices and figures only.
const beVietnamPro = Be_Vietnam_Pro({
  weight: ["400", "600", "700"],
  subsets: ["latin", "vietnamese"],
  variable: "--font-be-vietnam-pro",
});
const bricolage = Bricolage_Grotesque({
  subsets: ["latin", "vietnamese"],
  variable: "--font-bricolage",
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

// The page runs under a phone's home indicator, so the bottom bar can float clear of it (bottom-safe-4).
export const viewport: Viewport = { viewportFit: "cover" };

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Metadata");
  return { title: t("title"), description: t("description") };
}

// The root layout: every page lives under [locale], so the document's language is the page's.
export default async function LocaleLayout({ children }: LayoutProps<"/[locale]">) {
  const locale = await getLocale();

  return (
    <html
      lang={hasLocale(routing.locales, locale) ? locale : routing.defaultLocale}
      className={`${beVietnamPro.variable} ${bricolage.variable} h-full antialiased`}
      // The splash's script marks a visit's later pages before React hydrates.
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col">
        <NextIntlClientProvider>
          <Splash />
          {children}
          <SiteFooter />
          {/* The bar reads the address, which a page with a dynamic segment knows only at request time. */}
          <Suspense>
            <BottomNav />
          </Suspense>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
