import "server-only";

/** The kind of food a top category stands for, which sets its icon (Figma AD-CD1). */
export type CategoryIcon = "bakery" | "preparedFood" | "drinks" | "ingredients" | "other";

export type CategoryRow = {
  id: string;
  name: string;
  /** The top category it sits under; none for a top category. */
  parentId?: string;
  icon?: CategoryIcon;
  /** Posts on sale in it now. */
  postsOnSale: number;
  /** Whether customers see it. */
  visible: boolean;
  /** A category drawn as "Sắp mở": shown to no one until its first stores join. */
  opening?: boolean;
};

/**
 * The categories customers browse by. No module keeps a category tree yet (offers carry a fixed `kind`), so there
 * are none; the page shows its empty state until a backend for categories exists.
 */
export async function listCategories(): Promise<CategoryRow[]> {
  return [];
}
