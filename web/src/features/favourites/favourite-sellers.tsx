"use client";

import { HeartIcon } from "lucide-react";
import { useFormatter, useTranslations } from "next-intl";
import { useEffect, useState } from "react";

import { buttonVariants } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Skeleton } from "@/components/ui/skeleton";
import { DishTile } from "@/features/offers/dish-tile";
import { inShowingOrder, type OfferSummary } from "@/features/offers/offer";
import { sellerRating } from "@/features/offers/proposed";
import { SellerLogo } from "@/features/offers/seller-logo";
import { Link } from "@/i18n/navigation";
import { getSellerProfile, type SellerProfileBody } from "@/lib/api/generated";

import { FollowButton } from "./follow-button";
import { followedIds, useFollows } from "./follows";

const ONE_DECIMAL = { minimumFractionDigits: 1, maximumFractionDigits: 1 } as const;

type Seller = Pick<SellerProfileBody, "id" | "name" | "photo" | "address">;

// "Yêu thích" (SEC-109, Figma K9, K9a): one card for each followed seller, newest first, with its dishes on sale
// tonight in a row, or the line that it has none; the empty state while no seller is followed. `offers` are
// tonight's, as the home lists them (decision 5).
export function FavouriteSellers({ offers }: { offers: readonly OfferSummary[] }) {
  const t = useTranslations("Favourites");
  const follows = useFollows();
  const ids = followedIds(follows);
  const profiles = useProfiles(follows.state === "account" ? follows.sellers : null, ids, offers);

  if (follows.state === "loading") return <Skeleton shape="card" className="h-58" />;
  if (ids.length === 0) return <NoFavourites />;

  return (
    <>
      <p className="text-body-sm text-muted-foreground">{t("intro")}</p>
      <ul className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {ids.map((id) => {
          const own = inShowingOrder(offers.filter((offer) => offer.sellerId === id));
          const seller = own[0]?.seller ?? profiles.get(id);
          return seller ? (
            <li key={id}>
              <SellerCard seller={seller} offers={own} />
            </li>
          ) : null;
        })}
      </ul>
    </>
  );
}

/**
 * The followed sellers' profiles: the account's list carries them; a browser's list has only ids, so each seller
 * with no dish tonight is asked for. A seller that is gone answers 404 and is left out.
 */
function useProfiles(
  fromAccount: readonly SellerProfileBody[] | null,
  ids: readonly string[],
  offers: readonly OfferSummary[],
): ReadonlyMap<string, Seller> {
  const [asked, setAsked] = useState<ReadonlyMap<string, Seller>>(new Map());
  const missing = fromAccount
    ? []
    : ids.filter((id) => !asked.has(id) && !offers.some((offer) => offer.sellerId === id));
  const key = missing.join(",");

  useEffect(() => {
    if (!key) return;
    let current = true;
    void Promise.allSettled(
      key.split(",").map((sellerId) => getSellerProfile({ path: { sellerId } })),
    ).then((answers) => {
      if (!current) return;
      setAsked((before) => {
        const next = new Map(before);
        for (const answer of answers) {
          if (answer.status === "fulfilled") next.set(answer.value.data.id, answer.value.data);
        }
        return next;
      });
    });
    return () => {
      current = false;
    };
  }, [key]);

  return fromAccount ? new Map(fromAccount.map((seller) => [seller.id, seller])) : asked;
}

// One followed seller (Figma K9 "khối quán"): the logo beside the name, the rating and floor or place, and the
// red heart; tonight's dishes in a row that scrolls sideways, or the line that there are none tonight.
function SellerCard({
  seller,
  offers,
}: {
  seller: Seller | OfferSummary["seller"];
  offers: readonly OfferSummary[];
}) {
  const t = useTranslations("Favourites");
  const format = useFormatter();
  const [lead] = offers;
  const rating = lead ? sellerRating(lead) : undefined;

  return (
    <article className="flex flex-col gap-3 rounded-2xl bg-card p-3.5 text-card-foreground">
      <div className="flex items-center gap-2.5">
        <SellerLogo seller={seller} size="sm" />
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <h2 className="truncate text-title text-foreground">
            <Link
              href={`/sellers/${seller.id}`}
              className="focus-visible:ring-3 focus-visible:ring-ring focus-visible:outline-none"
            >
              {seller.name}
            </Link>
          </h2>
          <p className="truncate text-label text-muted-foreground">
            {rating !== undefined && `${format.number(rating, ONE_DECIMAL)} ★ · `}
            {seller.address}
          </p>
        </div>
        <FollowButton sellerId={seller.id} name={seller.name} look="card" />
      </div>
      {offers.length > 0 ? (
        <ul className="-mx-3.5 scrollbar-none flex gap-2.75 overflow-x-auto px-3.5">
          {offers.map((offer) => (
            <li key={offer.id} className="w-28 shrink-0">
              <DishTile offer={offer} square />
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-body-sm text-muted-foreground">{t("noneTonight")}</p>
      )}
    </article>
  );
}

// No seller followed yet (Figma K9a): the heart, what to do, and the way to the sellers.
function NoFavourites() {
  const t = useTranslations("Favourites");

  return (
    <Empty className="flex-1">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <HeartIcon aria-hidden />
        </EmptyMedia>
        <EmptyTitle>{t("emptyTitle")}</EmptyTitle>
        <EmptyDescription>{t("emptyBody")}</EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Link href="/" className={buttonVariants({ size: "lg", className: "w-full" })}>
          {t("explore")}
        </Link>
      </EmptyContent>
    </Empty>
  );
}
