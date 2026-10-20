"use client";

import { BanIcon, EyeIcon, PackageIcon } from "lucide-react";
import { useFormatter, useTranslations } from "next-intl";
import { useEffect, useState } from "react";

import { formatPrice } from "@/features/offers/format";
import { useRouter } from "@/i18n/navigation";

import { DataTable, MediaCell, TextCell } from "../ui/data-table";
import { EmptyState } from "../ui/empty-state";
import { DateRangeFilter, FilterBar, FilterSelect, SearchField } from "../ui/filter-bar";
import { PageHeader } from "../ui/page-header";
import { Pagination } from "../ui/pagination";
import { RowActionMenu } from "../ui/row-action-menu";
import { StatCard } from "../ui/stat-card";
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
  toDay,
  toggleSort,
} from "./offer";
import { OfferSheet } from "./offer-sheet";
import { OfferStatusBadge } from "./offer-status-badge";
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
  const router = useRouter();
  const setFilters = useOfferFilters(query);
  const [search, setSearch] = useState(query.q);
  const [removing, setRemoving] = useState(false);
  const open = rows.find((row) => row.id === query.offer);

  // The search follows the typing once it pauses, so each key does not reload the list.
  useEffect(() => {
    if (search.trim() === query.q) return;
    const timer = setTimeout(() => setFilters({ q: search.trim() }), 300);
    return () => clearTimeout(timer);
  }, [search, query.q, setFilters]);

  const all = { value: "", label: t("filters.all") };
  const sortOf = (key: OfferSortKey) => ({
    direction: query.sort === key ? query.direction : ("none" as const),
    href: offersHref(toggleSort(query, key)),
  });
  const sheetHref = (offer: AdminOfferRow) => offersHref({ ...query, offer: offer.id });

  return (
    <>
      <PageHeader title={shell("pages.offers.label")} />
      <nav aria-label={t("cards")}>
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {offerStatuses.map((status) => {
            const { tone, icon } = cardLook(status);
            const selected = query.status === status;
            return (
              <li key={status}>
                <StatCard
                  label={t(`status.${status}`)}
                  value={counts?.[status] ?? "—"}
                  icon={icon}
                  tone={tone}
                  selected={selected}
                  href={offersHref({
                    ...query,
                    status: selected ? undefined : status,
                    page: 1,
                    offer: undefined,
                  })}
                />
              </li>
            );
          })}
        </ul>
      </nav>
      <FilterBar>
        <SearchField
          label={t("filters.search")}
          placeholder={t("filters.searchPlaceholder")}
          value={search}
          onChange={setSearch}
        />
        <FilterSelect
          label={t("filters.seller")}
          value={query.seller ?? ""}
          options={[all, ...sellers.map((seller) => ({ value: seller.id, label: seller.name }))]}
          onChange={(seller) => setFilters({ seller: seller || undefined })}
        />
        <FilterSelect
          label={t("filters.kind")}
          value={query.kind ?? ""}
          options={[all, ...offerKinds.map((kind) => ({ value: kind, label: kinds(kind) }))]}
          onChange={(kind) => setFilters({ kind: kind ? (kind as OfferQuery["kind"]) : undefined })}
        />
        <DateRangeFilter
          label={t("filters.posted")}
          value={{ from: fromDay(query.from), to: fromDay(query.to) }}
          onChange={(range) =>
            setFilters({
              from: range.from && toDay(range.from),
              to: range.to && toDay(range.to),
            })
          }
        />
      </FilterBar>
      <DataTable
        caption={shell("pages.offers.label")}
        rows={rows}
        rowKey={(offer) => offer.id}
        rowHref={sheetHref}
        columns={[
          {
            key: "name",
            header: t("columns.name"),
            grow: true,
            sort: sortOf("name"),
            cell: (offer) => (
              <MediaCell src={offer.photoUrl} name={offer.name} href={sheetHref(offer)} />
            ),
          },
          {
            key: "seller",
            header: t("columns.seller"),
            sort: sortOf("seller"),
            cell: (offer) => <TextCell>{offer.sellerName}</TextCell>,
          },
          {
            key: "price",
            header: t("columns.price"),
            sort: sortOf("price"),
            cell: (offer) => (
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
            ),
          },
          {
            key: "left",
            header: t("columns.left"),
            cell: (offer) => (
              <TextCell>
                {t("left", { left: offer.unitsLeft, units: offer.units, unit: offer.unit })}
              </TextCell>
            ),
          },
          {
            key: "window",
            header: t("columns.window"),
            sort: sortOf("window"),
            cell: (offer) => (
              <TextCell>
                {t("window", {
                  start: format.dateTime(new Date(offer.windowStart), "time"),
                  end: format.dateTime(new Date(offer.windowEnd), "time"),
                })}
              </TextCell>
            ),
          },
          {
            key: "status",
            header: t("columns.status"),
            cell: (offer) => <OfferStatusBadge status={offer.status} />,
          },
          {
            key: "actions",
            header: t("columns.actions"),
            align: "end",
            cell: (offer) => (
              <RowActionMenu
                name={offer.name}
                actions={[
                  { label: t("view"), icon: EyeIcon, href: sheetHref(offer) },
                  ...(canRemove(offer.status)
                    ? [
                        {
                          label: t("remove"),
                          icon: BanIcon,
                          destructive: true,
                          onSelect: () => setRemoving(true),
                        },
                      ]
                    : []),
                ]}
              />
            ),
          },
        ]}
        empty={<EmptyState icon={PackageIcon} title={t("empty")} />}
        footer={
          total > 0 && (
            <Pagination
              page={query.page}
              pageSize={pageSize}
              total={total}
              hrefFor={(page) => offersHref({ ...query, page, offer: undefined })}
              summary={(range) => t("summary", range)}
            />
          )
        }
      />
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
