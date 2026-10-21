import { isFeatureOn } from "@/features/admin/features";

import { readStatus } from "./seller-list";
import { SellersList } from "./sellers-list";
import { countSellers, listSellers } from "./sellers-source";

/**
 * The stores of the status the address names, with the count of each status for the cards. It reads the
 * request, so the page renders it inside a Suspense boundary, its skeleton showing meanwhile (AD-TT3).
 */
export async function SellersPage({
  query,
}: {
  query: Promise<Record<string, string | string[] | undefined>>;
}) {
  const review = isFeatureOn("storeReview");
  const status = readStatus(await query, review);
  const [rows, counts] = await Promise.all([listSellers(status), countSellers(review)]);
  return <SellersList rows={rows} counts={counts} review={review} />;
}
