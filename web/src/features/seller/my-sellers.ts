import "server-only";

import { cache } from "react";

import { sessionHeaders } from "@/features/identity/session";
import { ApiError } from "@/lib/api/client";
import {
  type DishBody,
  getOrder,
  getSeller,
  listDishes,
  listMySellers,
  listSellerOffers,
  listSellerOrders,
  listSellerMembers,
  listSellerReviews,
  type MemberBody,
  type OfferBody,
  type OrderBody,
  type SellerBody,
  type SellerReviewsOutputBody,
} from "@/lib/api/generated";

/** A person owns at most five stores (server/internal/seller, maxOwnedSellers). */
export const MAX_OWNED = 5;

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

/** One order of a store, which the seller's people may read; null when there is no such order or it is not theirs to see. */
export const getStoreOrder = cache(async (orderId: string): Promise<OrderBody | null> => {
  try {
    const { data } = await getOrder({ path: { orderId }, headers: await sessionHeaders() });
    return data;
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return null;
    throw error;
  }
});

/** A store's shown reviews, the latest first, of the stars given (every review when none); at most `size` of them. */
export const getStoreReviews = cache(
  async (sellerId: string, stars: number[], size: number): Promise<SellerReviewsOutputBody> => {
    const { data } = await listSellerReviews({
      path: { sellerId },
      query: { stars, size },
      headers: await sessionHeaders(),
    });
    return data;
  },
);

/** A store's people, its owner and staff, to its members (SEC-162). */
export const getStoreMembers = cache(async (sellerId: string): Promise<MemberBody[]> => {
  const { data } = await listSellerMembers({ path: { sellerId }, headers: await sessionHeaders() });
  return data.members ?? [];
});
