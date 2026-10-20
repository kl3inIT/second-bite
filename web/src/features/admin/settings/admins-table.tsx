"use client";

import {
  BanIcon,
  CircleCheckIcon,
  ClockIcon,
  type LucideIcon,
  MailIcon,
  ShieldIcon,
  TriangleAlertIcon,
  UserCogIcon,
} from "lucide-react";
import { useFormatter, useNow, useTranslations } from "next-intl";

import { AdminBadge } from "../ui/badge";
import { DataTable, StrongCell } from "../ui/data-table";
import { EmptyState } from "../ui/empty-state";
import { RowActionMenu } from "../ui/row-action-menu";
import { type AdminStatus, adminStatusTone, initials, signInDay } from "./admin-rows";
import type { AdminRow } from "./admins-source";

const statusIcons: Record<AdminStatus, LucideIcon> = {
  active: CircleCheckIcon,
  disabled: ClockIcon,
  invited: TriangleAlertIcon,
};

/**
 * The admins (Figma AD-CD3): who, their role, when they last signed in and whether they can. Roles and invitations
 * have no backend yet, so the menu's actions say "Sắp có".
 */
export function AdminsTable({ rows }: { rows: AdminRow[] }) {
  const t = useTranslations("admin.settings.admins");
  const soon = useTranslations("admin.shell")("soon");
  const format = useFormatter();
  const now = useNow();

  function lastSignIn(at: string | undefined) {
    if (!at) return t("neverSignedIn");
    const date = new Date(at);
    const time = format.dateTime(date, "time");
    const day = signInDay(date, now);
    if (day === "today") return t("today", { time });
    if (day === "yesterday") return t("yesterday", { time });
    return `${format.dateTime(date, "day")}, ${time}`;
  }

  return (
    <DataTable
      caption={t("caption")}
      rows={rows}
      rowKey={(row) => row.id}
      empty={<EmptyState icon={ShieldIcon} title={t("empty")} />}
      columns={[
        {
          key: "name",
          header: t("columns.name"),
          grow: true,
          cell: (row) => (
            <span className="flex items-center gap-3">
              <span
                aria-hidden
                className="flex size-9 shrink-0 items-center justify-center rounded-full bg-secondary text-label-strong text-primary"
              >
                {initials(row.name)}
              </span>
              <StrongCell>{row.you ? t("you", { name: row.name }) : row.name}</StrongCell>
            </span>
          ),
        },
        {
          key: "role",
          header: t("columns.role"),
          cell: (row) => (
            <AdminBadge tone={row.role === "owner" ? "info" : "neutral"} icon={null}>
              {t(`roles.${row.role}`)}
            </AdminBadge>
          ),
        },
        {
          key: "lastSignIn",
          header: t("columns.lastSignIn"),
          cell: (row) => (
            <span className="text-body-sm whitespace-nowrap text-foreground">
              {lastSignIn(row.lastSignInAt)}
            </span>
          ),
        },
        {
          key: "status",
          header: t("columns.status"),
          cell: (row) => (
            <AdminBadge tone={adminStatusTone[row.status]} icon={statusIcons[row.status]}>
              {t(`statuses.${row.status}`)}
            </AdminBadge>
          ),
        },
        {
          key: "actions",
          header: "",
          align: "end",
          cell: (row) => (
            <RowActionMenu
              name={row.name}
              actions={[
                { label: `${t("changeRole")} · ${soon}`, icon: UserCogIcon, disabled: true },
                ...(row.status === "invited"
                  ? [{ label: `${t("resend")} · ${soon}`, icon: MailIcon, disabled: true }]
                  : []),
                {
                  label: `${t("disable")} · ${soon}`,
                  icon: BanIcon,
                  destructive: true,
                  disabled: true,
                },
              ]}
            />
          ),
        },
      ]}
    />
  );
}
