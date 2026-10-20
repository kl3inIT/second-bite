import "server-only";

import { cache } from "react";

import { ApiError } from "@/lib/api/client";
import { getMyAccount } from "@/lib/api/generated";

import { sessionHeaders } from "./session";

export type CurrentAccount = { email: string; displayName: string };

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
    return { email: data.email, displayName: data.displayName };
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) return null;
    throw error;
  }
});
