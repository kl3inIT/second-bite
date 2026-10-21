"use client";

import { ArrowDownIcon, ArrowUpIcon, EyeIcon, InboxIcon } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useFormatter, useLocale, useTranslations } from "next-intl";
import { type MouseEvent, useState } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardFooter } from "@/components/ui/card";
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { formatPrice } from "@/features/offers/format";
import { formatDayMonth } from "@/i18n/day-month";
import type { OfferBody } from "@/lib/api/generated";

import { OfferSheet } from "./offer-sheet";
import { pageCount } from "./seller-list";
import {
  countPosts,
  type PostStatus,
  postedAt,
  postsIn,
  postStatuses,
  readPostStatus,
} from "./seller-posts";

const PAGE_SIZE = 10;

/**
 * A store's posts tab (Figma AD-QD1, AD-QD2): one status at a time, on sale first, the newest first, ten to a
 * page. The status is kept in the address (`?posts=withdrawn`). The eye opens the post in the side panel to read
 * it, without leaving the store (AD-QD3); an admin does not change a store's posts.
 */
export function SellerPosts({ offers }: { offers: OfferBody[] }) {
  const t = useTranslations("admin.sellers.detail.posts");
  const pager = useTranslations("admin.shell.pagination");
  const sellers = useTranslations("admin.sellers");
  const format = useFormatter();
  const locale = useLocale();
  const params = useSearchParams();
  const status = readPostStatus(params.get("posts"));
  const [page, setPage] = useState(1);
  const [newestFirst, setNewestFirst] = useState(true);
  const [open, setOpen] = useState<string>();
  const counts = countPosts(offers);
  const sorted = postsIn(offers, status);
  const shown = newestFirst ? sorted : sorted.toReversed();
  const pages = pageCount(shown.length, PAGE_SIZE);
  const current = Math.min(page, pages);
  const total = shown.length;
  const from = total === 0 ? 0 : (current - 1) * PAGE_SIZE + 1;
  const to = Math.min(total, current * PAGE_SIZE);
  const time = (at: string) => format.dateTime(new Date(at), "time");
  const withdrawn = status === "withdrawn";
  // The page stays on this address: each page link points here and turns the page in place.
  const here = `?${params.toString()}`;
  const turn = (target: number) => (event: MouseEvent) => {
    event.preventDefault();
    setPage(target);
  };

  function choose(next: PostStatus) {
    const search = new URLSearchParams(params);
    if (next === "on_sale") search.delete("posts");
    else search.set("posts", next);
    window.history.replaceState(null, "", `?${search.toString()}`);
    setPage(1);
  }

  return (
    <>
      {/* Four statuses are wider than a phone: the row scrolls sideways there. */}
      <div className="max-w-full overflow-x-auto">
        <ToggleGroup
          variant="outline"
          aria-label={t("filter")}
          value={[status]}
          onValueChange={(next) => {
            // One status is always chosen: pressing the chosen one again keeps it.
            const value = next.at(-1);
            if (value) choose(readPostStatus(value));
          }}
        >
          {postStatuses.map((each) => (
            <ToggleGroupItem key={each} value={each}>
              {t("segment", { label: t(`status.${each}`), count: counts[each] })}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>
      {shown.length === 0 ? (
        <Empty surface="card">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <InboxIcon aria-hidden />
            </EmptyMedia>
            <EmptyTitle>{t(`empty.${status}`)}</EmptyTitle>
          </EmptyHeader>
        </Empty>
      ) : (
        <Card>
          <Table>
            <caption className="sr-only">{t("caption", { status: t(`status.${status}`) })}</caption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-full">{t("columns.name")}</TableHead>
                <TableHead>{t("columns.price")}</TableHead>
                <TableHead>{t("columns.discount")}</TableHead>
                <TableHead>{withdrawn ? t("columns.units") : t("columns.left")}</TableHead>
                <TableHead>{t("columns.window")}</TableHead>
                <TableHead aria-sort={newestFirst ? "descending" : "ascending"}>
                  <Button variant="ghost" onClick={() => setNewestFirst(!newestFirst)}>
                    {withdrawn ? t("columns.withdrawnAt") : t("columns.postedAt")}
                    {newestFirst ? (
                      <ArrowDownIcon data-icon="inline-end" aria-hidden />
                    ) : (
                      <ArrowUpIcon data-icon="inline-end" aria-hidden />
                    )}
                  </Button>
                </TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {shown.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE).map((offer) => {
                const at = new Date(postedAt(offer));
                return (
                  <TableRow key={offer.id}>
                    <TableCell className="w-full">
                      <span className="flex min-w-56 items-center gap-2.5">
                        <Avatar size="lg" aria-hidden>
                          <AvatarImage src={`/api${offer.photo.smallPath}`} alt="" />
                          <AvatarFallback />
                        </Avatar>
                        <span className="block max-w-80 truncate text-body-sm-strong">
                          {offer.name}
                        </span>
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-body-sm-strong tabular-nums">
                        {formatPrice(offer.priceVnd)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-body-sm-strong text-destructive">
                        {t("discount", { percent: offer.discountPercent })}
                      </span>
                    </TableCell>
                    <TableCell>
                      {withdrawn
                        ? t("units", { units: offer.units, unit: offer.unit })
                        : t("left", {
                            left: offer.unitsLeft,
                            units: offer.units,
                            unit: offer.unit,
                          })}
                    </TableCell>
                    <TableCell>{`${time(offer.windowStart)}–${time(offer.windowEnd)}`}</TableCell>
                    <TableCell>
                      <time dateTime={at.toISOString()} className="text-muted-foreground">
                        {`${formatDayMonth(at, locale)} · ${format.dateTime(at, "time")}`}
                      </time>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label={t("view", { name: offer.name })}
                        onClick={() => setOpen(offer.id)}
                      >
                        <EyeIcon aria-hidden />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          <CardFooter>
            <div className="flex w-full flex-wrap items-center justify-between gap-3">
              <p className="text-body-sm text-muted-foreground">
                {t("summary", { from, to, total })}
              </p>
              {pages > 1 && (
                <Pagination aria-label={pager("label")} className="mx-0 w-auto">
                  <PaginationContent>
                    {current > 1 && (
                      <PaginationItem>
                        <PaginationPrevious
                          href={here}
                          aria-label={pager("previous")}
                          text={pager("previous")}
                          onClick={turn(current - 1)}
                        />
                      </PaginationItem>
                    )}
                    <PaginationItem>
                      <span className="px-2 text-body-sm text-muted-foreground tabular-nums">
                        {sellers("pageOf", { page: current, pages })}
                      </span>
                    </PaginationItem>
                    {current < pages && (
                      <PaginationItem>
                        <PaginationNext
                          href={here}
                          aria-label={pager("next")}
                          text={pager("next")}
                          onClick={turn(current + 1)}
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
      <OfferSheet offerId={open} onClose={() => setOpen(undefined)} />
    </>
  );
}
