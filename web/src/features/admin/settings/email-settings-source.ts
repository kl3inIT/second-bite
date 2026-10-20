import "server-only";

import { ApiError } from "@/lib/api/client";
import { type EmailSettingsBody, getEmailSettings } from "@/lib/api/generated";

import { adminRead } from "../session";

/**
 * Who delivers email, from GET /admin/email-settings, or nothing when no provider is saved yet: the notification
 * module answers that with NOTIFICATION_EMAIL_NOT_CONFIGURED, and the page shows an empty form instead of the
 * error page.
 */
export async function readEmailSettings(): Promise<EmailSettingsBody | null> {
  try {
    return await adminRead((headers) => getEmailSettings({ headers }));
  } catch (error) {
    if (error instanceof ApiError && error.code === "NOTIFICATION_EMAIL_NOT_CONFIGURED")
      return null;
    throw error;
  }
}
