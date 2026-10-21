"use client";

import {
  ArrowDownIcon,
  ArrowUpIcon,
  BanIcon,
  ChevronsUpDownIcon,
  CircleCheckIcon,
  ClockIcon,
  CopyIcon,
  EllipsisIcon,
  PauseIcon,
  PencilIcon,
  SearchIcon,
  TicketPercentIcon,
  Trash2Icon,
  type LucideIcon,
} from "lucide-react";
import { useFormatter, useLocale, useTranslations } from "next-intl";
import { type MouseEvent, useId, useState } from "react";

import type { VariantProps } from "class-variance-authority";

import { Badge, type badgeVariants } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardFooter } from "@/components/ui/card";
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
import { Item, ItemContent, ItemMedia, ItemTitle } from "@/components/ui/item";
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
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "@/components/ui/toast";
import { formatPrice } from "@/features/offers/format";
import { formatDayMonth } from "@/i18n/day-month";
import { Link, useRouter } from "@/i18n/navigation";

import { pageSizes, toggledSort } from "../list-query";
import { useListQuery } from "../use-list-query";
import {
  type CampaignStatus,
  campaignFilters,
  type Discount,
  isFiltered,
  type PromotionList,
  type PromotionQuery,
  promotionDefaults,
  type PromotionSort,
  promotionScopes,
} from "./promotion";
import {
  blankPromotion,
  type PromotionForm,
  promotionFormOf,
  type StoreOption,
} from "./promotion-form";
import { PromotionSheet } from "./promotion-sheet";
import { vietnamDay } from "./schedule";

// Each status on the Badge's own variants (Figma Admin/Badge in AD-MK1): the tick or the clock and the words carry
// the status, never the colour alone.
const statusBadges: Record<
  CampaignStatus,
  { variant: VariantProps<typeof badgeVariants>["variant"]; icon: LucideIcon }
> = {
  running: { variant: "fresh", icon: CircleCheckIcon },
  scheduled: { variant: "secondary", icon: ClockIcon },
  paused: { variant: "outline", icon: ClockIcon },
  ended: { variant: "outline", icon: ClockIcon },
};

const statusCards = [
  { status: "running", icon: CircleCheckIcon },
  { status: "scheduled", icon: ClockIcon },
  { status: "inactive", icon: BanIcon },
] as const;

/**
 * The promotion codes (Figma AD-MK1): "Tạo mã", three cards that filter by status, the filter bar, the table of
 * codes with each one's menu, and the pages. "Tạo mã" and "Sửa" open the sheet (AD-MK2). The list comes in
 * `list`, filtered and sorted by the address (`query`); until the backend exists it is empty.
 */
export function PromotionsView({
  list,
  query,
  stores,
}: {
  list: PromotionList;
  query: PromotionQuery;
  stores: StoreOption[];
}) {
  const t = useTranslations("admin.promotions");
  const tShell = useTranslations("admin.shell");
  const format = useFormatter();
  const locale = useLocale();
  const id = useId();
  const router = useRouter();
  const { hrefWith, go } = useListQuery(query, promotionDefaults);
  const [search, setSearch] = useState(query.q);
  const [sheet, setSheet] = useState<{
    open: boolean;
    key: number;
    editing: boolean;
    form?: PromotionForm;
  }>({ open: false, key: 0, editing: false });

  const openSheet = (form: PromotionForm, editing: boolean) =>
    setSheet((current) => ({ open: true, key: current.key + 1, editing, form }));

  const copy = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      toast.add({ title: t("copied", { code }), type: "success", timeout: 5000 });
    } catch {
      toast.add({ title: t("copyFailed", { code }), type: "error", timeout: 5000 });
    }
  };

  // A run from its first to its last day, "01/10 – 31/10/2026", the year once when both days share it.
  const period = (start: string, end: string) => {
    const from = new Date(start);
    const to = new Date(end);
    const sameYear = vietnamDay(from).slice(0, 4) === vietnamDay(to).slice(0, 4);
    const fromText = sameYear ? formatDayMonth(from, locale) : format.dateTime(from, "day");
    return `${fromText} – ${format.dateTime(to, "day")}`;
  };

  const headers: { key: string; label: string; sort?: PromotionSort; grow?: boolean }[] = [
    { key: "code", label: t("columns.code"), sort: "code" },
    { key: "description", label: t("columns.description"), grow: true },
    { key: "discount", label: t("columns.discount") },
    { key: "uses", label: t("columns.uses") },
    { key: "period", label: t("columns.period"), sort: "period" },
    { key: "stores", label: t("columns.stores") },
    { key: "status", label: t("columns.status") },
    { key: "actions", label: "" },
  ];

  const filters = [
    {
      key: "status",
      label: t("filters.status"),
      value: query.status,
      options: campaignFilters.map((value) => ({
        value,
        label: t(`filters.statuses.${value}`),
      })),
      onChange: (value: string) => go({ status: value as PromotionQuery["status"] }),
    },
    {
      key: "scope",
      label: t("filters.scope"),
      value: query.scope,
      options: promotionScopes.map((value) => ({ value, label: t(`filters.scopes.${value}`) })),
      onChange: (value: string) => go({ scope: value as PromotionQuery["scope"] }),
    },
    {
      key: "size",
      label: t("filters.size"),
      value: String(query.size),
      options: pageSizes.map((size) => ({ value: String(size), label: String(size) })),
      onChange: (value: string) => go({ size: Number(value) as PromotionQuery["size"] }),
    },
  ];

  const counts = list.counts;
  const total = list.total ?? 0;
  const pages = Math.max(1, Math.ceil(total / query.size) || 1);
  const shown = {
    from: total === 0 ? 0 : (query.page - 1) * query.size + 1,
    to: Math.min(total, query.page * query.size),
    total,
  };
  const pageLink = (page: number) => ({
    href: `/${locale}${hrefWith({ page })}`,
    onClick: (event: MouseEvent<HTMLAnchorElement>) => {
      event.preventDefault();
      router.push(hrefWith({ page }), { scroll: false });
    },
  });

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-page-title text-foreground">{t("title")}</h1>
        <Button onClick={() => openSheet(blankPromotion(new Date()), false)}>{t("create")}</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {statusCards.map(({ status, icon: Icon }) => (
          <Item
            key={status}
            variant={query.status === status ? "muted" : "outline"}
            render={
              <Link
                href={hrefWith({ status })}
                aria-current={query.status === status ? "true" : undefined}
              />
            }
          >
            <ItemMedia variant="icon">
              <Icon aria-hidden />
            </ItemMedia>
            <ItemContent>
              <ItemTitle>{t(`cards.${status}`)}</ItemTitle>
              <p className="font-display text-display text-foreground">
                {counts ? counts[status] : "—"}
              </p>
            </ItemContent>
          </Item>
        ))}
      </div>

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
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                go({ q: event.target.value.trim() });
              }}
            />
          </InputGroup>
        </div>
        {filters.map((filter) => (
          <Select
            key={filter.key}
            value={filter.value}
            items={filter.options}
            onValueChange={(next) => {
              if (typeof next === "string") filter.onChange(next);
            }}
          >
            <SelectTrigger aria-labelledby={`${id}-${filter.key}`}>
              <span id={`${id}-${filter.key}`} className="text-muted-foreground">
                {filter.label}:
              </span>
              <span className="text-body-sm-strong text-foreground">
                <SelectValue />
              </span>
            </SelectTrigger>
            <SelectContent alignItemWithTrigger={false} align="start">
              {filter.options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ))}
      </search>

      <Card>
        <Table>
          <TableCaption className="sr-only">{t("title")}</TableCaption>
          <TableHeader>
            <TableRow>
              {headers.map((header) => {
                const direction =
                  header.sort && query.sort === header.sort ? query.dir : ("none" as const);
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
                    className={header.grow ? "w-full" : undefined}
                  >
                    {header.sort ? (
                      <Link
                        href={hrefWith(
                          toggledSort(
                            query,
                            header.sort,
                            header.sort === "period" ? "desc" : "asc",
                          ),
                        )}
                        scroll={false}
                        className={buttonVariants({
                          variant: direction === "none" ? "ghost" : "secondary",
                        })}
                      >
                        {header.label}
                        <SortIcon data-icon="inline-end" aria-hidden />
                      </Link>
                    ) : (
                      header.label
                    )}
                  </TableHead>
                );
              })}
            </TableRow>
          </TableHeader>
          <TableBody>
            {list.items.map((row) => {
              const badge = statusBadges[row.status];
              return (
                <TableRow key={row.id}>
                  <TableCell>
                    <span className="text-body-sm-strong text-foreground">{row.code}</span>
                  </TableCell>
                  <TableCell className="w-full">
                    <span className="block max-w-80 truncate">{row.description}</span>
                  </TableCell>
                  <TableCell>
                    <span className="font-display text-price text-primary">
                      {discountText(row.discount)}
                    </span>
                  </TableCell>
                  <TableCell>{t("uses", { used: row.used, limit: row.limit })}</TableCell>
                  <TableCell>{period(row.startsAt, row.endsAt)}</TableCell>
                  <TableCell>
                    {row.stores.kind === "all"
                      ? t("storesAll")
                      : t("storesSome", { count: row.stores.count })}
                  </TableCell>
                  <TableCell>
                    <Badge variant={badge.variant}>
                      <badge.icon aria-hidden />
                      {t(`status.${row.status}`)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        render={<Button variant="ghost" size="icon" />}
                        aria-label={tShell("rowActions", { name: row.code })}
                      >
                        <EllipsisIcon aria-hidden />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuGroup>
                          <DropdownMenuItem onClick={() => openSheet(promotionFormOf(row), true)}>
                            <PencilIcon aria-hidden />
                            {t("actions.edit")}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => void copy(row.code)}>
                            <CopyIcon aria-hidden />
                            {t("actions.copy")}
                          </DropdownMenuItem>
                          <DropdownMenuItem disabled>
                            <PauseIcon aria-hidden />
                            {t("actions.pause")}
                          </DropdownMenuItem>
                          <DropdownMenuItem variant="destructive" disabled>
                            <Trash2Icon aria-hidden />
                            {t("actions.delete")}
                          </DropdownMenuItem>
                        </DropdownMenuGroup>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        {list.items.length === 0 && (
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <TicketPercentIcon aria-hidden />
              </EmptyMedia>
              <EmptyTitle>
                {isFiltered(query, ["status", "scope"]) ? t("emptyFiltered") : t("empty")}
              </EmptyTitle>
            </EmptyHeader>
          </Empty>
        )}
        {total > 0 && (
          <CardFooter>
            <div className="flex w-full flex-wrap items-center justify-between gap-3">
              <p className="text-body-sm text-muted-foreground">{t("summary", shown)}</p>
              {pages > 1 && (
                <Pagination aria-label={tShell("pagination.label")} className="mx-0 w-auto">
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        text={tShell("pagination.previous")}
                        aria-label={tShell("pagination.previous")}
                        {...(query.page > 1 ? pageLink(query.page - 1) : { "aria-disabled": true })}
                      />
                    </PaginationItem>
                    <PaginationItem>
                      <span className="px-2 text-body-sm text-foreground tabular-nums">
                        {t("pageOf", { page: query.page, pages })}
                      </span>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationNext
                        text={tShell("pagination.next")}
                        aria-label={tShell("pagination.next")}
                        {...(query.page < pages
                          ? pageLink(query.page + 1)
                          : { "aria-disabled": true })}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              )}
            </div>
          </CardFooter>
        )}
      </Card>

      {sheet.form && (
        <PromotionSheet
          key={sheet.key}
          open={sheet.open}
          onOpenChange={(open) => setSheet((current) => ({ ...current, open }))}
          editing={sheet.editing}
          initial={sheet.form}
          stores={stores}
        />
      )}
    </>
  );
}

/** What a code takes off: "20%" or "15.000đ". */
function discountText(discount: Discount): string {
  return discount.kind === "percent" ? `${discount.percent}%` : formatPrice(discount.amountVnd);
}
