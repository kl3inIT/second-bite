"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";

import { recordView } from "@/lib/api/generated";

// The tools of admins and of a store's people are not the site's audience; their pages are not counted.
const notCounted = /^\/(?:[a-z]{2}\/)?(?:admin|stores)(?:\/|$)/;

/**
 * What a page on screen tells the server for the prototype's numbers (SEC-80), or nothing: not for an admin's
 * or a store's own page, and not when a browser is driven by a program (`navigator.webdriver`), as Plausible's
 * tracker leaves them out. The source is `utm_source` of the address, so a scan of the poster counts as `qr`.
 */
export function viewOf(
  pathname: string,
  search: URLSearchParams,
  automated: boolean,
): { path: string; source?: string } | null {
  if (automated || notCounted.test(pathname)) return null;
  const source = search.get("utm_source");
  return source ? { path: pathname, source } : { path: pathname };
}

/**
 * Counts each page once it is on screen (SEC-80): it runs after the page renders, so a link the router only
 * fetched ahead is never counted. The request outlives a page that closes at once (`keepalive`), and a
 * count that fails is lost quietly: the page never waits for it nor shows it.
 */
export function CountView() {
  const pathname = usePathname();
  const search = useSearchParams();

  useEffect(() => {
    const view = viewOf(pathname, new URLSearchParams(search.toString()), navigator.webdriver);
    if (view) recordView({ body: view, keepalive: true }).catch(() => {});
  }, [pathname, search]);

  return null;
}
