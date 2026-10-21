import { SearchIcon } from "lucide-react";
import { useFormatter, useTranslations } from "next-intl";

import { BackButton } from "@/components/back-button";
import { buttonVariants } from "@/components/ui/button";
import { Empty, EmptyHeader, EmptyTitle } from "@/components/ui/empty";
import { CartBar } from "@/features/cart/cart-bar";
import { CartPortions } from "@/features/cart/cart-portions";
import { QuantityStepper } from "@/features/cart/quantity-stepper";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

import { formatPrice } from "./format";
import {
  directionsHref,
  isAvailable,
  kindsByCount,
  type OfferKind,
  type OfferSummary,
} from "./offer";
import { OfferPhoto } from "./offer-photo";
import { sellerRating } from "./proposed";
import { SellerLogo } from "./seller-logo";
import { useDistance } from "./window";

const COVER_PHOTOS = 3;
const ONE_DECIMAL = { minimumFractionDigits: 1, maximumFractionDigits: 1 } as const;

// A seller's dishes tonight (Figma K4b): their dishes' photographs side by side, the seller, their rating,
// tonight's window and the way there, tabs by kind when they sell more than one (the seller's own menu
// sections have no backend, SEC-49 decision 7), each dish with its − and +, and the cart's bar.
export function SellerPage({
  offers,
  kind,
  near,
}: {
  offers: readonly OfferSummary[];
  kind?: OfferKind;
  near?: string;
}) {
  const t = useTranslations("Seller");
  const kinds = useTranslations("OfferKind");
  const available = offers.filter(isAvailable);
  const [first] = offers;
  const tabs = kindsByCount(offers);
  const shown = available.filter((offer) => !kind || offer.kind === kind);

  if (!first || available.length === 0) return <NothingTonight />;

  return (
    <>
      <main className="mx-auto w-full max-w-xl flex-1 bg-card">
        <div className="relative flex h-50 bg-muted">
          {available.slice(0, COVER_PHOTOS).map((offer) => (
            <div key={offer.id} className="relative flex-1">
              <OfferPhoto offer={offer} sizes="(min-width: 576px) 192px, 33vw" />
            </div>
          ))}
          <div className="absolute inset-x-0 top-0 h-30 bg-linear-to-b from-foreground/35 to-transparent" />
          <div className="absolute inset-x-4 top-3 flex items-center justify-between">
            <BackButton fallback="/" />
            <Link
              href={{ pathname: "/search", query: { q: first.seller.name } }}
              aria-label={t("search", { seller: first.seller.name })}
              className={buttonVariants({ variant: "float", size: "float" })}
            >
              <SearchIcon aria-hidden strokeWidth={2} />
            </Link>
          </div>
        </div>
        <div className="relative -mt-6 flex flex-col gap-4 rounded-t-3xl bg-card px-4 pt-5 pb-6">
          <div className="flex items-center gap-3">
            <SellerLogo seller={first.seller} size="lg" />
            <div className="flex min-w-0 flex-col gap-1">
              <h1 className="truncate text-headline text-foreground">{first.seller.name}</h1>
              <p className="truncate text-body-sm text-muted-foreground">{first.seller.address}</p>
            </div>
          </div>
          <SellerFacts lead={first} offers={available} />
          {tabs.length > 1 && (
            <nav aria-label={t("kinds")} className="-mx-4 scrollbar-none overflow-x-auto px-4">
              <ul className="flex min-w-max gap-6 border-b border-border">
                {[undefined, ...tabs.map((tab) => tab.kind)].map((each) => (
                  <li key={each ?? "all"}>
                    <Link
                      href={{
                        pathname: `/sellers/${first.sellerId}`,
                        query: { ...(each ? { kind: each } : {}), ...(near ? { near } : {}) },
                      }}
                      aria-current={each === kind ? "page" : undefined}
                      className={cn(
                        "-mb-px flex min-h-11 items-center border-b-3 text-title focus-visible:ring-3 focus-visible:ring-ring focus-visible:outline-none",
                        each === kind
                          ? "border-primary text-primary"
                          : "border-transparent text-muted-foreground",
                      )}
                    >
                      {each ? kinds(each) : t("onSale")}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          )}
          <section aria-labelledby="dishes" className="flex flex-col gap-3">
            <h2 id="dishes" className="text-title-lg text-foreground">
              {kind ? kinds(kind) : t("tonight")}
            </h2>
            <ul className="flex flex-col gap-5">
              {shown.map((offer) => (
                <li key={offer.id}>
                  <SellerDish offer={offer} />
                </li>
              ))}
            </ul>
          </section>
        </div>
      </main>
      <CartBar />
    </>
  );
}

// Rating, tonight's window and the way there, three columns on a white card with a hairline (Figma K4b
// "thông số quán"). Without a place searched, the floor takes the distance's place.
function SellerFacts({ lead, offers }: { lead: OfferSummary; offers: readonly OfferSummary[] }) {
  const t = useTranslations("Seller");
  const format = useFormatter();
  const distance = useDistance(lead);
  const rating = sellerRating(lead);
  const opens = Math.min(...offers.map(({ windowStart }) => Date.parse(windowStart)));
  const closes = Math.max(...offers.map(({ windowEnd }) => Date.parse(windowEnd)));
  const fact = "font-display text-price text-foreground";
  const label = "text-label text-muted-foreground";

  return (
    <dl className="flex rounded-lg border border-border px-2 py-3">
      {rating !== undefined && (
        <div className="flex flex-1 flex-col-reverse items-center gap-0.5">
          <dt className={label}>{t("rating")}</dt>
          <dd className={cn(fact, "flex items-center gap-1")}>
            <span aria-hidden className="text-rating">
              ★
            </span>
            {format.number(rating, ONE_DECIMAL)}
          </dd>
        </div>
      )}
      <div className="flex flex-1 flex-col-reverse items-center gap-0.5">
        <dt className={label}>{t("window")}</dt>
        <dd className={fact}>
          {format.dateTime(opens, "time")}–{format.dateTime(closes, "time")}
        </dd>
      </div>
      <div className="flex flex-1 flex-col items-center gap-0.5">
        <dt className="sr-only">{t("where")}</dt>
        <dd className={fact}>{distance ?? lead.seller.address}</dd>
        <dd>
          <a
            href={directionsHref(lead.collectionPoint)}
            target="_blank"
            rel="noreferrer"
            className="text-label text-link focus-visible:ring-3 focus-visible:ring-ring focus-visible:outline-none"
          >
            {t("directions")}
          </a>
        </dd>
      </div>
    </dl>
  );
}

// One dish of the seller (Figma K4b "món"): its photograph, the dish, the price over the discount and the
// portions left, and the − and +; the dish opens its own page.
function SellerDish({ offer }: { offer: OfferSummary }) {
  const t = useTranslations("OfferCard");
  const original = formatPrice(offer.originalPriceVnd);

  return (
    <article className="relative flex items-center gap-3.5">
      <div className="relative size-25 shrink-0 overflow-hidden rounded-lg bg-muted">
        <OfferPhoto offer={offer} sizes="100px" />
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-2.5">
        <h3 className="line-clamp-2 text-title-lg text-foreground">
          <Link
            href={`/offers/${offer.id}`}
            className="after:absolute after:inset-0 focus-visible:underline focus-visible:outline-none"
          >
            {offer.name}
          </Link>
        </h3>
        <div className="flex items-center justify-between gap-2">
          <div className="flex min-w-0 flex-col gap-0.5">
            <p className="flex items-baseline gap-1.25">
              <span className="font-display text-price text-primary">
                {formatPrice(offer.priceVnd)}
              </span>
              <s aria-hidden className="text-label text-muted-foreground">
                {original}
              </s>
              <span className="sr-only">{t("originalPrice", { price: original })}</span>
            </p>
            <CartPortions offer={offer} />
          </div>
          <div className="relative z-10">
            <QuantityStepper offer={offer} />
          </div>
        </div>
      </div>
    </article>
  );
}

// A seller with nothing on sale tonight has no dishes to show, nor a name the API gives (SEC-49 decision 7).
function NothingTonight() {
  const t = useTranslations("Seller");

  return (
    <main className="mx-auto flex w-full max-w-xl flex-1 flex-col gap-4 px-4 pt-3 pb-8">
      <BackButton fallback="/" />
      <Empty surface="card">
        <EmptyHeader>
          <EmptyTitle>{t("nothing")}</EmptyTitle>
        </EmptyHeader>
        <Link href="/" className={buttonVariants({ variant: "secondary" })}>
          {t("home")}
        </Link>
      </Empty>
    </main>
  );
}
