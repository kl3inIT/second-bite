"use client";

import { useEffect, useEffectEvent, useSyncExternalStore } from "react";

import { LiveClient, type LiveEvent } from "@/lib/live-client";

import { mintLiveTickets } from "./live-tickets";

let client: LiveClient | undefined;

/** The tab's one connection to `/api/live`, opened when a page first follows a topic. */
function liveClient(): LiveClient {
  client ??= new LiveClient({
    url: () => `${location.protocol === "https:" ? "wss:" : "ws:"}//${location.host}/api/live`,
    mint: mintLiveTickets,
    createSocket: (url) => new WebSocket(url),
  });
  return client;
}

/**
 * Follows the topics while the component is mounted and hands it every notice of the tab's connection, so it
 * filters what concerns it. `synced` says to read the state again: the topics were (re)subscribed, or the server
 * sent `resync`.
 */
export function useLive(topics: readonly string[], onEvent: (event: LiveEvent) => void) {
  const handle = useEffectEvent(onEvent);
  const key = topics.join(" ");

  useEffect(() => {
    if (key === "") return;
    return liveClient().follow(key.split(" "), handle);
  }, [key]);
}

/** Whether the socket keeps failing to open, so pages read their state on a timer instead (design decision 29). */
export function useLivePolling(): boolean {
  return useSyncExternalStore(
    (listener) => liveClient().onPollingChange(listener),
    () => liveClient().polling,
    () => false,
  );
}
