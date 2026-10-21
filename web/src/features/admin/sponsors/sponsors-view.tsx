"use client";

import {
  ArrowDownIcon,
  ArrowUpIcon,
  BanIcon,
  CircleCheckIcon,
  ClockIcon,
  EllipsisIcon,
  HandshakeIcon,
  type LucideIcon,
  PauseIcon,
  PencilIcon,
  SearchIcon,
  StoreIcon,
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
import { formatDayMonth } from "@/i18n/day-month";
import { Link, useRouter } from "@/i18n/navigation";

import { pageSizes } from "../list-query";
import { adminHref } from "../pages";
import { type CampaignStatus, isFiltered } from "../promotions/promotion";
import { vietnamDay } from "../promotions/schedule";
import { useListQuery } from "../use-list-query";
import {
  clickRateText,
  sponsorDefaults,
  sponsorKinds,
  type SponsorList,
  sponsorPlacements,
  type SponsorQuery,
} from "./sponsor";

// Each status on the Badge's own variants (Figma Admin/Badge in AD-MK7): the tick or the clock and the words carry
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
 * The places sold in the app (Figma AD-MK7): three cards that filter by status, the filter bar, the table of
 * places with how often each was shown and pressed, and the pages. The list comes in `list`, filtered by the
 * address (`query`); until a backend sells places it is empty, and "Thêm tài trợ" stays disabled beside "Sắp có".
 */
export function SponsorsView({ list, query }: { list: SponsorList; query: SponsorQuery }) {
  const t = useTranslations("admin.sponsors");
  const tStatus = useTranslations("admin.promotions.status");
  const tShell = useTranslations("admin.shell");
  const format = useFormatter();
  const locale = useLocale();
  const id = useId();
  const router = useRouter();
  const { hrefWith, go } = useListQuery(query, sponsorDefaults);
  const [search, setSearch] = useState(query.q);
  const counts = list.counts;

  // A run from its first to its last day, "01/10 – 31/10/2026", the year once when both days share it.
  const period = (start: string, end: string) => {
    const from = new Date(start);
    const to = new Date(end);
    const sameYear = vietnamDay(from).slice(0, 4) === vietnamDay(to).slice(0, 4);
    const fromText = sameYear ? formatDayMonth(from, locale) : format.dateTime(from, "day");
    return `${fromText} – ${format.dateTime(to, "day")}`;
  };

  const headers = [
    { key: "name", label: t("columns.name") },
    { key: "kind", label: t("columns.kind") },
    { key: "placement", label: t("columns.placement") },
    { key: "period", label: t("columns.period") },
    { key: "impressions", label: t("columns.impressions") },
    { key: "clicks", label: t("columns.clicks") },
    { key: "status", label: t("columns.status") },
    { key: "actions", label: "" },
  ];
  const SortIcon = query.dir === "asc" ? ArrowUpIcon : ArrowDownIcon;

  const filters = [
    {
      key: "kind",
      label: t("filters.kind"),
      value: query.kind,
      options: [
        { value: "all", label: t("filters.all") },
        ...sponsorKinds.map((value) => ({ value, label: t(`kinds.${value}`) })),
      ],
      onChange: (value: string) => go({ kind: value as SponsorQuery["kind"] }),
    },
    {
      key: "placement",
      label: t("filters.placement"),
      value: query.placement,
      options: [
        { value: "all", label: t("filters.all") },
        ...sponsorPlacements.map((value) => ({ value, label: t(`placements.${value}`) })),
      ],
      onChange: (value: string) => go({ placement: value as SponsorQuery["placement"] }),
    },
    {
      key: "size",
      label: t("filters.size"),
      value: String(query.size),
      options: pageSizes.map((size) => ({ value: String(size), label: String(size) })),
      onChange: (value: string) => go({ size: Number(value) as SponsorQuery["size"] }),
    },
  ];

  const total = list.total ?? 0;
  const pages = Math.max(1, Math.ceil(total / query.size) || 1);
  const range = {
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
        <div className="flex flex-wrap items-center gap-3">
          <Badge variant="outline" id={`${id}-soon`}>
            {tShell("soon")}
          </Badge>
          <Button disabled aria-describedby={`${id}-soon`}>
            {t("add")}
          </Button>
        </div>
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
              {headers.map((header) => (
                <TableHead
                  key={header.key}
                  aria-sort={
                    header.key === "period"
                      ? query.dir === "asc"
                        ? "ascending"
                        : "descending"
                      : undefined
                  }
                  className={header.key === "name" ? "w-full" : undefined}
                >
                  {header.key === "period" ? (
                    <Link
                      href={hrefWith({ dir: query.dir === "desc" ? "asc" : "desc" })}
                      scroll={false}
                      className={buttonVariants({ variant: "secondary" })}
                    >
                      {header.label}
                      <SortIcon data-icon="inline-end" aria-hidden />
                    </Link>
                  ) : (
                    header.label
                  )}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {list.items.map((row) => {
              const badge = statusBadges[row.status];
              const storeHref = row.sellerId
                ? adminHref("sellerDetail", { sellerId: row.sellerId })
                : undefined;
              return (
                <TableRow key={row.id}>
                  <TableCell className="w-full">
                    {storeHref ? (
                      <Link
                        href={storeHref}
                        className="block max-w-80 truncate text-body-sm-strong text-foreground hover:underline"
                      >
                        {row.name}
                      </Link>
                    ) : (
                      <span className="block max-w-80 truncate text-body-sm-strong text-foreground">
                        {row.name}
                      </span>
                    )}
                  </TableCell>
                  <TableCell>{t(`kinds.${row.kind}`)}</TableCell>
                  <TableCell>{t(`placements.${row.placement}`)}</TableCell>
                  <TableCell>{period(row.startsAt, row.endsAt)}</TableCell>
                  <TableCell>
                    <span className="font-display text-price text-primary">
                      {row.impressions === null ? "—" : format.number(row.impressions)}
                    </span>
                  </TableCell>
                  <TableCell>
                    {row.clickRate === null ? "—" : clickRateText(row.clickRate, locale)}
                  </TableCell>
                  <TableCell>
                    <Badge variant={badge.variant}>
                      <badge.icon aria-hidden />
                      {tStatus(row.status)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        render={<Button variant="ghost" size="icon" />}
                        aria-label={tShell("rowActions", { name: row.name })}
                      >
                        <EllipsisIcon aria-hidden />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuGroup>
                          {storeHref && (
                            <>
                              <DropdownMenuItem render={<Link href={storeHref} />}>
                                <StoreIcon aria-hidden />
                                {t("actions.store")}
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                            </>
                          )}
                          <DropdownMenuItem disabled>
                            <PencilIcon aria-hidden />
                            {t("actions.edit")}
                          </DropdownMenuItem>
                          <DropdownMenuItem disabled>
                            <PauseIcon aria-hidden />
                            {t("actions.pause")}
                          </DropdownMenuItem>
                          <DropdownMenuItem variant="destructive" disabled>
                            <BanIcon aria-hidden />
                            {t("actions.end")}
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
                <HandshakeIcon aria-hidden />
              </EmptyMedia>
              <EmptyTitle>
                {isFiltered(query, ["status", "kind", "placement"])
                  ? t("emptyFiltered")
                  : t("empty")}
              </EmptyTitle>
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
    </>
  );
}
