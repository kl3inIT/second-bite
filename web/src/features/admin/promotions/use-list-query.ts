"use client";

import { usePathname, useRouter } from "@/i18n/navigation";

import { type ListQueryValue, listSearch } from "./list-query";

/**
 * Moves a marketing list to another filter, sort or page through its address, as the seller's web does with
 * `searchParams` (no state library): `hrefWith` for a link (a sort heading, a page), `go` for a control (a
 * select, the search field), which replaces the address so the back button skips each keystroke.
 */
export function useListQuery<Query extends Record<string, ListQueryValue>>(
  query: Query,
  defaults: Query,
) {
  const router = useRouter();
  const pathname = usePathname();
  const hrefWith = (change: Partial<Query>) => `${pathname}${listSearch(query, change, defaults)}`;
  const go = (change: Partial<Query>) => router.replace(hrefWith(change), { scroll: false });
  return { hrefWith, go };
}
