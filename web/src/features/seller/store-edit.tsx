import { getLocale, getTranslations } from "next-intl/server";

import { redirect } from "@/i18n/navigation";

import { requireStore } from "./require-store";
import { StoreEditForm } from "./store-edit-form";

// The store's name, phone number, address, pin and photo (SEC-141), which only the owner changes; staff are sent
// to the store's home. A store just opened whose photo did not arrive comes here to
// choose it again (`?photo=failed`). It reads the session, so it renders inside Suspense.
export async function StoreEdit({
  sellerId: pendingId,
  query,
}: {
  sellerId: Promise<string>;
  query: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sellerId = await pendingId;
  const [t, store, search] = await Promise.all([
    getTranslations("StoreEditPage"),
    requireStore(sellerId, `/stores/${sellerId}/edit`),
    query,
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
        <StoreEditForm store={store} photoFailed={search.photo === "failed"} />
      </div>
    </div>
  );
}
