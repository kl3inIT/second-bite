"use client";

import Image from "next/image";
import { debounce, useQueryStates } from "nuqs";
import { useFormatter, useTranslations } from "next-intl";
import { useState, useTransition } from "react";

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
import { PostPanel } from "@/features/admin-sellers/seller-posts";
import { formatPrice } from "@/features/offers/format";
import { Link } from "@/i18n/navigation";
import type { AdminOfferBody, OfferBody, OfferCountsBody } from "@/lib/api/generated";
import { photoUrl } from "@/lib/api/photo";
import { cn } from "@/lib/utils";

import { OfferActions } from "./offer-actions";
import { OfferStatusBadge, statusLook } from "./offer-status";
import {
  cardStatuses,
  offerPageSizes,
  offerSearchParams,
  serializeOfferSearchParams,
  type OfferStatus,
} from "./search-params";

const anyStore = "all";

// Each card's icon on its tint (Figma AD-BD1 › Card): the status's colours, as its badge has them.
const cardTone = {
  on_sale: "bg-fresh-muted text-success",
  sold_out: "bg-warning text-warning-foreground",
  closed: "bg-muted text-muted-foreground",
  withdrawn: "bg-muted text-muted-foreground",
} as const;

// The API counts each status under its camel-cased name.
const countOf: Record<OfferStatus, keyof OfferCountsBody> = {
  on_sale: "onSale",
  sold_out: "soldOut",
  closed: "closed",
  withdrawn: "withdrawn",
};

/**
 * Every store's posts (Figma AD-BD1, SEC-134): a card per status with its count, which filters the list
 * when pressed; words, a store, the days posted and the page size in the address; a page of posts the server
 * read for them, newest first; a post opens in a panel beside the list (AD-BD2). Admins read posts and never
 * change them: removing one is not offered until an admin may.
 */
export function OffersList({
  offers,
  total,
  counts,
  stores,
}: {
  offers: AdminOfferBody[];
  total: number;
  counts: OfferCountsBody;
  stores: Array<{ id: string; name: string }>;
}) {
  const t = useTranslations("Admin.offers");
  const [pending, startTransition] = useTransition();
  const [params, setParams] = useQueryStates(offerSearchParams, {
    shallow: false,
    startTransition,
  });
  const [open, setOpen] = useState<OfferBody | null>(null);
  const columns = useColumns(setOpen);
  const filtered =
    params.q !== "" || params.status !== null || params.store !== null || params.from !== null;

  return (
    <section aria-label={t("title")} className="flex flex-col gap-5">
      <fieldset className="grid min-w-0 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <legend className="sr-only">{t("cards")}</legend>
        {cardStatuses.map((status) => {
          const Icon = statusLook[status].icon;
          const selected = params.status === status;
          return (
            <button
              key={status}
              type="button"
              aria-pressed={selected}
              onClick={() => void setParams({ status: selected ? null : status, page: null })}
              className={cn(
                "flex items-center gap-4 rounded-2xl border border-border bg-card p-4 text-start transition-colors hover:border-primary focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none",
                selected && "border-primary ring-1 ring-primary",
              )}
            >
              <span
                className={cn(
                  "flex size-11 shrink-0 items-center justify-center rounded-md",
                  cardTone[status],
                )}
              >
                <Icon aria-hidden className="size-5.5" />
              </span>
              <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                <span className="text-body-sm-strong text-muted-foreground">
                  {t(`status.${status}`)}
                </span>
                <span className="font-display text-display text-foreground">
                  {counts[countOf[status]]}
                </span>
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
          value={params.store ?? anyStore}
          items={[
            { value: anyStore, label: t("anyStore") },
            ...stores.map((s) => ({ value: s.id, label: s.name })),
          ]}
          onValueChange={(store) =>
            void setParams({ store: store === anyStore ? null : store, page: null })
          }
        >
          <SelectTrigger size="lg" aria-label={t("store")}>
            <span className="text-muted-foreground">{t("store")}:</span>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value={anyStore}>{t("anyStore")}</SelectItem>
              {stores.map((s) => (
                <SelectItem key={s.id} value={s.id}>
                  {s.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <DayRange
          label={t("posted")}
          anytime={t("anytime")}
          from={params.from}
          to={params.to}
          onChange={(from, to) => void setParams({ from, to, page: null })}
        />
        <Select
          value={String(params.size)}
          items={offerPageSizes.map((size) => ({ value: String(size), label: String(size) }))}
          onValueChange={(size) =>
            void setParams({ size: Number(size) as (typeof offerPageSizes)[number], page: null })
          }
        >
          <SelectTrigger size="lg" aria-label={t("size")}>
            <span className="text-muted-foreground">{t("size")}:</span>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {offerPageSizes.map((size) => (
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
        rows={offers}
        rowKey={(item) => item.offer.id}
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
                      status: null,
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
            hrefOf={(page) => serializeOfferSearchParams({ ...params, page })}
            onPage={(page) => void setParams({ page })}
          />
        }
      />
      <PostPanel offer={open} onClose={() => setOpen(null)} withStore />
    </section>
  );
}

function useColumns(onOpen: (offer: OfferBody) => void): DataTableColumns<AdminOfferBody> {
  const t = useTranslations("Admin.offers");
  const format = useFormatter();
  const time = (at: string) => format.dateTime(new Date(at), "time");

  return [
    {
      id: "dish",
      header: t("column.dish"),
      meta: { width: "w-72" },
      cell: ({ row }) => (
        <span className="flex items-center gap-3">
          <span className="relative size-9 shrink-0 overflow-hidden rounded-md bg-muted">
            <Image
              src={photoUrl(row.original.offer.photo.smallPath)}
              alt=""
              fill
              sizes="36px"
              unoptimized
              className="object-cover"
            />
          </span>
          <span className="truncate text-body-sm-strong">{row.original.offer.name}</span>
        </span>
      ),
    },
    {
      id: "store",
      header: t("column.store"),
      meta: { width: "w-48" },
      cell: ({ row }) => (
        <Link
          href={`/admin/sellers/${row.original.offer.sellerId}`}
          className="hover:underline focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
        >
          {row.original.sellerName}
        </Link>
      ),
    },
    {
      id: "price",
      header: t("column.price"),
      meta: { width: "w-24" },
      cell: ({ row }) => formatPrice(row.original.offer.priceVnd),
    },
    {
      id: "left",
      header: t("column.left"),
      meta: { width: "w-28" },
      cell: ({ row }) =>
        t("unitsLeft", {
          left: row.original.offer.unitsLeft,
          units: row.original.offer.units,
          unit: row.original.offer.unit,
        }),
    },
    {
      id: "status",
      header: t("column.status"),
      meta: { width: "w-32" },
      cell: ({ row }) => <OfferStatusBadge status={row.original.offer.status} />,
    },
    {
      id: "window",
      header: t("column.window"),
      meta: { width: "w-28" },
      cell: ({ row }) =>
        t("window", {
          from: time(row.original.offer.windowStart),
          until: time(row.original.offer.windowEnd),
        }),
    },
    {
      id: "actions",
      header: () => <span className="sr-only">{t("column.actions")}</span>,
      meta: { width: "w-16" },
      cell: ({ row }) => <OfferActions offer={row.original.offer} onOpen={onOpen} />,
    },
  ];
}
