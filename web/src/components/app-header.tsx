import { HeaderSweep } from "./header-sweep";
import { LanguageSwitcher } from "./language-switcher";

// The lime header of the home (Figma header): what the page names itself with, an optional search field,
// the account and the language capsules, then what the page puts under them, under the leaf sweep and with rounded
// bottom corners. On a phone the search field takes its own row; from `lg` the three share one.
export function AppHeader({
  title,
  search,
  account,
  children,
}: {
  title: React.ReactNode;
  search?: React.ReactNode;
  account?: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <header className="relative overflow-hidden rounded-b-3xl bg-header text-header-foreground">
      <HeaderSweep />
      <div className="relative mx-auto flex w-full max-w-5xl flex-col gap-3 px-4 pt-4 pb-3">
        <div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-3 lg:flex-nowrap lg:items-center">
          {title}
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
    </header>
  );
}
