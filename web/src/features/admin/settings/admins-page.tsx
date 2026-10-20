import { getTranslations } from "next-intl/server";

import { SettingsLayout } from "../ui/settings";
import { listAdmins } from "./admins-source";
import { AdminsTable } from "./admins-table";
import { InviteAdmin } from "./invite-admin";

/** Cài đặt › Quản trị viên (Figma AD-CD3, AD-CD4). Empty until admins and their roles have a backend. */
export async function AdminsPage() {
  const [rows, shell] = await Promise.all([listAdmins(), getTranslations("admin.shell")]);
  return (
    <SettingsLayout title={shell("pages.settingsAdmins.label")} actions={<InviteAdmin />}>
      <AdminsTable rows={rows} />
    </SettingsLayout>
  );
}
