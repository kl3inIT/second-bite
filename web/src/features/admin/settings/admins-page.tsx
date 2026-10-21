import { getTranslations } from "next-intl/server";

import { getCurrentAccount } from "@/features/identity/current-account";

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
    <section aria-labelledby="settings-title" className="flex min-w-0 flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 id="settings-title" className="text-card-title text-foreground">
          {shell("pages.settingsAdmins.label")}
        </h2>
        <AddAdmin admins={admins} />
      </div>
      <AdminsTable rows={admins} viewerEmail={account?.email} />
    </section>
  );
}
