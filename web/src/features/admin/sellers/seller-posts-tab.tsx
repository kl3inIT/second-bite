"use client";

import { EyeIcon } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useFormatter, useLocale, useTranslations } from "next-intl";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { formatPrice } from "@/features/offers/format";
import { AmountCell, DataTable, MediaCell, TextCell } from "@/features/admin/ui/data-table";
import { EmptyState } from "@/features/admin/ui/empty-state";
import { Pagination } from "@/features/admin/ui/pagination";
import { SegmentedControl } from "@/features/admin/ui/segmented-control";
import { formatDayMonth } from "@/i18n/day-month";
import type { OfferBody } from "@/lib/api/generated";

import { OfferSheet } from "./offer-sheet";
import { countPosts, postedAt, postsIn, postStatuses, readPostStatus } from "./seller-posts";

const PAGE_SIZE = 10;

/**
 * A store's posts tab (Figma AD-QD1, AD-QD2): one status at a time, on sale first, the newest first, ten to a
 * page. The status is kept in the address (`?posts=withdrawn`). The eye opens the post in the side panel to read
 * it, without leaving the store (AD-QD3); an admin does not change a store's posts.
 */
export function SellerPosts({ offers }: { offers: OfferBody[] }) {
  const t = useTranslations("admin.sellers.detail.posts");
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
  const pages = Math.max(1, Math.ceil(shown.length / PAGE_SIZE));
  const current = Math.min(page, pages);
  const time = (at: string) => format.dateTime(new Date(at), "time");
  const withdrawn = status === "withdrawn";

  function choose(next: typeof status) {
    const search = new URLSearchParams(params);
    if (next === "on_sale") search.delete("posts");
    else search.set("posts", next);
    window.history.replaceState(null, "", `?${search.toString()}`);
    setPage(1);
  }

  return (
    <>
      {/* Four statuses are wider than a phone: the row scrolls sideways there. */}
      <div className="max-w-full overflow-x-auto whitespace-nowrap">
        <SegmentedControl
          label={t("filter")}
          value={status}
          onChange={choose}
          segments={postStatuses.map((each) => ({
            value: each,
            label: t("segment", { label: t(`status.${each}`), count: counts[each] }),
          }))}
        />
      </div>
      {shown.length === 0 ? (
        <div className="rounded-md border border-border bg-card">
          <EmptyState title={t(`empty.${status}`)} />
        </div>
      ) : (
        <DataTable
          caption={t("caption", { status: t(`status.${status}`) })}
          rows={shown.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE)}
          rowKey={(offer) => offer.id}
          columns={[
            {
              key: "name",
              header: t("columns.name"),
              grow: true,
              cell: (offer) => <MediaCell src={`/api${offer.photo.smallPath}`} name={offer.name} />,
            },
            {
              key: "price",
              header: t("columns.price"),
              cell: (offer) => <AmountCell>{formatPrice(offer.priceVnd)}</AmountCell>,
            },
            {
              key: "discount",
              header: t("columns.discount"),
              cell: (offer) => (
                <span className="text-body-sm-strong text-destructive">
                  {t("discount", { percent: offer.discountPercent })}
                </span>
              ),
            },
            {
              key: "units",
              header: withdrawn ? t("columns.units") : t("columns.left"),
              cell: (offer) => (
                <TextCell>
                  {withdrawn
                    ? t("units", { units: offer.units, unit: offer.unit })
                    : t("left", { left: offer.unitsLeft, units: offer.units, unit: offer.unit })}
                </TextCell>
              ),
            },
            {
              key: "window",
              header: t("columns.window"),
              cell: (offer) => (
                <TextCell>{`${time(offer.windowStart)}–${time(offer.windowEnd)}`}</TextCell>
              ),
            },
            {
              key: "at",
              header: withdrawn ? t("columns.withdrawnAt") : t("columns.postedAt"),
              sort: {
                direction: newestFirst ? "desc" : "asc",
                onSort: () => setNewestFirst(!newestFirst),
              },
              cell: (offer) => {
                const at = new Date(postedAt(offer));
                return (
                  <time dateTime={at.toISOString()} className="text-body-sm text-muted-foreground">
                    {`${formatDayMonth(at, locale)} · ${format.dateTime(at, "time")}`}
                  </time>
                );
              },
            },
            {
              key: "view",
              header: "",
              align: "end",
              cell: (offer) => (
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label={t("view", { name: offer.name })}
                  onClick={() => setOpen(offer.id)}
                >
                  <EyeIcon aria-hidden />
                </Button>
              ),
            },
          ]}
          footer={
            <Pagination
              page={current}
              pageSize={PAGE_SIZE}
              total={shown.length}
              onPage={setPage}
              summary={({ from, to, total }) => t("summary", { from, to, total })}
            />
          }
        />
      )}
      <OfferSheet offerId={open} onClose={() => setOpen(undefined)} />
    </>
  );
}
