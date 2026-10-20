import "server-only";

export type AreaRow = {
  id: string;
  name: string;
  /** The mall it is a floor of; none for the mall itself. */
  parentId?: string;
  /** Stores in it. */
  sellers: number;
  /** Whether new stores may join it. */
  open: boolean;
};

/**
 * The malls and floors stores sit in. The seller module keeps an address, not an area, so there are none; the page
 * shows its empty state until a backend for areas exists.
 */
export async function listAreas(): Promise<AreaRow[]> {
  return [];
}
