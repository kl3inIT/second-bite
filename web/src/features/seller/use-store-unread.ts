"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";

import { useLive } from "@/features/orders/use-live";

import { readStoreUnread } from "./store-unread";

/** The unread messages across a store's orders of today, read again on any notice of the store's orders. */
export function useStoreUnread(sellerId: string): number {
  const queryClient = useQueryClient();
  const queryKey = ["unread", "store", sellerId];
  const { data } = useQuery({ queryKey, queryFn: () => readStoreUnread(sellerId) });
  useLive([`seller:${sellerId}`], () => void queryClient.invalidateQueries({ queryKey }));
  return data ?? 0;
}
