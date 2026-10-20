import type { SearchParams } from "../list-query";
import { promotionQueryOf } from "./promotion";
import { PromotionsView } from "./promotions-view";
import { listPromotions, listPromotionStores } from "./promotions-source";

/** The promotions page's read: the query from the address, then the codes and the stores a code can name. */
export async function PromotionsPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const query = promotionQueryOf(await searchParams);
  const [list, stores] = await Promise.all([listPromotions(query), listPromotionStores()]);
  return <PromotionsView list={list} query={query} stores={stores} />;
}
