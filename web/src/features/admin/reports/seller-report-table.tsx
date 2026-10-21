"use client";

import { ArrowDownIcon, ArrowUpIcon, ChevronsUpDownIcon, InboxIcon } from "lucide-react";
import { useFormatter, useTranslations } from "next-intl";
import { useState } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardFooter } from "@/components/ui/card";
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { adminHref } from "@/features/admin/pages";
import { formatPrice } from "@/features/offers/format";
import { Link } from "@/i18n/navigation";

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
  const tShell = useTranslations("admin.shell");
  const format = useFormatter();
  const [sort, setSort] = useState(defaultReportSort);
  const [page, setPage] = useState(1);
  const sorted = sortReportRows(rows, sort);
  const shown = sorted.slice((page - 1) * pageSize, page * pageSize);
  const total = rows.length;
  const pages = Math.max(1, Math.ceil(total / pageSize) || 1);
  const range = {
    from: total === 0 ? 0 : (page - 1) * pageSize + 1,
    to: Math.min(total, page * pageSize),
    total,
  };

  const headers: { key: ReportSortKey; label: string }[] = [
    { key: "name", label: t("seller") },
    { key: "orders", label: t("orders") },
    { key: "portionsSaved", label: t("portionsSaved") },
    { key: "collectionRate", label: t("collectionRate") },
    { key: "revenueVnd", label: t("revenue") },
  ];

  return (
    <Card>
      <Table>
        <TableCaption className="sr-only">{t("caption")}</TableCaption>
        <TableHeader>
          <TableRow>
            {headers.map((header) => {
              const direction = sort.key === header.key ? sort.direction : "none";
              const SortIcon =
                direction === "asc"
                  ? ArrowUpIcon
                  : direction === "desc"
                    ? ArrowDownIcon
                    : ChevronsUpDownIcon;
              return (
                <TableHead
                  key={header.key}
                  aria-sort={
                    direction === "asc"
                      ? "ascending"
                      : direction === "desc"
                        ? "descending"
                        : undefined
                  }
                  className={header.key === "name" ? "w-full" : undefined}
                >
                  <Button
                    variant={direction === "none" ? "ghost" : "secondary"}
                    onClick={() => {
                      setSort(nextReportSort(sort, header.key));
                      setPage(1);
                    }}
                  >
                    {header.label}
                    <SortIcon data-icon="inline-end" aria-hidden />
                  </Button>
                </TableHead>
              );
            })}
          </TableRow>
        </TableHeader>
        <TableBody>
          {shown.map((row) => (
            <TableRow key={row.sellerId}>
              <TableCell className="w-full">
                <div className="flex min-w-56 items-center gap-2.5">
                  <Avatar size="lg">
                    {row.photoUrl && <AvatarImage src={row.photoUrl} alt="" />}
                    <AvatarFallback>{row.name.slice(0, 1).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <Link
                    href={adminHref("sellerDetail", { sellerId: row.sellerId })}
                    className="block max-w-80 truncate text-body-sm-strong text-foreground hover:underline"
                  >
                    {row.name}
                  </Link>
                </div>
              </TableCell>
              <TableCell>{format.number(row.orders)}</TableCell>
              <TableCell>
                <span className="text-body-sm-strong text-foreground tabular-nums">
                  {format.number(row.portionsSaved)}
                </span>
              </TableCell>
              <TableCell>{`${Math.round(row.collectionRate * 100)}%`}</TableCell>
              <TableCell>{formatPrice(row.revenueVnd)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {total === 0 && (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <InboxIcon aria-hidden />
            </EmptyMedia>
            <EmptyTitle>{t("empty")}</EmptyTitle>
          </EmptyHeader>
        </Empty>
      )}
      {total > 0 && (
        <CardFooter>
          <div className="flex w-full flex-wrap items-center justify-between gap-3">
            <p className="text-body-sm text-muted-foreground">{t("summary", range)}</p>
            {pages > 1 && (
              <Pagination aria-label={tShell("pagination.label")} className="mx-0 w-auto">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      text={tShell("pagination.previous")}
                      aria-label={tShell("pagination.previous")}
                      href={page > 1 ? "#" : undefined}
                      aria-disabled={page > 1 ? undefined : true}
                      onClick={(event) => {
                        event.preventDefault();
                        if (page > 1) setPage(page - 1);
                      }}
                    />
                  </PaginationItem>
                  <PaginationItem>
                    <span className="px-2 text-body-sm text-foreground tabular-nums">
                      {t("pageOf", { page, pages })}
                    </span>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationNext
                      text={tShell("pagination.next")}
                      aria-label={tShell("pagination.next")}
                      href={page < pages ? "#" : undefined}
                      aria-disabled={page < pages ? undefined : true}
                      onClick={(event) => {
                        event.preventDefault();
                        if (page < pages) setPage(page + 1);
                      }}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
          </div>
        </CardFooter>
      )}
    </Card>
  );
}
