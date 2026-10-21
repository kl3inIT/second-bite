import { getLocale, getTranslations } from "next-intl/server";

import { redirect } from "@/i18n/navigation";

import { requireStore } from "./require-store";
import { StoreLocationForm } from "./store-location-form";

// Where the store is (SEC-66): its pin on the map and its written address, which only the owner changes; staff are
// sent to the store's home. It reads the session, so it renders inside Suspense.
export async function StoreLocation({ sellerId: pendingId }: { sellerId: Promise<string> }) {
  const sellerId = await pendingId;
  const [t, store] = await Promise.all([
    getTranslations("StoreLocationPage"),
    requireStore(sellerId, `/stores/${sellerId}/location`),
  ]);
  if (store.myRole !== "owner") {
    redirect({ href: `/stores/${sellerId}`, locale: await getLocale() });
  }

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col gap-4">
      <header className="flex flex-col gap-1">
        <h1 className="text-page-title text-foreground">{t("title")}</h1>
        <p className="text-body-sm text-muted-foreground">{t("intro")}</p>
      </header>
      <div className="rounded-2xl border border-border bg-card p-4 max-md:mb-24 sm:p-8">
        <StoreLocationForm store={store} />
      </div>
    </div>
  );
}
