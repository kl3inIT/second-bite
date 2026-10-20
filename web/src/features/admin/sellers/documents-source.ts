import "server-only";

/** Whether a store's document holds: in force, running out within 30 days, or not handed in. */
export type DocumentStatus = "valid" | "expiring" | "missing";

/**
 * One of the documents a store hands in to be checked (Figma AD-QD5): a business licence, a food-safety
 * certificate, a health check. Dates are days in Vietnam's time; `expiresOn` is absent for a document that does
 * not expire, `fileUrl` until the file is uploaded.
 */
export type SellerDocument = {
  id: string;
  name: string;
  number?: string;
  issuedOn?: string;
  expiresOn?: string;
  status: DocumentStatus;
  fileUrl?: string;
};

/**
 * A store's documents. The `seller` module keeps none yet (its spec holds the name, address, location, phone,
 * photo and status), and which documents are required is still to be decided (Figma AD-QD5's note), so there are
 * none and the tab shows its empty state. A seller documents API replaces this.
 */
export async function listSellerDocuments(_sellerId: string): Promise<SellerDocument[]> {
  return [];
}
