"use client";

import { useFormatter, useTranslations } from "next-intl";
import { useState } from "react";

import { formatPrice } from "@/features/offers/format";
import { adminHref } from "@/features/admin/pages";
import {
  AmountCell,
  type Column,
  DataTable,
  MediaCell,
  TextCell,
} from "@/features/admin/ui/data-table";
import { EmptyState } from "@/features/admin/ui/empty-state";
import { Pagination } from "@/features/admin/ui/pagination";

import {
  defaultReportSort,
  nextReportSort,
  type ReportSellerRow,
  type ReportSortKey,
  sortReportRows,
} from "./report-rows";

const pageSize = 10;

/**
 * The stores' lines of the report (Figma AD-BC1 › Table): orders, portions saved, share collected and what each took
 * at the counter, sorted by any heading, ten a page. Until SEC-13 there are no lines and it shows its empty state.
 */
export function SellerReportTable({ rows }: { rows: ReportSellerRow[] }) {
  const t = useTranslations("admin.reports.table");
  const format = useFormatter();
  const [sort, setSort] = useState(defaultReportSort);
  const [page, setPage] = useState(1);
  const sorted = sortReportRows(rows, sort);
  const shown = sorted.slice((page - 1) * pageSize, page * pageSize);

  const sortable = (key: ReportSortKey) => ({
    direction: sort.key === key ? sort.direction : ("none" as const),
    onSort: () => {
      setSort(nextReportSort(sort, key));
      setPage(1);
    },
  });

  const columns: Column<ReportSellerRow>[] = [
    {
      key: "name",
      header: t("seller"),
      grow: true,
      sort: sortable("name"),
      cell: (row) => (
        <MediaCell
          src={row.photoUrl}
          name={row.name}
          href={adminHref("sellerDetail", { sellerId: row.sellerId })}
        />
      ),
    },
    {
      key: "orders",
      header: t("orders"),
      sort: sortable("orders"),
      cell: (row) => <TextCell>{format.number(row.orders)}</TextCell>,
    },
    {
      key: "portionsSaved",
      header: t("portionsSaved"),
      sort: sortable("portionsSaved"),
      cell: (row) => <AmountCell>{format.number(row.portionsSaved)}</AmountCell>,
    },
    {
      key: "collectionRate",
      header: t("collectionRate"),
      sort: sortable("collectionRate"),
      cell: (row) => <TextCell>{`${Math.round(row.collectionRate * 100)}%`}</TextCell>,
    },
    {
      key: "revenueVnd",
      header: t("revenue"),
      sort: sortable("revenueVnd"),
      cell: (row) => <TextCell>{formatPrice(row.revenueVnd)}</TextCell>,
    },
  ];

  return (
    <DataTable
      caption={t("caption")}
      columns={columns}
      rows={shown}
      rowKey={(row) => row.sellerId}
      rowHref={(row) => adminHref("sellerDetail", { sellerId: row.sellerId })}
      empty={<EmptyState title={t("empty")} />}
      footer={
        rows.length > 0 && (
          <Pagination
            page={page}
            pageSize={pageSize}
            total={rows.length}
            onPage={setPage}
            summary={(range) => t("summary", range)}
          />
        )
      }
    />
  );
}
