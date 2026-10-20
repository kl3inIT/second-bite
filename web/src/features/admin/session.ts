import "server-only";

import { cookies } from "next/headers";
import { notFound } from "next/navigation";

import { ApiError } from "@/lib/api/client";

/** The session cookie the Go server sets on sign-in (see identity/current-account.ts). */
const sessionCookie = "secondbite_session";

/** The request's session cookie, forwarded to the API by an admin page's read; nothing without a session. */
export async function adminHeaders(): Promise<{ cookie: string } | undefined> {
  const session = (await cookies()).get(sessionCookie);
  return session ? { cookie: `${sessionCookie}=${session.value}` } : undefined;
}

/**
 * An admin read on the server, with the session forwarded: `adminRead((headers) => listAdminSellers({ headers }))`.
 * The backend decides who is an admin (`PLATFORM_ADMIN_REQUIRED`, 403); a caller it refuses, or whose session
 * ended (401), gets the not-found page, as the admin layout gives them, so the page never says it exists.
 */
export async function adminRead<T>(
  call: (headers: { cookie: string } | undefined) => Promise<{ data: T }>,
): Promise<T> {
  try {
    return (await call(await adminHeaders())).data;
  } catch (error) {
    if (error instanceof ApiError && (error.status === 401 || error.status === 403)) notFound();
    throw error;
  }
}
