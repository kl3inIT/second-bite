import { useTranslations } from "next-intl";
import { Suspense } from "react";

import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

import { HeaderSweep } from "./header-sweep";
import { LanguageSwitcher } from "./language-switcher";
import { StickyHeader } from "./sticky-header";
import { Wordmark } from "./wordmark";

// The blue header of the home (Figma header): what the page names itself with, an optional search field,
// the account and the language capsules, then what the page puts under them, under the light sweep; the
// page's pale ground rises over its foot with rounded corners (Figma header › sheet). On a phone the search field takes its own row; from `lg` the wordmark leads the row and
// the three share it, and `sticky` (a second search field and account) stays at the top once the row has
// scrolled away, on a phone the search field alone. From `xl` it is 1200px wide, as Vietnamese food sites are
// (docs/research/2026-10-19-desktop-home.md). Without a title (the legal, error and account pages, as Figma's
// seller screens), the wordmark leads the row at every width (SEC-52).
export function AppHeader({
  title,
  nav,
  search,
  account,
  sticky,
  children,
}: {
  title?: React.ReactNode;
  /** The seller's tabs (Figma Q1): centred between the wordmark and the capsules; on a phone, a row of its own. */
  nav?: React.ReactNode;
  search?: React.ReactNode;
  account?: React.ReactNode;
  sticky?: { search: React.ReactNode; account: React.ReactNode };
  children?: React.ReactNode;
}) {
  // Not async, so the error page, a client component, can show the same header.
  const t = useTranslations("TopBar");
  const home = (
    <Link
      href="/"
      className={cn(
        "shrink-0 items-center rounded-lg focus-visible:ring-3 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card focus-visible:outline-none",
        title ? "hidden lg:flex" : "flex min-h-11",
      )}
    >
      <Wordmark />
      <span className="sr-only">{t("home")}</span>
    </Link>
  );

  return (
    <header className="relative overflow-hidden bg-header text-header-foreground">
      <HeaderSweep />
      <div className="relative mx-auto flex w-full max-w-5xl flex-col gap-3 px-4 pt-4 pb-9.75 xl:max-w-300">
        <div
          className={cn(
            "flex flex-wrap justify-between gap-x-6 gap-y-3 lg:flex-nowrap lg:items-center",
            title ? "items-start" : "items-center",
          )}
        >
          <div className="flex items-center gap-5">
            {home}
            {title && <div className="lg:border-l lg:border-header-border lg:pl-5">{title}</div>}
          </div>
          {nav && (
            <div className="order-last w-full overflow-x-auto lg:order-none lg:w-auto lg:overflow-visible">
              {nav}
            </div>
          )}
          {search && (
            <div className="order-last w-full lg:order-none lg:max-w-xl lg:flex-1">{search}</div>
          )}
          <div className="flex shrink-0 items-center gap-2">
            {account}
            <Suspense fallback={<LanguagePlace />}>
              <LanguageSwitcher />
            </Suspense>
          </div>
        </div>
        {children}
      </div>
      <div aria-hidden className="absolute inset-x-0 bottom-0 h-7 rounded-t-3xl bg-background" />
      {sticky && (
        <StickyHeader>
          {home}
          <div className="max-w-xl flex-1">{sticky.search}</div>
          <div className="ml-auto hidden shrink-0 items-center gap-2 lg:flex">
            {sticky.account}
            <Suspense fallback={<LanguagePlace />}>
              <LanguageSwitcher />
            </Suspense>
          </div>
        </StickyHeader>
      )}
    </header>
  );
}

/**
 * The language capsule reads the page's address, which on a page with a parameter in its address is known only at
 * request time; until then its place keeps its size, so the header neither blanks nor moves.
 */
function LanguagePlace() {
  return <span aria-hidden className="-my-1.5 block size-11" />;
}
