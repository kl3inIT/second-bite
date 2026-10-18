import { useFormatter } from "next-intl";

import type { OfferSummary } from "./offer";

/** The two edges of an offer's collection window on the 24-hour clock, "20:30" and "21:30". */
export function useCollectionWindow(offer: OfferSummary): { from: string; until: string } {
  const format = useFormatter();
  return {
    from: format.dateTime(new Date(offer.windowStart), "time"),
    until: format.dateTime(new Date(offer.windowEnd), "time"),
  };
}
