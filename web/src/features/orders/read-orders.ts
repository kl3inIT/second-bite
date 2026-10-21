import "server-only";

import { cache } from "react";

import { sessionHeaders } from "@/features/identity/session";
import { ApiError } from "@/lib/api/client";
import { getOrder, listMyOrders } from "@/lib/api/generated";

import { canCancel, type Order } from "./order";
import { accessOf, keptOrders } from "./order-access";
import { hasEnded } from "./order-view";

/**
 * What the reader may see: nothing when no one is signed in and this browser placed no such order, so the
 * page asks them to sign in.
 */
export type Read<T> = { known: false } | { known: true; value: T };

function signedOut(error: unknown): boolean {
  return error instanceof ApiError && error.status === 401;
}

/** One order read with the session and, for an order placed without signing in, its access; null when 404. */
async function fetchOrder(
  orderId: string,
  session: { cookie: string } | undefined,
  access: string | undefined,
): Promise<Order | null> {
  try {
    const { data } = await getOrder({
      path: { orderId },
      headers: { ...session, ...(access ? { "Order-Access": access } : {}) },
    });
    return data;
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return null;
    throw error;
  }
}

/**
 * One order, to its customer, signed in or holding its access (SEC-15 › Reading, SEC-76 › decision 7); null
 * when there is no such order or it is someone else's, which the API answers alike with 404. It reads the
 * request, so it renders inside a Suspense boundary.
 */
export const readOrder = cache(async (orderId: string): Promise<Read<Order | null>> => {
  const [session, access] = await Promise.all([sessionHeaders(), accessOf(orderId)]);
  if (!session && !access) return { known: false };
  try {
    return { known: true, value: await fetchOrder(orderId, session, access) };
  } catch (error) {
    if (signedOut(error)) return { known: false };
    throw error;
  }
});

/**
 * One order and whether its customer may still cancel it, decided when it is read: the page renders once
 * per request, so the moment of reading is the moment that counts.
 */
export async function readOrderView(
  orderId: string,
): Promise<Read<{ order: Order; cancellable: boolean; now: number } | null>> {
  const read = await readOrder(orderId);
  if (!read.known) return read;
  if (!read.value) return { known: true, value: null };
  const now = Date.now();
  return {
    known: true,
    value: { order: read.value, cancellable: canCancel(read.value, now), now },
  };
}

/**
 * The reader's orders still to collect, or those that have ended, newest first: the account's when someone
 * is signed in, otherwise those this browser placed without signing in.
 */
export const readMyOrders = cache(async (state: "open" | "ended"): Promise<Read<Order[]>> => {
  const session = await sessionHeaders();
  if (!session) return readKeptOrders(state);
  try {
    const { data } = await listMyOrders({ query: { state, limit: 50 }, headers: session });
    return { known: true, value: data.orders };
  } catch (error) {
    if (signedOut(error)) return { known: false };
    throw error;
  }
});

const readAllKept = cache(async (): Promise<Order[] | null> => {
  const kept = await keptOrders();
  if (kept.length === 0) return null;
  const orders = await Promise.all(
    kept.map(([orderId, access]) => fetchOrder(orderId, undefined, access)),
  );
  return orders
    .filter((order) => order !== null)
    .toSorted((a, b) => b.createdAt.localeCompare(a.createdAt));
});

async function readKeptOrders(state: "open" | "ended"): Promise<Read<Order[]>> {
  const orders = await readAllKept();
  if (!orders) return { known: false };
  return {
    known: true,
    value: orders.filter((order) => hasEnded(order) === (state === "ended")),
  };
}
