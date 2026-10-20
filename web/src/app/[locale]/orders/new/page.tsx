import { CircleDotIcon, MapPinIcon } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getFormatter, getTranslations } from "next-intl/server";
import { Suspense } from "react";

import { buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { getCurrentAccount } from "@/features/identity/current-account";
import { listOffers } from "@/features/offers/list-offers";
import { clampUnits, directionsTo } from "@/features/orders/order";
import { OrdersHeader, OrdersHeaderFallback } from "@/features/orders/orders-header";
import { PlaceOrder } from "@/features/orders/place-order";
import { Link } from "@/i18n/navigation";
import { ApiError } from "@/lib/api/client";
import { getOffer, type OfferBody } from "@/lib/api/generated";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Orders.place");
  return { title: `${t("pageTitle")} · Second Bite`, robots: { index: false } };
}

// Confirming an order (SEC-51, Figma W1): where and when it is collected, how it is paid, the cancelling
// policy, and the order summary with "Đặt món". The offer page (SEC-45) links here with the offer and the
// units; pressing "Đặt món" places the order and opens its page.
export default async function NewOrderPage({ searchParams }: PageProps<"/[locale]/orders/new">) {
  const t = await getTranslations("Orders.place");

  return (
    <>
      <Suspense fallback={<OrdersHeaderFallback />}>
        <Header query={searchParams} />
      </Suspense>
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 pt-6 pb-10 md:pt-8 xl:max-w-300">
        <h1 className="text-headline">{t("pageTitle")}</h1>
        <p className="mb-6 text-body-sm text-muted-foreground">{t("pageLead")}</p>
        <Suspense fallback={<Skeleton shape="card" className="h-64" />}>
          <Confirm query={searchParams} />
        </Suspense>
      </main>
    </>
  );
}

// Signing in from the header comes back to this offer with these units.
async function Header({ query }: { query: PageProps<"/[locale]/orders/new">["searchParams"] }) {
  const { offer, units } = await query;
  const params = new URLSearchParams();
  if (typeof offer === "string") params.set("offer", offer);
  if (typeof units === "string") params.set("units", units);
  return <OrdersHeader returnTo={`/orders/new?${params}`} />;
}

async function Confirm({ query }: { query: PageProps<"/[locale]/orders/new">["searchParams"] }) {
  const { offer: offerId, units } = await query;
  if (typeof offerId !== "string") notFound();

  const t = await getTranslations("Orders.place");
  const [offer, account] = await Promise.all([readOffer(offerId), getCurrentAccount()]);
  if (!offer) notFound();

  if (offer.status !== "on_sale" || offer.unitsLeft < 1) {
    return (
      <section className="flex max-w-xl flex-col items-start gap-3 rounded-3xl bg-card p-6 text-card-foreground">
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
    <div className="grid gap-6 md:grid-cols-5 md:items-start">
      <div className="flex flex-col gap-6 md:col-span-3">
        <CollectAt offer={offer} seller={seller} />
        <Payment />
        <div>
          <p className="text-label-strong text-muted-foreground uppercase">{t("policy")}</p>
          <PolicyLine offer={offer} />
        </div>
      </div>
      <div className="md:col-span-2">
        <PlaceOrder
          offer={offer}
          initialUnits={clampUnits(units, offer.unitsLeft)}
          signedIn={account !== null}
        />
      </div>
    </div>
  );
}

/** Where and when the order is collected, and the way there (Figma W1 › Nhận món tại). */
async function CollectAt({ offer, seller }: { offer: OfferBody; seller?: string }) {
  const [t, format] = await Promise.all([getTranslations("Orders"), getFormatter()]);

  return (
    <section aria-labelledby="collect-at" className="flex flex-col gap-2">
      <h2 id="collect-at" className="text-title">
        {t("collectAt")}
      </h2>
      <div className="flex items-start gap-4 rounded-3xl bg-card p-4 text-card-foreground">
        <span
          aria-hidden
          className="flex size-16 shrink-0 items-center justify-center rounded-2xl bg-secondary text-primary"
        >
          <MapPinIcon className="size-6" />
        </span>
        <div className="flex min-w-0 flex-col">
          <p className="text-body-sm-strong">
            {seller
              ? t("placeLine", { seller, address: offer.collectionPoint.address })
              : offer.collectionPoint.address}
          </p>
          <p className="text-label text-muted-foreground">{t("placeHint")}</p>
          <p className="text-label-strong">
            {t("windowToday", {
              from: format.dateTime(new Date(offer.windowStart), "time"),
              until: format.dateTime(new Date(offer.windowEnd), "time"),
            })}
          </p>
          <a
            href={directionsTo(offer.collectionPoint)}
            target="_blank"
            rel="noopener noreferrer"
            className="self-start text-label-strong text-primary underline-offset-4 hover:underline"
          >
            {t("directions")}
            <span className="sr-only">{t("opensMaps")}</span>
          </a>
        </div>
      </div>
    </section>
  );
}

/** How the order is paid: at the counter, the one way the pilot has (Figma W1 › Thanh toán). */
async function Payment() {
  const t = await getTranslations("Orders.place");

  return (
    <section aria-labelledby="payment" className="flex flex-col gap-2">
      <h2 id="payment" className="text-title">
        {t("payment")}
      </h2>
      <div className="flex items-center gap-3 rounded-2xl border-2 border-primary bg-card p-4 text-card-foreground">
        <CircleDotIcon aria-hidden className="size-5 shrink-0 text-primary" />
        <div className="flex flex-col">
          <p className="text-body-sm-strong">{t("cash")}</p>
          <p className="text-label text-muted-foreground">{t("cashHint")}</p>
        </div>
      </div>
    </section>
  );
}

async function PolicyLine({ offer }: { offer: OfferBody }) {
  const [t, format] = await Promise.all([getTranslations("Orders.place"), getFormatter()]);
  return (
    <p className="text-body-sm text-muted-foreground">
      {t("policyBody", { from: format.dateTime(new Date(offer.windowStart), "time") })}
    </p>
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
