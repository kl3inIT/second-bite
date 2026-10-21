import "server-only";

import { cookies } from "next/headers";
import { cache } from "react";

import {
  type DishBody,
  getSeller,
  listDishes,
  listMySellers,
  listSellerOffers,
  listSellerOrders,
  type OfferBody,
  type OrderBody,
  type SellerBody,
} from "@/lib/api/generated";

/** The session cookie the Go server sets on sign-in (see identity/current-account.ts). */
const sessionCookie = "secondbite_session";

/** The request's session cookie, forwarded to the API; undefined when no one is signed in. */
async function sessionHeaders(): Promise<{ cookie: string } | undefined> {
  const session = (await cookies()).get(sessionCookie);
  return session ? { cookie: `${sessionCookie}=${session.value}` } : undefined;
}

/**
 * The stores the signed-in person owns or works for, read on the server with the session cookie; one render
 * asks once. It reads the request, so it renders inside a Suspense boundary.
 */
export const getMySellers = cache(async (): Promise<SellerBody[]> => {
  const headers = await sessionHeaders();
  if (!headers) return [];
  const { data } = await listMySellers({ headers });
  return data.sellers ?? [];
});

/** One of their stores; the API answers 401 without a session and 404 for a store they do not belong to. */
export const getStore = cache(async (sellerId: string): Promise<SellerBody> => {
  const { data } = await getSeller({ path: { sellerId }, headers: await sessionHeaders() });
  return data;
});

/** A store's posts in every status, the newest first (at most 100, which the pilot's stores do not reach in a day). */
export const getStoreOffers = cache(async (sellerId: string): Promise<OfferBody[]> => {
  const { data } = await listSellerOffers({
    path: { sellerId },
    query: { limit: 100 },
    headers: await sessionHeaders(),
  });
  return data.offers ?? [];
});

/** A store's orders of one day (`YYYY-MM-DD`, Vietnam's time), the soonest window first. */
export const getStoreOrders = cache(async (sellerId: string, day: string): Promise<OrderBody[]> => {
  const { data } = await listSellerOrders({
    path: { sellerId },
    query: { day },
    headers: await sessionHeaders(),
  });
  return data.orders;
});

/** A store's catalog, the newest dish first, hidden ones included. */
export const getStoreDishes = cache(async (sellerId: string): Promise<DishBody[]> => {
  const { data } = await listDishes({ path: { sellerId }, headers: await sessionHeaders() });
  return data.dishes;
});
