"use client";

import {
  ArrowDownIcon,
  ArrowUpIcon,
  BanIcon,
  CircleCheckIcon,
  ClockIcon,
  EllipsisIcon,
  EyeIcon,
  type LucideIcon,
  MegaphoneIcon,
  SearchIcon,
  Trash2Icon,
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
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
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
import { isFiltered } from "../promotions/promotion";
import { vietnamDateTime } from "../promotions/schedule";
import { useListQuery } from "../use-list-query";
import {
  campaignDefaults,
  type CampaignList,
  type CampaignQuery,
  type CampaignRow,
  type CampaignState,
  campaignStates,
  notificationChannels,
  percentOf,
} from "./campaign";
import { NotificationPreview } from "./notification-preview";

// Each state on the Badge's own variants (Figma Admin/Badge in AD-MK5): the tick or the clock and the words carry
// the state, never the colour alone.
const stateBadges: Record<
  CampaignState,
  { variant: VariantProps<typeof badgeVariants>["variant"]; icon: LucideIcon }
> = {
  sent: { variant: "fresh", icon: CircleCheckIcon },
  scheduled: { variant: "secondary", icon: ClockIcon },
  draft: { variant: "outline", icon: ClockIcon },
};

/**
 * The history of notifications sent to groups (Figma AD-MK5): "Soạn thông báo", the filter bar, the table of
 * campaigns with what they reached, and the pages. A campaign's menu shows it as people got it, in a side
 * sheet. The list comes in `list`, filtered by the address (`query`); until a backend sends to groups it is empty.
 */
export function NotificationsView({ list, query }: { list: CampaignList; query: CampaignQuery }) {
  const t = useTranslations("admin.notifications");
  const tShell = useTranslations("admin.shell");
  const format = useFormatter();
  const locale = useLocale();
  const id = useId();
  const router = useRouter();
  const { hrefWith, go } = useListQuery(query, campaignDefaults);
  const [search, setSearch] = useState(query.q);
  const [shown, setShown] = useState<CampaignRow>();
  const [open, setOpen] = useState(false);

  const when = (at: string | null) => {
    if (!at) return t("unscheduled");
    const instant = new Date(at);
    return `${formatDayMonth(instant, locale)} · ${format.dateTime(instant, "time")}`;
  };

  const headers = [
    { key: "title", label: t("columns.title") },
    { key: "channel", label: t("columns.channel") },
    { key: "audience", label: t("columns.audience") },
    { key: "sent", label: t("columns.sent") },
    { key: "opened", label: t("columns.opened") },
    { key: "at", label: t("columns.at") },
    { key: "state", label: t("columns.state") },
    { key: "actions", label: "" },
  ];
  const SortIcon = query.dir === "asc" ? ArrowUpIcon : ArrowDownIcon;

  const filters = [
    {
      key: "channel",
      label: t("filters.channel"),
      value: query.channel,
      options: [
        { value: "all", label: t("filters.all") },
        ...notificationChannels.map((value) => ({ value, label: t(`channels.${value}`) })),
      ],
      onChange: (value: string) => go({ channel: value as CampaignQuery["channel"] }),
    },
    {
      key: "state",
      label: t("filters.state"),
      value: query.state,
      options: [
        { value: "all", label: t("filters.all") },
        ...campaignStates.map((value) => ({ value, label: t(`states.${value}`) })),
      ],
      onChange: (value: string) => go({ state: value as CampaignQuery["state"] }),
    },
    {
      key: "size",
      label: t("filters.size"),
      value: String(query.size),
      options: pageSizes.map((size) => ({ value: String(size), label: String(size) })),
      onChange: (value: string) => go({ size: Number(value) as CampaignQuery["size"] }),
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
        <Link href={adminHref("notificationsCompose")} className={buttonVariants()}>
          {t("composeAction")}
        </Link>
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
                    header.key === "at"
                      ? query.dir === "asc"
                        ? "ascending"
                        : "descending"
                      : undefined
                  }
                  className={header.key === "title" ? "w-full" : undefined}
                >
                  {header.key === "at" ? (
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
              const badge = stateBadges[row.state];
              return (
                <TableRow key={row.id}>
                  <TableCell className="w-full">
                    <span className="block max-w-80 truncate text-body-sm-strong text-foreground">
                      {row.title}
                    </span>
                  </TableCell>
                  <TableCell>{t(`channels.${row.channel}`)}</TableCell>
                  <TableCell>{t(`audiences.${row.audience}`)}</TableCell>
                  <TableCell>
                    <span className="font-display text-price text-primary">
                      {row.sent === null ? "—" : format.number(row.sent)}
                    </span>
                  </TableCell>
                  <TableCell>{row.openRate === null ? "—" : percentOf(row.openRate)}</TableCell>
                  <TableCell>{when(row.at)}</TableCell>
                  <TableCell>
                    <Badge variant={badge.variant}>
                      <badge.icon aria-hidden />
                      {t(`states.${row.state}`)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        render={<Button variant="ghost" size="icon" />}
                        aria-label={tShell("rowActions", { name: row.title })}
                      >
                        <EllipsisIcon aria-hidden />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuGroup>
                          <DropdownMenuItem
                            onClick={() => {
                              setShown(row);
                              setOpen(true);
                            }}
                          >
                            <EyeIcon aria-hidden />
                            {t("actions.view")}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem disabled>
                            <BanIcon aria-hidden />
                            {t("actions.cancel")}
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
                <MegaphoneIcon aria-hidden />
              </EmptyMedia>
              <EmptyTitle>
                {isFiltered(query, ["channel", "state"]) ? t("emptyFiltered") : t("empty")}
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

      {shown && (
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetContent side="right">
            <SheetHeader variant="bar">
              <SheetTitle variant="headline">{shown.title}</SheetTitle>
            </SheetHeader>
            <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-6 py-5">
              <CampaignDetails campaign={shown} when={when(shown.at)} />
            </div>
          </SheetContent>
        </Sheet>
      )}
    </>
  );
}

/** A campaign in its sheet: to whom, how and when, then the notification as people got it. */
export function CampaignDetails({ campaign, when }: { campaign: CampaignRow; when: string }) {
  const t = useTranslations("admin.notifications");
  const [day, clock] = campaign.at
    ? vietnamDateTime(campaign.at).split("T")
    : [undefined, undefined];
  return (
    <>
      <dl className="flex flex-col gap-2 text-body-sm">
        {(
          [
            ["channel", t(`channels.${campaign.channel}`)],
            ["audience", t(`audiences.${campaign.audience}`)],
            ["at", when],
            ["state", t(`states.${campaign.state}`)],
          ] as const
        ).map(([key, value]) => (
          <div key={key} className="flex gap-4">
            <dt className="w-28 shrink-0 text-muted-foreground">{t(`columns.${key}`)}</dt>
            <dd className="text-foreground">{value}</dd>
          </div>
        ))}
      </dl>
      <NotificationPreview
        channel={campaign.channel}
        title={campaign.title}
        body={campaign.body}
        day={day}
        time={clock}
      />
    </>
  );
}
