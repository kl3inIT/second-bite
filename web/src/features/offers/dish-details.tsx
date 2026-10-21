import {
  ClockIcon,
  CookieIcon,
  CupSodaIcon,
  PackageIcon,
  StarIcon,
  UtensilsIcon,
  type LucideIcon,
} from "lucide-react";
import { useFormatter, useTranslations } from "next-intl";

import { BackButton } from "@/components/back-button";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { AddToCartButton } from "@/features/cart/add-to-cart-button";
import { DishBooking } from "@/features/cart/dish-booking";
import { Link } from "@/i18n/navigation";

import { formatPrice } from "./format";
import { HeartButton } from "./heart-button";
import { isAvailable, type OfferKind, type OfferSummary } from "./offer";
import { OfferPhoto } from "./offer-photo";
import { sellerRating } from "./proposed";
import { SellerLogo } from "./seller-logo";
import { ShareButton } from "./share-button";
import { useCollectionWindow, useDistance } from "./window";

const MORE_DISHES = 4;
const ONE_DECIMAL = { minimumFractionDigits: 1, maximumFractionDigits: 1 } as const;

const kindIcons: Record<OfferKind, LucideIcon> = {
  bakery: CookieIcon,
  prepared_food: UtensilsIcon,
  ingredients: PackageIcon,
  drinks: CupSodaIcon,
  mixed_box: PackageIcon,
  other: PackageIcon,
};

// A dish (Figma K4): its photograph with back, share and the heart over it; on a white sheet rising over its
// foot the seller with "Xem quán", the dish, its kind and portion, the window and the seller's rating, then
// the seller's other dishes tonight and the description; a bar with the price and "Thêm vào giỏ" stays at the
// bottom. Reviews have no backend yet, so they are left out (SEC-49 decision 7).
// From 1024px it is Figma WK4: the path to it, then two columns, the dish's name over a rounded photograph and
// the same details on the left, and the booking card staying beside them on the right instead of the bar.
export function DishDetails({
  dish,
  others,
  near,
}: {
  dish: OfferSummary;
  others: readonly OfferSummary[];
  near?: string;
}) {
  const t = useTranslations("Dish");
  const kinds = useTranslations("OfferKind");
  const format = useFormatter();
  const { from, until } = useCollectionWindow(dish);
  const distance = useDistance(dish);
  const rating = sellerRating(dish);
  const KindIcon = kindIcons[dish.kind];
  const sellerHref = { pathname: `/sellers/${dish.sellerId}`, query: near ? { near } : {} };

  return (
    <>
      <main className="mx-auto w-full max-w-xl flex-1 bg-card lg:max-w-248 lg:bg-transparent lg:px-0 lg:pt-8 lg:pb-12">
        <Breadcrumb aria-label={t("crumbs")} className="mb-6 hidden lg:block">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink render={<Link href="/" />}>{t("home")}</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink render={<Link href={sellerHref} />}>
                {dish.seller.name}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{dish.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="lg:flex lg:items-start lg:gap-8">
          <div className="flex flex-col lg:min-w-0 lg:flex-1 lg:gap-5">
            <div className="relative h-70 bg-muted lg:order-2 lg:h-90 lg:overflow-hidden lg:rounded-3xl">
              <OfferPhoto
                offer={dish}
                large
                dimmed={!isAvailable(dish)}
                sizes="(min-width: 576px) 576px, 100vw"
              />
              <div className="absolute inset-x-0 top-0 h-30 bg-linear-to-b from-foreground/35 to-transparent lg:hidden" />
              <div className="absolute inset-x-4 top-3 flex items-center gap-2 lg:hidden">
                <BackButton fallback="/" />
                <div className="ml-auto flex gap-2">
                  <ShareButton title={dish.name} />
                  <HeartButton offerId={dish.id} name={dish.name} float />
                </div>
              </div>
            </div>
            <div className="relative -mt-6 flex flex-col gap-4 rounded-t-3xl bg-card px-4 pt-5 pb-6 lg:contents">
              <div className="flex items-center gap-3 lg:order-3">
                <SellerLogo seller={dish.seller} size="md" />
                <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                  <p className="truncate text-title text-foreground">{dish.seller.name}</p>
                  <p className="truncate text-label text-muted-foreground">
                    {distance
                      ? t("placeAway", { place: dish.seller.address, distance })
                      : dish.seller.address}
                  </p>
                </div>
                <Link
                  href={sellerHref}
                  className="-mr-2 flex min-h-11 shrink-0 items-center rounded-lg px-2 text-label-strong text-link focus-visible:ring-3 focus-visible:ring-ring focus-visible:outline-none"
                >
                  {t("seeSeller")}
                </Link>
              </div>
              <h1 className="text-headline text-foreground lg:order-1 lg:font-display lg:text-page-title lg:font-bold">
                {dish.name}
              </h1>
              <ul className="flex flex-col gap-2.5 text-body-sm text-foreground lg:order-4">
                <li className="flex items-center gap-2.5">
                  <KindIcon
                    aria-hidden
                    strokeWidth={1.8}
                    className="size-5.5 shrink-0 text-primary"
                  />
                  {t("portion", { kind: kinds(dish.kind), unit: dish.unit })}
                </li>
                <li className="flex items-center gap-2.5">
                  <ClockIcon
                    aria-hidden
                    strokeWidth={1.8}
                    className="size-5.5 shrink-0 text-primary"
                  />
                  {t("window", { from, until })}
                </li>
                {rating !== undefined && (
                  <li className="flex items-center gap-2.5">
                    <StarIcon aria-hidden className="size-5.5 shrink-0 fill-rating text-rating" />
                    {t("rating", { rating: format.number(rating, ONE_DECIMAL) })}
                  </li>
                )}
              </ul>
              {(others.length > 0 || dish.description) && (
                <section
                  aria-labelledby="more"
                  className="flex flex-col gap-3 border-t border-border pt-4 lg:order-5"
                >
                  {others.length > 0 && (
                    <>
                      <h2 id="more" className="text-title-lg text-foreground">
                        {t("more")}
                      </h2>
                      <ul className="grid grid-cols-4 gap-3 lg:flex lg:justify-between">
                        {others.slice(0, MORE_DISHES).map((other) => (
                          <li key={other.id} className="lg:size-20">
                            <Link
                              href={`/offers/${other.id}`}
                              aria-label={t("other", {
                                name: other.name,
                                price: formatPrice(other.priceVnd),
                              })}
                              className="relative block aspect-square overflow-hidden rounded-md focus-visible:ring-3 focus-visible:ring-ring focus-visible:outline-none"
                            >
                              <OfferPhoto offer={other} sizes="96px" />
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                  {dish.description && (
                    <p className="text-body-sm text-muted-foreground lg:text-note">
                      {dish.description}
                    </p>
                  )}
                </section>
              )}
            </div>
          </div>
          <DishBooking
            dish={dish}
            className="hidden lg:sticky lg:top-24 lg:flex lg:w-87 lg:shrink-0"
          />
        </div>
      </main>
      <DishBar dish={dish} />
    </>
  );
}

// The bar at the bottom of the dish (Figma K4 footer): tonight's price over the old one, the discount and the
// portions left, and the cart's button. It sticks to the screen's foot and rests above the site's footer.
function DishBar({ dish }: { dish: OfferSummary }) {
  const t = useTranslations("Dish");
  const cards = useTranslations("OfferCard");
  const original = formatPrice(dish.originalPriceVnd);

  return (
    <div className="sticky bottom-0 z-40 border-t border-border bg-card lg:hidden">
      <div className="mx-auto flex w-full max-w-xl items-center gap-4 px-4 pt-3 pb-5">
        <div className="flex flex-col">
          <p className="flex items-baseline gap-1.5">
            <span className="font-display text-price-lg text-primary">
              {formatPrice(dish.priceVnd)}
            </span>
            <s aria-hidden className="text-label text-muted-foreground">
              {original}
            </s>
            <span className="sr-only">{cards("originalPrice", { price: original })}</span>
          </p>
          {isAvailable(dish) ? (
            <p className="text-label-strong text-sale">
              {t("saving", { percent: dish.discountPercent, units: dish.unitsLeft })}
            </p>
          ) : (
            <p className="text-label-strong text-muted-foreground">{cards("soldOut")}</p>
          )}
        </div>
        <AddToCartButton offer={dish} />
      </div>
    </div>
  );
}
