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
  type AdminTransaction,
  type AdminTransactionRow,
  dayRangeLabel,
  filterTransactions,
  methodLooks,
  paymentMethods,
  sortTransactions,
  type TransactionFilters,
  type TransactionSortKey,
  type TransactionStatus,
  transactionStatuses,
  transactionStatusLooks,
  type TransactionSummary,
} from "./payment";
import { TransactionSheet } from "./transaction-sheet";
import { useWhen } from "./use-when";

const PAGE_SIZE = 10;

type Column = {
  key: string;
  header: string;
  cell: (row: AdminTransactionRow) => ReactNode;
  sort?: TransactionSortKey;
  end?: boolean;
};

/**
 * The Giao dịch tab (Figma AD-HT1, AD-HT2): three cards that filter by state (`?status=mismatch`), the filters,
 * the table, and the transaction named by the address (`?transaction=`) in the side sheet. A row opens it.
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
  const shell = useTranslations("admin.shell");
  const format = useFormatter();
  const locale = useLocale();
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

  const cards = [
    {
      key: "confirmed",
      value: summary?.confirmed,
      icon: <CircleCheckIcon aria-hidden className="text-success" />,
    },
    {
      key: "awaitingSepay",
      value: summary?.awaitingSepay,
      icon: <ClockIcon aria-hidden className="text-warning-foreground" />,
    },
    {
      key: "mismatch",
      value: summary?.mismatch,
      icon: <BanIcon aria-hidden className="text-destructive" />,
    },
  ] as const;

  const selects = [
    {
      key: "method",
      label: t("filters.method"),
      value: filters.method as string,
      options: [
        { value: "all", label: t("filters.all") },
        ...paymentMethods.map((each) => ({ value: each, label: t(`method.${each}`) })),
      ],
      onChange: (method: string) => change({ method: method as TransactionFilters["method"] }),
    },
    {
      key: "status",
      label: t("filters.status"),
      value: status as string,
      options: [
        { value: "all", label: t("filters.all") },
        ...transactionStatuses.map((each) => ({
          value: each,
          label: t(`transactions.status.${each}`),
        })),
      ],
      onChange: (next: string) => {
        setPage(1);
        router.replace(statusHref(next as TransactionStatus | "all"), { scroll: false });
      },
    },
  ];

  const columns: Column[] = [
    {
      key: "code",
      header: t("transactions.columns.code"),
      cell: (row) => (
        <Link href={sheetHref(row)} className="text-body-sm-strong text-foreground hover:underline">
          {row.code}
        </Link>
      ),
    },
    {
      key: "order",
      header: t("transactions.columns.order"),
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
      header: t("transactions.columns.seller"),
      sort: "seller",
      cell: (row) => row.sellerName,
    },
    {
      key: "customer",
      header: t("transactions.columns.customer"),
      cell: (row) => row.customerName,
    },
    {
      key: "amount",
      header: t("transactions.columns.amount"),
      sort: "amount",
      cell: (row) => (
        <span className="text-body-sm-strong tabular-nums">{formatPrice(row.amountVnd)}</span>
      ),
    },
    {
      key: "method",
      header: t("transactions.columns.method"),
      cell: (row) => (
        <Badge variant={methodLooks[row.method].variant}>{t(`method.${row.method}`)}</Badge>
      ),
    },
    {
      key: "status",
      header: t("transactions.columns.status"),
      cell: (row) => {
        const look = transactionStatusLooks[row.status];
        return (
          <Badge variant={look.variant}>
            {look.icon && <look.icon aria-hidden />}
            {t(`transactions.status.${row.status}`)}
          </Badge>
        );
      },
    },
    {
      key: "at",
      header: t("transactions.columns.at"),
      sort: "at",
      cell: (row) => (
        <time dateTime={row.at} className="text-muted-foreground">
          {when(row.at)}
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
      <nav aria-label={t("transactions.cards")} className="grid gap-4 md:grid-cols-3">
        {cards.map((card) => (
          <Link
            key={card.key}
            href={statusHref(card.key)}
            aria-current={status === card.key ? "true" : undefined}
            className="rounded-2xl focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
          >
            <Card>
              <CardHeader>
                <CardTitle>{t(`transactions.status.${card.key}`)}</CardTitle>
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
              aria-label={t("transactions.search")}
              placeholder={t("transactions.searchPlaceholder")}
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
            <SelectTrigger aria-labelledby={`transactions-${select.key}`}>
              <span id={`transactions-${select.key}`} className="text-muted-foreground">
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
        <Table aria-label={t("transactions.table")}>
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
                        onClick={() => setSort(toggleSort(sort, column.sort as TransactionSortKey))}
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
                {rows.length === 0 ? t("transactions.empty") : t("transactions.emptyFiltered")}
              </EmptyTitle>
            </EmptyHeader>
          </Empty>
        )}

        {shown.length > 0 && (
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-body-sm text-muted-foreground">
              {t("transactions.summary", {
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
