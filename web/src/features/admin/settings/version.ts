import { ApiError } from "@/lib/api/client";

/** The version a read or a save answered, "" when the answer carried none. */
export function etagOf(response: Response): string {
  return response.headers.get("ETag") ?? "";
}

/** Whether a save was refused because someone saved the settings after they were read (412). */
export function changedSinceRead(error: unknown): boolean {
  return error instanceof ApiError && error.code === "PLATFORM_CHANGED_SINCE_READ";
}
