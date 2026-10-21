import { ChevronDownIcon } from "lucide-react";
import { Suspense } from "react";

import { AppHeader } from "@/components/app-header";
import { HeaderSweep } from "@/components/header-sweep";
import { LanguageSwitcher } from "@/components/language-switcher";
import { SellerAvatar } from "@/features/offers/seller-avatar";
import { getMySellers, MAX_OWNED } from "./my-sellers";
import { requireStore } from "./require-store";
import { StoreMenu } from "./store-menu";
import { StoreNav } from "./store-nav";

// The header of a store's pages: the tabs, and the store's name in a capsule that opens the store menu: the
// customers' shop, the person's stores and a way to open another (Figma Q1). On a phone (Figma "Chủ quán · Mobile 390") it is the app's header instead: the store's
// name as a switcher with a chevron, the language, and room under them where the page puts its title (the
// tabs are the bottom bar then). The header itself is a static shell, as the home's is, so moving between pages
// never blanks or resizes it; only the tabs, which need the store's address, and the store's name, which needs the
// session, stream in where their own placeholders stand.
export function StoreHeader({ sellerId }: { sellerId: Promise<string> }) {
  return (
    <>
      <div className="max-md:hidden">
        <AppHeader
          nav={
            <Suspense fallback={<NavPlaceholder />}>
              <Tabs sellerId={sellerId} />
            </Suspense>
          }
          account={
            <Suspense fallback={<CapsulePlaceholder />}>
              <StoreCapsule sellerId={sellerId} />
            </Suspense>
          }
        />
      </div>

      <header className="relative overflow-hidden bg-header text-header-foreground group-has-[[data-pushed]]/store:hidden md:hidden">
        <HeaderSweep />
        <div className="relative flex flex-col gap-4 px-4 pt-4 pb-12">
          <div className="flex items-center justify-between gap-3">
            <Suspense fallback={<SwitcherPlaceholder />}>
              <StoreSwitcher sellerId={sellerId} />
            </Suspense>
            <Suspense fallback={<span aria-hidden className="-my-1.5 block size-11" />}>
              <LanguageSwitcher />
            </Suspense>
          </div>
          {/* The room for the page's title row, which the layout pulls up into it. */}
          <div aria-hidden className="h-13" />
        </div>
      </header>
    </>
  );
}

/** The store the page is of, the person's stores to move between, and whether they have room to open another. */
async function storesOf(sellerId: string) {
  const [store, stores] = await Promise.all([
    requireStore(sellerId, `/stores/${sellerId}`),
    getMySellers(),
  ]);
  const owned = stores.filter((seller) => seller.myRole === "owner").length;
  return { store, stores, canCreate: owned < MAX_OWNED };
}

async function Tabs({ sellerId }: { sellerId: Promise<string> }) {
  return <StoreNav sellerId={await sellerId} />;
}

async function StoreCapsule({ sellerId: pendingId }: { sellerId: Promise<string> }) {
  const sellerId = await pendingId;
  const { store, stores, canCreate } = await storesOf(sellerId);

  return (
    <StoreMenu current={store} stores={stores} canCreate={canCreate} align="end">
      <span className="group/store flex h-8 items-center gap-1.5 rounded-full border border-header-border bg-header-raised px-2 text-label-strong text-header-raised-foreground transition-colors hover:bg-secondary">
        <SellerAvatar seller={store} size="sm" />
        <span className="max-w-32 truncate">{store.name}</span>
        <ChevronDownIcon aria-hidden className="size-4 shrink-0" />
      </span>
    </StoreMenu>
  );
}

// The phone's switcher (Figma "Chủ quán · Mobile 390"): the store's avatar, name and a chevron, opening the
// store menu.
async function StoreSwitcher({ sellerId: pendingId }: { sellerId: Promise<string> }) {
  const sellerId = await pendingId;
  const { store, stores, canCreate } = await storesOf(sellerId);

  return (
    <StoreMenu current={store} stores={stores} canCreate={canCreate} align="start">
      <span className="flex min-w-0 items-center gap-2.5">
        <SellerAvatar seller={store} size="md" />
        <span className="truncate text-title">{store.name}</span>
        <ChevronDownIcon aria-hidden className="size-5 shrink-0" />
      </span>
    </StoreMenu>
  );
}

/** The four tabs' places, the size they take once drawn. */
function NavPlaceholder() {
  return (
    <ul aria-hidden className="flex items-center gap-1">
      {["w-20", "w-22", "w-24", "w-12"].map((width) => (
        <li key={width} className="flex min-h-11 items-center">
          <span className={`h-9 rounded-full bg-header-raised/20 ${width}`} />
        </li>
      ))}
    </ul>
  );
}

/** The capsule's place, the size it takes once drawn. */
function CapsulePlaceholder() {
  return <span aria-hidden className="block h-8 w-40 rounded-full bg-header-raised/20" />;
}

/** The switcher's place on a phone, the size it takes once drawn. */
function SwitcherPlaceholder() {
  return <span aria-hidden className="block h-9 w-44 rounded-full bg-header-raised/20" />;
}
