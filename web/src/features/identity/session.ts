import "server-only";

import { cookies } from "next/headers";

import { sessionCookie } from "./session-cookie";

/**
 * The headers that carry the reader's session to the API from the server (SEC-29 › decision 2), or nothing
 * when no one is signed in. It reads the request, so whatever calls it renders inside a Suspense boundary.
 */
export async function sessionHeaders(): Promise<{ cookie: string } | undefined> {
  const session = (await cookies()).get(sessionCookie);
  return session ? { cookie: `${sessionCookie}=${session.value}` } : undefined;
}
