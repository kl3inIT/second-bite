import { useTranslations } from "next-intl";

import { BiteCorner } from "@/components/bite-corner";

import { DishTile } from "./dish-tile";
import type { OfferSummary } from "./offer";
import { OfferCard } from "./offer-card";
import { SellerAvatar } from "./seller-avatar";
import { useCollectionWindow } from "./window";

const MORE_DISHES = 3;

// One seller's dishes in the search, as Grab and Keeta group them. `lead="dish"` (Figma K1f) opens with the
// seller's first dish as a large card, then three more as tiles; `lead="seller"` (Figma K2c) opens with the
// seller and when they hand over, then three dishes as tiles.
export function SellerGroup({
  seller,
  offers,
  lead,
}: {
  seller: OfferSummary["seller"];
  offers: readonly OfferSummary[];
  lead: "dish" | "seller";
}) {
  const [first, ...rest] = offers;
  if (!first) return null;
  const tiles = (lead === "dish" ? rest : offers).slice(0, MORE_DISHES);

  return (
    <section
      aria-label={seller.name}
      className="relative flex flex-col overflow-hidden rounded-2xl bg-card text-card-foreground"
    >
      {lead === "dish" ? (
        <OfferCard offer={first} showSeller className="rounded-none" />
      ) : (
        <SellerHeading seller={seller} offer={first} />
      )}
      {tiles.length > 0 && (
        <div className="grid grid-cols-3 gap-2.25 px-3.5 pt-3 pb-3.5">
          {tiles.map((offer) => (
            <DishTile key={offer.id} offer={offer} />
          ))}
        </div>
      )}
      {lead === "seller" && <BiteCorner className="size-14" />}
    </section>
  );
}

function SellerHeading({ seller, offer }: { seller: OfferSummary["seller"]; offer: OfferSummary }) {
  const t = useTranslations("Search");
  const { from, until } = useCollectionWindow(offer);

  return (
    <div className="flex items-center gap-2.5 px-3.5 pt-3.5">
      <SellerAvatar seller={seller} size="md" />
      <div className="flex min-w-0 flex-col gap-0.5">
        <h3 className="truncate text-title-lg text-foreground">{seller.name}</h3>
        <p className="truncate text-label text-muted-foreground">
          {t("sellerWindow", { from, until })}
        </p>
      </div>
    </div>
  );
}
