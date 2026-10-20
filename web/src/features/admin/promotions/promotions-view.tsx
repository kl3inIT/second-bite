"use client";

import {
  BanIcon,
  CircleCheckIcon,
  ClockIcon,
  CopyIcon,
  PauseIcon,
  PencilIcon,
  TicketPercentIcon,
  Trash2Icon,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { formatPrice } from "@/features/offers/format";

import { showAdminToast } from "../admin-toast";
import { type Column, DataTable, StrongCell, TextCell } from "../ui/data-table";
import { EmptyState } from "../ui/empty-state";
import { FilterBar, FilterSelect, SearchField } from "../ui/filter-bar";
import { PageHeader } from "../ui/page-header";
import { Pagination } from "../ui/pagination";
import { RowActionMenu } from "../ui/row-action-menu";
import { StatCard } from "../ui/stat-card";
import { CampaignBadge, FigureText, PeriodText } from "./campaign-badge";
import { pageSizes, toggledSort } from "../list-query";
import {
  campaignFilters,
  type Discount,
  isFiltered,
  type PromotionList,
  type PromotionQuery,
  type PromotionRow,
  promotionDefaults,
  type PromotionSort,
  promotionScopes,
} from "./promotion";
import {
  blankPromotion,
  type PromotionForm,
  promotionFormOf,
  type StoreOption,
} from "./promotion-form";
import { PromotionSheet } from "./promotion-sheet";
import { useListQuery } from "../use-list-query";

/**
 * The promotion codes (Figma AD-MK1): "Tạo mã", three cards that filter by status, the filter bar, the table of
 * codes with each one's menu, and the pages. "Tạo mã" and "Sửa" open the sheet (AD-MK2). The list comes in
 * `list`, filtered and sorted by the address (`query`); until the backend exists it is empty.
 */
export function PromotionsView({
  list,
  query,
  stores,
}: {
  list: PromotionList;
  query: PromotionQuery;
  stores: StoreOption[];
}) {
  const t = useTranslations("admin.promotions");
  const { hrefWith, go } = useListQuery(query, promotionDefaults);
  const [search, setSearch] = useState(query.q);
  const [sheet, setSheet] = useState<{
    open: boolean;
    key: number;
    editing: boolean;
    form?: PromotionForm;
  }>({ open: false, key: 0, editing: false });

  const openSheet = (form: PromotionForm, editing: boolean) =>
    setSheet((current) => ({ open: true, key: current.key + 1, editing, form }));

  const sortOf = (key: PromotionSort) => ({
    direction: query.sort === key ? query.dir : ("none" as const),
    href: hrefWith(toggledSort(query, key, key === "period" ? "desc" : "asc")),
  });

  const copy = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      showAdminToast(t("copied", { code }));
    } catch {
      showAdminToast(t("copyFailed", { code }), "error");
    }
  };

  const columns: Column<PromotionRow>[] = [
    {
      key: "code",
      header: t("columns.code"),
      sort: sortOf("code"),
      cell: (row) => <StrongCell>{row.code}</StrongCell>,
    },
    {
      key: "description",
      header: t("columns.description"),
      grow: true,
      cell: (row) => <TextCell>{row.description}</TextCell>,
    },
    {
      key: "discount",
      header: t("columns.discount"),
      cell: (row) => <FigureText>{discountText(row.discount)}</FigureText>,
    },
    {
      key: "uses",
      header: t("columns.uses"),
      cell: (row) => <TextCell>{t("uses", { used: row.used, limit: row.limit })}</TextCell>,
    },
    {
      key: "period",
      header: t("columns.period"),
      sort: sortOf("period"),
      cell: (row) => <PeriodText start={row.startsAt} end={row.endsAt} />,
    },
    {
      key: "stores",
      header: t("columns.stores"),
      cell: (row) => (
        <TextCell>
          {row.stores.kind === "all"
            ? t("storesAll")
            : t("storesSome", { count: row.stores.count })}
        </TextCell>
      ),
    },
    {
      key: "status",
      header: t("columns.status"),
      cell: (row) => <CampaignBadge status={row.status} />,
    },
    {
      key: "actions",
      header: "",
      align: "end",
      cell: (row) => (
        <RowActionMenu
          name={row.code}
          actions={[
            {
              label: t("actions.edit"),
              icon: PencilIcon,
              onSelect: () => openSheet(promotionFormOf(row), true),
            },
            { label: t("actions.copy"), icon: CopyIcon, onSelect: () => void copy(row.code) },
            { label: t("actions.pause"), icon: PauseIcon, disabled: true },
            { label: t("actions.delete"), icon: Trash2Icon, destructive: true, disabled: true },
          ]}
        />
      ),
    },
  ];

  const counts = list.counts;
  const filtered = isFiltered(query, ["status", "scope"]);

  return (
    <>
      <PageHeader
        title={t("title")}
        actions={
          <Button onClick={() => openSheet(blankPromotion(new Date()), false)}>
            {t("create")}
          </Button>
        }
      />

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          label={t("cards.running")}
          value={counts ? counts.running : "—"}
          icon={CircleCheckIcon}
          tone="success"
          href={hrefWith({ status: "running" })}
          selected={query.status === "running"}
        />
        <StatCard
          label={t("cards.scheduled")}
          value={counts ? counts.scheduled : "—"}
          icon={ClockIcon}
          tone="warning"
          href={hrefWith({ status: "scheduled" })}
          selected={query.status === "scheduled"}
        />
        <StatCard
          label={t("cards.inactive")}
          value={counts ? counts.inactive : "—"}
          icon={BanIcon}
          tone="error"
          href={hrefWith({ status: "inactive" })}
          selected={query.status === "inactive"}
        />
      </div>

      <FilterBar>
        <SearchField
          label={t("filters.search")}
          placeholder={t("filters.searchPlaceholder")}
          value={search}
          onChange={(value) => {
            setSearch(value);
            go({ q: value.trim() });
          }}
        />
        <FilterSelect
          label={t("filters.status")}
          value={query.status}
          options={campaignFilters.map((value) => ({
            value,
            label: t(`filters.statuses.${value}`),
          }))}
          onChange={(value) => go({ status: value as PromotionQuery["status"] })}
        />
        <FilterSelect
          label={t("filters.scope")}
          value={query.scope}
          options={promotionScopes.map((value) => ({
            value,
            label: t(`filters.scopes.${value}`),
          }))}
          onChange={(value) => go({ scope: value as PromotionQuery["scope"] })}
        />
        <FilterSelect
          label={t("filters.size")}
          value={String(query.size)}
          options={pageSizes.map((size) => ({ value: String(size), label: String(size) }))}
          onChange={(value) => go({ size: Number(value) as PromotionQuery["size"] })}
        />
      </FilterBar>

      <DataTable
        caption={t("title")}
        columns={columns}
        rows={list.items}
        rowKey={(row) => row.id}
        empty={
          <EmptyState icon={TicketPercentIcon} title={filtered ? t("emptyFiltered") : t("empty")} />
        }
        footer={
          list.total > 0 && (
            <Pagination
              page={query.page}
              pageSize={query.size}
              total={list.total}
              hrefFor={(page) => hrefWith({ page })}
              summary={(range) => t("summary", range)}
            />
          )
        }
      />

      {sheet.form && (
        <PromotionSheet
          key={sheet.key}
          open={sheet.open}
          onOpenChange={(open) => setSheet((current) => ({ ...current, open }))}
          editing={sheet.editing}
          initial={sheet.form}
          stores={stores}
        />
      )}
    </>
  );
}

/** What a code takes off: "20%" or "15.000đ". */
function discountText(discount: Discount): string {
  return discount.kind === "percent" ? `${discount.percent}%` : formatPrice(discount.amountVnd);
}
