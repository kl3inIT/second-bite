import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { AdminTopBar } from "@/features/admin/admin-top-bar";
import { AuditLog } from "@/features/audit/audit-log";
import {
  auditPageSize,
  loadAuditSearchParams,
  vietnamMidnight,
} from "@/features/audit/search-params";
import { requireAdmin } from "@/features/identity/current-account";
import { sessionHeaders } from "@/features/identity/session";
import { listAdmins, listAuditEvents } from "@/lib/api/generated";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Admin.audit");
  return { title: t("title") };
}

// The admins' log (Figma AD-CD5, SEC-75): what admins did, read on the server for the filters in the
// address, on a page of its own across the frame's width.
export default async function AuditPage({ searchParams }: PageProps<"/[locale]/admin/audit">) {
  await requireAdmin("/admin/audit");
  const filter = loadAuditSearchParams(await searchParams);
  const [t, headers] = await Promise.all([getTranslations("Admin.audit"), sessionHeaders()]);

  const [{ data: page }, { data: admins }] = await Promise.all([
    listAuditEvents({
      headers,
      query: {
        q: filter.q || undefined,
        action: filter.action ? [filter.action] : undefined,
        actorId: filter.actor ?? undefined,
        since: filter.from ? vietnamMidnight(filter.from) : undefined,
        until: filter.from ? vietnamMidnight(filter.to ?? filter.from, 1) : undefined,
        page: filter.page,
        size: auditPageSize,
      },
    }),
    listAdmins({ headers }),
  ]);

  return (
    <>
      <AdminTopBar crumbs={[{ label: t("title") }]} />
      <div className="flex flex-1 flex-col gap-5 px-4 py-6 md:px-8">
        <h1 className="text-page-title text-foreground">{t("title")}</h1>
        <AuditLog events={page.items ?? []} total={page.total} admins={admins.admins ?? []} />
      </div>
    </>
  );
}
