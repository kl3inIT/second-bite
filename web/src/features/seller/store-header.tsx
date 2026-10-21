import { ChevronDownIcon } from "lucide-react";

import { Link } from "@/i18n/navigation";
import { AppHeader } from "@/components/app-header";
import { HeaderSweep } from "@/components/header-sweep";
import { LanguageSwitcher } from "@/components/language-switcher";
import { SellerAvatar } from "@/features/offers/seller-avatar";

import { requireStore } from "./require-store";
import { StoreNav } from "./store-nav";

const focusRing =
  "focus-visible:ring-3 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card focus-visible:outline-none";

// The header of a store's pages: the tabs, and the store's name in a capsule that leads to all the person's
// stores (Figma Q1). On a phone (Figma "Chủ quán · Mobile 390") it is the app's header instead: the store's
// name as a switcher with a chevron, the language, and room under them where the page puts its title (the
// tabs are the bottom bar then). It reads the session, so it renders inside Suspense.
export async function StoreHeader({ sellerId: pendingId }: { sellerId: Promise<string> }) {
  const sellerId = await pendingId;
  const store = await requireStore(sellerId, `/stores/${sellerId}`);

  return (
    <>
      <div className="max-md:hidden">
        <AppHeader
          nav={<StoreNav sellerId={sellerId} />}
          account={
            <Link
              href="/stores"
              className={`group/store -my-1.5 flex min-h-11 items-center rounded-full ${focusRing}`}
            >
              <span className="flex h-8 items-center gap-1.5 rounded-full border border-header-border bg-header-raised px-2 text-label-strong text-header-raised-foreground transition-colors group-hover/store:bg-secondary">
                <SellerAvatar seller={store} size="sm" />
                <span className="max-w-32 truncate">{store.name}</span>
              </span>
            </Link>
          }
        />
      </div>

      <header className="relative overflow-hidden bg-header text-header-foreground group-data-[screen=push]/store:hidden md:hidden">
        <HeaderSweep />
        <div className="relative flex flex-col gap-4 px-4 pt-4 pb-12">
          <div className="flex items-center justify-between gap-3">
            <Link
              href="/stores"
              className={`-my-1 flex min-h-11 min-w-0 items-center gap-2.5 rounded-full ${focusRing}`}
            >
              <SellerAvatar seller={store} size="md" />
              <span className="truncate text-title">{store.name}</span>
              <ChevronDownIcon aria-hidden className="size-5 shrink-0" />
            </Link>
            <LanguageSwitcher />
          </div>
          {/* The room for the page's title row, which the layout pulls up into it. */}
          <div aria-hidden className="h-13" />
        </div>
      </header>
    </>
  );
}
