import { getTranslations } from "next-intl/server";

import { buttonVariants } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";

import { getStoreOffers } from "./my-sellers";
import { PostRow } from "./post-row";
import { requireStore } from "./require-store";
import { postedToday } from "./store-offers";

// The store's home (SEC-57, Figma Q1): its name, "Bắt đầu bán" until it has posted anything, and today's posts.
// The card of orders to handle (Figma Q1) joins with the order module (SEC-15, SEC-51). It reads the session,
// so it renders inside Suspense.
export async function StoreHome({ sellerId: pendingId }: { sellerId: Promise<string> }) {
  const sellerId = await pendingId;
  const [t, store, offers] = await Promise.all([
    getTranslations("StoreHome"),
    requireStore(sellerId, `/stores/${sellerId}`),
    getStoreOffers(sellerId),
  ]);
  const today = postedToday(offers);

  return (
    <>
      <h1 className="text-page-title text-foreground">{store.name}</h1>

      {offers.length === 0 && (
        <section
          aria-labelledby="store-start"
          className="flex flex-col items-start gap-3 rounded-2xl border border-border bg-card p-5 text-card-foreground"
        >
          <div className="flex flex-col gap-1">
            <h2 id="store-start" className="text-title-lg">
              {t("startTitle")}
            </h2>
            <p className="text-body-sm text-muted-foreground">{t("startBody")}</p>
          </div>
          <Link href={`/stores/${sellerId}/offers/new`} className={buttonVariants({ size: "lg" })}>
            {t("post")}
          </Link>
        </section>
      )}

      <section
        aria-labelledby="store-today"
        className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-5 text-card-foreground"
      >
        <h2 id="store-today" className="text-title-lg">
          {t("todayTitle")}
        </h2>
        {today.length === 0 ? (
          <p className="text-body-sm text-muted-foreground">{t("todayEmpty")}</p>
        ) : (
          <ul className="flex flex-col border-t border-border">
            {today.map((offer) => (
              <PostRow key={offer.id} offer={offer} />
            ))}
          </ul>
        )}
      </section>
    </>
  );
}
