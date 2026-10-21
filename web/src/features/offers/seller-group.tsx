import { DishTile } from "./dish-tile";
import type { OfferSummary } from "./offer";
import { OfferCard } from "./offer-card";

const MORE_DISHES = 3;

// One seller's dishes in the search, as Grab and Keeta group them (Figma K1f): the seller's first dish as a
// large card naming them, then three more as tiles 12px under its body.
export function SellerGroup({
  seller,
  offers,
}: {
  seller: OfferSummary["seller"];
  offers: readonly OfferSummary[];
}) {
  const [first, ...rest] = offers;
  if (!first) return null;
  const tiles = rest.slice(0, MORE_DISHES);

  return (
    <section
      aria-label={seller.name}
      className="relative flex flex-col overflow-hidden rounded-2xl bg-card text-card-foreground shadow-card"
    >
      <OfferCard offer={first} showSeller className="rounded-none shadow-none" />
      {tiles.length > 0 && (
        <div className="grid grid-cols-3 gap-2.25 px-3.5 pb-3.5">
          {tiles.map((offer) => (
            <DishTile key={offer.id} offer={offer} />
          ))}
        </div>
      )}
    </section>
  );
}
