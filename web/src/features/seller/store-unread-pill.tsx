"use client";

import { UnreadPill } from "@/components/unread-pill";

import { useStoreUnread } from "./use-store-unread";

/** The messages customers wrote on today's orders that the store's people have not read, on the "Đơn" tab. */
export function StoreUnreadPill({ sellerId, className }: { sellerId: string; className?: string }) {
  return <UnreadPill count={useStoreUnread(sellerId)} className={className} />;
}
