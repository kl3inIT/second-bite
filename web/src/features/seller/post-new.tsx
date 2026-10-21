import { getStoreDishes, getStoreOffers } from "./my-sellers";
import { catalogDishOf, dishOf, dishesOf } from "./post-draft";
import { PostDrawer } from "./post-drawer";
import { requireStore } from "./require-store";
import { StorePosts } from "./store-posts";

// Posting a dish (SEC-57, Figma P1 to P3 and R1): the store's post list, with the drawer that posts over it.
// With `from`, a closed post it is posted again from, the list behind is that tab and the drawer starts at the
// last step with the dish filled in. It reads the session, so it renders inside Suspense.
export async function PostNew({
  sellerId: pendingId,
  from: pendingFrom,
}: {
  sellerId: Promise<string>;
  from: Promise<string | undefined>;
}) {
  const [sellerId, from] = await Promise.all([pendingId, pendingFrom]);
  await requireStore(sellerId, `/stores/${sellerId}/offers/new`);
  const [offers, catalog] = await Promise.all([getStoreOffers(sellerId), getStoreDishes(sellerId)]);
  const earlier = from ? offers.find((offer) => offer.id === from) : undefined;

  return (
    <>
      <StorePosts
        sellerId={Promise.resolve(sellerId)}
        tab={Promise.resolve(earlier ? "closed" : undefined)}
      />
      <PostDrawer
        sellerId={sellerId}
        dishes={dishesOf(offers)}
        catalog={catalog.filter((dish) => !dish.hidden).map(catalogDishOf)}
        again={earlier ? dishOf(earlier) : undefined}
      />
    </>
  );
}
