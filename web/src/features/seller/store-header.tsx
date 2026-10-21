import { Link } from "@/i18n/navigation";
import { AppHeader } from "@/components/app-header";
import { SellerAvatar } from "@/features/offers/seller-avatar";

import { requireStore } from "./require-store";
import { StoreNav } from "./store-nav";

// The header of a store's pages: the tabs, and the store's name in a capsule that leads to all the person's
// stores (Figma Q1). It reads the session, so it renders inside Suspense.
export async function StoreHeader({ sellerId: pendingId }: { sellerId: Promise<string> }) {
  const sellerId = await pendingId;
  const store = await requireStore(sellerId, `/stores/${sellerId}`);

  return (
    <AppHeader
      nav={<StoreNav sellerId={sellerId} />}
      account={
        <Link
          href="/stores"
          className="group/store -my-1.5 flex min-h-11 items-center rounded-full focus-visible:ring-3 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card focus-visible:outline-none"
        >
          <span className="flex h-8 items-center gap-1.5 rounded-full border border-header-border bg-header-raised px-2 text-label-strong text-header-raised-foreground transition-colors group-hover/store:bg-secondary">
            <SellerAvatar seller={store} size="sm" />
            <span className="max-w-32 truncate">{store.name}</span>
          </span>
        </Link>
      }
    />
  );
}
