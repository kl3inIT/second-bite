import "server-only";

import { cookies } from "next/headers";

import { listMySellers } from "@/lib/api/generated";

/** The session cookie the Go server sets on sign-in (SEC-27; server/internal/platform/caller.go). */
const sessionCookie = "secondbite_session";

/**
 * The names of the sellers the signed-in person owns, read on the server with their session, so the deletion
 * can warn them that their sellers close with their account (SEC-37). It reads the request, so it renders
 * inside a Suspense boundary.
 */
export async function getOwnedSellerNames(): Promise<string[]> {
  const session = (await cookies()).get(sessionCookie);
  if (!session) return [];
  const { data } = await listMySellers({
    headers: { cookie: `${sessionCookie}=${session.value}` },
  });
  return (data.sellers ?? [])
    .filter((seller) => seller.myRole === "owner")
    .map((seller) => seller.name);
}
