"use client";

import { BanIcon, CircleCheckIcon, ClockIcon, type LucideIcon, ShieldIcon } from "lucide-react";
import { useFormatter, useTranslations } from "next-intl";
import { useState } from "react";

import { AdminBadge, type BadgeTone } from "../ui/badge";
import { DataTable, StrongCell, TextCell } from "../ui/data-table";
import { EmptyState } from "../ui/empty-state";
import { RowActionMenu } from "../ui/row-action-menu";
import { initialsOf } from "../sellers/member";
import { type AdminGrant, type AdminStatus, revokeBlock, sameEmail } from "./admins";
import { RevokeAdminDialog } from "./revoke-admin-dialog";

const statuses: Record<AdminStatus, { tone: BadgeTone; icon: LucideIcon }> = {
  active: { tone: "success", icon: CircleCheckIcon },
  pending: { tone: "neutral", icon: ClockIcon },
};

/**
 * The admins (Figma AD-AM1): each address with its initials, the day it was granted, who granted it ("Cấp bằng
 * dòng lệnh" from the CLI) and whether they have signed in since. The ⋯ menu revokes, locked with its reason for
 * the viewer and for the last admin (AD-AM4), and opens the revoke dialog (AD-AM3).
 */
export function AdminsTable({
  rows,
  viewerEmail,
}: {
  rows: AdminGrant[];
  /** The signed-in admin's address, to mark their row and keep them from revoking themselves. */
  viewerEmail?: string;
}) {
  const t = useTranslations("admin.settings.admins");
  const deleted = useTranslations("admin.settings")("deletedAccount");
  const format = useFormatter();
  const [revoking, setRevoking] = useState<AdminGrant | null>(null);

  return (
    <>
      <DataTable
        caption={t("caption")}
        rows={rows}
        rowKey={(row) => row.accountId}
        empty={<EmptyState icon={ShieldIcon} title={t("empty")} />}
        columns={[
          {
            key: "email",
            header: t("columns.email"),
            grow: true,
            cell: (row) => (
              <span className="flex items-center gap-3">
                <span
                  aria-hidden
                  className="flex size-9 shrink-0 items-center justify-center rounded-full bg-secondary text-label-strong text-primary"
                >
                  {initialsOf(row.email)}
                </span>
                <StrongCell>
                  {viewerEmail && sameEmail(row.email, viewerEmail)
                    ? t("you", { email: row.email })
                    : row.email}
                </StrongCell>
              </span>
            ),
          },
          {
            key: "grantedAt",
            header: t("columns.grantedAt"),
            cell: (row) => (
              <TextCell>
                <time dateTime={row.grantedAt}>
                  {format.dateTime(new Date(row.grantedAt), "day")}
                </time>
              </TextCell>
            ),
          },
          {
            key: "grantedBy",
            header: t("columns.grantedBy"),
            cell: (row) => (
              <TextCell>
                {row.grantedBy === null ? t("cli") : (row.grantedBy.label ?? deleted)}
              </TextCell>
            ),
          },
          {
            key: "status",
            header: t("columns.status"),
            cell: (row) => (
              <AdminBadge tone={statuses[row.status].tone} icon={statuses[row.status].icon}>
                {t(`statuses.${row.status}`)}
              </AdminBadge>
            ),
          },
          {
            key: "actions",
            header: "",
            align: "end",
            cell: (row) => {
              const blocked = revokeBlock(row, rows, viewerEmail);
              return (
                <RowActionMenu
                  name={row.email}
                  actions={[
                    {
                      label: t("revoke"),
                      icon: BanIcon,
                      destructive: true,
                      disabled: blocked !== null,
                      title: blocked ? t(`revokeBlocked.${blocked}`) : undefined,
                      onSelect: () => setRevoking(row),
                    },
                  ]}
                />
              );
            },
          },
        ]}
      />
      <RevokeAdminDialog
        email={revoking?.email ?? ""}
        open={revoking !== null}
        onOpenChange={(open) => !open && setRevoking(null)}
      />
    </>
  );
}
