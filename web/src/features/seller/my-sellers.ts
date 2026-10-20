import "server-only";

import { cookies } from "next/headers";
import { cache } from "react";

import { listMySellers, type SellerBody } from "@/lib/api/generated";

/** The session cookie the Go server sets on sign-in (see identity/current-account.ts). */
const sessionCookie = "secondbite_session";

/**
 * The stores the signed-in person owns or works for, read on the server with the session cookie; one render
 * asks once. It reads the request, so it renders inside a Suspense boundary.
 */
export const getMySellers = cache(async (): Promise<SellerBody[]> => {
  const session = (await cookies()).get(sessionCookie);
  if (!session) return [];
  const { data } = await listMySellers({
    headers: { cookie: `${sessionCookie}=${session.value}` },
  });
  return data.sellers ?? [];
});
