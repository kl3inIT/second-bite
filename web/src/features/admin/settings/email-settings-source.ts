import "server-only";

import { ApiError } from "@/lib/api/client";
import { type EmailSettingsBody, getEmailSettings } from "@/lib/api/generated";

import { adminRead } from "../session";
import { etagOf, type Versioned } from "./version";

/**
 * Who delivers email, from GET /admin/email-settings with its version, or nothing when no provider is saved yet:
 * the notification module answers that with NOTIFICATION_EMAIL_NOT_CONFIGURED, and the page shows an empty form
 * instead of the error page.
 */
export async function readEmailSettings(): Promise<Versioned<EmailSettingsBody> | null> {
  try {
    return await adminRead(async (headers) => {
      const { data, response } = await getEmailSettings({ headers });
      return { data: { settings: data, etag: etagOf(response) } };
    });
  } catch (error) {
    if (error instanceof ApiError && error.code === "NOTIFICATION_EMAIL_NOT_CONFIGURED")
      return null;
    throw error;
  }
}
