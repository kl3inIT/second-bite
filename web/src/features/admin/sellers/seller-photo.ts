import type { SellerBody } from "@/lib/api/generated";

/** A store's photo through the web's /api, 400 px on its longer side for lists or 1600 for a page. */
export function sellerPhoto(
  seller: Pick<SellerBody, "photoId">,
  size: 400 | 1600,
): string | undefined {
  return seller.photoId ? `/api/photos/${seller.photoId}/${size}.jpg` : undefined;
}
