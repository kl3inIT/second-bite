import "server-only";

import { notFound } from "next/navigation";
import { cache } from "react";

import { adminRead } from "@/features/admin/session";
import { ApiError } from "@/lib/api/client";
import {
  getAdminSummary,
  getSeller,
  listSellerMembers,
  listSellerOffers,
  listSellersForAdmins,
  type MemberBody,
  type OfferBody,
  type SellerBody,
} from "@/lib/api/generated";

import type { SellerStatus } from "./seller-list";

/** The most the backend gives in one page of `GET /admin/sellers`. */
const PAGE = 100;
/** Enough pages for the pilot's 30 to 100 stores many times over; the list moves to the backend before this. */
const MOST_PAGES = 20;

/**
 * Every store in a status, read page by page from `GET /admin/sellers` (oldest first). The list searches and
 * sorts them in the browser (docs: admin-web-flow › Style 6.1).
 */
export const listSellers = cache(async (status: SellerStatus): Promise<SellerBody[]> => {
  const all: SellerBody[] = [];
  for (let page = 0; page < MOST_PAGES; page++) {
    const { sellers } = await adminRead((headers) =>
      listSellersForAdmins({ query: { status, limit: PAGE, offset: page * PAGE }, headers }),
    );
    all.push(...(sellers ?? []));
    if ((sellers?.length ?? 0) < PAGE) break;
  }
  return all;
});

export type SellerCounts = Record<SellerStatus, number>;

/** How many stores are in each status now, from `GET /admin/summary`. */
export async function countSellers(): Promise<SellerCounts> {
  const { sellers } = await adminRead((headers) => getAdminSummary({ headers }));
  return { active: sellers.active, pending: sellers.pending, blocked: sellers.blocked };
}

/** One store; a store that does not exist is the admin's not-found page, in the admin's frame (AD-TT5). */
export const readSeller = cache(async (sellerId: string): Promise<SellerBody> => {
  try {
    return await adminRead((headers) => getSeller({ path: { sellerId }, headers }));
  } catch (error) {
    if (
      error instanceof ApiError &&
      (error.code === "SELLER_NOT_FOUND" || error.status === 400 || error.status === 422)
    ) {
      notFound();
    }
    throw error;
  }
});

/** A store's posts in every status, the newest first (at most 100; the pilot's stores post a few a day). */
export async function readSellerOffers(sellerId: string): Promise<OfferBody[]> {
  const { offers } = await adminRead((headers) =>
    listSellerOffers({ path: { sellerId }, query: { limit: 100 }, headers }),
  );
  return offers;
}

/** A store's owner and staff. */
export async function readSellerMembers(sellerId: string): Promise<MemberBody[]> {
  const { members } = await adminRead((headers) =>
    listSellerMembers({ path: { sellerId }, headers }),
  );
  return members ?? [];
}
