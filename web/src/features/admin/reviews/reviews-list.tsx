"use client";

import { EyeIcon, EyeOffIcon, StarIcon } from "lucide-react";
import { useFormatter, useTranslations } from "next-intl";
import { useEffect, useState } from "react";

import { useRouter } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

import { AdminBadge } from "../ui/badge";
import { DataTable, DateCell, StrongCell, TextCell } from "../ui/data-table";
import { EmptyState } from "../ui/empty-state";
import { FilterBar, FilterSelect, SearchField } from "../ui/filter-bar";
import { PageHeader } from "../ui/page-header";
import { Pagination } from "../ui/pagination";
import { RowActionMenu } from "../ui/row-action-menu";
import { AdminTabs } from "../ui/tabs";
import { HideReviewDialog } from "./hide-review-dialog";
import {
  type AdminReviewRow,
  type ReviewQuery,
  type ReviewSeller,
  type ReviewStatus,
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
  const setFilters = useReviewFilters(query);
  const [search, setSearch] = useState(query.q);
  const [hiding, setHiding] = useState<AdminReviewRow>();

  // The search follows the typing once it pauses, so each key does not reload the list.
  useEffect(() => {
    if (search.trim() === query.q) return;
    const timer = setTimeout(() => setFilters({ q: search.trim() }), 300);
    return () => clearTimeout(timer);
  }, [search, query.q, setFilters]);

  const all = { value: "", label: t("filters.all") };

  return (
    <>
      <PageHeader title={shell("pages.reviews.label")} />
      <AdminTabs
        label={t("tabs.label")}
        current={query.tab}
        tabs={reviewTabs.map((tab) => ({
          key: tab,
          label: t(`tabs.${tab}`),
          href: reviewsHref({ ...query, tab, page: 1 }),
          count: counts?.[tab],
        }))}
      />
      <FilterBar>
        <SearchField
          label={t("filters.search")}
          placeholder={t("filters.searchPlaceholder")}
          value={search}
          onChange={setSearch}
        />
        <FilterSelect
          label={t("filters.stars")}
          value={query.stars ? String(query.stars) : ""}
          options={[
            all,
            ...starChoices.map((stars) => ({
              value: String(stars),
              label: t("filters.starsValue", { stars }),
            })),
          ]}
          onChange={(stars) =>
            setFilters({ stars: stars ? (Number(stars) as ReviewQuery["stars"]) : undefined })
          }
        />
        <FilterSelect
          label={t("filters.seller")}
          value={query.seller ?? ""}
          options={[all, ...sellers.map((seller) => ({ value: seller.id, label: seller.name }))]}
          onChange={(seller) => setFilters({ seller: seller || undefined })}
        />
        <FilterSelect
          label={t("filters.size")}
          value={String(query.size)}
          options={pageSizes.map((size) => ({ value: String(size), label: String(size) }))}
          onChange={(size) => setFilters({ size: Number(size) as ReviewQuery["size"] })}
        />
      </FilterBar>
      <DataTable
        caption={shell("pages.reviews.label")}
        rows={rows}
        rowKey={(review) => review.id}
        columns={[
          {
            key: "stars",
            header: t("columns.stars"),
            cell: (review) => <Stars stars={review.stars} />,
          },
          {
            key: "seller",
            header: t("columns.seller"),
            cell: (review) => <TextCell>{review.sellerName}</TextCell>,
          },
          {
            key: "customer",
            header: t("columns.customer"),
            cell: (review) => <StrongCell>{review.customerName}</StrongCell>,
          },
          {
            key: "body",
            header: t("columns.body"),
            grow: true,
            cell: (review) => (
              <span
                className={cn(
                  "block max-w-80 truncate text-body-sm",
                  review.status === "hidden" ? "text-muted-foreground" : "text-foreground",
                )}
              >
                {t("quoted", { body: review.body })}
              </span>
            ),
          },
          {
            key: "status",
            header: t("columns.status"),
            cell: (review) => <ReviewStatusBadge status={review.status} />,
          },
          {
            key: "createdAt",
            header: t("columns.createdAt"),
            sort: {
              direction: query.sort,
              href: reviewsHref({
                ...query,
                page: 1,
                sort: query.sort === "desc" ? "asc" : "desc",
              }),
            },
            cell: (review) => <DateCell value={review.createdAt} />,
          },
          {
            key: "actions",
            header: t("columns.actions"),
            align: "end",
            cell: (review) => (
              <RowActionMenu
                name={t("rowName", { name: review.customerName })}
                actions={[
                  review.status === "hidden"
                    ? { label: t("show"), icon: EyeIcon, disabled: true }
                    : {
                        label: t("hide"),
                        icon: EyeOffIcon,
                        destructive: true,
                        onSelect: () => setHiding(review),
                      },
                ]}
              />
            ),
          },
        ]}
        empty={<EmptyState icon={StarIcon} title={t(`empty.${query.tab}`)} />}
        footer={
          total > 0 && (
            <Pagination
              page={query.page}
              pageSize={query.size}
              total={total}
              hrefFor={(page) => reviewsHref({ ...query, page })}
              summary={(range) => t("summary", range)}
            />
          )
        }
      />
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

/** A review's stars, "★ 5,0" (Figma AD-DG1 › Số sao), read out as "5 trên 5 sao". */
function Stars({ stars }: { stars: number }) {
  const t = useTranslations("admin.reviews");
  const format = useFormatter();
  return (
    <span className="flex items-center gap-1.5">
      <StarIcon aria-hidden className="size-4.5 fill-rating text-rating" />
      <span aria-hidden className="text-body-sm-strong text-foreground tabular-nums">
        {format.number(stars, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}
      </span>
      <span className="sr-only">{t("starsLabel", { stars })}</span>
    </span>
  );
}

function ReviewStatusBadge({ status }: { status: ReviewStatus }) {
  const t = useTranslations("admin.reviews.status");
  const { tone, icon } = statusLook(status);
  return (
    <AdminBadge tone={tone} icon={icon}>
      {t(status)}
    </AdminBadge>
  );
}
