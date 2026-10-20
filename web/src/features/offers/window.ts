import { useFormatter } from "next-intl";

import type { OfferSummary } from "./offer";

const METERS_PER_KM = 1000;

/** The two edges of an offer's collection window on the 24-hour clock, "20:30" and "21:30". */
export function useCollectionWindow(offer: OfferSummary): { from: string; until: string } {
  const format = useFormatter();
  return {
    from: format.dateTime(new Date(offer.windowStart), "time"),
    until: format.dateTime(new Date(offer.windowEnd), "time"),
  };
}

/** How far the offer is from the place searched near, "350 m" or "1,2 km"; undefined without one. */
export function useDistance(offer: OfferSummary): string | undefined {
  const format = useFormatter();
  const meters = offer.distanceMeters;
  if (meters === undefined) return undefined;
  return meters < METERS_PER_KM
    ? format.number(meters, "meters")
    : format.number(meters / METERS_PER_KM, "kilometers");
}
