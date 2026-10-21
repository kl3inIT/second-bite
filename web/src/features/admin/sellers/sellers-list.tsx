"use client";

import { EllipsisIcon, EyeIcon, InboxIcon, SearchIcon, StoreIcon } from "lucide-react";
import { useFormatter, useLocale, useTranslations } from "next-intl";
import { type MouseEvent, useEffect, useId, useState } from "react";
import { Line, LineChart } from "recharts";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardFooter } from "@/components/ui/card";
import { type ChartConfig, ChartContainer } from "@/components/ui/chart";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Empty, EmptyContent, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Item, ItemActions, ItemContent, ItemMedia, ItemTitle } from "@/components/ui/item";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
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
import { isFeatureOn } from "@/features/admin/features";
import { dayToDate } from "@/features/admin/overview/days";
import { adminHref } from "@/features/admin/pages";
import { Link, useRouter } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

import { pageSizes } from "../list-query";
import { useSellerActions } from "./seller-actions";
import {
  type AdminSeller,
  type BadgeTone,
  isFiltered,
  type ListQuery,
  listQueryString,
  listStatuses,
  pageCount,
  sellerStatusLook,
  toneBadge,
} from "./seller-list";
import { sellerPhoto } from "./seller-photo";
import type { SellerCounts } from "./sellers-source";
import { statusHref, useListQuery } from "./use-list-query";

// Each card's trend in its tone's ink, from the shared tokens.
const trendInk: Record<BadgeTone, string> = {
  success: "var(--color-success)",
  warning: "var(--color-warning-foreground)",
  error: "var(--color-destructive)",
  info: "var(--color-primary)",
  neutral: "var(--color-muted-foreground)",
};

/**
 * The stores list (Figma AD-Q1, AD-Q2, AD-Q5 to AD-Q11, AD-TT1, AD-TT2): the status cards, which filter the list
 * in place of tabs, the search, the table with its row menu, and the numbered pages. `rows` are the page of
 * stores `GET /admin/sellers` gave for the address's status, search and page, in the backend's order, and `total`
 * how many match. Each card draws its status over the last 14 days (`counts.trend`), which the backend rebuilds
 * from each store's last change of status (design.md › Sellers per day).
 *
 * With the `storeReview` flag (`review`, SEC-64) the list opens on the pending queue, a fourth card counts the
 * rejected stores, and a pending store's menu offers "Từ chối…" (AD-DS1).
 */
export function SellersList({
  query,
  rows,
  total,
  counts,
  review = isFeatureOn("storeReview"),
}: {
  query: ListQuery;
  rows: AdminSeller[];
  total: number | undefined;
  counts: SellerCounts;
  review?: boolean;
}) {
  const t = useTranslations("admin.sellers");
  const shell = useTranslations("admin.shell");
  const format = useFormatter();
  const locale = useLocale();
  const router = useRouter();
  const update = useListQuery(query, review);
  const actions = useSellerActions({ review });
  const [search, setSearch] = useState(query.q);
  const sizeLabel = useId();
  const base = adminHref("sellers");
  // A missing total (the backend sent none) reads as an empty list, never as NaN.
  const rowCount = Number.isFinite(total) ? (total as number) : 0;
  const pages = pageCount(total, query.size);
  const from = rowCount === 0 ? 0 : (query.page - 1) * query.size + 1;
  const to = Math.min(rowCount, query.page * query.size);
  const sizes = pageSizes.map((size) => ({ value: String(size), label: String(size) }));

  // The search follows the typing once it pauses, so each key does not reload the list.
  useEffect(() => {
    if (search.trim() === query.q) return;
    const timer = setTimeout(() => update({ q: search.trim() }), 300);
    return () => clearTimeout(timer);
  }, [search, query.q, update]);

  // A page's address, in the page's language, for the pagination's links; pressing one turns the page in place.
  const pageHref = (page: number) => {
    const searchString = listQueryString({ ...query, page }, review);
    return `/${locale}${base}${searchString ? `?${searchString}` : ""}`;
  };
  const turn = (page: number) => (event: MouseEvent) => {
    event.preventDefault();
    update({ page });
  };

  return (
    <>
      <ul className={cn("grid gap-4", review ? "sm:grid-cols-2 xl:grid-cols-4" : "md:grid-cols-3")}>
        {listStatuses(review).map((each) => {
          const { tone, icon: Icon } = sellerStatusLook[each];
          const selected = query.status === each;
          const config = { count: { label: shell(`status.${each}`), color: trendInk[tone] } };
          return (
            <li key={each}>
              <Item
                variant={selected ? "muted" : "outline"}
                render={
                  <Link
                    href={statusHref(query, each, base, review)}
                    aria-current={selected ? "true" : undefined}
                  />
                }
              >
                <ItemMedia variant="icon">
                  <Icon aria-hidden />
                </ItemMedia>
                <ItemContent className="min-w-0">
                  <ItemTitle>{shell(`status.${each}`)}</ItemTitle>
                  <span className="font-display text-display text-foreground">{counts[each]}</span>
                </ItemContent>
                {counts.trend && counts.trend.length > 1 && (
                  <ItemActions>
                    {/* The 14 days for a screen reader; the line itself is drawn for the eye. */}
                    <span className="sr-only">
                      {counts.trend
                        .map(
                          (day) => `${format.dateTime(dayToDate(day.date), "day")}: ${day[each]}`,
                        )
                        .join(", ")}
                    </span>
                    <span aria-hidden>
                      <ChartContainer
                        config={config satisfies ChartConfig}
                        className="aspect-auto h-9 w-27"
                      >
                        <LineChart
                          accessibilityLayer={false}
                          data={counts.trend.map((day) => ({ count: day[each] }))}
                          margin={{ top: 4, right: 4, bottom: 4, left: 4 }}
                        >
                          <Line
                            dataKey="count"
                            type="linear"
                            stroke="var(--color-count)"
                            strokeWidth={2}
                            dot={false}
                            isAnimationActive={false}
                          />
                        </LineChart>
                      </ChartContainer>
                    </span>
                  </ItemActions>
                )}
              </Item>
            </li>
          );
        })}
      </ul>

      <search className="flex flex-wrap items-center gap-3">
        <div className="min-w-60 flex-1">
          <InputGroup>
            <InputGroupAddon>
              <SearchIcon aria-hidden />
            </InputGroupAddon>
            <InputGroupInput
              type="search"
              aria-label={t("search.label")}
              placeholder={t("search.placeholder")}
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </InputGroup>
        </div>
        <Select
          value={String(query.size)}
          items={sizes}
          onValueChange={(size) => {
            if (typeof size === "string") update({ size: Number(size) as ListQuery["size"] });
          }}
        >
          {/* A combobox takes no name from what it holds, so its label names it. */}
          <SelectTrigger aria-labelledby={sizeLabel}>
            <span id={sizeLabel} className="text-muted-foreground">
              {t("filters.size")}:
            </span>
            <SelectValue />
          </SelectTrigger>
          <SelectContent alignItemWithTrigger={false} align="start">
            {sizes.map((size) => (
              <SelectItem key={size.value} value={size.value}>
                {size.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </search>

      {rowCount === 0 ? (
        <Empty surface="card">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <InboxIcon aria-hidden />
            </EmptyMedia>
            <EmptyTitle>
              {isFiltered(query) ? t("empty.filtered") : t(`empty.${query.status}`)}
            </EmptyTitle>
          </EmptyHeader>
          {isFiltered(query) && (
            <EmptyContent>
              <Button
                variant="link"
                onClick={() => {
                  setSearch("");
                  update({ q: "" });
                }}
              >
                {t("empty.clear")}
              </Button>
            </EmptyContent>
          )}
        </Empty>
      ) : (
        <Card>
          <Table>
            <caption className="sr-only">
              {t("caption", { status: shell(`status.${query.status}`) })}
            </caption>
            <TableHeader>
              <TableRow>
                <TableHead>{t("columns.name")}</TableHead>
                <TableHead className="w-full">{t("columns.address")}</TableHead>
                <TableHead>{t("columns.phone")}</TableHead>
                <TableHead>{t("columns.status")}</TableHead>
                <TableHead>{t("columns.updatedAt")}</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((seller) => {
                const href = adminHref("sellerDetail", { sellerId: seller.id });
                const photo = sellerPhoto(seller, 400);
                const { tone, icon: StatusIcon } = sellerStatusLook[seller.status];
                const updated = new Date(seller.updatedAt);
                return (
                  <TableRow
                    key={seller.id}
                    // A press anywhere on the row opens the store, as in Figma; a control in it does its own thing.
                    onClick={(event) => {
                      if ((event.target as HTMLElement).closest("a, button, [role=menuitem]"))
                        return;
                      router.push(href);
                    }}
                  >
                    <TableCell>
                      <span className="flex min-w-56 items-center gap-2.5">
                        <Avatar size="lg" aria-hidden>
                          {photo && <AvatarImage src={photo} alt="" />}
                          <AvatarFallback>
                            <StoreIcon aria-hidden />
                          </AvatarFallback>
                        </Avatar>
                        <Link
                          href={href}
                          className="block max-w-80 truncate text-body-sm-strong text-foreground hover:underline"
                        >
                          {seller.name}
                        </Link>
                      </span>
                    </TableCell>
                    <TableCell className="w-full">
                      <span className="block max-w-80 truncate">{seller.address}</span>
                    </TableCell>
                    <TableCell>{seller.phone}</TableCell>
                    <TableCell>
                      <Badge variant={toneBadge[tone]}>
                        <StatusIcon aria-hidden />
                        {shell(`status.${seller.status}`)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <time dateTime={updated.toISOString()} className="text-muted-foreground">
                        {format.dateTime(updated, "day")}
                      </time>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger
                          render={
                            <Button
                              variant="ghost"
                              size="icon"
                              aria-label={shell("rowActions", { name: seller.name })}
                            />
                          }
                        >
                          <EllipsisIcon aria-hidden />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuGroup>
                            <DropdownMenuItem render={<Link href={href} />}>
                              <EyeIcon aria-hidden />
                              {t("actions.view")}
                            </DropdownMenuItem>
                          </DropdownMenuGroup>
                          <DropdownMenuSeparator />
                          <DropdownMenuGroup>
                            {actions.actionsFor(seller).map((action) => {
                              const Icon = action.icon;
                              return (
                                <DropdownMenuItem
                                  key={action.kind}
                                  variant={action.destructive ? "destructive" : "default"}
                                  disabled={actions.locked}
                                  onClick={() => actions.act(seller, action.kind)}
                                >
                                  <Icon aria-hidden />
                                  {action.menuLabel}
                                </DropdownMenuItem>
                              );
                            })}
                          </DropdownMenuGroup>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          <CardFooter>
            <div className="flex w-full flex-wrap items-center justify-between gap-3">
              <p className="text-body-sm text-muted-foreground">
                {t("summary", { from, to, total: rowCount })}
              </p>
              {pages > 1 && (
                <Pagination aria-label={shell("pagination.label")} className="mx-0 w-auto">
                  <PaginationContent>
                    {query.page > 1 && (
                      <PaginationItem>
                        <PaginationPrevious
                          href={pageHref(query.page - 1)}
                          aria-label={shell("pagination.previous")}
                          text={shell("pagination.previous")}
                          onClick={turn(query.page - 1)}
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
                          href={pageHref(query.page + 1)}
                          aria-label={shell("pagination.next")}
                          text={shell("pagination.next")}
                          onClick={turn(query.page + 1)}
                        />
                      </PaginationItem>
                    )}
                  </PaginationContent>
                </Pagination>
              )}
            </div>
          </CardFooter>
        </Card>
      )}
      {actions.dialog}
    </>
  );
}
