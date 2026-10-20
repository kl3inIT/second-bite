import { ScrollRow } from "@/components/scroll-row";

import type { OfferSummary } from "./offer";
import { OfferCard } from "./offer-card";

// Large cards in a row that scrolls sideways on a phone (Figma "closing soon row"), and a grid on a wide
// screen, where a row would leave most of it empty.
export function OfferRow({ label, offers }: { label: string; offers: readonly OfferSummary[] }) {
  return (
    <ScrollRow
      label={label}
      className="lg:grid lg:snap-none lg:grid-cols-3 lg:overflow-visible lg:pb-0 xl:grid-cols-4"
    >
      {offers.map((offer) => (
        <li key={offer.id} className="flex shrink-0 snap-start lg:shrink xl:nth-[n+5]:hidden">
          <OfferCard offer={offer} className="w-66 lg:w-full" />
        </li>
      ))}
    </ScrollRow>
  );
}
