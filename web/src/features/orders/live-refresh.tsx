"use client";

import { useEffect, useEffectEvent, useRef } from "react";

import { useRouter } from "@/i18n/navigation";

import { useLive, useLivePolling } from "./use-live";

/** Notices that arrive together, the twenty `synced` of a long list among them, make one refresh. */
const REFRESH_DELAY_MS = 300;
/** While the socket is down, a page reads its order again this often, and only while the tab is shown. */
const POLL_MS = 15_000;
/** A page that waits for a moment of its order's window refreshes just after it, once the server reads it too. */
const AFTER_MOMENT_MS = 1000;
/** The longest a timer may wait. */
const MAX_TIMER_MS = 2 ** 31 - 1;

/**
 * Keeps a server-rendered order page current (SEC-117): it follows the topics and reads the page again on a
 * notice of one of `orderIds` (any, when none are named) and whenever the topics are subscribed again, which
 * is design decision 12's catch-up. While the socket cannot open it reads the page every 15 seconds, and at each
 * of `at`, the moments the window opens or closes, which change what the page shows without any notice
 * (decision 27). It draws nothing.
 */
export function LiveRefresh({
  topics,
  orderIds,
  at = [],
}: {
  topics: string[];
  orderIds?: string[];
  at?: string[];
}) {
  const router = useRouter();
  const polling = useLivePolling();
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const refreshNow = useEffectEvent(() => router.refresh());
  const moments = at.join(" ");

  useLive(topics, (event) => {
    if (event.type !== "synced" && orderIds && !orderIds.includes(event.orderId)) return;
    clearTimeout(timer.current);
    timer.current = setTimeout(() => router.refresh(), REFRESH_DELAY_MS);
  });

  useEffect(() => {
    if (!polling) return;
    const poll = setInterval(() => {
      if (document.visibilityState === "visible") refreshNow();
    }, POLL_MS);
    return () => clearInterval(poll);
  }, [polling]);

  useEffect(() => {
    const waits = moments
      .split(" ")
      .filter(Boolean)
      .map((moment) => Date.parse(moment) - Date.now() + AFTER_MOMENT_MS)
      .filter((wait) => wait > 0 && wait <= MAX_TIMER_MS)
      .map((wait) => setTimeout(() => refreshNow(), wait));
    return () => waits.forEach(clearTimeout);
  }, [moments]);

  useEffect(() => () => clearTimeout(timer.current), []);

  return null;
}
