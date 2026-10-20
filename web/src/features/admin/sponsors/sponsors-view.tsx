"use client";

import {
  BanIcon,
  CircleCheckIcon,
  ClockIcon,
  HandshakeIcon,
  PauseIcon,
  PencilIcon,
  StoreIcon,
} from "lucide-react";
import { useFormatter, useLocale, useTranslations } from "next-intl";
import { useId, useState } from "react";

import { Button } from "@/components/ui/button";

import { adminHref } from "../pages";
import { CampaignBadge, FigureText, PeriodText } from "../promotions/campaign-badge";
import { pageSizes } from "../list-query";
import { isFiltered } from "../promotions/promotion";
import { SoonBadge } from "../ui/soon-badge";
import { useListQuery } from "../use-list-query";
import { type Column, DataTable, StrongCell, TextCell } from "../ui/data-table";
import { EmptyState } from "../ui/empty-state";
import { FilterBar, FilterSelect, SearchField } from "../ui/filter-bar";
import { PageHeader } from "../ui/page-header";
import { Pagination } from "../ui/pagination";
import { type RowAction, RowActionMenu } from "../ui/row-action-menu";
import { StatCard } from "../ui/stat-card";
import {
  clickRateText,
  sponsorDefaults,
  sponsorKinds,
  type SponsorList,
  sponsorPlacements,
  type SponsorQuery,
  type SponsorRow,
} from "./sponsor";

/**
 * The places sold in the app (Figma AD-MK7): three cards that filter by status, the filter bar, the table of
 * places with how often each was shown and pressed, and the pages. The list comes in `list`, filtered by the
 * address (`query`); until a backend sells places it is empty, and "Thêm tài trợ" stays disabled beside "Sắp có".
 */
export function SponsorsView({ list, query }: { list: SponsorList; query: SponsorQuery }) {
  const t = useTranslations("admin.sponsors");
  const tShell = useTranslations("admin.shell");
  const format = useFormatter();
  const locale = useLocale();
  const soonId = useId();
  const { hrefWith, go } = useListQuery(query, sponsorDefaults);
  const [search, setSearch] = useState(query.q);
  const counts = list.counts;

  const columns: Column<SponsorRow>[] = [
    {
      key: "name",
      header: t("columns.name"),
      grow: true,
      cell: (row) => (
        <StrongCell
          href={row.sellerId ? adminHref("sellerDetail", { sellerId: row.sellerId }) : undefined}
        >
          {row.name}
        </StrongCell>
      ),
    },
    {
      key: "kind",
      header: t("columns.kind"),
      cell: (row) => <TextCell>{t(`kinds.${row.kind}`)}</TextCell>,
    },
    {
      key: "placement",
      header: t("columns.placement"),
      cell: (row) => <TextCell>{t(`placements.${row.placement}`)}</TextCell>,
    },
    {
      key: "period",
      header: t("columns.period"),
      sort: {
        direction: query.dir,
        href: hrefWith({ dir: query.dir === "desc" ? "asc" : "desc" }),
      },
      cell: (row) => <PeriodText start={row.startsAt} end={row.endsAt} />,
    },
    {
      key: "impressions",
      header: t("columns.impressions"),
      cell: (row) => (
        <FigureText>{row.impressions === null ? "—" : format.number(row.impressions)}</FigureText>
      ),
    },
    {
      key: "clicks",
      header: t("columns.clicks"),
      cell: (row) => (
        <TextCell>{row.clickRate === null ? "—" : clickRateText(row.clickRate, locale)}</TextCell>
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
      cell: (row) => {
        const actions: RowAction[] = [
          { label: t("actions.edit"), icon: PencilIcon, disabled: true },
          { label: t("actions.pause"), icon: PauseIcon, disabled: true },
          { label: t("actions.end"), icon: BanIcon, destructive: true, disabled: true },
        ];
        if (row.sellerId) {
          actions.unshift({
            label: t("actions.store"),
            icon: StoreIcon,
            href: adminHref("sellerDetail", { sellerId: row.sellerId }),
          });
        }
        return <RowActionMenu name={row.name} actions={actions} />;
      },
    },
  ];

  return (
    <>
      <PageHeader
        title={t("title")}
        actions={
          <>
            <SoonBadge id={soonId} />
            <Button disabled title={tShell("soon")} aria-describedby={soonId}>
              {t("add")}
            </Button>
          </>
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
          label={t("filters.kind")}
          value={query.kind}
          options={[
            { value: "all", label: t("filters.all") },
            ...sponsorKinds.map((value) => ({ value, label: t(`kinds.${value}`) })),
          ]}
          onChange={(value) => go({ kind: value as SponsorQuery["kind"] })}
        />
        <FilterSelect
          label={t("filters.placement")}
          value={query.placement}
          options={[
            { value: "all", label: t("filters.all") },
            ...sponsorPlacements.map((value) => ({ value, label: t(`placements.${value}`) })),
          ]}
          onChange={(value) => go({ placement: value as SponsorQuery["placement"] })}
        />
        <FilterSelect
          label={t("filters.size")}
          value={String(query.size)}
          options={pageSizes.map((size) => ({ value: String(size), label: String(size) }))}
          onChange={(value) => go({ size: Number(value) as SponsorQuery["size"] })}
        />
      </FilterBar>

      <DataTable
        caption={t("title")}
        columns={columns}
        rows={list.items}
        rowKey={(row) => row.id}
        empty={
          <EmptyState
            icon={HandshakeIcon}
            title={
              isFiltered(query, ["status", "kind", "placement"]) ? t("emptyFiltered") : t("empty")
            }
          />
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
    </>
  );
}
