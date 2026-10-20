"use client";

import { MapPinIcon, PencilIcon, PlusIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import { DataTable, StrongCell, TextCell } from "../ui/data-table";
import { EmptyState } from "../ui/empty-state";
import { RowActionMenu } from "../ui/row-action-menu";
import type { AreaRow } from "./areas-source";
import { ShownSwitch } from "./shown-switch";
import { flattenTree } from "./tree";

/**
 * The areas (Figma AD-CD2): each mall with its floors under it, how many stores are in each, and whether it takes
 * new stores. Nothing can be changed until areas have a backend, so the switch and the menu say "Sắp có".
 */
export function AreasTable({ rows }: { rows: AreaRow[] }) {
  const t = useTranslations("admin.settings.areas");
  const soon = useTranslations("admin.shell")("soon");

  return (
    <DataTable
      caption={t("caption")}
      rows={flattenTree(rows)}
      rowKey={(row) => row.id}
      empty={<EmptyState icon={MapPinIcon} title={t("empty")} />}
      columns={[
        {
          key: "name",
          header: t("columns.name"),
          grow: true,
          cell: (row) => (
            <span className="flex items-center gap-3">
              {row.depth === 0 ? (
                <MapPinIcon aria-hidden className="size-5 shrink-0 text-primary" />
              ) : (
                <span aria-hidden className="w-5 shrink-0" />
              )}
              <StrongCell>{row.name}</StrongCell>
            </span>
          ),
        },
        {
          key: "sellers",
          header: t("columns.sellers"),
          align: "end",
          cell: (row) => <TextCell>{t("sellers", { count: row.sellers })}</TextCell>,
        },
        {
          key: "open",
          header: t("columns.open"),
          cell: (row) => (
            <ShownSwitch
              checked={row.open}
              label={t("toggle", { name: row.name })}
              on={t("open")}
              off={t("paused")}
            />
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
                { label: `${t("edit")} · ${soon}`, icon: PencilIcon, disabled: true },
                { label: `${t("addFloor")} · ${soon}`, icon: PlusIcon, disabled: true },
              ]}
            />
          ),
        },
      ]}
    />
  );
}
