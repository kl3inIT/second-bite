import type { OfferSummary } from "./offer";
import { OfferCard } from "./offer-card";

// Large cards one above the other on a phone (Figma "thẻ nổi bật"), in columns as the screen widens.
export function OfferList({
  offers,
  showSeller = false,
}: {
  offers: readonly OfferSummary[];
  showSeller?: boolean;
}) {
  return (
    <ul className="grid gap-3 px-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {offers.map((offer) => (
        <li key={offer.id} className="flex">
          <OfferCard offer={offer} showSeller={showSeller} className="w-full" />
        </li>
      ))}
    </ul>
  );
}
