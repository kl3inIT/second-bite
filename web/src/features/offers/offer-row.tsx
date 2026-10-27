import { ScrollRow } from "@/components/scroll-row";

import type { OfferSummary } from "./offer";
import { OfferCard } from "./offer-card";

// Large cards in a row that scrolls sideways on a phone (Figma "closing soon row"), and a grid on a wide
// screen, where a row would leave most of it empty.
export function OfferRow({ label, offers }: { label: string; offers: readonly OfferSummary[] }) {
  return (
    <ScrollRow
      label={label}
      className="md:grid md:snap-none md:grid-cols-3 md:overflow-visible md:pb-0 lg:grid-cols-4"
    >
      {offers.map((offer) => (
        <li key={offer.id} className="flex shrink-0 snap-start md:shrink lg:nth-[n+5]:hidden">
          <OfferCard offer={offer} className="w-66 md:w-full" />
        </li>
      ))}
    </ScrollRow>
  );
}
