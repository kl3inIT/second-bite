import "server-only";

import { cache } from "react";

import { ApiError } from "@/lib/api/client";
import { listMySellers } from "@/lib/api/generated";

import { sessionHeaders } from "./session";

export type MySeller = { name: string; role: "owner" | "staff" };

/**
 * The sellers the signed-in person owns or works for, read on the server with their session: account
 * settings lists them, and the deletion warns an owner that their sellers close with their account (SEC-37).
 * A session that ended after the account was read has no sellers, as `getCurrentAccount` has no account, so
 * the page goes on rather than showing the error page (SEC-69). It reads the request, so it renders inside a
 * Suspense boundary; one render asks once.
 */
export const getMySellers = cache(async (): Promise<MySeller[]> => {
  const headers = await sessionHeaders();
  if (!headers) return [];
  try {
    const { data } = await listMySellers({ headers });
    return (data.sellers ?? []).map((seller) => ({
      name: seller.name,
      role: seller.myRole === "owner" ? "owner" : "staff",
    }));
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) return [];
    throw error;
  }
});

/** The names of the sellers the signed-in person owns. */
export async function getOwnedSellerNames(): Promise<string[]> {
  return (await getMySellers())
    .filter((seller) => seller.role === "owner")
    .map((seller) => seller.name);
}
