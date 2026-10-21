import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { AdminTopBar } from "@/features/admin/admin-top-bar";
import { SettingsNav } from "@/features/admin/settings-nav";
import { requireAdmin } from "@/features/identity/current-account";
import { sessionHeaders } from "@/features/identity/session";
import { EmailSettingsForm } from "@/features/notification/email-settings-form";
import { ApiError } from "@/lib/api/client";
import { getEmailSettings } from "@/lib/api/generated";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Admin.email");
  return { title: t("title") };
}

/** The saved settings and their version, or nothing when none are saved yet (Figma AD-CS6). */
async function readSettings() {
  try {
    const { data, response } = await getEmailSettings({ headers: await sessionHeaders() });
    return { saved: data, version: response.headers.get("etag") ?? undefined };
  } catch (error) {
    if (error instanceof ApiError && error.code === "NOTIFICATION_EMAIL_NOT_CONFIGURED") return {};
    throw error;
  }
}

// The email settings (Figma AD-E1…E4), a page of the settings: read on the server, changed in the form.
export default async function EmailSettingsPage() {
  const admin = await requireAdmin("/admin/settings/email");
  const [t, { saved, version }] = await Promise.all([getTranslations("Admin"), readSettings()]);

  return (
    <>
      <AdminTopBar
        crumbs={[
          { label: t("settings.title"), href: "/admin/settings" },
          { label: t("email.title") },
        ]}
      />
      <div className="flex flex-1 flex-col gap-5 px-4 py-6 md:px-8">
        <h1 className="text-page-title text-foreground">{t("settings.title")}</h1>
        <div className="flex flex-col gap-6 md:flex-row md:items-start">
          <SettingsNav />
          <div className="min-w-0 flex-1 md:max-w-4xl">
            {/* A new version of the settings starts the form over from it. */}
            <EmailSettingsForm
              key={version ?? "none"}
              saved={saved}
              version={version}
              adminEmail={admin.email}
            />
          </div>
        </div>
      </div>
    </>
  );
}
