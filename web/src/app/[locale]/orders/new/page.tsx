import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { Suspense } from "react";

import { TopBar } from "@/components/top-bar";
import { buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { getCurrentAccount } from "@/features/identity/current-account";
import { listOffers } from "@/features/offers/list-offers";
import { clampUnits } from "@/features/orders/order";
import { CollectionPlace } from "@/features/orders/order-summary";
import { PlaceOrder } from "@/features/orders/place-order";
import { Link } from "@/i18n/navigation";
import { ApiError } from "@/lib/api/client";
import { getOffer } from "@/lib/api/generated";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Orders.place");
  return { title: `${t("pageTitle")} · Second Bite`, robots: { index: false } };
}

// Confirming an order (SEC-51, Figma W1): where and when it is collected, paid at the counter, and the order
// panel. The offer page (SEC-45) links here with the offer and the units; pressing "Đặt món" places the order
// and opens its page.
export default async function NewOrderPage({ searchParams }: PageProps<"/[locale]/orders/new">) {
  const t = await getTranslations("Orders.place");

  return (
    <>
      <TopBar title={t("pageTitle")} back="/" />
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 pt-4 pb-10 md:pt-8">
        <h1 className="sr-only sm:not-sr-only sm:mb-4 sm:block sm:text-headline">
          {t("pageTitle")}
        </h1>
        <Suspense fallback={<Skeleton shape="card" className="h-64" />}>
          <Confirm query={searchParams} />
        </Suspense>
      </main>
    </>
  );
}

async function Confirm({ query }: { query: PageProps<"/[locale]/orders/new">["searchParams"] }) {
  const { offer: offerId, units } = await query;
  if (typeof offerId !== "string") notFound();

  const t = await getTranslations("Orders.place");
  const [offer, account] = await Promise.all([readOffer(offerId), getCurrentAccount()]);
  if (!offer) notFound();

  if (offer.status !== "on_sale" || offer.unitsLeft < 1) {
    return (
      <section className="flex flex-col items-start gap-3 rounded-2xl bg-card p-6 text-card-foreground">
        <h2 className="text-title">{t("goneTitle")}</h2>
        <p className="text-body-sm text-muted-foreground">{t("goneBody")}</p>
        <Link href="/" className={buttonVariants({ variant: "outline" })}>
          {t("other")}
        </Link>
      </section>
    );
  }

  // The offer carries its collection point; the seller's name comes with tonight's offers on the home.
  const seller = (await listOffers({})).find((found) => found.id === offer.id)?.seller.name;

  return (
    <div className="grid gap-4 md:grid-cols-3 md:items-start">
      <div className="flex flex-col gap-4 md:col-span-2">
        <CollectionPlace
          seller={seller}
          address={offer.collectionPoint.address}
          windowStart={offer.windowStart}
          windowEnd={offer.windowEnd}
        />
        <section className="flex flex-col gap-1 rounded-2xl bg-card p-5 text-card-foreground">
          <h2 className="text-title">{t("payment")}</h2>
          <p className="text-body-sm-strong">{t("cash")}</p>
          <p className="text-body-sm text-muted-foreground">{t("cashHint")}</p>
        </section>
      </div>
      <PlaceOrder
        offer={offer}
        initialUnits={clampUnits(units, offer.unitsLeft)}
        signedIn={account !== null}
      />
    </div>
  );
}

async function readOffer(offerId: string) {
  try {
    return (await getOffer({ path: { offerId } })).data;
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return null;
    throw error;
  }
}
