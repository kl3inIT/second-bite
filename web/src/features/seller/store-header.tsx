import { ChevronDownIcon } from "lucide-react";
import { Suspense } from "react";

import { AppHeader } from "@/components/app-header";
import { HeaderSweep } from "@/components/header-sweep";
import { LanguageSwitcher } from "@/components/language-switcher";
import { SellerAvatar } from "@/features/offers/seller-avatar";
import { Link } from "@/i18n/navigation";

import { requireStore } from "./require-store";
import { StoreNav } from "./store-nav";

const focusRing =
  "focus-visible:ring-3 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card focus-visible:outline-none";

// The header of a store's pages: the tabs, and the store's name in a capsule that leads to all the person's
// stores (Figma Q1). On a phone (Figma "Chủ quán · Mobile 390") it is the app's header instead: the store's
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

async function Tabs({ sellerId }: { sellerId: Promise<string> }) {
  return <StoreNav sellerId={await sellerId} />;
}

async function StoreCapsule({ sellerId: pendingId }: { sellerId: Promise<string> }) {
  const sellerId = await pendingId;
  const store = await requireStore(sellerId, `/stores/${sellerId}`);

  return (
    <Link
      href="/stores"
      className={`group/store -my-1.5 flex min-h-11 items-center rounded-full ${focusRing}`}
    >
      <span className="flex h-8 items-center gap-1.5 rounded-full border border-header-border bg-header-raised px-2 text-label-strong text-header-raised-foreground transition-colors group-hover/store:bg-secondary">
        <SellerAvatar seller={store} size="sm" />
        <span className="max-w-32 truncate">{store.name}</span>
      </span>
    </Link>
  );
}

// The phone's switcher (Figma "Chủ quán · Mobile 390"): the store's avatar, name and a chevron, leading to the
// person's stores.
async function StoreSwitcher({ sellerId: pendingId }: { sellerId: Promise<string> }) {
  const sellerId = await pendingId;
  const store = await requireStore(sellerId, `/stores/${sellerId}`);

  return (
    <Link
      href="/stores"
      className={`-my-1 flex min-h-11 min-w-0 items-center gap-2.5 rounded-full ${focusRing}`}
    >
      <SellerAvatar seller={store} size="md" />
      <span className="truncate text-title">{store.name}</span>
      <ChevronDownIcon aria-hidden className="size-5 shrink-0" />
    </Link>
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
