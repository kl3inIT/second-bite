"use client";

import { useFormatter, useTranslations } from "next-intl";

import { Empty, EmptyHeader, EmptyTitle } from "@/components/ui/empty";
import { DataTable, type DataTableColumns } from "@/features/admin/data-table";
import { ListFooter } from "@/features/admin/list-footer";
import { OrderActions } from "@/features/admin-orders/order-actions";
import { OrderStatusBadge } from "@/features/admin-orders/order-status";
import { useLinesSummary } from "@/features/admin-orders/orders-list";
import { formatPrice } from "@/features/offers/format";
import { DayBar } from "@/features/seller/day-filter";
import { Link } from "@/i18n/navigation";
import type { OrderBody } from "@/lib/api/generated";
import { customerOf } from "@/features/orders/order";

/**
 * The "Đơn hàng" tab of a store's page (Figma AD-QD6): the store's orders of one day, chosen with the app's
 * day steps, the soonest window first; each row's "⋯" opens the order's page (AD-QD7), whose crumbs lead back
 * to this store. Admins read orders and never act on them.
 */
export function SellerOrders({
  sellerId,
  orders,
  today,
}: {
  sellerId: string;
  orders: OrderBody[];
  today: string;
}) {
  const t = useTranslations("Admin.sellers.detail");
  const columns = useColumns();

  return (
    <div className="flex flex-col gap-4">
      <DayBar
        pathname={`/admin/sellers/${sellerId}`}
        list="orders"
        today={today}
        keep="tab=orders"
      />
      <DataTable
        label={t("ordersTable")}
        columns={columns}
        rows={orders}
        rowKey={(order) => order.id}
        empty={
          <Empty>
            <EmptyHeader>
              <EmptyTitle>{t("noOrders")}</EmptyTitle>
            </EmptyHeader>
          </Empty>
        }
        footer={
          orders.length > 0 && (
            <ListFooter
              page={1}
              pageSize={orders.length}
              total={orders.length}
              noun={t("orderNoun")}
              hrefOf={() => ""}
              onPage={() => {}}
            />
          )
        }
      />
    </div>
  );
}

function useColumns(): DataTableColumns<OrderBody> {
  const t = useTranslations("Admin.orders");
  const gone = useTranslations("Orders")("customerGone");
  const format = useFormatter();
  const time = (at: string) => format.dateTime(new Date(at), "time");
  const summary = useLinesSummary();

  return [
    {
      id: "customer",
      header: t("column.customer"),
      meta: { width: "w-36" },
      cell: ({ row }) => (
        <Link
          href={`/admin/orders/${row.original.id}?from=store`}
          className="text-body-sm-strong hover:underline focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
        >
          {customerOf(row.original, gone)}
        </Link>
      ),
    },
    {
      id: "lines",
      header: t("column.lines"),
      meta: { width: "w-56" },
      cell: ({ row }) => <span className="text-muted-foreground">{summary(row.original)}</span>,
    },
    {
      id: "number",
      header: t("column.number"),
      meta: { width: "w-28" },
      cell: ({ row }) => (
        <Link
          href={`/admin/orders/${row.original.id}?from=store`}
          className="hover:underline focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
        >
          {row.original.number}
        </Link>
      ),
    },
    {
      id: "total",
      header: t("column.total"),
      meta: { width: "w-24" },
      cell: ({ row }) => formatPrice(row.original.totalVnd),
    },
    {
      id: "status",
      header: t("column.status"),
      meta: { width: "w-48" },
      cell: ({ row }) => <OrderStatusBadge status={row.original.status} />,
    },
    {
      id: "window",
      header: t("column.window"),
      meta: { width: "w-28" },
      cell: ({ row }) =>
        t("window", { from: time(row.original.windowStart), until: time(row.original.windowEnd) }),
    },
    {
      id: "actions",
      header: () => <span className="sr-only">{t("column.actions")}</span>,
      meta: { width: "w-16" },
      cell: ({ row }) => <OrderActions order={row.original} fromStore />,
    },
  ];
}
