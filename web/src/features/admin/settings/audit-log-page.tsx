import { getTranslations } from "next-intl/server";

import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

import type { SearchParams } from "../list-query";
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
    <section aria-labelledby="settings-title" className="flex min-w-0 flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 id="settings-title" className="text-card-title text-foreground">
          {shell("pages.settingsAuditLog.label")}
        </h2>
        <Tooltip>
          <TooltipTrigger render={<span />}>
            <Button variant="outline" disabled>
              {t("export")}
            </Button>
          </TooltipTrigger>
          <TooltipContent>{shell("soon")}</TooltipContent>
        </Tooltip>
      </div>
      <AuditLogTable key={JSON.stringify(query)} query={query} page={page} />
    </section>
  );
}
