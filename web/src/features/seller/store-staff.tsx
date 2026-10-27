import { getTranslations } from "next-intl/server";

import { getCurrentAccount } from "@/features/identity/current-account";

import { getStoreMembers } from "./my-sellers";
import { requireStore } from "./require-store";
import { AddStaffForm, StaffList } from "./store-staff-parts";

// The store's people (SEC-162, Figma N1, N3 and N1m): its owner first, then its staff. The owner adds staff by
// email and removes them; staff read the list and may leave. It reads the session, so it renders inside Suspense.
export async function StoreStaff({ sellerId: pendingId }: { sellerId: Promise<string> }) {
  const sellerId = await pendingId;
  const [t, store, members, me] = await Promise.all([
    getTranslations("StoreStaffPage"),
    requireStore(sellerId, `/stores/${sellerId}/staff`),
    getStoreMembers(sellerId),
    getCurrentAccount(),
  ]);
  const owner = store.myRole === "owner";
  // The owner first, then staff in the order they were added, as the API lists them.
  const people = [...members].sort(
    (a, b) => Number(b.role === "owner") - Number(a.role === "owner"),
  );

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col gap-4">
      <header className="flex flex-col gap-1">
        <h1 className="text-page-title text-foreground">{t("title")}</h1>
        <p className="text-body-sm text-muted-foreground">
          {t(owner ? "introOwner" : "introStaff")}
        </p>
      </header>
      <div className="flex flex-col gap-6 rounded-2xl border border-border bg-card p-4 max-md:mb-24 sm:p-8">
        {owner && <AddStaffForm sellerId={sellerId} />}
        <StaffList
          sellerId={sellerId}
          storeName={store.name}
          members={people}
          myId={me?.id ?? ""}
          owner={owner}
        />
      </div>
    </div>
  );
}
