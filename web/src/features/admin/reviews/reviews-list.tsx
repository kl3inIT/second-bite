"use client";

import {
  ArrowDownIcon,
  ArrowUpIcon,
  EllipsisIcon,
  EyeIcon,
  EyeOffIcon,
  SearchIcon,
  StarIcon,
} from "lucide-react";
import { useFormatter, useLocale, useTranslations } from "next-intl";
import { type MouseEvent, useEffect, useId, useState } from "react";

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
import { Link, useRouter } from "@/i18n/navigation";

import { HideReviewDialog } from "./hide-review-dialog";
import {
  type AdminReviewRow,
  type ReviewQuery,
  type ReviewSeller,
  type ReviewTab,
  reviewTabs,
  reviewsHref,
  starChoices,
  statusLook,
} from "./review";
import { pageSizes } from "../list-query";

/** Moves the list to a new state through its address, back on the first page. */
function useReviewFilters(query: ReviewQuery) {
  const router = useRouter();
  return (patch: Partial<ReviewQuery>) =>
    router.replace(reviewsHref({ ...query, page: 1, ...patch }), { scroll: false });
}

/**
 * The customers' reviews (Figma AD-DG1, AD-DG3): the tabs Tất cả, Bị báo cáo, Đã ẩn with their counts, the
 * filters, then one row per review with its stars, store, customer, words and status, the newest first. A row's
 * menu hides it after a question (AD-DG2). Its state lives in the address.
 */
export function ReviewsList({
  query,
  rows,
  total,
  counts,
  sellers,
}: {
  query: ReviewQuery;
  rows: AdminReviewRow[];
  total: number;
  counts?: Record<ReviewTab, number>;
  sellers: ReviewSeller[];
}) {
  const t = useTranslations("admin.reviews");
  const shell = useTranslations("admin.shell");
  const format = useFormatter();
  const locale = useLocale();
  const router = useRouter();
  const setFilters = useReviewFilters(query);
  const [search, setSearch] = useState(query.q);
  const [hiding, setHiding] = useState<AdminReviewRow>();
  const id = useId();

  // The search follows the typing once it pauses, so each key does not reload the list.
  useEffect(() => {
    if (search.trim() === query.q) return;
    const timer = setTimeout(() => setFilters({ q: search.trim() }), 300);
    return () => clearTimeout(timer);
  }, [search, query.q, setFilters]);

  const all = { value: "", label: t("filters.all") };
  const starOptions = [
    all,
    ...starChoices.map((stars) => ({
      value: String(stars),
      label: t("filters.starsValue", { stars }),
    })),
  ];
  const sellerOptions = [
    all,
    ...sellers.map((seller) => ({ value: seller.id, label: seller.name })),
  ];
  const sizeOptions = pageSizes.map((size) => ({ value: String(size), label: String(size) }));

  // A page of the list is a link in the page's language that moves without reloading the page.
  const pages = Math.max(1, Math.ceil((total || 0) / query.size) || 1);
  const pageLink = (page: number) => {
    const href = reviewsHref({ ...query, page });
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
      <h1 className="text-page-title text-foreground">{shell("pages.reviews.label")}</h1>
      <Tabs
        value={query.tab}
        onValueChange={(tab) => {
          if (tab !== query.tab)
            router.push(reviewsHref({ ...query, tab, page: 1 }), { scroll: false });
        }}
      >
        <TabsList variant="line" aria-label={t("tabs.label")}>
          {reviewTabs.map((tab) => (
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
                value={query.stars ? String(query.stars) : ""}
                items={starOptions}
                onValueChange={(stars) =>
                  setFilters({
                    stars: stars ? (Number(stars) as ReviewQuery["stars"]) : undefined,
                  })
                }
              >
                <SelectTrigger aria-labelledby={`${id}-stars`}>
                  <span id={`${id}-stars`} className="text-muted-foreground">
                    {t("filters.stars")}:
                  </span>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent alignItemWithTrigger={false} align="start">
                  {starOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
                value={String(query.size)}
                items={sizeOptions}
                onValueChange={(size) => setFilters({ size: Number(size) as ReviewQuery["size"] })}
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
                  <caption className="sr-only">{shell("pages.reviews.label")}</caption>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t("columns.stars")}</TableHead>
                      <TableHead>{t("columns.seller")}</TableHead>
                      <TableHead>{t("columns.customer")}</TableHead>
                      <TableHead className="w-full">{t("columns.body")}</TableHead>
                      <TableHead>{t("columns.status")}</TableHead>
                      <TableHead aria-sort={query.sort === "asc" ? "ascending" : "descending"}>
                        <Link
                          href={reviewsHref({
                            ...query,
                            page: 1,
                            sort: query.sort === "desc" ? "asc" : "desc",
                          })}
                          scroll={false}
                          className={buttonVariants({ variant: "link", size: "inline" })}
                        >
                          {t("columns.createdAt")}
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
                    {rows.map((review) => {
                      const status = statusLook(review.status);
                      const created = new Date(review.createdAt);
                      return (
                        <TableRow key={review.id}>
                          <TableCell>
                            {/* "★ 5,0", read out as "5 trên 5 sao" (Figma AD-DG1 › Số sao). */}
                            <span className="flex items-center gap-1.5">
                              <StarIcon aria-hidden className="size-4.5 fill-rating text-rating" />
                              <span
                                aria-hidden
                                className="text-body-sm-strong text-foreground tabular-nums"
                              >
                                {format.number(review.stars, {
                                  minimumFractionDigits: 1,
                                  maximumFractionDigits: 1,
                                })}
                              </span>
                              <span className="sr-only">
                                {t("starsLabel", { stars: review.stars })}
                              </span>
                            </span>
                          </TableCell>
                          <TableCell>
                            <span className="block max-w-80 truncate">{review.sellerName}</span>
                          </TableCell>
                          <TableCell>
                            <span className="block max-w-80 truncate text-body-sm-strong">
                              {review.customerName}
                            </span>
                          </TableCell>
                          <TableCell className="w-full">
                            <span
                              className={
                                review.status === "hidden"
                                  ? "block max-w-80 truncate text-muted-foreground"
                                  : "block max-w-80 truncate"
                              }
                            >
                              {t("quoted", { body: review.body })}
                            </span>
                          </TableCell>
                          <TableCell>
                            <Badge variant={status.variant}>
                              <status.icon aria-hidden />
                              {t(`status.${review.status}`)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <time
                              dateTime={created.toISOString()}
                              className="text-muted-foreground"
                            >
                              {format.dateTime(created, "day")}
                            </time>
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger
                                render={<Button variant="ghost" size="icon" />}
                                aria-label={shell("rowActions", {
                                  name: t("rowName", { name: review.customerName }),
                                })}
                              >
                                <EllipsisIcon aria-hidden />
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuGroup>
                                  {review.status === "hidden" ? (
                                    <DropdownMenuItem disabled>
                                      <EyeIcon aria-hidden />
                                      {t("show")}
                                    </DropdownMenuItem>
                                  ) : (
                                    <DropdownMenuItem
                                      variant="destructive"
                                      onClick={() => setHiding(review)}
                                    >
                                      <EyeOffIcon aria-hidden />
                                      {t("hide")}
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
                        <StarIcon aria-hidden />
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
      <HideReviewDialog
        customerName={hiding?.customerName ?? ""}
        open={hiding !== undefined}
        onOpenChange={(open) => {
          if (!open) setHiding(undefined);
        }}
      />
    </>
  );
}
