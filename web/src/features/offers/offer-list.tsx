import { cn } from "@/lib/utils";

import type { OfferSummary } from "./offer";
import { OfferCard } from "./offer-card";

// Large cards one above the other on a phone (Figma "thẻ nổi bật"), in columns as the screen widens; `compact`
// cards two abreast from a phone up (Figma "lưới món").
export function OfferList({
  offers,
  compact = false,
}: {
  offers: readonly OfferSummary[];
  compact?: boolean;
}) {
  return (
    <ul
      className={cn(
        "grid gap-3 px-4",
        compact
          ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
          : "sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
      )}
    >
      {offers.map((offer) => (
        <li key={offer.id} className="flex min-w-0">
          <OfferCard offer={offer} compact={compact} className="w-full" />
        </li>
      ))}
    </ul>
  );
}
