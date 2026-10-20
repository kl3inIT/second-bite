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
  type AdminTransaction,
  type AdminTransactionRow,
  filterTransactions,
  paymentMethods,
  sortTransactions,
  type TransactionFilters,
  type TransactionSortKey,
  type TransactionStatus,
  transactionStatuses,
  type TransactionSummary,
} from "./payment";
import { MethodBadge, TransactionStatusBadge } from "./payment-badges";
import { TransactionSheet } from "./transaction-sheet";
import { useWhen } from "./use-when";

const PAGE_SIZE = 10;

/**
 * The Giao dịch tab (Figma AD-HT1, AD-HT2): three cards that filter by state (`?status=mismatch`), the filter
 * bar, the table, and the transaction named by the address (`?transaction=`) in the side sheet. A row opens it.
 */
export function TransactionsView({
  rows,
  summary,
  status,
  selected,
  onResolve,
}: {
  rows: AdminTransactionRow[];
  summary?: TransactionSummary;
  status: TransactionStatus | "all";
  selected?: AdminTransaction;
  onResolve?: (transactionId: string) => Promise<void>;
}) {
  const t = useTranslations("admin.payments");
  const when = useWhen();
  const router = useRouter();
  const [filters, setFilters] = useState<Omit<TransactionFilters, "status">>({
    search: "",
    method: "all",
    range: {},
  });
  const [sort, setSort] = useState<Sort<TransactionSortKey>>({ key: "at", direction: "desc" });
  const [page, setPage] = useState(1);

  const shown = sortTransactions(filterTransactions(rows, { ...filters, status }), sort);
  const current = pageOf(shown, page, PAGE_SIZE);
  const list = adminHref("payments");
  const statusHref = (next: TransactionStatus | "all") =>
    next === "all" || next === status ? list : `${list}?status=${next}`;
  const sheetHref = (row: AdminTransactionRow) =>
    `${list}?${new URLSearchParams({ ...(status === "all" ? {} : { status }), transaction: row.id })}`;

  const change = (next: Partial<Omit<TransactionFilters, "status">>) => {
    setFilters({ ...filters, ...next });
    setPage(1);
  };
  const sortBy = (key: TransactionSortKey) => ({
    direction: sort.key === key ? sort.direction : ("none" as const),
    onSort: () => setSort(toggleSort(sort, key)),
  });
  const figure = (value: number | undefined) => (value === undefined ? t("none") : value);

  const columns: Column<AdminTransactionRow>[] = [
    {
      key: "code",
      header: t("transactions.columns.code"),
      cell: (row) => <StrongCell href={sheetHref(row)}>{row.code}</StrongCell>,
    },
    {
      key: "order",
      header: t("transactions.columns.order"),
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
      header: t("transactions.columns.seller"),
      sort: sortBy("seller"),
      grow: true,
      cell: (row) => <TextCell>{row.sellerName}</TextCell>,
    },
    {
      key: "customer",
      header: t("transactions.columns.customer"),
      cell: (row) => <TextCell>{row.customerName}</TextCell>,
    },
    {
      key: "amount",
      header: t("transactions.columns.amount"),
      sort: sortBy("amount"),
      cell: (row) => <AmountCell>{formatPrice(row.amountVnd)}</AmountCell>,
    },
    {
      key: "method",
      header: t("transactions.columns.method"),
      cell: (row) => <MethodBadge method={row.method} />,
    },
    {
      key: "status",
      header: t("transactions.columns.status"),
      cell: (row) => <TransactionStatusBadge status={row.status} />,
    },
    {
      key: "at",
      header: t("transactions.columns.at"),
      sort: sortBy("at"),
      cell: (row) => (
        <time dateTime={row.at} className="text-body-sm whitespace-nowrap text-muted-foreground">
          {when(row.at)}
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
      <nav aria-label={t("transactions.cards")} className="grid gap-4 md:grid-cols-3">
        <StatCard
          label={t("transactions.status.confirmed")}
          value={figure(summary?.confirmed)}
          icon={CircleCheckIcon}
          tone="success"
          href={statusHref("confirmed")}
          selected={status === "confirmed"}
        />
        <StatCard
          label={t("transactions.status.awaitingSepay")}
          value={figure(summary?.awaitingSepay)}
          icon={ClockIcon}
          tone="warning"
          href={statusHref("awaitingSepay")}
          selected={status === "awaitingSepay"}
        />
        <StatCard
          label={t("transactions.status.mismatch")}
          value={figure(summary?.mismatch)}
          icon={BanIcon}
          tone="error"
          href={statusHref("mismatch")}
          selected={status === "mismatch"}
        />
      </nav>

      <FilterBar>
        <SearchField
          label={t("transactions.search")}
          placeholder={t("transactions.searchPlaceholder")}
          value={filters.search}
          onChange={(search) => change({ search })}
        />
        <FilterSelect
          label={t("filters.method")}
          value={filters.method}
          options={[
            { value: "all", label: t("filters.all") },
            ...paymentMethods.map((each) => ({ value: each, label: t(`method.${each}`) })),
          ]}
          onChange={(method) => change({ method: method as TransactionFilters["method"] })}
        />
        <FilterSelect
          label={t("filters.status")}
          value={status}
          options={[
            { value: "all", label: t("filters.all") },
            ...transactionStatuses.map((each) => ({
              value: each,
              label: t(`transactions.status.${each}`),
            })),
          ]}
          onChange={(next) => {
            setPage(1);
            router.replace(statusHref(next as TransactionStatus | "all"), { scroll: false });
          }}
        />
        <DateRangeFilter
          label={t("filters.day")}
          value={filters.range}
          onChange={(range) => change({ range })}
        />
      </FilterBar>

      <DataTable
        caption={t("transactions.table")}
        rows={current.rows}
        rowKey={(row) => row.id}
        rowHref={sheetHref}
        columns={columns}
        empty={
          <EmptyState
            title={rows.length === 0 ? t("transactions.empty") : t("transactions.emptyFiltered")}
          />
        }
        footer={
          shown.length > 0 && (
            <Pagination
              page={current.page}
              pageSize={PAGE_SIZE}
              total={shown.length}
              onPage={setPage}
              summary={({ from, to, total }) => t("transactions.summary", { from, to, total })}
            />
          )
        }
      />

      {selected && (
        <TransactionSheet
          transaction={selected}
          onClose={() =>
            router.replace(status === "all" ? list : `${list}?status=${status}`, { scroll: false })
          }
          onResolve={onResolve && (() => onResolve(selected.id))}
        />
      )}
    </>
  );
}
