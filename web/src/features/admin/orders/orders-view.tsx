"use client";

import { BanIcon, CircleCheckIcon, ClockIcon, EyeIcon, StoreIcon, XCircleIcon } from "lucide-react";
import { useFormatter, useTranslations } from "next-intl";
import { useState } from "react";

import { useRouter } from "@/i18n/navigation";

import { formatPrice } from "../../offers/format";
import { adminHref } from "../pages";
import {
  AmountCell,
  type Column,
  DataTable,
  MediaCell,
  StrongCell,
  TextCell,
} from "../ui/data-table";
import { EmptyState } from "../ui/empty-state";
import { DateRangeFilter, FilterBar, FilterSelect, SearchField } from "../ui/filter-bar";
import { Pagination } from "../ui/pagination";
import { type RowAction, RowActionMenu } from "../ui/row-action-menu";
import { StatCard } from "../ui/stat-card";
import { CancelOrderDialog } from "./cancel-order-dialog";
import {
  type AdminOrderRow,
  type CancelRequest,
  defaultOrderSort,
  filterOrders,
  isOpen,
  type OrderFilters,
  type OrderSortKey,
  type OrderStatusFilter,
  type OrderSummary,
  orderStatuses,
  ordersHref,
  pageOf,
  sellersOf,
  type Sort,
  sortOrders,
  toggleSort,
} from "./order";
import { OrderStatusBadge } from "./order-status-badge";

const PAGE_SIZE = 10;

/**
 * The orders list (Figma AD-DH1, AD-DH2): three cards that filter by state, the filter bar, then the table with
 * its sortable store, total and pickup columns and a menu on each row. `status` comes from the address
 * (`?status=expired`), so a card is a link; the rest is filtered in the browser. An open order's menu has
 * "Huỷ đơn…", whose dialog sends through `onCancel` once SEC-15's admin API can cancel one.
 */
export function OrdersView({
  rows,
  summary,
  status,
  search = "",
  onCancel,
}: {
  rows: AdminOrderRow[];
  summary?: OrderSummary;
  status: OrderStatusFilter;
  /** The search from the address (`?q=`), such as an account's email from its page. */
  search?: string;
  onCancel?: (orderId: string, request: CancelRequest) => Promise<void>;
}) {
  const t = useTranslations("admin.orders");
  const format = useFormatter();
  const router = useRouter();
  const [filters, setFilters] = useState<Omit<OrderFilters, "status">>({
    search,
    sellerId: "all",
    range: {},
  });
  const [sort, setSort] = useState<Sort<OrderSortKey>>(defaultOrderSort);
  const [page, setPage] = useState(1);
  const [cancelling, setCancelling] = useState<AdminOrderRow>();

  const shown = sortOrders(filterOrders(rows, { ...filters, status }), sort);
  const current = pageOf(shown, page, PAGE_SIZE);
  const list = adminHref("orders");
  // A card pressed again turns its filter off; the search stays in the address either way.
  const statusHref = (next: OrderStatusFilter) =>
    ordersHref(list, { status: next === status ? "all" : next, q: filters.search });

  const change = (next: Partial<Omit<OrderFilters, "status">>) => {
    setFilters({ ...filters, ...next });
    setPage(1);
  };
  const sortBy = (key: OrderSortKey) => ({
    direction: sort.key === key ? sort.direction : ("none" as const),
    onSort: () => setSort(toggleSort(sort, key)),
  });
  const time = (at: string) => format.dateTime(new Date(at), "time");
  const figure = (value: number | undefined) => (value === undefined ? t("cards.none") : value);

  const columns: Column<AdminOrderRow>[] = [
    {
      key: "code",
      header: t("columns.code"),
      cell: (order) => (
        <StrongCell href={adminHref("orderDetail", { orderId: order.id })}>
          {t("code", { code: order.code })}
        </StrongCell>
      ),
    },
    {
      key: "customer",
      header: t("columns.customer"),
      cell: (order) => <StrongCell>{order.customerName}</StrongCell>,
    },
    {
      key: "seller",
      header: t("columns.seller"),
      sort: sortBy("seller"),
      cell: (order) => <MediaCell src={order.sellerPhotoUrl} name={order.sellerName} />,
    },
    {
      key: "items",
      header: t("columns.items"),
      grow: true,
      cell: (order) => (
        <TextCell>
          {order.items
            .map((item) => t("item", { name: item.name, quantity: item.quantity }))
            .join(", ")}
        </TextCell>
      ),
    },
    {
      key: "total",
      header: t("columns.total"),
      align: "end",
      sort: sortBy("total"),
      cell: (order) => <AmountCell>{formatPrice(order.totalVnd)}</AmountCell>,
    },
    {
      key: "pickup",
      header: t("columns.pickup"),
      sort: sortBy("pickup"),
      cell: (order) => (
        <TextCell>
          {t("window", { start: time(order.pickupStart), end: time(order.pickupEnd) })}
        </TextCell>
      ),
    },
    {
      key: "status",
      header: t("columns.status"),
      cell: (order) => <OrderStatusBadge status={order.status} />,
    },
    {
      key: "actions",
      header: "",
      align: "end",
      cell: (order) => {
        const actions: RowAction[] = [
          {
            label: t("actions.view"),
            icon: EyeIcon,
            href: adminHref("orderDetail", { orderId: order.id }),
          },
          {
            label: t("actions.viewSeller"),
            icon: StoreIcon,
            href: adminHref("sellerDetail", { sellerId: order.sellerId }),
          },
        ];
        if (isOpen(order.status)) {
          actions.push({
            label: t("actions.cancel"),
            icon: XCircleIcon,
            destructive: true,
            onSelect: () => setCancelling(order),
          });
        }
        return <RowActionMenu name={t("code", { code: order.code })} actions={actions} />;
      },
    },
  ];

  return (
    <>
      <nav aria-label={t("cards.label")} className="grid gap-4 md:grid-cols-3">
        <StatCard
          label={t("cards.collectedToday")}
          value={figure(summary?.collectedToday)}
          icon={CircleCheckIcon}
          tone="success"
          href={statusHref("collected")}
          selected={status === "collected"}
        />
        <StatCard
          label={t("cards.waiting")}
          value={figure(summary?.waiting)}
          icon={ClockIcon}
          tone="warning"
          href={statusHref("waiting")}
          selected={status === "waiting"}
        />
        <StatCard
          label={t("cards.noShow")}
          value={figure(summary?.noShow)}
          icon={BanIcon}
          tone="error"
          href={statusHref("expired")}
          selected={status === "expired"}
        />
      </nav>

      <FilterBar>
        <SearchField
          label={t("filters.search")}
          placeholder={t("filters.searchPlaceholder")}
          value={filters.search}
          onChange={(next) => {
            change({ search: next });
            router.replace(ordersHref(list, { status, q: next }), { scroll: false });
          }}
        />
        <FilterSelect
          label={t("filters.seller")}
          value={filters.sellerId}
          options={[
            { value: "all", label: t("filters.all") },
            ...sellersOf(rows).map((seller) => ({ value: seller.id, label: seller.name })),
          ]}
          onChange={(sellerId) => change({ sellerId })}
        />
        <FilterSelect
          label={t("filters.status")}
          value={status}
          options={[
            { value: "all", label: t("filters.all") },
            { value: "waiting", label: t("cards.waiting") },
            ...orderStatuses.map((each) => ({ value: each, label: t(`status.${each}`) })),
          ]}
          onChange={(next) => {
            setPage(1);
            router.replace(
              ordersHref(list, { status: next as OrderStatusFilter, q: filters.search }),
              { scroll: false },
            );
          }}
        />
        <DateRangeFilter
          label={t("filters.day")}
          value={filters.range}
          onChange={(range) => change({ range })}
        />
      </FilterBar>

      <DataTable
        caption={t("table")}
        rows={current.rows}
        rowKey={(order) => order.id}
        rowHref={(order) => adminHref("orderDetail", { orderId: order.id })}
        columns={columns}
        empty={<EmptyState title={rows.length === 0 ? t("empty") : t("emptyFiltered")} />}
        footer={
          shown.length > 0 && (
            <Pagination
              page={current.page}
              pageSize={PAGE_SIZE}
              total={shown.length}
              onPage={setPage}
              summary={({ from, to, total }) => t("summary", { from, to, total })}
            />
          )
        }
      />

      {cancelling && (
        <CancelOrderDialog
          code={cancelling.code}
          open
          onOpenChange={(open) => !open && setCancelling(undefined)}
          onCancel={onCancel && ((request) => onCancel(cancelling.id, request))}
        />
      )}
    </>
  );
}
