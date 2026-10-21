import { isFeatureOn } from "@/features/admin/features";

import { readListQuery } from "./seller-list";
import { SellersList } from "./sellers-list";
import { countSellers, listSellers } from "./sellers-source";

/**
 * The page of stores the address asks for, with the count of each status for the cards. It reads the request,
 * so the page renders it inside a Suspense boundary, its skeleton showing meanwhile (AD-TT3).
 */
export async function SellersPage({
  query,
}: {
  query: Promise<Record<string, string | string[] | undefined>>;
}) {
  const review = isFeatureOn("storeReview");
  const state = readListQuery(await query, review);
  const [shown, counts] = await Promise.all([listSellers(state), countSellers()]);
  return (
    <SellersList
      query={{ ...state, page: shown.page }}
      rows={shown.rows}
      total={shown.total}
      counts={counts}
      review={review}
    />
  );
}
