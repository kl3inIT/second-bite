import "server-only";

import { getLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import { redirect } from "@/i18n/navigation";
import { ApiError } from "@/lib/api/client";
import type { SellerBody } from "@/lib/api/generated";

import { getStore } from "./my-sellers";

/**
 * A store the person signed in belongs to: someone who is not signed in is sent to sign in and comes back to
 * `returnTo`; a store that does not exist, or that they do not belong to, is a 404 (the API answers both alike).
 */
export async function requireStore(sellerId: string, returnTo: string): Promise<SellerBody> {
  try {
    return await getStore(sellerId);
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) {
      redirect({
        href: { pathname: "/sign-in", query: { returnTo } },
        locale: await getLocale(),
      });
    }
    if (
      error instanceof ApiError &&
      (error.status === 400 || error.status === 404 || error.status === 422)
    )
      notFound();
    throw error;
  }
}
