import "server-only";

import { cookies } from "next/headers";
import { cache } from "react";

import { ApiError } from "@/lib/api/client";
import { type AccountBody, getMyAccount } from "@/lib/api/generated";

/** The session cookie the Go server sets on sign-in (SEC-27; server/internal/platform/caller.go). */
const sessionCookie = "secondbite_session";

/**
 * The signed-in person as the web uses them. `role` is the platform role from `GET /accounts/me`: the admin
 * pages show only to `admin` (SEC-62), and the backend decides again on every admin call.
 */
export type CurrentAccount = Pick<AccountBody, "email" | "displayName" | "role">;

/**
 * Who is signed in, read on the server by forwarding the session cookie to the API (SEC-29 › decision 2);
 * nothing when no one is, or when the session has ended. It reads the request, so it renders inside a
 * Suspense boundary; one render asks once.
 */
export const getCurrentAccount = cache(async (): Promise<CurrentAccount | null> => {
  const session = (await cookies()).get(sessionCookie);
  if (!session) return null;
  try {
    const { data } = await getMyAccount({
      headers: { cookie: `${sessionCookie}=${session.value}` },
    });
    return { email: data.email, displayName: data.displayName, role: data.role };
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) return null;
    throw error;
  }
});
