import { Suspense } from "react";

import { AppHeader } from "@/components/app-header";
import { SellerAvatar } from "@/features/offers/seller-avatar";
import { Link } from "@/i18n/navigation";

import { requireStore } from "./require-store";
import { StoreNav } from "./store-nav";

// The header of a store's pages: the tabs, and the store's name in a capsule that leads to all the person's
// stores (Figma Q1). The header itself is a static shell, as the home's is, so moving between pages never blanks
// or resizes it; only the tabs, which need the store's address, and the capsule, which needs the session, stream in
// where their own placeholders stand.
export function StoreHeader({ sellerId }: { sellerId: Promise<string> }) {
  return (
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
      className="group/store -my-1.5 flex min-h-11 items-center rounded-full focus-visible:ring-3 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card focus-visible:outline-none"
    >
      <span className="flex h-8 items-center gap-1.5 rounded-full border border-header-border bg-header-raised px-2 text-label-strong text-header-raised-foreground transition-colors group-hover/store:bg-secondary">
        <SellerAvatar seller={store} size="sm" />
        <span className="max-w-32 truncate">{store.name}</span>
      </span>
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
