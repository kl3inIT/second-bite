"use client";

import { usePathname, useRouter } from "@/i18n/navigation";

import { type ListQuery, listQueryString } from "./seller-list";

/**
 * Moves the stores list to a new state through its address (seller-list.ts), which the server reads to ask
 * `GET /admin/sellers` for that page. Anything but turning the page starts again from the first. `review` is the
 * `storeReview` flag, which changes the statuses the list offers and the one it opens on.
 */
export function useListQuery(query: ListQuery, review: boolean) {
  const router = useRouter();
  const pathname = usePathname();
  return (change: Partial<ListQuery>) => {
    const search = listQueryString({ ...query, page: 1, ...change }, review);
    router.replace(search ? `${pathname}?${search}` : pathname, { scroll: false });
  };
}

/** The address of the list in another status, keeping the search, from the first page. */
export function statusHref(
  query: ListQuery,
  status: ListQuery["status"],
  base: string,
  review: boolean,
): string {
  const search = listQueryString({ ...query, status, page: 1 }, review);
  return search ? `${base}?${search}` : base;
}
