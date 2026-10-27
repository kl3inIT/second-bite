import Image from "next/image";
import { getTranslations } from "next-intl/server";

import { buttonVariants } from "@/components/ui/button";
import { formatPrice } from "@/features/offers/format";
import { kindText } from "@/features/offers/offer";
import { Link } from "@/i18n/navigation";
import type { DishBody, OfferBody } from "@/lib/api/generated";
import { photoUrl } from "@/lib/api/photo";
import { cn } from "@/lib/utils";

import { ShowDishButton } from "./show-dish-button";

// The home's posts and catalog on a phone (Figma Q1b-1 to Q1b-4): a heading, then one white box per dish, as the
// search list draws them (Figma K2b). A box is the photograph, the name, and at most two short lines; a post that
// cannot be ordered and a hidden dish have a faded photograph and their name in the muted ink.
//
// What a box holds is bounded so no data breaks it: a post's name stops after two lines and a dish's after one,
// a word too long for the line breaks inside, the old price goes under the new one when both do not fit, and every
// other line ends in "…". Under 360 px (a small phone) the photograph is 56 px, so the words keep their room.

const box = "flex min-w-0 items-center gap-3 rounded-2xl bg-card py-2.5 pr-3 pl-2.5 shadow-card";

/** A section of boxes: its heading, then the boxes or the line said when there are none. */
export function BoxSection({
  id,
  title,
  empty,
  children,
}: {
  id: string;
  title: string;
  empty?: string;
  children?: React.ReactNode;
}) {
  return (
    <section aria-labelledby={id} className="flex flex-col gap-2.5">
      <h2 id={id} className="text-card-title">
        {title}
      </h2>
      {empty ? (
        <p className="text-body-sm text-muted-foreground">{empty}</p>
      ) : (
        <ul className="flex flex-col gap-2.5">{children}</ul>
      )}
    </section>
  );
}

/** One post of the day: the name over two lines at most, the price over the old one, and the units left. */
export async function PostBox({ offer }: { offer: OfferBody }) {
  const [t, card] = await Promise.all([getTranslations("StoreHome"), getTranslations("OfferCard")]);
  const original = formatPrice(offer.originalPriceVnd);
  const onSale = offer.status === "on_sale";
  const standing = {
    on_sale: t("portionsLeft", { count: offer.unitsLeft }),
    sold_out: t("soldOut"),
    withdrawn: t("withdrawn"),
    closed: t("closed"),
  }[offer.status];

  return (
    <li className={box}>
      <BoxPhoto path={offer.photo.smallPath} faded={!onSale} />
      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <h3
          className={cn(
            "line-clamp-2 text-body-sm-strong wrap-break-word",
            onSale ? "text-foreground" : "text-muted-foreground",
          )}
        >
          {offer.name}
        </h3>
        <p className="flex flex-wrap items-baseline gap-x-1.25">
          <span className="font-display text-price-sm text-primary">
            {formatPrice(offer.priceVnd)}
          </span>
          <s aria-hidden className="text-label text-muted-foreground">
            {original}
          </s>
          <span className="sr-only">{card("originalPrice", { price: original })}</span>
        </p>
        <p className="truncate text-label text-muted-foreground">{standing}</p>
      </div>
    </li>
  );
}

/** One dish of the catalog: its name and its kind on one line each, and "Đăng ngay" or "Hiện món" at the end. */
export async function DishBox({ dish, sellerId }: { dish: DishBody; sellerId: string }) {
  const [t, kindName] = await Promise.all([
    getTranslations("StoreHome"),
    getTranslations("OfferKind"),
  ]);

  return (
    <li className={box}>
      <BoxPhoto path={dish.photo.smallPath} faded={dish.hidden} />
      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <h3
          className={cn(
            "truncate text-body-sm-strong",
            dish.hidden ? "text-muted-foreground" : "text-foreground",
          )}
        >
          {dish.name}
        </h3>
        <p className="truncate text-label text-muted-foreground">
          {`${kindText(kindName, dish.kind, dish.kindLabel)} · 1 ${dish.unit}`}
          {dish.hidden && <span className="sr-only">{` · ${t("dishHidden")}`}</span>}
        </p>
      </div>
      <span className="shrink-0">
        {dish.hidden ? (
          <ShowDishButton dishId={dish.id} label={t("showDish")} />
        ) : (
          <Link href={`/stores/${sellerId}/catalog/${dish.id}/post`} className={buttonVariants()}>
            {t("postNow")}
          </Link>
        )}
      </span>
    </li>
  );
}

function BoxPhoto({ path, faded }: { path: string; faded: boolean }) {
  return (
    <span
      className={cn(
        "relative size-14 shrink-0 overflow-hidden rounded-lg bg-muted min-[360px]:size-18",
        faded && "opacity-50",
      )}
    >
      <Image src={photoUrl(path)} alt="" fill sizes="72px" unoptimized className="object-cover" />
    </span>
  );
}
