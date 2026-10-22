"use client";

import { EllipsisIcon, EyeIcon } from "lucide-react";
import { useFormatter, useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Empty, EmptyHeader, EmptyTitle } from "@/components/ui/empty";
import { DataTable, type DataTableColumns } from "@/features/admin/data-table";
import { ListFooter } from "@/features/admin/list-footer";
import { OrderStatusBadge } from "@/features/admin-orders/order-status";
import { useLinesSummary } from "@/features/admin-orders/orders-list";
import { formatPrice } from "@/features/offers/format";
import { DayBar } from "@/features/seller/day-filter";
import { Link } from "@/i18n/navigation";
import type { OrderBody } from "@/lib/api/generated";

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
  const detail = useTranslations("Admin.sellers.detail");
  const sellers = useTranslations("Admin.sellers");
  const format = useFormatter();
  const time = (at: string) => format.dateTime(new Date(at), "time");
  const summary = useLinesSummary();

  return [
    {
      id: "customer",
      header: t("column.customer"),
      cell: ({ row }) => <span className="text-body-sm-strong">{row.original.customerName}</span>,
    },
    {
      id: "lines",
      header: t("column.lines"),
      cell: ({ row }) => <span className="min-w-48">{summary(row.original)}</span>,
    },
    {
      id: "number",
      header: t("column.number"),
      cell: ({ row }) => (
        <Link
          href={`/admin/orders/${row.original.id}?from=store`}
          className="whitespace-nowrap hover:underline focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
        >
          {row.original.number}
        </Link>
      ),
    },
    {
      id: "total",
      header: t("column.total"),
      cell: ({ row }) => (
        <span className="whitespace-nowrap">{formatPrice(row.original.totalVnd)}</span>
      ),
    },
    {
      id: "status",
      header: t("column.status"),
      cell: ({ row }) => <OrderStatusBadge status={row.original.status} />,
    },
    {
      id: "window",
      header: t("column.window"),
      cell: ({ row }) => (
        <span className="whitespace-nowrap">
          {t("window", {
            from: time(row.original.windowStart),
            until: time(row.original.windowEnd),
          })}
        </span>
      ),
    },
    {
      id: "actions",
      header: () => <span className="sr-only">{sellers("column.actions")}</span>,
      cell: ({ row }) => (
        <div className="flex justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label={detail("orderActions", { number: row.original.number })}
                />
              }
            >
              <EllipsisIcon aria-hidden />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                render={<Link href={`/admin/orders/${row.original.id}?from=store`} />}
              >
                <EyeIcon aria-hidden />
                {detail("viewOrder")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
    },
  ];
}
