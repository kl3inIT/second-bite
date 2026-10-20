"use client";

import { BanIcon, CircleCheckIcon, ClockIcon, EyeIcon, ReceiptIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { Link, useRouter } from "@/i18n/navigation";

import { formatPrice } from "../../offers/format";
import { pageOf, type Sort, toggleSort } from "../orders/order";
import { adminHref } from "../pages";
import { AmountCell, type Column, DataTable, StrongCell, TextCell } from "../ui/data-table";
import { EmptyState } from "../ui/empty-state";
import { DateRangeFilter, FilterBar, FilterSelect, SearchField } from "../ui/filter-bar";
import { Pagination } from "../ui/pagination";
import { RowActionMenu } from "../ui/row-action-menu";
import { StatCard } from "../ui/stat-card";
import {
  type AdminRefund,
  type AdminRefundRow,
  type ApproveRequest,
  filterRefunds,
  type RefundFilters,
  type RefundSortKey,
  type RefundStatus,
  refundStatuses,
  type RefundSummary,
  sellerNames,
  sortRefunds,
} from "./payment";
import { RefundStatusBadge } from "./payment-badges";
import { RefundSheet } from "./refund-sheet";
import { useWhen } from "./use-when";

const PAGE_SIZE = 10;

/**
 * The Hoàn tiền tab (Figma AD-HT3 to AD-HT7): three cards that filter by state (`?tab=refunds&status=pending`),
 * the filter bar, the table, and the request named by the address (`&refund=`) in the side sheet, where it is
 * approved or refused through `onApprove` and `onReject` once SEC-18's API exists.
 */
export function RefundsView({
  rows,
  summary,
  status,
  selected,
  onApprove,
  onReject,
}: {
  rows: AdminRefundRow[];
  summary?: RefundSummary;
  status: RefundStatus | "all";
  selected?: AdminRefund;
  onApprove?: (refundId: string, request: ApproveRequest) => Promise<void>;
  onReject?: (refundId: string, reason: string) => Promise<void>;
}) {
  const t = useTranslations("admin.payments");
  const when = useWhen();
  const router = useRouter();
  const [filters, setFilters] = useState<Omit<RefundFilters, "status">>({
    search: "",
    seller: "all",
    range: {},
  });
  const [sort, setSort] = useState<Sort<RefundSortKey>>({ key: "requestedAt", direction: "desc" });
  const [page, setPage] = useState(1);

  const shown = sortRefunds(filterRefunds(rows, { ...filters, status }), sort);
  const current = pageOf(shown, page, PAGE_SIZE);
  const href = (params: Record<string, string>) =>
    `${adminHref("payments")}?${new URLSearchParams({ tab: "refunds", ...params })}`;
  const statusHref = (next: RefundStatus | "all") =>
    href(next === "all" || next === status ? {} : { status: next });
  const here: Record<string, string> = status === "all" ? {} : { status };
  const sheetHref = (row: AdminRefundRow) => href({ ...here, refund: row.id });

  const change = (next: Partial<Omit<RefundFilters, "status">>) => {
    setFilters({ ...filters, ...next });
    setPage(1);
  };
  const sortBy = (key: RefundSortKey) => ({
    direction: sort.key === key ? sort.direction : ("none" as const),
    onSort: () => setSort(toggleSort(sort, key)),
  });
  const figure = (value: number | undefined) => (value === undefined ? t("none") : value);

  const columns: Column<AdminRefundRow>[] = [
    {
      key: "code",
      header: t("refunds.columns.code"),
      cell: (row) => <StrongCell href={sheetHref(row)}>{row.code}</StrongCell>,
    },
    {
      key: "order",
      header: t("refunds.columns.order"),
      cell: (row) => (
        <Link
          href={adminHref("orderDetail", { orderId: row.orderId })}
          className="rounded-sm text-body-sm text-link hover:underline focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
        >
          {t("order", { code: row.orderCode })}
        </Link>
      ),
    },
    {
      key: "seller",
      header: t("refunds.columns.seller"),
      sort: sortBy("seller"),
      cell: (row) => <TextCell>{row.sellerName}</TextCell>,
    },
    {
      key: "customer",
      header: t("refunds.columns.customer"),
      cell: (row) => <TextCell>{row.customerName}</TextCell>,
    },
    {
      key: "amount",
      header: t("refunds.columns.amount"),
      sort: sortBy("amount"),
      cell: (row) => <AmountCell>{formatPrice(row.amountVnd)}</AmountCell>,
    },
    {
      key: "reason",
      header: t("refunds.columns.reason"),
      grow: true,
      cell: (row) => <TextCell>{row.reason}</TextCell>,
    },
    {
      key: "status",
      header: t("refunds.columns.status"),
      cell: (row) => <RefundStatusBadge status={row.status} />,
    },
    {
      key: "requestedAt",
      header: t("refunds.columns.requestedAt"),
      sort: sortBy("requestedAt"),
      cell: (row) => (
        <time
          dateTime={row.requestedAt}
          className="text-body-sm whitespace-nowrap text-muted-foreground"
        >
          {when(row.requestedAt)}
        </time>
      ),
    },
    {
      key: "actions",
      header: "",
      align: "end",
      cell: (row) => (
        <RowActionMenu
          name={row.code}
          actions={[
            { label: t("actions.view"), icon: EyeIcon, href: sheetHref(row) },
            {
              label: t("actions.viewOrder"),
              icon: ReceiptIcon,
              href: adminHref("orderDetail", { orderId: row.orderId }),
            },
          ]}
        />
      ),
    },
  ];

  return (
    <>
      <nav aria-label={t("refunds.cards")} className="grid gap-4 md:grid-cols-3">
        <StatCard
          label={t("refunds.approved7Days")}
          value={figure(summary?.approved7Days)}
          icon={CircleCheckIcon}
          tone="success"
          href={statusHref("approved")}
          selected={status === "approved"}
        />
        <StatCard
          label={t("refunds.pendingCard")}
          value={figure(summary?.pending)}
          icon={ClockIcon}
          tone="warning"
          href={statusHref("pending")}
          selected={status === "pending"}
        />
        <StatCard
          label={t("refunds.rejected7Days")}
          value={figure(summary?.rejected7Days)}
          icon={BanIcon}
          tone="error"
          href={statusHref("rejected")}
          selected={status === "rejected"}
        />
      </nav>

      <FilterBar>
        <SearchField
          label={t("refunds.search")}
          placeholder={t("refunds.searchPlaceholder")}
          value={filters.search}
          onChange={(search) => change({ search })}
        />
        <FilterSelect
          label={t("filters.status")}
          value={status}
          options={[
            { value: "all", label: t("filters.all") },
            ...refundStatuses.map((each) => ({ value: each, label: t(`refunds.status.${each}`) })),
          ]}
          onChange={(next) => {
            setPage(1);
            router.replace(statusHref(next as RefundStatus | "all"), { scroll: false });
          }}
        />
        <FilterSelect
          label={t("filters.seller")}
          value={filters.seller}
          options={[
            { value: "all", label: t("filters.all") },
            ...sellerNames(rows).map((name) => ({ value: name, label: name })),
          ]}
          onChange={(seller) => change({ seller })}
        />
        <DateRangeFilter
          label={t("filters.day")}
          value={filters.range}
          onChange={(range) => change({ range })}
        />
      </FilterBar>

      <DataTable
        caption={t("refunds.table")}
        rows={current.rows}
        rowKey={(row) => row.id}
        rowHref={sheetHref}
        columns={columns}
        empty={
          <EmptyState title={rows.length === 0 ? t("refunds.empty") : t("refunds.emptyFiltered")} />
        }
        footer={
          shown.length > 0 && (
            <Pagination
              page={current.page}
              pageSize={PAGE_SIZE}
              total={shown.length}
              onPage={setPage}
              summary={({ from, to, total }) => t("refunds.summary", { from, to, total })}
            />
          )
        }
      />

      {selected && (
        <RefundSheet
          refund={selected}
          onClose={() => router.replace(href(here), { scroll: false })}
          onApprove={onApprove && ((request) => onApprove(selected.id, request))}
          onReject={onReject && ((reason) => onReject(selected.id, reason))}
        />
      )}
    </>
  );
}
