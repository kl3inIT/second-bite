"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";

import { readOrdersUnread } from "./unread";
import { useLive } from "./use-live";

/** Where the count of unread messages is kept in the browser; the live socket makes it read again. */
const QUERY_KEY = ["unread", "orders"];

/**
 * How many messages the reader has not read across their orders, for the bottom bar. It follows the open orders,
 * so a message, a mark as seen or a status change reads the count again.
 */
export function useOrdersUnread(): number {
  const queryClient = useQueryClient();
  const { data } = useQuery({ queryKey: QUERY_KEY, queryFn: () => readOrdersUnread() });
  useLive(
    (data?.open ?? []).map((id) => `order:${id}`),
    () => void queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
  );
  return data?.unread ?? 0;
}
