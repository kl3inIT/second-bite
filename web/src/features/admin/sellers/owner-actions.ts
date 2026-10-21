import type { SellerBody } from "@/lib/api/generated";

/**
 * The body of `POST /admin/sellers` as SEC-64 is expected to take it: the store's details as the owner's own form
 * sends them (`POST /sellers`), and the owner's address. The store is `active` at once; the owner role waits until
 * that address signs in with its code (SEC-39), and the owner is emailed that the store is ready.
 */
export type OpenStoreForOwnerRequest = {
  name: string;
  phone: string;
  address: string;
  latitude: number;
  longitude: number;
  /** The owner's address, 3 to 254 characters. */
  ownerEmail: string;
  /** A photo uploaded first with `POST /photos`, as the owner's form does. */
  photoId?: string;
};

/**
 * Whether the backend takes the request. SEC-64 has not built `POST /admin/sellers`, so the form's button stays
 * off with "Sắp có"; the change that builds it turns this on with the `openForOwner` flag.
 */
export const openStoreReady: boolean = false;

/**
 * Opens a store for its owner. SEC-64 has not built `POST /admin/sellers` yet, so this is never called while
 * `openStoreReady` is off; it answers the store, `active`, and refuses with the seller module's codes
 * (`SELLER_DETAILS_INVALID`, `SELLER_PHONE_INVALID`), `SELLER_LIMIT_REACHED` when the address owns five stores
 * already, and `SELLER_OWNER_EMAIL_INVALID` (open-store.ts › problemOfFailure). The generated SDK's function
 * replaces this body once `api/openapi.yaml` has the operation.
 */
export async function openStoreForOwner(_request: OpenStoreForOwnerRequest): Promise<SellerBody> {
  throw new Error("SEC-64 has not built POST /admin/sellers");
}
