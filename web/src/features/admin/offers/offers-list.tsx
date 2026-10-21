"use client";

import { enUS, vi } from "date-fns/locale";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  BanIcon,
  CalendarIcon,
  CheckIcon,
  ChevronDownIcon,
  ChevronsUpDownIcon,
  EllipsisIcon,
  EyeIcon,
  PackageIcon,
  SearchIcon,
} from "lucide-react";
import Image from "next/image";
import { useFormatter, useLocale, useTranslations } from "next-intl";
import { type MouseEvent, useEffect, useId, useState } from "react";
import type { DateRange } from "react-day-picker";

import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { formatPrice } from "@/features/offers/format";
import { formatDayMonth } from "@/i18n/day-month";
import { Link, useRouter } from "@/i18n/navigation";

import {
  type AdminOfferRow,
  canRemove,
  cardLook,
  fromDay,
  type OfferQuery,
  type OfferSeller,
  type OfferSortKey,
  type OfferStatus,
  offerKinds,
  offerStatuses,
  offersHref,
  pageSize,
  statusLook,
  toDay,
  toggleSort,
} from "./offer";
import { OfferSheet } from "./offer-sheet";
import { RemoveOfferDialog } from "./remove-offer-dialog";

/** Moves the list to a new state through its address, back on the first page with no post open. */
function useOfferFilters(query: OfferQuery) {
  const router = useRouter();
  return (patch: Partial<OfferQuery>) =>
    router.replace(offersHref({ ...query, page: 1, offer: undefined, ...patch }), {
      scroll: false,
    });
}

/**
 * Every post in the system (Figma AD-BD1, AD-BD4): a card per status, "Đã gỡ" the store's own withdrawal and "Gỡ
 * do vi phạm" an admin's removal, each a filter; the filters; then one row per post with its dish, store, price,
 * what is left, window and status. A row opens the post in the side panel (AD-BD2), from where, or from its menu,
 * it can be taken down (AD-BD3). Its state, the open post included, lives in the address.
 */
export function OffersList({
  query,
  rows,
  total,
  counts,
  sellers,
}: {
  query: OfferQuery;
  rows: AdminOfferRow[];
  total: number;
  counts?: Record<OfferStatus, number>;
  sellers: OfferSeller[];
}) {
  const t = useTranslations("admin.offers");
  const shell = useTranslations("admin.shell");
  const kinds = useTranslations("OfferKind");
  const format = useFormatter();
  const locale = useLocale();
  const router = useRouter();
  const setFilters = useOfferFilters(query);
  const [search, setSearch] = useState(query.q);
  const [removing, setRemoving] = useState(false);
  const id = useId();
  const open = rows.find((row) => row.id === query.offer);

  // The search follows the typing once it pauses, so each key does not reload the list.
  useEffect(() => {
    if (search.trim() === query.q) return;
    const timer = setTimeout(() => setFilters({ q: search.trim() }), 300);
    return () => clearTimeout(timer);
  }, [search, query.q, setFilters]);

  const all = { value: "", label: t("filters.all") };
  const sellerOptions = [
    all,
    ...sellers.map((seller) => ({ value: seller.id, label: seller.name })),
  ];
  const kindOptions = [all, ...offerKinds.map((kind) => ({ value: kind, label: kinds(kind) }))];
  const sheetHref = (offer: AdminOfferRow) => offersHref({ ...query, offer: offer.id });

  // The posted range as Figma writes it, "21/09 – 20/10/2026", each end on its own: Intl's own range drops the
  // two-digit month in Vietnamese. The start loses its year when both ends share one.
  const from = fromDay(query.from);
  const to = fromDay(query.to);
  const posted =
    from && to
      ? `${
          from.getFullYear() === to.getFullYear()
            ? formatDayMonth(from, locale)
            : format.dateTime(from, "day")
        } – ${format.dateTime(to, "day")}`
      : from
        ? format.dateTime(from, "day")
        : shell("dateRange.any");

  const columns: { key: string; header: string; sort?: OfferSortKey }[] = [
    { key: "name", header: t("columns.name"), sort: "name" },
    { key: "seller", header: t("columns.seller"), sort: "seller" },
    { key: "price", header: t("columns.price"), sort: "price" },
    { key: "left", header: t("columns.left") },
    { key: "window", header: t("columns.window"), sort: "window" },
    { key: "status", header: t("columns.status") },
  ];

  // A page of the list is a link in the page's language that moves without reloading the page.
  const pages = Math.max(1, Math.ceil((total || 0) / pageSize) || 1);
  const pageLink = (page: number) => {
    const href = offersHref({ ...query, page, offer: undefined });
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
      <h1 className="text-page-title text-foreground">{shell("pages.offers.label")}</h1>
      <nav aria-label={t("cards")}>
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {offerStatuses.map((status) => {
            const look = cardLook(status);
            const selected = query.status === status;
            return (
              <li key={status}>
                {/* Each card is a filter: pressing it lists that status, pressing it again lists them all. */}
                <Link
                  href={offersHref({
                    ...query,
                    status: selected ? undefined : status,
                    page: 1,
                    offer: undefined,
                  })}
                  aria-current={selected ? "true" : undefined}
                  className="block"
                >
                  <Card size="sm">
                    <CardHeader>
                      <CardDescription>{t(`status.${status}`)}</CardDescription>
                      <CardTitle>
                        <span className="font-display text-display">{counts?.[status] ?? "—"}</span>
                      </CardTitle>
                      <CardAction>
                        {selected ? (
                          <Badge>
                            <CheckIcon aria-hidden />
                          </Badge>
                        ) : (
                          <Badge variant={look.variant}>
                            <look.icon aria-hidden />
                          </Badge>
                        )}
                      </CardAction>
                    </CardHeader>
                  </Card>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
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
          value={query.seller ?? ""}
          items={sellerOptions}
          onValueChange={(seller) => setFilters({ seller: seller || undefined })}
        >
          <SelectTrigger aria-labelledby={`${id}-seller`}>
            <span id={`${id}-seller`} className="text-muted-foreground">
              {t("filters.seller")}:
            </span>
            <SelectValue />
          </SelectTrigger>
          <SelectContent alignItemWithTrigger={false} align="start">
            {sellerOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={query.kind ?? ""}
          items={kindOptions}
          onValueChange={(kind) =>
            setFilters({ kind: kind ? (kind as OfferQuery["kind"]) : undefined })
          }
        >
          <SelectTrigger aria-labelledby={`${id}-kind`}>
            <span id={`${id}-kind`} className="text-muted-foreground">
              {t("filters.kind")}:
            </span>
            <SelectValue />
          </SelectTrigger>
          <SelectContent alignItemWithTrigger={false} align="start">
            {kindOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Popover>
          <PopoverTrigger render={<Button variant="outline" />}>
            <CalendarIcon data-icon="inline-start" aria-hidden />
            {t("filters.posted")}: {posted}
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
      </search>
      <Card>
        <CardContent>
          <Table>
            <caption className="sr-only">{shell("pages.offers.label")}</caption>
            <TableHeader>
              <TableRow>
                {columns.map((column) => {
                  if (!column.sort) return <TableHead key={column.key}>{column.header}</TableHead>;
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
                        href={offersHref(toggleSort(query, column.sort))}
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
              {rows.map((offer) => {
                const status = statusLook(offer.status);
                return (
                  <TableRow
                    key={offer.id}
                    onClick={(event) => {
                      // A press on a control inside the row (its menu, a link) does its own thing.
                      if ((event.target as HTMLElement).closest("a, button, [role=menuitem]"))
                        return;
                      router.push(sheetHref(offer), { scroll: false });
                    }}
                  >
                    <TableCell className="w-full">
                      <Item size="xs" className="min-w-56">
                        <ItemMedia variant={offer.photoUrl ? "image" : "icon"}>
                          {offer.photoUrl ? (
                            <Image src={offer.photoUrl} alt="" width={36} height={36} unoptimized />
                          ) : (
                            <PackageIcon aria-hidden />
                          )}
                        </ItemMedia>
                        <ItemContent>
                          <ItemTitle>
                            <Link
                              href={sheetHref(offer)}
                              scroll={false}
                              className={buttonVariants({ variant: "link", size: "inline" })}
                            >
                              {offer.name}
                            </Link>
                          </ItemTitle>
                        </ItemContent>
                      </Item>
                    </TableCell>
                    <TableCell>
                      <span className="block max-w-80 truncate">{offer.sellerName}</span>
                    </TableCell>
                    <TableCell>
                      <span className="flex items-baseline gap-1.5">
                        <span className="font-display text-price text-primary">
                          {formatPrice(offer.priceVnd)}
                        </span>
                        <s className="text-label text-muted-foreground">
                          <span className="sr-only">
                            {t("originalPrice", { price: formatPrice(offer.originalPriceVnd) })}
                          </span>
                          <span aria-hidden>{formatPrice(offer.originalPriceVnd)}</span>
                        </s>
                      </span>
                    </TableCell>
                    <TableCell>
                      {t("left", { left: offer.unitsLeft, units: offer.units, unit: offer.unit })}
                    </TableCell>
                    <TableCell>
                      {t("window", {
                        start: format.dateTime(new Date(offer.windowStart), "time"),
                        end: format.dateTime(new Date(offer.windowEnd), "time"),
                      })}
                    </TableCell>
                    <TableCell>
                      <Badge variant={status.variant}>
                        <status.icon aria-hidden />
                        {t(`status.${offer.status}`)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger
                          render={<Button variant="ghost" size="icon" />}
                          aria-label={shell("rowActions", { name: offer.name })}
                        >
                          <EllipsisIcon aria-hidden />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuGroup>
                            <DropdownMenuItem
                              render={<Link href={sheetHref(offer)} scroll={false} />}
                            >
                              <EyeIcon aria-hidden />
                              {t("view")}
                            </DropdownMenuItem>
                            {canRemove(offer.status) && (
                              <>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  variant="destructive"
                                  onClick={() => setRemoving(true)}
                                >
                                  <BanIcon aria-hidden />
                                  {t("remove")}
                                </DropdownMenuItem>
                              </>
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
                  <PackageIcon aria-hidden />
                </EmptyMedia>
                <EmptyTitle>{t("empty")}</EmptyTitle>
              </EmptyHeader>
            </Empty>
          )}
        </CardContent>
        {total > 0 && (
          <CardFooter>
            <div className="flex w-full flex-wrap items-center justify-between gap-3">
              <p className="text-body-sm text-muted-foreground">
                {t("summary", {
                  from: (query.page - 1) * pageSize + 1,
                  to: Math.min(total, query.page * pageSize),
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
      <OfferSheet
        offer={open}
        onOpenChange={(next) => {
          if (!next) router.replace(offersHref({ ...query, offer: undefined }), { scroll: false });
        }}
        onRemove={() => setRemoving(true)}
      />
      <RemoveOfferDialog open={removing} onOpenChange={setRemoving} />
    </>
  );
}
