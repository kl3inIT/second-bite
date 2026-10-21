import "server-only";

import { notFound } from "next/navigation";
import { connection } from "next/server";
import { cache } from "react";

import { addDays, dayInVietnam } from "@/features/admin/overview/days";
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
  type SellerStatusDay,
} from "@/lib/api/generated";

import { countRejectedSellers, listRejectedSellers } from "./review-source";
import type { AdminSeller, SellerStatus } from "./seller-list";

/** The most the backend gives in one page of `GET /admin/sellers`. */
const PAGE = 100;
/** Enough pages for the pilot's 30 to 100 stores many times over; the list moves to the backend before this. */
const MOST_PAGES = 20;

/**
 * Every store in a status, read page by page from `GET /admin/sellers` (oldest first). The list searches and
 * sorts them in the browser (docs: admin-web-flow › Style 6.1). The rejected stores, asked for only behind the
 * `storeReview` flag, come from SEC-64's source, which has none yet.
 */
export const listSellers = cache(async (status: SellerStatus): Promise<AdminSeller[]> => {
  if (status === "rejected") return listRejectedSellers();
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

/**
 * How many stores are in each status now, and at the end of each of the last 14 days (`trend`, oldest first, the
 * last day today); no figure and no trend for the rejected ones until SEC-64 counts them.
 */
export type SellerCounts = Record<Exclude<SellerStatus, "rejected">, number> & {
  rejected?: number;
  trend?: SellerStatusDay[];
};

/** The days the cards' trend draws (Figma "Sparkline · 14 ngày"). */
const TREND_DAYS = 14;

/**
 * How many stores are in each status now and over the last 14 days, from `GET /admin/summary`, with the rejected
 * ones only behind the `storeReview` flag. The backend rebuilds the days from each store's last change of status
 * (docs/specs/seller.md).
 */
export async function countSellers(review: boolean): Promise<SellerCounts> {
  // Today is the request's, never a prerender's.
  await connection();
  const to = dayInVietnam(new Date());
  const [{ sellers }, rejected] = await Promise.all([
    adminRead((headers) =>
      getAdminSummary({ query: { from: addDays(to, 1 - TREND_DAYS), to }, headers }),
    ),
    review ? countRejectedSellers() : undefined,
  ]);
  return {
    active: sellers.active,
    pending: sellers.pending,
    blocked: sellers.blocked,
    rejected,
    trend: sellers.perDay,
  };
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
