import { getTranslations } from "next-intl/server";

import { Button } from "@/components/ui/button";

import { SettingsLayout } from "../ui/settings";
import { auditQuery } from "./audit-log";
import { auditPageSize, listAuditLog } from "./audit-log-source";
import { AuditLogTable } from "./audit-log-table";

/** Cài đặt › Nhật ký thao tác (Figma AD-CD5), filtered by the address. Empty until the audit log has a backend. */
export async function AuditLogPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const query = auditQuery(await searchParams);
  const [log, shell, t] = await Promise.all([
    listAuditLog(query),
    getTranslations("admin.shell"),
    getTranslations("admin.settings.auditLog"),
  ]);
  return (
    <SettingsLayout
      title={shell("pages.settingsAuditLog.label")}
      actions={
        <Button variant="neutral" disabled title={shell("soon")}>
          {t("export")}
        </Button>
      }
    >
      <AuditLogTable
        query={query}
        rows={log.items}
        total={log.total}
        pageSize={auditPageSize}
        actors={log.actors}
      />
    </SettingsLayout>
  );
}
