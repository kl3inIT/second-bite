import "server-only";

import type { StoreOption } from "../promotions/promotion-form";
import type { BannerRow, ContentData } from "./banner";

/**
 * The app's banners and featured collections (Figma AD-MK3). No module keeps them yet and no issue or decision
 * covers them (SEC-62 design › What waits), so there are none and the page shows its empty states. The backend
 * that adds them replaces this read.
 */
export async function getContent(): Promise<ContentData> {
  return { banners: [], collections: [] };
}

/** One banner to change (Figma AD-MK4); with no banners kept yet, none is found and the page is not found. */
export async function getBanner(_bannerId: string): Promise<BannerRow | null> {
  return null;
}

/** The stores a banner can open; read with the banners' backend, none until then. */
export async function listBannerStores(): Promise<StoreOption[]> {
  return [];
}
