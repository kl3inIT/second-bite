import { getTranslations } from "next-intl/server";

import { Link } from "@/i18n/navigation";

import { HeaderSweep } from "./header-sweep";
import { LanguageSwitcher } from "./language-switcher";
import { StickyHeader } from "./sticky-header";
import { Wordmark } from "./wordmark";

// The blue header of the home (Figma header): what the page names itself with, an optional search field,
// the account and the language capsules, then what the page puts under them, under the light sweep; the
// page's pale ground rises over its foot with rounded corners (Figma header › sheet). On a phone the search field takes its own row; from `lg` the wordmark leads the row and
// the three share it, and `sticky` (a second search field and account) stays at the top once the row has
// scrolled away, on a phone the search field alone. From `xl` it is 1200px wide, as Vietnamese food sites are
// (docs/research/2026-10-19-desktop-home.md).
export async function AppHeader({
  title,
  search,
  account,
  sticky,
  children,
}: {
  title: React.ReactNode;
  search?: React.ReactNode;
  account?: React.ReactNode;
  sticky?: { search: React.ReactNode; account: React.ReactNode };
  children?: React.ReactNode;
}) {
  const t = await getTranslations("TopBar");
  const home = (
    <Link
      href="/"
      className="hidden shrink-0 items-center rounded-lg focus-visible:ring-3 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card focus-visible:outline-none lg:flex"
    >
      <Wordmark />
      <span className="sr-only">{t("home")}</span>
    </Link>
  );

  return (
    <header className="relative overflow-hidden bg-header text-header-foreground">
      <HeaderSweep />
      <div className="relative mx-auto flex w-full max-w-5xl flex-col gap-3 px-4 pt-4 pb-9.75 xl:max-w-300">
        <div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-3 lg:flex-nowrap lg:items-center">
          <div className="flex items-center gap-5">
            {home}
            <div className="lg:border-l lg:border-header-border lg:pl-5">{title}</div>
          </div>
          {search && (
            <div className="order-last w-full lg:order-none lg:max-w-xl lg:flex-1">{search}</div>
          )}
          <div className="flex items-center gap-1">
            {account}
            <LanguageSwitcher />
          </div>
        </div>
        {children}
      </div>
      <div aria-hidden className="absolute inset-x-0 bottom-0 h-7 rounded-t-3xl bg-background" />
      {sticky && (
        <StickyHeader>
          {home}
          <div className="max-w-xl flex-1">{sticky.search}</div>
          <div className="ml-auto hidden items-center gap-1 lg:flex">
            {sticky.account}
            <LanguageSwitcher />
          </div>
        </StickyHeader>
      )}
    </header>
  );
}
