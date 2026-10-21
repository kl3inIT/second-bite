import "server-only";

import { notFound } from "next/navigation";
import { getLocale } from "next-intl/server";
import { cache } from "react";

import { redirect } from "@/i18n/navigation";
import { ApiError } from "@/lib/api/client";
import { getMyAccount, type AccountBody } from "@/lib/api/generated";

import { sessionHeaders } from "./session";

export type CurrentAccount = {
  id: string;
  email: string;
  displayName: string;
  role: AccountBody["role"];
};

/**
 * Who is signed in, read on the server by forwarding the session cookie to the API (SEC-29 › decision 2);
 * nothing when no one is, or when the session has ended. It reads the request, so it renders inside a
 * Suspense boundary; one render asks once.
 */
export const getCurrentAccount = cache(async (): Promise<CurrentAccount | null> => {
  const headers = await sessionHeaders();
  if (!headers) return null;
  try {
    const { data } = await getMyAccount({ headers });
    return { id: data.id, email: data.email, displayName: data.displayName, role: data.role };
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) return null;
    throw error;
  }
});

/**
 * The account of an admin page's caller (SEC-75 › Guard): someone signed out goes to sign in and back to
 * `returnTo`; anyone but an admin gets the not-found page, so the page does not say it exists. Every admin
 * page calls it, since a layout is not rendered again between its pages; the server refuses every admin
 * call besides. It reads the request, so it runs inside Suspense, where the refusal streams under a 200
 * with `noindex` (SEC-75 › Guard, option 3; `proxy.ts` sends a signed-out person away with a real 307).
 */
export async function requireAdmin(returnTo: string): Promise<CurrentAccount> {
  const account = await getCurrentAccount();
  if (!account) {
    return redirect({
      href: { pathname: "/sign-in", query: { returnTo } },
      locale: await getLocale(),
    });
  }
  if (account.role !== "admin") notFound();
  return account;
}
