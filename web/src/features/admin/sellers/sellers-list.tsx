"use client";

import { BanIcon, CircleCheckIcon, ClockIcon, EyeIcon, type LucideIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { adminHref } from "@/features/admin/pages";
import { StatusBadge } from "@/features/admin/ui/badge";
import { DataTable, DateCell, MediaCell, TextCell } from "@/features/admin/ui/data-table";
import { EmptyState } from "@/features/admin/ui/empty-state";
import {
  DateRangeFilter,
  type DateRangeValue,
  FilterBar,
  FilterSelect,
  SearchField,
} from "@/features/admin/ui/filter-bar";
import { Pagination } from "@/features/admin/ui/pagination";
import { RowActionMenu } from "@/features/admin/ui/row-action-menu";
import { StatCard } from "@/features/admin/ui/stat-card";
import type { BadgeTone } from "@/features/admin/ui/badge";
import type { SellerBody } from "@/lib/api/generated";

import { useSellerActions } from "./seller-actions";
import {
  applyListQuery,
  areasOf,
  isFiltered,
  type ListQuery,
  pageSizes,
  type SellerStatus,
  type SortKey,
  toggleSort,
} from "./seller-list";
import type { SellerCounts } from "./sellers-source";
import { sellerPhoto } from "./seller-photo";
import { statusHref, useListQuery } from "./use-list-query";

const cards: { status: SellerStatus; tone: BadgeTone; icon: LucideIcon }[] = [
  { status: "active", tone: "success", icon: CircleCheckIcon },
  { status: "pending", tone: "warning", icon: ClockIcon },
  { status: "blocked", tone: "error", icon: BanIcon },
];

/**
 * The stores list (Figma AD-Q1, AD-Q2, AD-Q5 to AD-Q11, AD-TT1, AD-TT2): the three status cards, which filter
 * the list in place of tabs, the filter bar, the table with its row menu, and the numbered pages. `rows` are
 * every store in the status of the address; the search, the area, the change dates, the sort and the page are
 * applied here (seller-list.ts). The cards' 14-day trend waits for a history of status changes in `seller`, so
 * the cards draw none (design.md › What waits).
 */
export function SellersList({ rows, counts }: { rows: SellerBody[]; counts: SellerCounts }) {
  const t = useTranslations("admin.sellers");
  const status = useTranslations("admin.shell.status");
  const [query, update] = useListQuery();
  const actions = useSellerActions();
  const shown = applyListQuery(rows, query);
  const base = adminHref("sellers");

  const sortOf = (key: SortKey) => ({
    direction: query.sort === key ? query.dir : ("none" as const),
    onSort: () => update(toggleSort(query, key)),
  });

  return (
    <>
      <ul className="grid gap-4 md:grid-cols-3">
        {cards.map((card) => (
          <li key={card.status}>
            <StatCard
              label={status(card.status)}
              value={counts[card.status]}
              icon={card.icon}
              tone={card.tone}
              href={statusHref(query, card.status, base)}
              selected={query.status === card.status}
            />
          </li>
        ))}
      </ul>

      <FilterBar>
        <SearchField
          label={t("search.label")}
          placeholder={t("search.placeholder")}
          value={query.q}
          onChange={(q) => update({ q })}
        />
        <FilterSelect
          label={t("filters.area")}
          value={query.area || "all"}
          options={[
            { value: "all", label: t("filters.all") },
            ...areasOf(rows).map((area) => ({ value: area, label: area })),
          ]}
          onChange={(area) => update({ area: area === "all" ? "" : area })}
        />
        <DateRangeFilter
          label={t("filters.changed")}
          value={{ from: dateOf(query.from), to: dateOf(query.to) }}
          onChange={(range: DateRangeValue) =>
            update({ from: dayString(range.from), to: dayString(range.to) })
          }
        />
        <FilterSelect
          label={t("filters.size")}
          value={String(query.size)}
          options={pageSizes.map((size) => ({ value: String(size), label: String(size) }))}
          onChange={(size) => update({ size: Number(size) as ListQuery["size"] })}
        />
      </FilterBar>

      {shown.total === 0 ? (
        <div className="flex flex-col items-center rounded-md border border-border bg-card pb-6">
          {isFiltered(query) ? (
            <>
              <EmptyState title={t("empty.filtered")} />
              <Button
                variant="link"
                onClick={() => update({ q: "", area: "", from: undefined, to: undefined })}
              >
                {t("empty.clear")}
              </Button>
            </>
          ) : (
            <EmptyState title={t(`empty.${query.status}`)} />
          )}
        </div>
      ) : (
        <DataTable
          caption={t("caption", { status: status(query.status) })}
          rows={shown.rows}
          rowKey={(seller) => seller.id}
          rowHref={(seller) => adminHref("sellerDetail", { sellerId: seller.id })}
          columns={[
            {
              key: "name",
              header: t("columns.name"),
              sort: sortOf("name"),
              cell: (seller) => (
                <MediaCell
                  src={sellerPhoto(seller, 400)}
                  name={seller.name}
                  href={adminHref("sellerDetail", { sellerId: seller.id })}
                />
              ),
            },
            {
              key: "address",
              header: t("columns.address"),
              sort: sortOf("address"),
              grow: true,
              cell: (seller) => <TextCell>{seller.address}</TextCell>,
            },
            {
              key: "phone",
              header: t("columns.phone"),
              cell: (seller) => <TextCell>{seller.phone}</TextCell>,
            },
            {
              key: "status",
              header: t("columns.status"),
              cell: (seller) => <StatusBadge status={seller.status} />,
            },
            {
              key: "updatedAt",
              header: t("columns.updatedAt"),
              sort: sortOf("updatedAt"),
              cell: (seller) => <DateCell value={seller.updatedAt} />,
            },
            {
              key: "actions",
              header: "",
              align: "end",
              cell: (seller) => {
                const action = actions.actionFor(seller);
                return (
                  <RowActionMenu
                    name={seller.name}
                    actions={[
                      {
                        label: t("actions.view"),
                        icon: EyeIcon,
                        href: adminHref("sellerDetail", { sellerId: seller.id }),
                      },
                      {
                        label: action.menuLabel,
                        icon: action.icon,
                        destructive: action.destructive,
                        disabled: actions.locked,
                        onSelect: () => actions.act(seller),
                      },
                    ]}
                  />
                );
              },
            },
          ]}
          footer={
            <Pagination
              page={shown.page}
              pageSize={query.size}
              total={shown.total}
              onPage={(page) => update({ page })}
              summary={({ from, to, total }) => t("summary", { from, to, total })}
            />
          }
        />
      )}
      {actions.dialog}
    </>
  );
}

/** A day of the address, `2026-10-20`, as the calendar's date at midnight where the browser is. */
function dateOf(day: string | undefined): Date | undefined {
  if (!day) return undefined;
  const [year, month, date] = day.split("-").map(Number);
  return new Date(year, month - 1, date);
}

/** The calendar's date as a day of the address. */
function dayString(date: Date | undefined): string | undefined {
  if (!date) return undefined;
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}
