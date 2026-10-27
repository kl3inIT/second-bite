"use client";

import { BanIcon, EyeIcon, StarIcon, TriangleAlertIcon, type LucideIcon } from "lucide-react";
import { debounce, useQueryStates } from "nuqs";
import { useFormatter, useTranslations } from "next-intl";
import { useTransition } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Empty, EmptyContent, EmptyHeader, EmptyTitle } from "@/components/ui/empty";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DataTable, type DataTableColumns } from "@/features/admin/data-table";
import { DayRange } from "@/features/admin/day-range";
import { ListFooter } from "@/features/admin/list-footer";
import { SearchBox } from "@/features/admin/search-box";
import { StoreThumb } from "@/features/admin-sellers/seller-parts";
import { Link } from "@/i18n/navigation";
import type { AdminReviewBody, ReviewCountsBody } from "@/lib/api/generated";
import { cn } from "@/lib/utils";

import { ReviewActions } from "./review-actions";
import {
  reviewCards,
  reviewPageSizes,
  reviewSearchParams,
  reviewStars,
  serializeReviewSearchParams,
  type ReviewCard,
} from "./search-params";
import { customerOf } from "@/features/orders/order";

const any = "all";

// Each card's icon on its tint (Figma AD-DG1 › Card), as the badges of the list have them.
const cardLook: Record<"average" | ReviewCard, { tone: string; icon: LucideIcon }> = {
  average: { tone: "bg-fresh-muted text-success", icon: StarIcon },
  low: { tone: "bg-warning text-warning-foreground", icon: TriangleAlertIcon },
  hidden: { tone: "bg-destructive-muted text-destructive", icon: BanIcon },
};

const cardFrame =
  "flex items-center gap-4 rounded-2xl border border-border bg-card p-4 text-start transition-colors";

const linkLook =
  "hover:underline focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none";

/**
 * Every customer's review (Figma AD-DG1, SEC-145): the mean stars of the reviews shown, and a card for the
 * poor reviews and one for the hidden, each with its count, which filters the list when pressed; words,
 * stars, a store, the days rated and the page size in the address; a page of reviews the server read for
 * them, the latest first, each with its menu to open its order, hide it or show it again.
 */
export function ReviewsList({
  reviews,
  total,
  counts,
  average,
  stores,
}: {
  reviews: AdminReviewBody[];
  total: number;
  counts: ReviewCountsBody;
  average: number | undefined;
  stores: Array<{ id: string; name: string }>;
}) {
  const t = useTranslations("Admin.reviews");
  const format = useFormatter();
  const [pending, startTransition] = useTransition();
  const [params, setParams] = useQueryStates(reviewSearchParams, {
    shallow: false,
    startTransition,
  });
  const columns = useColumns();
  const filtered =
    params.q !== "" ||
    params.card !== null ||
    params.stars !== null ||
    params.store !== null ||
    params.from !== null;
  const countOf: Record<ReviewCard, number> = {
    low: counts.oneStar + counts.twoStars,
    hidden: counts.hidden,
  };
  const AverageIcon = cardLook.average.icon;

  return (
    <section aria-label={t("title")} className="flex flex-col gap-5">
      <fieldset className="grid min-w-0 gap-4 sm:grid-cols-3">
        <legend className="sr-only">{t("cards")}</legend>
        <div className={cardFrame}>
          <span
            className={cn(
              "flex size-11 shrink-0 items-center justify-center rounded-md",
              cardLook.average.tone,
            )}
          >
            <AverageIcon aria-hidden className="size-5.5" />
          </span>
          <span className="flex min-w-0 flex-1 flex-col gap-0.5">
            <span className="text-body-sm-strong text-muted-foreground">{t("card.average")}</span>
            <span className="font-display text-display text-foreground">
              {average === undefined
                ? t("noAverage")
                : format.number(average, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}
            </span>
          </span>
        </div>
        {reviewCards.map((card) => {
          const { tone, icon: Icon } = cardLook[card];
          const selected = params.card === card;
          return (
            <button
              key={card}
              type="button"
              aria-pressed={selected}
              onClick={() =>
                void setParams({ card: selected ? null : card, stars: null, page: null })
              }
              className={cn(
                cardFrame,
                "hover:border-primary focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none",
                selected && "border-primary ring-1 ring-primary",
              )}
            >
              <span
                className={cn("flex size-11 shrink-0 items-center justify-center rounded-md", tone)}
              >
                <Icon aria-hidden className="size-5.5" />
              </span>
              <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                <span className="text-body-sm-strong text-muted-foreground">
                  {t(`card.${card}`)}
                </span>
                <span className="font-display text-display text-foreground">{countOf[card]}</span>
              </span>
            </button>
          );
        })}
      </fieldset>
      <div className="flex flex-wrap items-center gap-3">
        <SearchBox
          label={t("search")}
          className="sm:w-auto sm:flex-1"
          value={params.q}
          onChange={(q) =>
            void setParams(
              { q, page: null },
              { limitUrlUpdates: q === "" ? undefined : debounce(300) },
            )
          }
        />
        <Select
          value={params.stars === null ? any : String(params.stars)}
          items={[
            { value: any, label: t("anyStars") },
            ...reviewStars.map((n) => ({ value: String(n), label: t("starCount", { count: n }) })),
          ]}
          onValueChange={(value) =>
            void setParams({
              stars: value === any ? null : (Number(value) as (typeof reviewStars)[number]),
              card: params.card === "low" ? null : params.card,
              page: null,
            })
          }
        >
          <SelectTrigger size="lg" aria-label={t("stars")}>
            <span className="text-muted-foreground">{t("stars")}:</span>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value={any}>{t("anyStars")}</SelectItem>
              {reviewStars.map((n) => (
                <SelectItem key={n} value={String(n)}>
                  {t("starCount", { count: n })}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <Select
          value={params.store ?? any}
          items={[
            { value: any, label: t("anyStore") },
            ...stores.map((s) => ({ value: s.id, label: s.name })),
          ]}
          onValueChange={(store) =>
            void setParams({ store: store === any ? null : store, page: null })
          }
        >
          <SelectTrigger size="lg" aria-label={t("store")}>
            <span className="text-muted-foreground">{t("store")}:</span>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value={any}>{t("anyStore")}</SelectItem>
              {stores.map((s) => (
                <SelectItem key={s.id} value={s.id}>
                  {s.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <DayRange
          label={t("reviewDay")}
          anytime={t("anytime")}
          from={params.from}
          to={params.to}
          onChange={(from, to) => void setParams({ from, to, page: null })}
        />
        <Select
          value={String(params.size)}
          items={reviewPageSizes.map((size) => ({ value: String(size), label: String(size) }))}
          onValueChange={(size) =>
            void setParams({ size: Number(size) as (typeof reviewPageSizes)[number], page: null })
          }
        >
          <SelectTrigger size="lg" aria-label={t("size")}>
            <span className="text-muted-foreground">{t("size")}:</span>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {reviewPageSizes.map((size) => (
                <SelectItem key={size} value={String(size)}>
                  {size}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <DataTable
        label={t("title")}
        columns={columns}
        rows={reviews}
        rowKey={(review) => review.orderId}
        busy={pending}
        empty={
          <Empty>
            <EmptyHeader>
              <EmptyTitle>{filtered ? t("noResults.title") : t("empty.title")}</EmptyTitle>
            </EmptyHeader>
            {filtered && (
              <EmptyContent>
                <Button
                  variant="outline"
                  onClick={() =>
                    void setParams({
                      q: null,
                      card: null,
                      stars: null,
                      store: null,
                      from: null,
                      to: null,
                      page: null,
                    })
                  }
                >
                  {t("noResults.clear")}
                </Button>
              </EmptyContent>
            )}
          </Empty>
        }
        footer={
          <ListFooter
            page={params.page}
            pageSize={params.size}
            total={total}
            noun={t("noun")}
            hrefOf={(page) => serializeReviewSearchParams({ ...params, page })}
            onPage={(page) => void setParams({ page })}
          />
        }
      />
    </section>
  );
}

function useColumns(): DataTableColumns<AdminReviewBody> {
  const t = useTranslations("Admin.reviews");
  const gone = useTranslations("Orders")("customerGone");
  const format = useFormatter();

  return [
    {
      id: "store",
      header: t("column.store"),
      meta: { width: "w-52" },
      cell: ({ row }) => (
        <div className="flex items-center gap-2.5">
          <StoreThumb seller={{ id: row.original.sellerId, name: row.original.sellerName }} />
          <Link
            href={`/admin/sellers/${row.original.sellerId}`}
            className={cn("truncate text-body-sm-strong text-foreground", linkLook)}
          >
            {row.original.sellerName}
          </Link>
        </div>
      ),
    },
    {
      id: "customer",
      header: t("column.customer"),
      meta: { width: "w-28" },
      cell: ({ row }) => customerOf(row.original, gone),
    },
    {
      id: "comment",
      header: t("column.comment"),
      cell: ({ row }) =>
        row.original.comment ? (
          <span className="block truncate">“{row.original.comment}”</span>
        ) : (
          <span className="text-muted-foreground">{t("noComment")}</span>
        ),
    },
    {
      id: "number",
      header: t("column.number"),
      meta: { width: "w-28" },
      cell: ({ row }) => (
        <Link
          href={`/admin/orders/${row.original.orderId}`}
          className={cn("text-body-sm-strong whitespace-nowrap text-link", linkLook)}
        >
          {row.original.orderNumber}
        </Link>
      ),
    },
    {
      id: "stars",
      header: t("column.stars"),
      meta: { width: "w-20" },
      cell: ({ row }) => (
        <span className="whitespace-nowrap">{t("starCount", { count: row.original.stars })}</span>
      ),
    },
    {
      id: "status",
      header: t("column.status"),
      meta: { width: "w-32" },
      cell: ({ row }) =>
        row.original.hiddenAt === undefined ? (
          <Badge variant="success">
            <EyeIcon data-icon="inline-start" aria-hidden />
            {t("status.visible")}
          </Badge>
        ) : (
          <Badge variant="neutral">
            <BanIcon data-icon="inline-start" aria-hidden />
            {t("status.hidden")}
          </Badge>
        ),
    },
    {
      id: "reviewed",
      header: t("column.reviewed"),
      meta: { width: "w-36" },
      cell: ({ row }) => (
        <span className="whitespace-nowrap">
          {format.dateTime(new Date(row.original.createdAt), "day")}
        </span>
      ),
    },
    {
      id: "actions",
      header: () => <span className="sr-only">{t("column.actions")}</span>,
      meta: { width: "w-16" },
      cell: ({ row }) => <ReviewActions review={row.original} />,
    },
  ];
}
