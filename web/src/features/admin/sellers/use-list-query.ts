"use client";

import { usePathname, useSearchParams } from "next/navigation";

import { type ListQuery, listQueryString, readListQuery } from "./seller-list";

/**
 * The stores list's state in its address (seller-list.ts). A search, a filter, a sort or a page changes the
 * address in place, without a request to the server: the rows are already in the browser. Only the status
 * cards are links, since a status is a read of its own. Kept in this one hook so that a library for state in
 * the address (nuqs) can take its place later in one file.
 */
export function useListQuery(): [ListQuery, (change: Partial<ListQuery>) => void] {
  const params = useSearchParams();
  const pathname = usePathname();
  const query = readListQuery(params);

  function update(change: Partial<ListQuery>) {
    // Anything but turning the page starts again from the first.
    const next = { ...query, page: 1, ...change };
    const search = listQueryString(next);
    // Next.js keeps useSearchParams in step with the history API (App Router › Linking and Navigating).
    window.history.replaceState(null, "", search ? `${pathname}?${search}` : pathname);
  }

  return [query, update];
}

/** The address of the list in another status, keeping the search and the filters, from the first page. */
export function statusHref(query: ListQuery, status: ListQuery["status"], base: string): string {
  const search = listQueryString({ ...query, status, page: 1 });
  return search ? `${base}?${search}` : base;
}
