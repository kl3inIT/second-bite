"use client";

import {
  BanIcon,
  CircleCheckIcon,
  CircleXIcon,
  ClockIcon,
  EyeIcon,
  type LucideIcon,
} from "lucide-react";
import { useFormatter, useTranslations } from "next-intl";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { isFeatureOn } from "@/features/admin/features";
import { adminHref } from "@/features/admin/pages";
import { StatusBadge } from "@/features/admin/ui/badge";
import { DataTable, DateCell, MediaCell, TextCell } from "@/features/admin/ui/data-table";
import { EmptyState } from "@/features/admin/ui/empty-state";
import { FilterBar, FilterSelect, SearchField } from "@/features/admin/ui/filter-bar";
import { Pagination } from "@/features/admin/ui/pagination";
import { RowActionMenu } from "@/features/admin/ui/row-action-menu";
import { dayToDate } from "@/features/admin/overview/days";
import { Sparkline, StatCard } from "@/features/admin/ui/stat-card";
import type { BadgeTone } from "@/features/admin/ui/badge";
import { cn } from "@/lib/utils";

import { useSellerActions } from "./seller-actions";
import {
  type AdminSeller,
  isFiltered,
  type ListQuery,
  listStatuses,
  type SellerStatus,
} from "./seller-list";
import type { SellerCounts } from "./sellers-source";
import { sellerPhoto } from "./seller-photo";
import { statusHref, useListQuery } from "./use-list-query";
import { pageSizes } from "../list-query";

const cardLooks: Record<SellerStatus, { tone: BadgeTone; icon: LucideIcon }> = {
  active: { tone: "success", icon: CircleCheckIcon },
  pending: { tone: "warning", icon: ClockIcon },
  rejected: { tone: "neutral", icon: CircleXIcon },
  blocked: { tone: "error", icon: BanIcon },
};

/**
 * The stores list (Figma AD-Q1, AD-Q2, AD-Q5 to AD-Q11, AD-TT1, AD-TT2): the three status cards, which filter
 * the list in place of tabs, the search, the table with its row menu, and the numbered pages. `rows` are the
 * page of stores `GET /admin/sellers` gave for the address's status, search and page, in the backend's order,
 * and `total` how many match. Each card draws its status over the last 14 days (`counts.trend`), which the
 * backend rebuilds from each store's last change of status (design.md › Sellers per day).
 *
 * With the `storeReview` flag (`review`, SEC-64) the list opens on the pending queue, a fourth card counts the
 * rejected stores, and a pending store's menu offers "Từ chối…" (AD-DS1).
 */
export function SellersList({
  query,
  rows,
  total,
  counts,
  review = isFeatureOn("storeReview"),
}: {
  query: ListQuery;
  rows: AdminSeller[];
  total: number;
  counts: SellerCounts;
  review?: boolean;
}) {
  const t = useTranslations("admin.sellers");
  const status = useTranslations("admin.shell.status");
  const format = useFormatter();
  const update = useListQuery(query, review);
  const actions = useSellerActions({ review });
  const [search, setSearch] = useState(query.q);
  const base = adminHref("sellers");
  const cards = listStatuses(review).map((each) => ({ status: each, ...cardLooks[each] }));

  // The search follows the typing once it pauses, so each key does not reload the list.
  useEffect(() => {
    if (search.trim() === query.q) return;
    const timer = setTimeout(() => update({ q: search.trim() }), 300);
    return () => clearTimeout(timer);
  }, [search, query.q, update]);

  return (
    <>
      <ul className={cn("grid gap-4", review ? "sm:grid-cols-2 xl:grid-cols-4" : "md:grid-cols-3")}>
        {cards.map((card) => (
          <li key={card.status}>
            <StatCard
              label={status(card.status)}
              value={counts[card.status]}
              icon={card.icon}
              tone={card.tone}
              chart={
                counts.trend && (
                  <Sparkline
                    points={counts.trend.map((day) => day[card.status])}
                    labels={counts.trend.map((day) => format.dateTime(dayToDate(day.date), "day"))}
                  />
                )
              }
              href={statusHref(query, card.status, base, review)}
              selected={query.status === card.status}
            />
          </li>
        ))}
      </ul>

      <FilterBar>
        <SearchField
          label={t("search.label")}
          placeholder={t("search.placeholder")}
          value={search}
          onChange={setSearch}
        />
        <FilterSelect
          label={t("filters.size")}
          value={String(query.size)}
          options={pageSizes.map((size) => ({ value: String(size), label: String(size) }))}
          onChange={(size) => update({ size: Number(size) as ListQuery["size"] })}
        />
      </FilterBar>

      {total === 0 ? (
        <div className="flex flex-col items-center rounded-md border border-border bg-card pb-6">
          {isFiltered(query) ? (
            <>
              <EmptyState title={t("empty.filtered")} />
              <Button
                variant="link"
                onClick={() => {
                  setSearch("");
                  update({ q: "" });
                }}
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
          rows={rows}
          rowKey={(seller) => seller.id}
          rowHref={(seller) => adminHref("sellerDetail", { sellerId: seller.id })}
          columns={[
            {
              key: "name",
              header: t("columns.name"),
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
              cell: (seller) => <DateCell value={seller.updatedAt} />,
            },
            {
              key: "actions",
              header: "",
              align: "end",
              cell: (seller) => (
                <RowActionMenu
                  name={seller.name}
                  actions={[
                    {
                      label: t("actions.view"),
                      icon: EyeIcon,
                      href: adminHref("sellerDetail", { sellerId: seller.id }),
                    },
                    ...actions.actionsFor(seller).map((action) => ({
                      label: action.menuLabel,
                      icon: action.icon,
                      destructive: action.destructive,
                      disabled: actions.locked,
                      onSelect: () => actions.act(seller, action.kind),
                    })),
                  ]}
                />
              ),
            },
          ]}
          footer={
            <Pagination
              page={query.page}
              pageSize={query.size}
              total={total}
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
