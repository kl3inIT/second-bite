"use client";

import { UsersIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import { DataTable, DateCell } from "@/features/admin/ui/data-table";
import { EmptyState } from "@/features/admin/ui/empty-state";
import type { MemberBody } from "@/lib/api/generated";

import { MemberAvatar, RoleBadge } from "./member";

/**
 * A store's members tab (Figma AD-QD4): its owner and staff with their address, role and the day they joined.
 * The backend keeps no name for an account and does not count who posted what, so the table shows the address
 * and leaves out Figma's "Bài đã đăng". The address writes to them.
 */
export function SellerMembers({ members }: { members: MemberBody[] }) {
  const t = useTranslations("admin.sellers.detail.members");
  if (members.length === 0) {
    return (
      <div className="rounded-md border border-border bg-card">
        <EmptyState title={t("empty")} icon={UsersIcon} />
      </div>
    );
  }

  return (
    <DataTable
      caption={t("caption")}
      rows={members}
      rowKey={(member) => member.accountId}
      columns={[
        {
          key: "member",
          header: t("columns.member"),
          grow: true,
          cell: (member) => (
            <span className="flex items-center gap-2.5">
              <MemberAvatar member={member} />
              <a
                href={`mailto:${member.email}`}
                className="block max-w-80 truncate rounded-sm text-body-sm-strong text-foreground hover:underline focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
              >
                {member.email}
              </a>
            </span>
          ),
        },
        {
          key: "role",
          header: t("columns.role"),
          cell: (member) => <RoleBadge role={member.role} />,
        },
        {
          key: "added",
          header: t("columns.added"),
          cell: (member) => <DateCell value={member.addedAt} />,
        },
      ]}
    />
  );
}
