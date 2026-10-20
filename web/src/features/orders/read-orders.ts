import "server-only";

import { cache } from "react";

import { sessionHeaders } from "@/features/identity/session";
import { ApiError } from "@/lib/api/client";
import { getOrder, listMyOrders } from "@/lib/api/generated";

import { canCancel, type Order } from "./order";

/** What the reader may see: nothing when no one is signed in, so the page asks them to sign in. */
export type Read<T> = { signedIn: false } | { signedIn: true; value: T };

function signedOut(error: unknown): boolean {
  return error instanceof ApiError && error.status === 401;
}

/**
 * One order, to its customer (SEC-15 › Reading); null when there is no such order or it is someone else's,
 * which the API answers alike with 404. It reads the session, so it renders inside a Suspense boundary.
 */
export const readOrder = cache(async (orderId: string): Promise<Read<Order | null>> => {
  const headers = await sessionHeaders();
  if (!headers) return { signedIn: false };
  try {
    const { data } = await getOrder({ path: { orderId }, headers });
    return { signedIn: true, value: data };
  } catch (error) {
    if (signedOut(error)) return { signedIn: false };
    if (error instanceof ApiError && error.status === 404) return { signedIn: true, value: null };
    throw error;
  }
});

/**
 * One order and whether its customer may still cancel it, decided when it is read: the page renders once
 * per request, so the moment of reading is the moment that counts.
 */
export async function readOrderView(
  orderId: string,
): Promise<Read<{ order: Order; cancellable: boolean } | null>> {
  const read = await readOrder(orderId);
  if (!read.signedIn) return read;
  if (!read.value) return { signedIn: true, value: null };
  return {
    signedIn: true,
    value: { order: read.value, cancellable: canCancel(read.value, Date.now()) },
  };
}

/** The reader's orders still to collect, or those that have ended, newest first. */
export const readMyOrders = cache(async (state: "open" | "ended"): Promise<Read<Order[]>> => {
  const headers = await sessionHeaders();
  if (!headers) return { signedIn: false };
  try {
    const { data } = await listMyOrders({ query: { state, limit: 50 }, headers });
    return { signedIn: true, value: data.orders };
  } catch (error) {
    if (signedOut(error)) return { signedIn: false };
    throw error;
  }
});
