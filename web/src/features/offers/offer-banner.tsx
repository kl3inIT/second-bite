import { useTranslations } from "next-intl";

import { BiteCorner } from "@/components/bite-corner";
import { Sticker } from "@/components/sticker";

import { OfferPhoto } from "./offer-card";
import type { OfferSummary } from "./offer";
import { useCollectionWindow } from "./window";

// A banner for one of tonight's offers (DESIGN.md › Banner, Figma banner/…): the photograph under a dark
// scrim, the window as a sticker and the dish as the title, under a bitten corner.
export function OfferBanner({ offer }: { offer: OfferSummary }) {
  const t = useTranslations("OfferCard");
  const { from, until } = useCollectionWindow(offer);

  return (
    <article className="relative h-42 w-full overflow-hidden rounded-2xl bg-primary">
      <OfferPhoto offer={offer} />
      <div
        aria-hidden
        className="absolute inset-0 bg-linear-to-b from-primary-hover/5 to-primary-hover/80"
      />
      <Sticker className="absolute top-4 left-4">{t("window", { from, until })}</Sticker>
      <div className="absolute inset-x-4 bottom-6 flex flex-col gap-1">
        <p className="truncate text-caption font-semibold text-primary-foreground">
          {offer.seller.name}
        </p>
        <h3 className="line-clamp-2 font-display text-banner text-primary-foreground">
          {offer.name}
        </h3>
      </div>
      <BiteCorner className="size-14" />
    </article>
  );
}
