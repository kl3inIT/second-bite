"use client";

import { BanIcon, ShieldIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

import type { AccountBody } from "@/lib/api/generated";

import { DataTable, StrongCell } from "../ui/data-table";
import { EmptyState } from "../ui/empty-state";
import { RowActionMenu } from "../ui/row-action-menu";
import { initialsOf } from "../sellers/member";
import { revokeBlock, sameEmail } from "./admins";
import { RevokeAdminDialog } from "./revoke-admin-dialog";

/**
 * The admins (Figma AD-AM1): each address with its initials, as `GET /admin/admins` lists them. The backend keeps
 * no grant date, granter or first sign-in, so those columns of the design are not drawn. The ⋯ menu revokes,
 * locked with its reason for the viewer and for the last admin (AD-AM4), and opens the revoke dialog (AD-AM3).
 */
export function AdminsTable({
  rows,
  viewerEmail,
}: {
  rows: AccountBody[];
  /** The signed-in admin's address, to mark their row and keep them from revoking themselves. */
  viewerEmail?: string;
}) {
  const t = useTranslations("admin.settings.admins");
  const [revoking, setRevoking] = useState<AccountBody | null>(null);

  return (
    <>
      <DataTable
        caption={t("caption")}
        rows={rows}
        rowKey={(row) => row.id}
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
        admin={revoking}
        open={revoking !== null}
        onOpenChange={(open) => !open && setRevoking(null)}
      />
    </>
  );
}
