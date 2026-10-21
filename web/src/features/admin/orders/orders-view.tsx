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
  SearchIcon,
  StoreIcon,
  XCircleIcon,
} from "lucide-react";
import { useFormatter, useLocale, useTranslations } from "next-intl";
import { type ReactNode, useState } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle, CardAction } from "@/components/ui/card";
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
import { adminHref } from "../pages";
import { CancelOrderDialog } from "./cancel-order-dialog";
import {
  type AdminOrderRow,
  type CancelRequest,
  dayRangeLabel,
  defaultOrderSort,
  filterOrders,
  isOpen,
  type OrderFilters,
  type OrderSortKey,
  type OrderStatusFilter,
  orderStatuses,
  orderStatusLooks,
  type OrderSummary,
  ordersHref,
  pageOf,
  sellersOf,
  type Sort,
  sortOrders,
  toggleSort,
} from "./order";

const PAGE_SIZE = 10;

type Column = {
  key: string;
  header: string;
  cell: (order: AdminOrderRow) => ReactNode;
  sort?: OrderSortKey;
  end?: boolean;
};

/**
 * The orders list (Figma AD-DH1, AD-DH2): three cards that filter by state, the filters, then the table with
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
  const shell = useTranslations("admin.shell");
  const format = useFormatter();
  const locale = useLocale();
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
  const time = (at: string) => format.dateTime(new Date(at), "time");
  const detailHref = (order: AdminOrderRow) => adminHref("orderDetail", { orderId: order.id });

  const cards = [
    {
      key: "collected",
      label: t("cards.collectedToday"),
      value: summary?.collectedToday,
      icon: <CircleCheckIcon aria-hidden className="text-success" />,
    },
    {
      key: "waiting",
      label: t("cards.waiting"),
      value: summary?.waiting,
      icon: <ClockIcon aria-hidden className="text-warning-foreground" />,
    },
    {
      key: "expired",
      label: t("cards.noShow"),
      value: summary?.noShow,
      icon: <BanIcon aria-hidden className="text-destructive" />,
    },
  ] as const;

  const selects = [
    {
      key: "seller",
      label: t("filters.seller"),
      value: filters.sellerId,
      options: [
        { value: "all", label: t("filters.all") },
        ...sellersOf(rows).map((seller) => ({ value: seller.id, label: seller.name })),
      ],
      onChange: (sellerId: string) => change({ sellerId }),
    },
    {
      key: "status",
      label: t("filters.status"),
      value: status as string,
      options: [
        { value: "all", label: t("filters.all") },
        { value: "waiting", label: t("cards.waiting") },
        ...orderStatuses.map((each) => ({ value: each, label: t(`status.${each}`) })),
      ],
      onChange: (next: string) => {
        setPage(1);
        router.replace(ordersHref(list, { status: next as OrderStatusFilter, q: filters.search }), {
          scroll: false,
        });
      },
    },
  ];

  const columns: Column[] = [
    {
      key: "code",
      header: t("columns.code"),
      cell: (order) => (
        <Link
          href={detailHref(order)}
          className="text-body-sm-strong text-foreground hover:underline"
        >
          {t("code", { code: order.code })}
        </Link>
      ),
    },
    {
      key: "customer",
      header: t("columns.customer"),
      cell: (order) => <span className="text-body-sm-strong">{order.customerName}</span>,
    },
    {
      key: "seller",
      header: t("columns.seller"),
      sort: "seller",
      cell: (order) => (
        <span className="flex items-center gap-2.5">
          <Avatar size="seller" aria-hidden>
            {order.sellerPhotoUrl && <AvatarImage src={order.sellerPhotoUrl} alt="" />}
            <AvatarFallback>{order.sellerName.charAt(0)}</AvatarFallback>
          </Avatar>
          <span className="text-body-sm-strong">{order.sellerName}</span>
        </span>
      ),
    },
    {
      key: "items",
      header: t("columns.items"),
      cell: (order) => (
        <span className="block max-w-80 truncate">
          {order.items
            .map((item) => t("item", { name: item.name, quantity: item.quantity }))
            .join(", ")}
        </span>
      ),
    },
    {
      key: "total",
      header: t("columns.total"),
      sort: "total",
      end: true,
      cell: (order) => (
        <span className="text-body-sm-strong tabular-nums">{formatPrice(order.totalVnd)}</span>
      ),
    },
    {
      key: "pickup",
      header: t("columns.pickup"),
      sort: "pickup",
      cell: (order) => t("window", { start: time(order.pickupStart), end: time(order.pickupEnd) }),
    },
    {
      key: "status",
      header: t("columns.status"),
      cell: (order) => {
        const look = orderStatusLooks[order.status];
        return (
          <Badge variant={look.variant}>
            {look.icon && <look.icon aria-hidden />}
            {t(`status.${order.status}`)}
          </Badge>
        );
      },
    },
    {
      key: "actions",
      header: "",
      end: true,
      cell: (order) => (
        <DropdownMenu>
          <DropdownMenuTrigger
            render={<Button variant="ghost" size="icon" />}
            aria-label={shell("rowActions", { name: t("code", { code: order.code }) })}
          >
            <EllipsisIcon aria-hidden />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuGroup>
              <DropdownMenuItem render={<Link href={detailHref(order)} />}>
                <EyeIcon aria-hidden />
                {t("actions.view")}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                render={<Link href={adminHref("sellerDetail", { sellerId: order.sellerId })} />}
              >
                <StoreIcon aria-hidden />
                {t("actions.viewSeller")}
              </DropdownMenuItem>
              {isOpen(order.status) && (
                <DropdownMenuItem variant="destructive" onClick={() => setCancelling(order)}>
                  <XCircleIcon aria-hidden />
                  {t("actions.cancel")}
                </DropdownMenuItem>
              )}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <>
      <nav aria-label={t("cards.label")} className="grid gap-4 md:grid-cols-3">
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
                  <span className="font-display text-display">{card.value ?? t("cards.none")}</span>
                  {status === card.key && <Badge variant="secondary">{t("cards.filtering")}</Badge>}
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
              aria-label={t("filters.search")}
              placeholder={t("filters.searchPlaceholder")}
              value={filters.search}
              onChange={(event) => {
                change({ search: event.target.value });
                router.replace(ordersHref(list, { status, q: event.target.value }), {
                  scroll: false,
                });
              }}
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
            <SelectTrigger aria-labelledby={`orders-${select.key}`}>
              <span id={`orders-${select.key}`} className="text-muted-foreground">
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
        <Table aria-label={t("table")}>
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
                        onClick={() => setSort(toggleSort(sort, column.sort as OrderSortKey))}
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
            {current.rows.map((order) => (
              <TableRow
                key={order.id}
                className="cursor-pointer"
                onClick={(event) => {
                  // A press on a control inside the row (its menu, a link) does its own thing.
                  if ((event.target as HTMLElement).closest("a, button, [role=menuitem]")) return;
                  router.push(detailHref(order));
                }}
              >
                {columns.map((column) => (
                  <TableCell key={column.key} className={column.end ? "text-right" : undefined}>
                    {column.cell(order)}
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
              <EmptyTitle>{rows.length === 0 ? t("empty") : t("emptyFiltered")}</EmptyTitle>
            </EmptyHeader>
          </Empty>
        )}

        {shown.length > 0 && (
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-body-sm text-muted-foreground">
              {t("summary", { from: current.from, to: current.to, total: shown.length })}
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
