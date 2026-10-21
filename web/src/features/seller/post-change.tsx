import { notFound } from "next/navigation";

import { getStoreOffers } from "./my-sellers";
import { dishesOf, editTargetOf } from "./post-draft";
import { PostDrawer } from "./post-drawer";
import { requireStore } from "./require-store";
import { vietnamDay } from "./store-day";
import { StorePosts } from "./store-posts";
import { WithdrawDrawer } from "./withdraw-drawer";

// Changing or withdrawing a live post (SEC-57, Figma E1 to E3b): the store's post list, with the drawer over it.
// A post that does not exist, or is over or withdrawn, no longer changes, and its address is a not-found page.
// It reads the session, so it renders inside Suspense.
export async function PostChange({
  sellerId: pendingId,
  offerId: pendingOffer,
  mode,
}: {
  sellerId: Promise<string>;
  offerId: Promise<string>;
  mode: "edit" | "withdraw";
}) {
  const [sellerId, offerId] = await Promise.all([pendingId, pendingOffer]);
  await requireStore(sellerId, `/stores/${sellerId}/offers/${offerId}/${mode}`);
  const offers = await getStoreOffers(sellerId);
  const offer = offers.find((candidate) => candidate.id === offerId);
  const target = offer && editTargetOf(offer);
  if (!target) notFound();

  return (
    <>
      <StorePosts
        sellerId={Promise.resolve(sellerId)}
        query={Promise.resolve({
          // The list behind the drawer shows the day of the post being changed, and its tab.
          day: vietnamDay.format(new Date(offer.windowStart)),
          ...(target.status === "sold_out" ? { tab: "sold_out" } : {}),
        })}
      />
      {mode === "edit" ? (
        <PostDrawer sellerId={sellerId} dishes={dishesOf(offers)} catalog={[]} edit={target} />
      ) : (
        <WithdrawDrawer sellerId={sellerId} target={target} />
      )}
    </>
  );
}
