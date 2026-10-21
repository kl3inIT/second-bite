import "server-only";

import { cache } from "react";

import { ApiError } from "@/lib/api/client";
import { getOffer } from "@/lib/api/generated";

import { listOffers } from "./list-offers";
import { inShowingOrder, isAvailable, type OfferSummary } from "./offer";

/**
 * A dish with its seller's other dishes tonight (Figma K4), or null when nobody can read it. The offer
 * itself names only its seller, so the seller's search gives the dish as the cards show it. The page and its
 * title ask for the same dish, so one render makes one request.
 */
export const getDish = cache(async function getDish(
  offerId: string,
  near?: string,
): Promise<{ dish: OfferSummary; others: OfferSummary[] } | null> {
  let sellerId: string;
  try {
    ({
      data: { sellerId },
    } = await getOffer({ path: { offerId } }));
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return null;
    throw error;
  }
  const offers = inShowingOrder(await listOffers({ sellerId, near }));
  const dish = offers.find(({ id }) => id === offerId);
  if (!dish) return null;
  return { dish, others: offers.filter((offer) => offer.id !== offerId && isAvailable(offer)) };
});
