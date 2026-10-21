import { ClockIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import { BiteCorner } from "@/components/bite-corner";
import { FollowButton } from "@/features/favourites/follow-button";
import { cn } from "@/lib/utils";

import { DiscountLabel } from "./discount-label";
import { DishLink, SellerLink } from "./dish-link";
import { isAvailable, type OfferSummary } from "./offer";
import { OfferPhoto } from "./offer-photo";
import { Price } from "./price";
import { sellerRating } from "./proposed";
import { Rating } from "./rating";
import { useCollectionWindow, useDistance } from "./window";

// The large card of "Sắp hết giờ nhận", the lists and the search (DESIGN.md › Offer card, Figma Mobile v3
// card/…): the photograph with the discount label and, on a scrim at its foot, the window, how far it is and
// the seller's rating; then the dish, the portions left in red words and the price, under a bitten corner.
// A card names the dish only; where the seller is not otherwise shown, as in search results, `showSeller`
// adds them, with their place on the scrim ("Tầng 3", Figma K1f) and a heart.
// `compact` is the card of the home's two-column grid (Figma "lưới món"): a 120px photograph, then the dish
// (with `showSeller` the seller under it), the price on its own line and the portions left under it, a heart instead of the bitten corner and no
// rating, which would cut the window short.
export function OfferCard({
  offer,
  showSeller = false,
  compact = false,
  className,
}: {
  offer: OfferSummary;
  showSeller?: boolean;
  compact?: boolean;
  className?: string;
}) {
  const t = useTranslations("OfferCard");
  const { from, until } = useCollectionWindow(offer);
  const distance = useDistance(offer);
  const available = isAvailable(offer);
  const window = t("window", { from, until });
  const rating = sellerRating(offer);
  const where = showSeller
    ? t("windowAt", { window, place: offer.seller.address })
    : distance
      ? t("windowAway", { window, distance })
      : window;

  return (
    <article
      className={cn(
        "relative flex flex-col overflow-hidden rounded-xl bg-card text-card-foreground shadow-card",
        className,
      )}
    >
      <div className={cn("relative", compact ? "h-30" : showSeller ? "h-37" : "h-34")}>
        <OfferPhoto
          offer={offer}
          dimmed={!available}
          sizes={compact ? "(min-width: 640px) 25vw, 50vw" : "(min-width: 640px) 50vw, 100vw"}
        />
        {/* In the search the heart takes the label's corner; the struck price still shows the saving (Figma K1f). */}
        {(compact || !showSeller) && (
          <DiscountLabel percent={offer.discountPercent} className="rounded-tl-xl" />
        )}
        <p
          className={cn(
            "absolute inset-x-0 bottom-0 flex items-end bg-linear-to-b from-transparent to-foreground/60 text-label-strong text-card",
            compact ? "h-11 gap-1.25 px-2.5 pb-2" : "h-13 gap-1.75 px-3.25 pb-2.5",
          )}
        >
          <ClockIcon aria-hidden strokeWidth={2} className="mb-0.5 size-4 shrink-0" />
          <span className="truncate">{where}</span>
          {!compact && rating !== undefined && <Rating rating={rating} className="ml-auto" />}
        </p>
        {(compact || showSeller) && (
          <FollowButton
            sellerId={offer.sellerId}
            name={offer.seller.name}
            look="photo"
            className={compact ? "top-0 right-0" : "top-0.5 left-0.5"}
          />
        )}
      </div>
      <div className={cn("flex flex-col gap-1 pt-2.5 pb-3", compact ? "px-2.5" : "px-3.5")}>
        {showSeller && !compact ? (
          // The seller under the dish, the portions left under the price (Figma K1f).
          <>
            <div className="flex items-center justify-between gap-2">
              <h3 className="min-w-0 truncate text-title-lg text-foreground">
                <DishLink offer={offer}>{offer.name}</DishLink>
              </h3>
              <Price offer={offer} />
            </div>
            <div className="flex items-center justify-between gap-2">
              <p className="min-w-0 truncate text-label text-muted-foreground">
                <SellerLink sellerId={offer.sellerId}>
                  {distance
                    ? t("sellerAway", { seller: offer.seller.name, distance })
                    : t("seller", { seller: offer.seller.name })}
                </SellerLink>
              </p>
              <UnitsLeft offer={offer} />
            </div>
          </>
        ) : (
          <>
            <h3
              className={cn("truncate text-foreground", compact ? "text-title" : "text-title-lg")}
            >
              <DishLink offer={offer}>{offer.name}</DishLink>
            </h3>
            {showSeller && (
              <p className="truncate text-label text-muted-foreground">
                <SellerLink sellerId={offer.sellerId}>
                  {t("seller", { seller: offer.seller.name })}
                </SellerLink>
              </p>
            )}
          </>
        )}
        {compact ? (
          <>
            <Price offer={offer} className="justify-end" />
            <UnitsLeft offer={offer} />
          </>
        ) : (
          !showSeller && (
            // With a phone's large text the price goes under the units, still on the right (SEC-107).
            <div className="flex flex-wrap items-center justify-between gap-x-2">
              <UnitsLeft offer={offer} />
              <Price offer={offer} className="ml-auto" />
            </div>
          )
        )}
      </div>
      {!compact && <BiteCorner className="size-14" />}
    </article>
  );
}

/** "Còn 2 phần" in red words, or "Đã hết" in muted once nothing is left (The One Label Rule). */
export function UnitsLeft({ offer }: { offer: OfferSummary }) {
  const t = useTranslations("OfferCard");

  return isAvailable(offer) ? (
    <p className="text-label-strong text-sale">{t("left", { units: offer.unitsLeft })}</p>
  ) : (
    <p className="text-label-strong text-muted-foreground">{t("soldOut")}</p>
  );
}
