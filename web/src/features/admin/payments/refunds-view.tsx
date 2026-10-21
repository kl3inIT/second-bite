"use client";

import { enUS, vi } from "date-fns/locale";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  BanIcon,
  CalendarIcon,
  ChevronDownIcon,
  ChevronsUpDownIcon,
  CircleCheckIcon,
  ClockIcon,
  EllipsisIcon,
  EyeIcon,
  InboxIcon,
  ReceiptIcon,
  SearchIcon,
} from "lucide-react";
import { useFormatter, useLocale, useTranslations } from "next-intl";
import { type ReactNode, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDayMonth } from "@/i18n/day-month";
import { Link, useRouter } from "@/i18n/navigation";

import { formatPrice } from "../../offers/format";
import { pageOf, type Sort, toggleSort } from "../orders/order";
import { adminHref } from "../pages";
import {
  type AdminRefund,
  type AdminRefundRow,
  type ApproveRequest,
  dayRangeLabel,
  filterRefunds,
  type RefundFilters,
  type RefundSortKey,
  type RefundStatus,
  refundStatuses,
  refundStatusLooks,
  type RefundSummary,
  sellerNames,
  sortRefunds,
} from "./payment";
import { RefundSheet } from "./refund-sheet";
import { useWhen } from "./use-when";

const PAGE_SIZE = 10;

type Column = {
  key: string;
  header: string;
  cell: (row: AdminRefundRow) => ReactNode;
  sort?: RefundSortKey;
  end?: boolean;
};

/**
 * The Hoàn tiền tab (Figma AD-HT3 to AD-HT7): three cards that filter by state (`?tab=refunds&status=pending`),
 * the filters, the table, and the request named by the address (`&refund=`) in the side sheet, where it is
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
  const shell = useTranslations("admin.shell");
  const format = useFormatter();
  const locale = useLocale();
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

  const cards = [
    {
      key: "approved",
      label: t("refunds.approved7Days"),
      value: summary?.approved7Days,
      icon: <CircleCheckIcon aria-hidden className="text-success" />,
    },
    {
      key: "pending",
      label: t("refunds.pendingCard"),
      value: summary?.pending,
      icon: <ClockIcon aria-hidden className="text-warning-foreground" />,
    },
    {
      key: "rejected",
      label: t("refunds.rejected7Days"),
      value: summary?.rejected7Days,
      icon: <BanIcon aria-hidden className="text-destructive" />,
    },
  ] as const;

  const selects = [
    {
      key: "status",
      label: t("filters.status"),
      value: status as string,
      options: [
        { value: "all", label: t("filters.all") },
        ...refundStatuses.map((each) => ({ value: each, label: t(`refunds.status.${each}`) })),
      ],
      onChange: (next: string) => {
        setPage(1);
        router.replace(statusHref(next as RefundStatus | "all"), { scroll: false });
      },
    },
    {
      key: "seller",
      label: t("filters.seller"),
      value: filters.seller,
      options: [
        { value: "all", label: t("filters.all") },
        ...sellerNames(rows).map((name) => ({ value: name, label: name })),
      ],
      onChange: (seller: string) => change({ seller }),
    },
  ];

  const columns: Column[] = [
    {
      key: "code",
      header: t("refunds.columns.code"),
      cell: (row) => (
        <Link href={sheetHref(row)} className="text-body-sm-strong text-foreground hover:underline">
          {row.code}
        </Link>
      ),
    },
    {
      key: "order",
      header: t("refunds.columns.order"),
      cell: (row) => (
        <Link
          href={adminHref("orderDetail", { orderId: row.orderId })}
          className="text-link hover:underline"
        >
          {t("order", { code: row.orderCode })}
        </Link>
      ),
    },
    {
      key: "seller",
      header: t("refunds.columns.seller"),
      sort: "seller",
      cell: (row) => row.sellerName,
    },
    {
      key: "customer",
      header: t("refunds.columns.customer"),
      cell: (row) => row.customerName,
    },
    {
      key: "amount",
      header: t("refunds.columns.amount"),
      sort: "amount",
      cell: (row) => (
        <span className="text-body-sm-strong tabular-nums">{formatPrice(row.amountVnd)}</span>
      ),
    },
    {
      key: "reason",
      header: t("refunds.columns.reason"),
      cell: (row) => <span className="block max-w-80 truncate">{row.reason}</span>,
    },
    {
      key: "status",
      header: t("refunds.columns.status"),
      cell: (row) => {
        const look = refundStatusLooks[row.status];
        return (
          <Badge variant={look.variant}>
            {look.icon && <look.icon aria-hidden />}
            {t(`refunds.status.${row.status}`)}
          </Badge>
        );
      },
    },
    {
      key: "requestedAt",
      header: t("refunds.columns.requestedAt"),
      sort: "requestedAt",
      cell: (row) => (
        <time dateTime={row.requestedAt} className="text-muted-foreground">
          {when(row.requestedAt)}
        </time>
      ),
    },
    {
      key: "actions",
      header: "",
      end: true,
      cell: (row) => (
        <DropdownMenu>
          <DropdownMenuTrigger
            render={<Button variant="ghost" size="icon" />}
            aria-label={shell("rowActions", { name: row.code })}
          >
            <EllipsisIcon aria-hidden />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuGroup>
              <DropdownMenuItem render={<Link href={sheetHref(row)} />}>
                <EyeIcon aria-hidden />
                {t("actions.view")}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                render={<Link href={adminHref("orderDetail", { orderId: row.orderId })} />}
              >
                <ReceiptIcon aria-hidden />
                {t("actions.viewOrder")}
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <>
      <nav aria-label={t("refunds.cards")} className="grid gap-4 md:grid-cols-3">
        {cards.map((card) => (
          <Link
            key={card.key}
            href={statusHref(card.key)}
            aria-current={status === card.key ? "true" : undefined}
            className="rounded-2xl focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
          >
            <Card>
              <CardHeader>
                <CardTitle>{card.label}</CardTitle>
                <CardAction>{card.icon}</CardAction>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between gap-3">
                  <span className="font-display text-display">{card.value ?? t("none")}</span>
                  {status === card.key && <Badge variant="secondary">{t("filtering")}</Badge>}
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </nav>

      <search className="flex flex-wrap items-center gap-3">
        <div className="min-w-60 flex-1">
          <InputGroup>
            <InputGroupAddon>
              <SearchIcon aria-hidden />
            </InputGroupAddon>
            <InputGroupInput
              type="search"
              aria-label={t("refunds.search")}
              placeholder={t("refunds.searchPlaceholder")}
              value={filters.search}
              onChange={(event) => change({ search: event.target.value })}
            />
          </InputGroup>
        </div>
        {selects.map((select) => (
          <Select
            key={select.key}
            value={select.value}
            items={select.options}
            onValueChange={(next) => {
              if (typeof next === "string") select.onChange(next);
            }}
          >
            {/* A combobox takes no name from what it holds, so its label names it. */}
            <SelectTrigger aria-labelledby={`refunds-${select.key}`}>
              <span id={`refunds-${select.key}`} className="text-muted-foreground">
                {select.label}:
              </span>
              <SelectValue />
            </SelectTrigger>
            <SelectContent alignItemWithTrigger={false} align="start">
              {select.options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ))}
        <Popover>
          <PopoverTrigger render={<Button variant="outline" />}>
            <CalendarIcon data-icon="inline-start" aria-hidden />
            {t("filters.day")}:{" "}
            {dayRangeLabel(filters.range, {
              day: (at) => format.dateTime(at, "day"),
              dayMonth: (at) => formatDayMonth(at, locale),
              any: shell("dateRange.any"),
            })}
            <ChevronDownIcon data-icon="inline-end" aria-hidden />
          </PopoverTrigger>
          <PopoverContent align="start" className="w-auto">
            <Calendar
              mode="range"
              locale={locale === "vi" ? vi : enUS}
              numberOfMonths={2}
              selected={{ from: filters.range.from, to: filters.range.to }}
              onSelect={(range) => change({ range: { from: range?.from, to: range?.to } })}
            />
            <Button variant="ghost" onClick={() => change({ range: {} })}>
              {shell("dateRange.clear")}
            </Button>
          </PopoverContent>
        </Popover>
      </search>

      <div className="flex flex-col gap-3">
        <Table aria-label={t("refunds.table")}>
          <TableHeader>
            <TableRow>
              {columns.map((column) => {
                const direction = sort.key === column.sort ? sort.direction : undefined;
                const SortIcon =
                  direction === "asc"
                    ? ArrowUpIcon
                    : direction === "desc"
                      ? ArrowDownIcon
                      : ChevronsUpDownIcon;
                return (
                  <TableHead
                    key={column.key}
                    aria-sort={
                      direction === "asc"
                        ? "ascending"
                        : direction === "desc"
                          ? "descending"
                          : undefined
                    }
                    className={column.end ? "text-right" : undefined}
                  >
                    {column.sort ? (
                      <Button
                        variant="ghost"
                        onClick={() => setSort(toggleSort(sort, column.sort as RefundSortKey))}
                      >
                        {column.header}
                        <SortIcon data-icon="inline-end" aria-hidden />
                      </Button>
                    ) : (
                      column.header
                    )}
                  </TableHead>
                );
              })}
            </TableRow>
          </TableHeader>
          <TableBody>
            {current.rows.map((row) => (
              <TableRow
                key={row.id}
                className="cursor-pointer"
                onClick={(event) => {
                  // A press on a control inside the row (its menu, a link) does its own thing.
                  if ((event.target as HTMLElement).closest("a, button, [role=menuitem]")) return;
                  router.push(sheetHref(row));
                }}
              >
                {columns.map((column) => (
                  <TableCell key={column.key} className={column.end ? "text-right" : undefined}>
                    {column.cell(row)}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {shown.length === 0 && (
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <InboxIcon aria-hidden />
              </EmptyMedia>
              <EmptyTitle>
                {rows.length === 0 ? t("refunds.empty") : t("refunds.emptyFiltered")}
              </EmptyTitle>
            </EmptyHeader>
          </Empty>
        )}

        {shown.length > 0 && (
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-body-sm text-muted-foreground">
              {t("refunds.summary", {
                from: current.from,
                to: current.to,
                total: shown.length,
              })}
            </p>
            {current.pages > 1 && (
              <Pagination aria-label={shell("pagination.label")} className="mx-0 w-auto">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      text={shell("pagination.previous")}
                      aria-label={shell("pagination.previous")}
                      aria-disabled={current.page === 1 ? true : undefined}
                      onClick={(event) => {
                        event.preventDefault();
                        setPage(Math.max(1, current.page - 1));
                      }}
                    />
                  </PaginationItem>
                  <PaginationItem>
                    <span className="px-2 text-body-sm tabular-nums">
                      {t("pages", { page: current.page, pages: current.pages })}
                    </span>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      text={shell("pagination.next")}
                      aria-label={shell("pagination.next")}
                      aria-disabled={current.page === current.pages ? true : undefined}
                      onClick={(event) => {
                        event.preventDefault();
                        setPage(Math.min(current.pages, current.page + 1));
                      }}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
          </div>
        )}
      </div>

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
