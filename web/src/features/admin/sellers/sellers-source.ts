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

import type { AdminSeller, ListQuery, SellerStatus } from "./seller-list";

/** A page of stores and how many match in all. */
export type SellerPage = { rows: AdminSeller[]; total: number; page: number };

/**
 * A page of the stores in a status that match the search, from `GET /admin/sellers`, which searches the name,
 * address and phone without Vietnamese marks and orders them (the pending ones first, the oldest first, then the
 * latest change first). A page past the end comes back empty, so the last page is read instead.
 */
export const listSellers = cache(
  async ({
    status,
    q,
    page,
    size,
  }: Omit<ListQuery, "size"> & { size: number }): Promise<SellerPage> => {
    const read = (at: number) =>
      adminRead((headers) =>
        listSellersForAdmins({
          query: { status: [status], q: q || undefined, page: at, size },
          headers,
        }),
      );
    let answer = await read(page);
    const last = Math.max(1, Math.ceil(answer.total / size));
    if (page > last) answer = await read(last);
    // The items carry the store's own fields, which api/openapi.yaml leaves out of AdminSellerBody.
    return { rows: (answer.items ?? []) as AdminSeller[], total: answer.total, page: answer.page };
  },
);

/**
 * How many stores are in each status now, and at the end of each of the last 14 days (`trend`, oldest first, the
 * last day today).
 */
export type SellerCounts = Record<SellerStatus, number> & { trend?: SellerStatusDay[] };

/** The days the cards' trend draws (Figma "Sparkline · 14 ngày"). */
const TREND_DAYS = 14;

/**
 * How many stores are in each status now and over the last 14 days, from `GET /admin/summary`. The backend
 * rebuilds the days from each store's last change of status (docs/specs/seller.md).
 */
export async function countSellers(): Promise<SellerCounts> {
  // Today is the request's, never a prerender's.
  await connection();
  const to = dayInVietnam(new Date());
  const { sellers } = await adminRead((headers) =>
    getAdminSummary({ query: { from: addDays(to, 1 - TREND_DAYS), to }, headers }),
  );
  return {
    active: sellers.active,
    pending: sellers.pending,
    rejected: sellers.rejected,
    blocked: sellers.blocked,
    trend: sellers.perDay,
  };
}

/** The most stores the ‹ › of a store's page steps through: one page of `GET /admin/sellers` at its largest. */
const NEIGHBOURS = 100;

/** The first stores in a status, in the list's order, for the ‹ › of a store's page. */
export async function listSiblings(status: SellerStatus): Promise<AdminSeller[]> {
  const { rows } = await listSellers({ status, q: "", page: 1, size: NEIGHBOURS });
  return rows;
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
