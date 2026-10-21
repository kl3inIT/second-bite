import { SearchIcon } from "lucide-react";
import { useFormatter, useLocale, useTranslations } from "next-intl";

import { BackButton } from "@/components/back-button";
import { buttonVariants } from "@/components/ui/button";
import { Empty, EmptyHeader, EmptyTitle } from "@/components/ui/empty";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { CartBar } from "@/features/cart/cart-bar";
import { FollowButton } from "@/features/favourites/follow-button";
import { Link } from "@/i18n/navigation";
import { plainText } from "@/lib/plain-text";
import { cn } from "@/lib/utils";

import {
  directionsHref,
  isAvailable,
  kindsByCount,
  type OfferKind,
  type OfferSummary,
} from "./offer";
import { OfferPhoto } from "./offer-photo";
import { sellerRating } from "./proposed";
import { SellerDish } from "./seller-dish";
import { SellerLogo } from "./seller-logo";
import { ShareButton } from "./share-button";
import { useDistance } from "./window";

const COVER_PHOTOS = 3;
// The page's width: a phone's column, wider on a tablet and a desktop, where the dishes sit two and three abreast.
const PAGE_WIDTH = "max-w-xl md:max-w-3xl lg:max-w-5xl";
const ONE_DECIMAL = { minimumFractionDigits: 1, maximumFractionDigits: 1 } as const;

// A seller's dishes tonight (Figma K4b): their dishes' photographs side by side with back, the heart that follows them (SEC-109) and share; the seller's
// logo, name, rating and floor; tonight's window, the counter and the way there; a search of their dishes; tabs by
// kind when they sell more than one (the seller's own menu sections have no backend, SEC-49 decision 7); each dish
// with its − and +, opening its sheet; and the cart's bar. `at` is the dish a link led to (K4), `q` the words
// searched for. Figma's review count and seller category have no backend, so they are left out.
export function SellerPage({
  offers,
  kind,
  near,
  at,
  q,
}: {
  offers: readonly OfferSummary[];
  kind?: OfferKind;
  near?: string;
  at?: string;
  q?: string;
}) {
  const t = useTranslations("Seller");
  const kinds = useTranslations("OfferKind");
  const available = offers.filter(isAvailable);
  const [first] = offers;
  const tabs = kindsByCount(offers);
  const words = q ? plainText(q) : "";
  const shown = available.filter(
    (offer) => (!kind || offer.kind === kind) && (!words || plainText(offer.name).includes(words)),
  );

  if (!first || available.length === 0) return <NothingTonight />;

  return (
    <>
      <main className={cn("mx-auto w-full flex-1 bg-card", PAGE_WIDTH)}>
        <div className="relative flex h-50 bg-muted md:h-60">
          {available.slice(0, COVER_PHOTOS).map((offer) => (
            <div key={offer.id} className="relative flex-1">
              <OfferPhoto offer={offer} sizes="(min-width: 576px) 192px, 33vw" />
            </div>
          ))}
          <div className="absolute inset-x-0 top-0 h-30 bg-linear-to-b from-foreground/35 to-transparent" />
          <div className="absolute inset-x-4 top-3 flex items-center justify-between">
            <BackButton fallback="/" />
            <div className="flex gap-2">
              <FollowButton sellerId={first.sellerId} name={first.seller.name} look="float" />
              <ShareButton title={first.seller.name} />
            </div>
          </div>
        </div>
        <div className="relative -mt-6 flex flex-col gap-3.5 rounded-t-3xl bg-card px-4 pt-4 pb-6">
          <SellerHeading lead={first} />
          <div className="flex flex-col gap-3.5 md:grid md:grid-cols-2 md:items-center">
            <SellerFacts lead={first} offers={available} />
            <SellerSearch lead={first} kind={kind} near={near} q={q} />
          </div>
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
            {shown.length > 0 ? (
              <ul className="grid gap-5 md:grid-cols-2 md:gap-x-6 lg:grid-cols-3">
                {shown.map((offer) => (
                  <li key={offer.id}>
                    <SellerDish offer={offer} focused={offer.id === at} />
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-body-sm text-muted-foreground">{t("noMatch", { q: q ?? "" })}</p>
            )}
          </section>
        </div>
      </main>
      <CartBar width={PAGE_WIDTH} />
    </>
  );
}

// The seller's logo beside their name, over their rating, when there is one, and their floor (Figma K4b "quán").
function SellerHeading({ lead }: { lead: OfferSummary }) {
  const format = useFormatter();
  const rating = sellerRating(lead);

  return (
    <div className="flex items-center gap-3">
      <SellerLogo seller={lead.seller} size="lg" />
      <div className="flex min-w-0 flex-col gap-0.5">
        <h1 className="text-headline break-words text-foreground">{lead.seller.name}</h1>
        <p className="flex items-center gap-1 text-body-sm text-muted-foreground">
          {rating !== undefined && (
            <>
              <span aria-hidden className="text-rating">
                ★
              </span>
              <span className="text-body-sm-strong text-foreground">
                {format.number(rating, ONE_DECIMAL)}
              </span>
              <span aria-hidden>·</span>
            </>
          )}
          {lead.seller.address}
        </p>
      </div>
    </div>
  );
}

// Tonight's window over the counter and its distance, with the way there, on a card with a hairline (Figma K4b
// "thông số quán").
function SellerFacts({ lead, offers }: { lead: OfferSummary; offers: readonly OfferSummary[] }) {
  const t = useTranslations("Seller");
  const format = useFormatter();
  const distance = useDistance(lead);
  const opens = Math.min(...offers.map(({ windowStart }) => Date.parse(windowStart)));
  const closes = Math.max(...offers.map(({ windowEnd }) => Date.parse(windowEnd)));
  const place = lead.collectionPoint.address;

  return (
    <div className="flex items-center gap-3 rounded-lg border border-border px-3.5 py-3">
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <p className="text-title text-foreground">
          {t("window", {
            from: format.dateTime(opens, "time"),
            until: format.dateTime(closes, "time"),
          })}
        </p>
        <p className="truncate text-label text-muted-foreground">
          {distance ? t("placeAway", { place, distance }) : place}
        </p>
      </div>
      <a
        href={directionsHref(lead.collectionPoint)}
        target="_blank"
        rel="noreferrer"
        className="-mr-2 flex min-h-11 shrink-0 items-center rounded-lg px-2 text-label-strong text-link focus-visible:ring-3 focus-visible:ring-ring focus-visible:outline-none"
      >
        {t("directions")}
      </a>
    </div>
  );
}

// A search of the seller's dishes tonight (Figma K4b "tìm trong thực đơn"): a GET form to this page, so it works
// before JavaScript, keeping the tab and the place.
function SellerSearch({
  lead,
  kind,
  near,
  q,
}: {
  lead: OfferSummary;
  kind?: OfferKind;
  near?: string;
  q?: string;
}) {
  const t = useTranslations("Seller");
  const locale = useLocale();
  const label = t("search", { seller: lead.seller.name });

  return (
    <search>
      <form action={`/${locale}/sellers/${lead.sellerId}`}>
        {kind && <input type="hidden" name="kind" value={kind} />}
        {near && <input type="hidden" name="near" value={near} />}
        <InputGroup surface="sky" className="h-12">
          <InputGroupInput
            name="q"
            type="search"
            defaultValue={q}
            aria-label={label}
            placeholder={label}
          />
          <InputGroupAddon>
            <SearchIcon aria-hidden className="size-5" />
          </InputGroupAddon>
        </InputGroup>
      </form>
    </search>
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
