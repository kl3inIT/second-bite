import { ApiError } from "@/lib/api/client";

/**
 * Settings read with their version (SEC-75): the backend answers a read with an `ETag` and takes a save only with
 * that tag in `If-Match`, so two admins saving at once cannot overwrite each other unseen.
 */
export type Versioned<T> = { settings: T; etag: string };

/** The version a read or a save answered, "" when the answer carried none. */
export function etagOf(response: Response): string {
  return response.headers.get("ETag") ?? "";
}

/** Whether a save was refused because someone saved the settings after they were read (412). */
export function changedSinceRead(error: unknown): boolean {
  return error instanceof ApiError && error.code === "PLATFORM_CHANGED_SINCE_READ";
}
