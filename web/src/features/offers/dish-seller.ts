import "server-only";

import { ApiError } from "@/lib/api/client";
import { getOffer } from "@/lib/api/generated";

/** The seller of a dish, or null when nobody can read it: where an old dish address now leads (Figma K4). */
export async function dishSeller(offerId: string): Promise<string | null> {
  try {
    const { data } = await getOffer({ path: { offerId } });
    return data.sellerId;
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return null;
    throw error;
  }
}
