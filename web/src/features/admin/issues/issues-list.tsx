"use client";

import {
  ArrowDownIcon,
  ArrowUpIcon,
  EllipsisIcon,
  EyeIcon,
  LifeBuoyIcon,
  SearchIcon,
} from "lucide-react";
import { useFormatter, useLocale, useTranslations } from "next-intl";
import { type MouseEvent, useEffect, useId, useState } from "react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
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

import { adminHref } from "../pages";
import {
  type AdminIssueRow,
  type IssuePerson,
  type IssueQuery,
  issueKinds,
  issueStatuses,
  issuesHref,
  kindLook,
} from "./issue";
import { pageSizes } from "../list-query";

/** Moves the list to a new state through its address, back on the first page. */
function useIssueFilters(query: IssueQuery) {
  const router = useRouter();
  return (patch: Partial<IssueQuery>) =>
    router.replace(issuesHref({ ...query, page: 1, ...patch }), { scroll: false });
}

/**
 * The queue of problem reports (Figma AD-BL1, AD-BL4): the tabs Mới, Đang xử lý, Đã xong with their counts, the
 * filters, then one row per report with its type, who sent it, the order or store it is about and who handles it,
 * the newest first. A row opens the report. Its state lives in the address.
 */
export function IssuesList({
  query,
  rows,
  total,
  counts,
  handlers,
}: {
  query: IssueQuery;
  rows: AdminIssueRow[];
  total: number;
  counts?: Record<IssueQuery["tab"], number>;
  handlers: IssuePerson[];
}) {
  const t = useTranslations("admin.issues");
  const shell = useTranslations("admin.shell");
  const format = useFormatter();
  const locale = useLocale();
  const router = useRouter();
  const setFilters = useIssueFilters(query);
  const [search, setSearch] = useState(query.q);
  const id = useId();

  // The search follows the typing once it pauses, so each key does not reload the list.
  useEffect(() => {
    if (search.trim() === query.q) return;
    const timer = setTimeout(() => setFilters({ q: search.trim() }), 300);
    return () => clearTimeout(timer);
  }, [search, query.q, setFilters]);

  const done = query.tab === "done";
  const all = { value: "", label: t("filters.all") };
  const kindOptions = [
    all,
    ...issueKinds.map((kind) => ({ value: kind, label: t(`kind.${kind}`) })),
  ];
  const handlerOptions = [
    all,
    { value: "none", label: t("filters.unassigned") },
    ...handlers.map((handler) => ({ value: handler.id, label: handler.name })),
  ];
  const sizeOptions = pageSizes.map((size) => ({ value: String(size), label: String(size) }));
  const detail = (issue: AdminIssueRow) => adminHref("issueDetail", { issueId: issue.id });

  // A page of the list is a link in the page's language that moves without reloading the page.
  const pages = Math.max(1, Math.ceil((total || 0) / query.size) || 1);
  const pageLink = (page: number) => {
    const href = issuesHref({ ...query, page });
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
      <h1 className="text-page-title text-foreground">{shell("pages.issues.label")}</h1>
      <Tabs
        value={query.tab}
        onValueChange={(tab) => {
          if (tab !== query.tab)
            router.push(issuesHref({ ...query, tab, page: 1 }), { scroll: false });
        }}
      >
        <TabsList variant="line" aria-label={t("tabs.label")}>
          {issueStatuses.map((status) => (
            <TabsTrigger key={status} value={status}>
              {t(`tabs.${status}`)}
              {counts && <Badge variant="secondary">{counts[status]}</Badge>}
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
                value={query.kind ?? ""}
                items={kindOptions}
                onValueChange={(kind) =>
                  setFilters({ kind: kind ? (kind as IssueQuery["kind"]) : undefined })
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
              <Select
                value={query.handler ?? ""}
                items={handlerOptions}
                onValueChange={(handler) => setFilters({ handler: handler || undefined })}
              >
                <SelectTrigger aria-labelledby={`${id}-handler`}>
                  <span id={`${id}-handler`} className="text-muted-foreground">
                    {t("filters.handler")}:
                  </span>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent alignItemWithTrigger={false} align="start">
                  {handlerOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={String(query.size)}
                items={sizeOptions}
                onValueChange={(size) => setFilters({ size: Number(size) as IssueQuery["size"] })}
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
                  <caption className="sr-only">{shell("pages.issues.label")}</caption>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t("columns.code")}</TableHead>
                      <TableHead>{t("columns.kind")}</TableHead>
                      <TableHead>{t("columns.sender")}</TableHead>
                      <TableHead className="w-full">{t("columns.related")}</TableHead>
                      <TableHead>{t("columns.handler")}</TableHead>
                      <TableHead aria-sort={query.sort === "asc" ? "ascending" : "descending"}>
                        <Link
                          href={issuesHref({
                            ...query,
                            page: 1,
                            sort: query.sort === "desc" ? "asc" : "desc",
                          })}
                          scroll={false}
                          className={buttonVariants({ variant: "link", size: "inline" })}
                        >
                          {done ? t("columns.resolvedAt") : t("columns.updatedAt")}
                          {query.sort === "asc" ? (
                            <ArrowUpIcon data-icon="inline-end" aria-hidden />
                          ) : (
                            <ArrowDownIcon data-icon="inline-end" aria-hidden />
                          )}
                        </Link>
                      </TableHead>
                      <TableHead className="text-right">{t("columns.actions")}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rows.map((issue) => {
                      const kind = kindLook(issue.kind);
                      const related = issue.related;
                      const at = new Date(
                        done ? (issue.resolvedAt ?? issue.updatedAt) : issue.updatedAt,
                      );
                      return (
                        <TableRow
                          key={issue.id}
                          onClick={(event) => {
                            // A press on a control inside the row (its menu, a link) does its own thing.
                            if ((event.target as HTMLElement).closest("a, button, [role=menuitem]"))
                              return;
                            router.push(detail(issue));
                          }}
                        >
                          <TableCell>
                            <Link
                              href={detail(issue)}
                              className={buttonVariants({ variant: "link", size: "inline" })}
                            >
                              {issue.code}
                            </Link>
                          </TableCell>
                          <TableCell>
                            <Badge variant={kind.variant}>
                              <kind.icon aria-hidden />
                              {t(`kind.${issue.kind}`)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <span className="block max-w-80 truncate text-body-sm-strong">
                              {issue.senderName}
                            </span>
                          </TableCell>
                          <TableCell className="w-full">
                            {related && (
                              <Link
                                href={
                                  related.kind === "order"
                                    ? adminHref("orderDetail", { orderId: related.id })
                                    : adminHref("sellerDetail", { sellerId: related.id })
                                }
                                className={buttonVariants({ variant: "link", size: "inline" })}
                              >
                                {related.kind === "order"
                                  ? t("relatedOrder", { code: related.code })
                                  : related.name}
                              </Link>
                            )}
                          </TableCell>
                          <TableCell>
                            <span className="flex items-center gap-2">
                              <Avatar size="sm" aria-hidden>
                                <AvatarFallback>
                                  {issue.handler ? initials(issue.handler.name) : "?"}
                                </AvatarFallback>
                              </Avatar>
                              <span
                                className={
                                  issue.handler
                                    ? "truncate text-body-sm"
                                    : "truncate text-body-sm text-muted-foreground"
                                }
                              >
                                {issue.handler?.name ?? t("unassigned")}
                              </span>
                            </span>
                          </TableCell>
                          <TableCell>
                            <time
                              dateTime={at.toISOString()}
                              className="text-body-sm text-muted-foreground"
                            >
                              {t("at", {
                                day: formatDayMonth(at, locale),
                                time: format.dateTime(at, "time"),
                              })}
                            </time>
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger
                                render={<Button variant="ghost" size="icon" />}
                                aria-label={shell("rowActions", { name: issue.code })}
                              >
                                <EllipsisIcon aria-hidden />
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuGroup>
                                  <DropdownMenuItem render={<Link href={detail(issue)} />}>
                                    <EyeIcon aria-hidden />
                                    {t("view")}
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
                {rows.length === 0 && (
                  <Empty>
                    <EmptyHeader>
                      <EmptyMedia variant="icon">
                        <LifeBuoyIcon aria-hidden />
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
                      {t(`summary.${query.tab}`, {
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
    </>
  );
}
