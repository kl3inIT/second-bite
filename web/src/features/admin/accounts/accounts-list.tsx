"use client";

import { enUS, vi } from "date-fns/locale";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  BanIcon,
  CalendarIcon,
  ChevronDownIcon,
  ChevronsUpDownIcon,
  EllipsisIcon,
  EyeIcon,
  RotateCcwIcon,
  SearchIcon,
  UsersIcon,
} from "lucide-react";
import { useFormatter, useLocale, useTranslations } from "next-intl";
import { type MouseEvent, useEffect, useId, useState } from "react";
import type { DateRange } from "react-day-picker";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { initials } from "@/features/offers/seller";
import { formatDayMonth } from "@/i18n/day-month";
import { Link, useRouter } from "@/i18n/navigation";

import { fromDay, toDay } from "../offers/offer";
import { adminHref } from "../pages";
import {
  type AccountQuery,
  type AccountSortKey,
  type AccountTab,
  type AdminAccountRow,
  accountStatuses,
  accountTabs,
  accountsHref,
  roleLook,
  sellersLabel,
  statusLook,
  toggleSort,
} from "./account";
import { LockAccountDialog } from "./lock-account-dialog";
import { pageSizes } from "../list-query";

/** Moves the list to a new state through its address, back on the first page. */
function useAccountFilters(query: AccountQuery) {
  const router = useRouter();
  return (patch: Partial<AccountQuery>) =>
    router.replace(accountsHref({ ...query, page: 1, ...patch }), { scroll: false });
}

/**
 * The accounts (Figma AD-TK1): the tabs Tất cả, Khách, Chủ cửa hàng/Nhân viên, Quản trị with their counts, the
 * filters, then one row per account with its role, stores, orders, day created and status, the newest first. A
 * row opens the account; its menu locks it after a question (AD-TK3). Its state lives in the address.
 */
export function AccountsList({
  query,
  rows,
  total,
  counts,
}: {
  query: AccountQuery;
  rows: AdminAccountRow[];
  total: number;
  counts?: Record<AccountTab, number>;
}) {
  const t = useTranslations("admin.accounts");
  const shell = useTranslations("admin.shell");
  const format = useFormatter();
  const locale = useLocale();
  const router = useRouter();
  const setFilters = useAccountFilters(query);
  const [search, setSearch] = useState(query.q);
  const [locking, setLocking] = useState<AdminAccountRow>();
  const id = useId();

  // The search follows the typing once it pauses, so each key does not reload the list.
  useEffect(() => {
    if (search.trim() === query.q) return;
    const timer = setTimeout(() => setFilters({ q: search.trim() }), 300);
    return () => clearTimeout(timer);
  }, [search, query.q, setFilters]);

  const statusOptions = [
    { value: "", label: t("filters.all") },
    ...accountStatuses.map((status) => ({ value: status, label: t(`status.${status}`) })),
  ];
  const sizeOptions = pageSizes.map((size) => ({ value: String(size), label: String(size) }));
  const detail = (account: AdminAccountRow) =>
    adminHref("accountDetail", { accountId: account.id });

  // The created range as Figma writes it, "21/09 – 20/10/2026", each end on its own: Intl's own range drops the
  // two-digit month in Vietnamese. The start loses its year when both ends share one.
  const from = fromDay(query.from);
  const to = fromDay(query.to);
  const created =
    from && to
      ? `${
          from.getFullYear() === to.getFullYear()
            ? formatDayMonth(from, locale)
            : format.dateTime(from, "day")
        } – ${format.dateTime(to, "day")}`
      : from
        ? format.dateTime(from, "day")
        : shell("dateRange.any");

  const columns: { key: string; header: string; sort?: AccountSortKey }[] = [
    { key: "name", header: t("columns.name"), sort: "name" },
    { key: "role", header: t("columns.role") },
    { key: "sellers", header: t("columns.sellers") },
    { key: "orders", header: t("columns.orders"), sort: "orders" },
    { key: "createdAt", header: t("columns.createdAt"), sort: "createdAt" },
    { key: "status", header: t("columns.status") },
  ];

  // A page of the list is a link in the page's language that moves without reloading the page.
  const pages = Math.max(1, Math.ceil((total || 0) / query.size) || 1);
  const pageLink = (page: number) => {
    const href = accountsHref({ ...query, page });
    return {
      href: `/${locale}${href}`,
      onClick: (event: MouseEvent<HTMLAnchorElement>) => {
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
        event.preventDefault();
        router.push(href, { scroll: false });
      },
    };
  };
  const paging = (key: "label" | "previous" | "next") => shell(`pagination.${key}`);

  return (
    <>
      <h1 className="text-page-title text-foreground">{shell("pages.accounts.label")}</h1>
      <Tabs
        value={query.tab}
        onValueChange={(tab) => {
          if (tab !== query.tab)
            router.push(accountsHref({ ...query, tab, page: 1 }), { scroll: false });
        }}
      >
        <TabsList variant="line" aria-label={t("tabs.label")}>
          {accountTabs.map((tab) => (
            <TabsTrigger key={tab} value={tab}>
              {t(`tabs.${tab}`)}
              {counts && <Badge variant="secondary">{counts[tab]}</Badge>}
            </TabsTrigger>
          ))}
        </TabsList>
        <TabsContent value={query.tab}>
          <div className="flex flex-col gap-4">
            <search className="flex flex-wrap items-center gap-3">
              <InputGroup className="min-w-60 flex-1">
                <InputGroupAddon>
                  <SearchIcon aria-hidden />
                </InputGroupAddon>
                <InputGroupInput
                  type="search"
                  aria-label={t("filters.search")}
                  placeholder={t("filters.searchPlaceholder")}
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                />
              </InputGroup>
              {/* A combobox takes no name from what it holds, so each select is named by its label. */}
              <Select
                value={query.status ?? ""}
                items={statusOptions}
                onValueChange={(status) =>
                  setFilters({ status: status ? (status as AccountQuery["status"]) : undefined })
                }
              >
                <SelectTrigger aria-labelledby={`${id}-status`}>
                  <span id={`${id}-status`} className="text-muted-foreground">
                    {t("filters.status")}:
                  </span>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent alignItemWithTrigger={false} align="start">
                  {statusOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Popover>
                <PopoverTrigger render={<Button variant="outline" />}>
                  <CalendarIcon data-icon="inline-start" aria-hidden />
                  {t("filters.created")}: {created}
                  <ChevronDownIcon data-icon="inline-end" aria-hidden />
                </PopoverTrigger>
                <PopoverContent align="start" className="w-auto">
                  <Calendar
                    mode="range"
                    locale={locale === "vi" ? vi : enUS}
                    numberOfMonths={2}
                    selected={{ from, to } as DateRange}
                    onSelect={(range) =>
                      setFilters({
                        from: range?.from && toDay(range.from),
                        to: range?.to && toDay(range.to),
                      })
                    }
                  />
                  <div className="flex justify-end">
                    <Button
                      variant="ghost"
                      onClick={() => setFilters({ from: undefined, to: undefined })}
                    >
                      {shell("dateRange.clear")}
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
              <Select
                value={String(query.size)}
                items={sizeOptions}
                onValueChange={(size) => setFilters({ size: Number(size) as AccountQuery["size"] })}
              >
                <SelectTrigger aria-labelledby={`${id}-size`}>
                  <span id={`${id}-size`} className="text-muted-foreground">
                    {t("filters.size")}:
                  </span>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent alignItemWithTrigger={false} align="start">
                  {sizeOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </search>
            <Card>
              <CardContent>
                <Table>
                  <caption className="sr-only">{shell("pages.accounts.label")}</caption>
                  <TableHeader>
                    <TableRow>
                      {columns.map((column) => {
                        if (!column.sort)
                          return <TableHead key={column.key}>{column.header}</TableHead>;
                        const direction = query.sort === column.sort ? query.direction : undefined;
                        const SortIcon =
                          direction === "asc"
                            ? ArrowUpIcon
                            : direction === "desc"
                              ? ArrowDownIcon
                              : ChevronsUpDownIcon;
                        return (
                          <TableHead
                            key={column.key}
                            className={column.key === "name" ? "w-full" : undefined}
                            aria-sort={
                              direction === "asc"
                                ? "ascending"
                                : direction === "desc"
                                  ? "descending"
                                  : undefined
                            }
                          >
                            <Link
                              href={accountsHref(toggleSort(query, column.sort))}
                              scroll={false}
                              className={buttonVariants({ variant: "link", size: "inline" })}
                            >
                              {column.header}
                              <SortIcon data-icon="inline-end" aria-hidden />
                            </Link>
                          </TableHead>
                        );
                      })}
                      <TableHead className="text-right">{t("columns.actions")}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rows.map((account) => {
                      const status = statusLook(account.status);
                      const createdAt = new Date(account.createdAt);
                      return (
                        <TableRow
                          key={account.id}
                          onClick={(event) => {
                            // A press on a control inside the row (its menu, a link) does its own thing.
                            if ((event.target as HTMLElement).closest("a, button, [role=menuitem]"))
                              return;
                            router.push(detail(account));
                          }}
                        >
                          <TableCell className="w-full">
                            <span className="flex min-w-48 items-center gap-2.5">
                              <Avatar aria-hidden>
                                <AvatarFallback>{initials(account.name)}</AvatarFallback>
                              </Avatar>
                              <Link
                                href={detail(account)}
                                className={buttonVariants({ variant: "link", size: "inline" })}
                              >
                                {account.name}
                              </Link>
                            </span>
                          </TableCell>
                          <TableCell>
                            <Badge variant={roleLook(account.role)}>
                              {t(`role.${account.role}`)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <span className="block max-w-80 truncate">
                              {sellersLabel(account.sellers) ?? "—"}
                            </span>
                          </TableCell>
                          <TableCell>{account.orders}</TableCell>
                          <TableCell>
                            <time
                              dateTime={createdAt.toISOString()}
                              className="text-muted-foreground"
                            >
                              {format.dateTime(createdAt, "day")}
                            </time>
                          </TableCell>
                          <TableCell>
                            <Badge variant={status.variant}>
                              <status.icon aria-hidden />
                              {t(`status.${account.status}`)}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger
                                render={<Button variant="ghost" size="icon" />}
                                aria-label={shell("rowActions", { name: account.name })}
                              >
                                <EllipsisIcon aria-hidden />
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuGroup>
                                  <DropdownMenuItem render={<Link href={detail(account)} />}>
                                    <EyeIcon aria-hidden />
                                    {t("view")}
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  {account.status === "locked" ? (
                                    <DropdownMenuItem disabled>
                                      <RotateCcwIcon aria-hidden />
                                      {t("unlock")}
                                    </DropdownMenuItem>
                                  ) : (
                                    <DropdownMenuItem
                                      variant="destructive"
                                      onClick={() => setLocking(account)}
                                    >
                                      <BanIcon aria-hidden />
                                      {t("lockMenu")}
                                    </DropdownMenuItem>
                                  )}
                                </DropdownMenuGroup>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
                {rows.length === 0 && (
                  <Empty>
                    <EmptyHeader>
                      <EmptyMedia variant="icon">
                        <UsersIcon aria-hidden />
                      </EmptyMedia>
                      <EmptyTitle>{t(`empty.${query.tab}`)}</EmptyTitle>
                    </EmptyHeader>
                  </Empty>
                )}
              </CardContent>
              {total > 0 && (
                <CardFooter>
                  <div className="flex w-full flex-wrap items-center justify-between gap-3">
                    <p className="text-body-sm text-muted-foreground">
                      {t("summary", {
                        from: (query.page - 1) * query.size + 1,
                        to: Math.min(total, query.page * query.size),
                        total,
                      })}
                    </p>
                    {pages > 1 && (
                      <Pagination aria-label={paging("label")} className="w-auto">
                        <PaginationContent>
                          {query.page > 1 && (
                            <PaginationItem>
                              <PaginationPrevious
                                text={paging("previous")}
                                aria-label={paging("previous")}
                                {...pageLink(query.page - 1)}
                              />
                            </PaginationItem>
                          )}
                          <PaginationItem>
                            <span className="px-2 text-body-sm text-muted-foreground tabular-nums">
                              {t("pageOf", { page: query.page, pages })}
                            </span>
                          </PaginationItem>
                          {query.page < pages && (
                            <PaginationItem>
                              <PaginationNext
                                text={paging("next")}
                                aria-label={paging("next")}
                                {...pageLink(query.page + 1)}
                              />
                            </PaginationItem>
                          )}
                        </PaginationContent>
                      </Pagination>
                    )}
                  </div>
                </CardFooter>
              )}
            </Card>
          </div>
        </TabsContent>
      </Tabs>
      <LockAccountDialog
        name={locking?.name ?? ""}
        heldOrders={[]}
        open={locking !== undefined}
        onOpenChange={(open) => {
          if (!open) setLocking(undefined);
        }}
      />
    </>
  );
}
