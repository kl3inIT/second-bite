import { getTranslations } from "next-intl/server";

import { Button } from "@/components/ui/button";

import type { SearchParams } from "../list-query";
import { SettingsLayout } from "../ui/settings";
import { readAuditQuery } from "./audit-log";
import { listAuditLog } from "./audit-log-source";
import { AuditLogTable } from "./audit-log-table";

/**
 * Cài đặt › Nhật ký thao tác (Figma AD-AL1), filtered by the address. Empty until SEC-75 builds the audit log;
 * "Tải CSV" waits for it too.
 */
export async function AuditLogPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const query = readAuditQuery(await searchParams);
  const [page, shell, t] = await Promise.all([
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
      <AuditLogTable key={JSON.stringify(query)} query={query} page={page} />
    </SettingsLayout>
  );
}
