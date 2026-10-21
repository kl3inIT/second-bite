import { getTranslations } from "next-intl/server";

import { getCurrentAccount } from "@/features/identity/current-account";

import { SettingsLayout } from "../ui/settings";
import { AddAdmin } from "./add-admin";
import { readAdmins } from "./admins-source";
import { AdminsTable } from "./admins-table";

/** Cài đặt › Quản trị viên (Figma AD-AM1 to AD-AM4): the admins from `GET /admin/admins`. */
export async function AdminsPage() {
  const [admins, account, shell] = await Promise.all([
    readAdmins(),
    getCurrentAccount(),
    getTranslations("admin.shell"),
  ]);
  return (
    <SettingsLayout
      title={shell("pages.settingsAdmins.label")}
      actions={<AddAdmin admins={admins} />}
    >
      <AdminsTable rows={admins} viewerEmail={account?.email} />
    </SettingsLayout>
  );
}
