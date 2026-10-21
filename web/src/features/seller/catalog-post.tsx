import { notFound } from "next/navigation";

import { getStoreDishes, getStoreOffers } from "./my-sellers";
import { catalogDishOf, dishesOf } from "./post-draft";
import { PostDrawer } from "./post-drawer";
import { requireStore } from "./require-store";
import { StoreCatalog } from "./store-catalog";

// Posting a dish straight from its row in the catalog (SEC-55, Figma D1): the catalog, with the drawer that posts
// over it, at the last step with the dish filled in. A hidden or missing dish is not found. It reads the session,
// so it renders inside Suspense.
export async function CatalogPost({
  sellerId: pendingId,
  dishId: pendingDish,
}: {
  sellerId: Promise<string>;
  dishId: Promise<string>;
}) {
  const [sellerId, dishId] = await Promise.all([pendingId, pendingDish]);
  await requireStore(sellerId, `/stores/${sellerId}/catalog/${dishId}/post`);
  const [dishes, offers] = await Promise.all([getStoreDishes(sellerId), getStoreOffers(sellerId)]);
  const dish = dishes.find((d) => d.id === dishId && !d.hidden);
  if (!dish) notFound();

  return (
    <StoreCatalog sellerId={Promise.resolve(sellerId)}>
      <PostDrawer
        sellerId={sellerId}
        dishes={dishesOf(offers)}
        catalog={dishes.filter((d) => !d.hidden).map(catalogDishOf)}
        fromDish={catalogDishOf(dish)}
      />
    </StoreCatalog>
  );
}
