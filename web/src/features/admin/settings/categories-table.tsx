"use client";

import {
  CakeIcon,
  ClockIcon,
  CupSodaIcon,
  GripVerticalIcon,
  type LucideIcon,
  PencilIcon,
  PlusIcon,
  ShapesIcon,
  SproutIcon,
  TagsIcon,
  Trash2Icon,
  UtensilsIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";

import { AdminBadge } from "../ui/badge";
import { DataTable, StrongCell, TextCell } from "../ui/data-table";
import { EmptyState } from "../ui/empty-state";
import { RowActionMenu } from "../ui/row-action-menu";
import type { CategoryIcon, CategoryRow } from "./categories-source";
import { ShownSwitch } from "./shown-switch";
import { flattenTree } from "./tree";

const icons: Record<CategoryIcon, LucideIcon> = {
  bakery: CakeIcon,
  preparedFood: UtensilsIcon,
  drinks: CupSodaIcon,
  ingredients: SproutIcon,
  other: ShapesIcon,
};

/**
 * The categories (Figma AD-CD1): each group with its categories under it, how many posts are on sale in each,
 * whether customers see it, and its menu. Nothing can be changed until categories have a backend, so the switch
 * and the menu's actions say "Sắp có".
 */
export function CategoriesTable({ rows }: { rows: CategoryRow[] }) {
  const t = useTranslations("admin.settings.categories");
  const soon = useTranslations("admin.shell")("soon");

  return (
    <DataTable
      caption={t("caption")}
      rows={flattenTree(rows)}
      rowKey={(row) => row.id}
      empty={<EmptyState icon={TagsIcon} title={t("empty")} />}
      columns={[
        {
          key: "name",
          header: t("columns.name"),
          grow: true,
          cell: (row) => {
            const Icon = row.icon ? icons[row.icon] : undefined;
            return (
              <span className="flex items-center gap-3">
                <GripVerticalIcon aria-hidden className="size-4 shrink-0 text-muted-foreground" />
                {row.depth > 0 ? (
                  <span aria-hidden className="w-6 shrink-0" />
                ) : (
                  Icon && (
                    <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-secondary text-primary">
                      <Icon aria-hidden className="size-4" />
                    </span>
                  )
                )}
                <StrongCell>{row.name}</StrongCell>
                {row.opening && (
                  <AdminBadge tone="neutral" icon={ClockIcon}>
                    {t("opening")}
                  </AdminBadge>
                )}
              </span>
            );
          },
        },
        {
          key: "posts",
          header: t("columns.posts"),
          align: "end",
          cell: (row) => <TextCell>{t("posts", { count: row.postsOnSale })}</TextCell>,
        },
        {
          key: "visible",
          header: t("columns.visible"),
          cell: (row) => (
            <ShownSwitch
              checked={row.visible}
              label={t("toggle", { name: row.name })}
              on={t("shown")}
              off={t("hidden")}
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
                { label: `${t("addChild")} · ${soon}`, icon: PlusIcon, disabled: true },
                {
                  label: `${t("delete")} · ${soon}`,
                  icon: Trash2Icon,
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
