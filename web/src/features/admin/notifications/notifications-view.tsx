"use client";

import { BanIcon, ClockIcon, EyeIcon, MegaphoneIcon, Trash2Icon } from "lucide-react";
import { useFormatter, useLocale, useTranslations } from "next-intl";
import { useState } from "react";

import { buttonVariants } from "@/components/ui/button";
import { formatDayMonth } from "@/i18n/day-month";
import { Link } from "@/i18n/navigation";

import { adminHref } from "../pages";
import { FigureText } from "../promotions/campaign-badge";
import { pageSizes } from "../list-query";
import { isFiltered } from "../promotions/promotion";
import { vietnamDateTime } from "../promotions/schedule";
import { useListQuery } from "../use-list-query";
import { AdminBadge, type BadgeTone } from "../ui/badge";
import { type Column, DataTable, StrongCell, TextCell } from "../ui/data-table";
import { EmptyState } from "../ui/empty-state";
import { FilterBar, FilterSelect, SearchField } from "../ui/filter-bar";
import { PageHeader } from "../ui/page-header";
import { Pagination } from "../ui/pagination";
import { RowActionMenu } from "../ui/row-action-menu";
import { SideSheet } from "../ui/side-sheet";
import {
  campaignDefaults,
  type CampaignList,
  type CampaignQuery,
  type CampaignRow,
  type CampaignState,
  campaignStates,
  notificationChannels,
  percentOf,
} from "./campaign";
import { NotificationPreview } from "./notification-preview";

const stateTones: Record<CampaignState, BadgeTone> = {
  sent: "success",
  scheduled: "info",
  draft: "neutral",
};

/**
 * The history of notifications sent to groups (Figma AD-MK5): "Soạn thông báo", the filter bar, the table of
 * campaigns with what they reached, and the pages. A campaign's menu shows it as people got it, in a side
 * sheet. The list comes in `list`, filtered by the address (`query`); until a backend sends to groups it is empty.
 */
export function NotificationsView({ list, query }: { list: CampaignList; query: CampaignQuery }) {
  const t = useTranslations("admin.notifications");
  const format = useFormatter();
  const locale = useLocale();
  const { hrefWith, go } = useListQuery(query, campaignDefaults);
  const [search, setSearch] = useState(query.q);
  const [shown, setShown] = useState<CampaignRow>();
  const [open, setOpen] = useState(false);

  const when = (at: string | null) => {
    if (!at) return t("unscheduled");
    const instant = new Date(at);
    return `${formatDayMonth(instant, locale)} · ${format.dateTime(instant, "time")}`;
  };

  const columns: Column<CampaignRow>[] = [
    {
      key: "title",
      header: t("columns.title"),
      grow: true,
      cell: (row) => <StrongCell>{row.title}</StrongCell>,
    },
    {
      key: "channel",
      header: t("columns.channel"),
      cell: (row) => <TextCell>{t(`channels.${row.channel}`)}</TextCell>,
    },
    {
      key: "audience",
      header: t("columns.audience"),
      cell: (row) => <TextCell>{t(`audiences.${row.audience}`)}</TextCell>,
    },
    {
      key: "sent",
      header: t("columns.sent"),
      cell: (row) => <FigureText>{row.sent === null ? "—" : format.number(row.sent)}</FigureText>,
    },
    {
      key: "opened",
      header: t("columns.opened"),
      cell: (row) => <TextCell>{row.openRate === null ? "—" : percentOf(row.openRate)}</TextCell>,
    },
    {
      key: "at",
      header: t("columns.at"),
      sort: {
        direction: query.dir,
        href: hrefWith({ dir: query.dir === "desc" ? "asc" : "desc" }),
      },
      cell: (row) => <TextCell>{when(row.at)}</TextCell>,
    },
    {
      key: "state",
      header: t("columns.state"),
      cell: (row) => (
        <AdminBadge
          tone={stateTones[row.state]}
          icon={row.state === "sent" ? undefined : ClockIcon}
        >
          {t(`states.${row.state}`)}
        </AdminBadge>
      ),
    },
    {
      key: "actions",
      header: "",
      align: "end",
      cell: (row) => (
        <RowActionMenu
          name={row.title}
          actions={[
            {
              label: t("actions.view"),
              icon: EyeIcon,
              onSelect: () => {
                setShown(row);
                setOpen(true);
              },
            },
            { label: t("actions.cancel"), icon: BanIcon, disabled: true },
            { label: t("actions.delete"), icon: Trash2Icon, destructive: true, disabled: true },
          ]}
        />
      ),
    },
  ];

  return (
    <>
      <PageHeader
        title={t("title")}
        actions={
          <Link href={adminHref("notificationsCompose")} className={buttonVariants()}>
            {t("composeAction")}
          </Link>
        }
      />

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
          label={t("filters.channel")}
          value={query.channel}
          options={[
            { value: "all", label: t("filters.all") },
            ...notificationChannels.map((value) => ({ value, label: t(`channels.${value}`) })),
          ]}
          onChange={(value) => go({ channel: value as CampaignQuery["channel"] })}
        />
        <FilterSelect
          label={t("filters.state")}
          value={query.state}
          options={[
            { value: "all", label: t("filters.all") },
            ...campaignStates.map((value) => ({ value, label: t(`states.${value}`) })),
          ]}
          onChange={(value) => go({ state: value as CampaignQuery["state"] })}
        />
        <FilterSelect
          label={t("filters.size")}
          value={String(query.size)}
          options={pageSizes.map((size) => ({ value: String(size), label: String(size) }))}
          onChange={(value) => go({ size: Number(value) as CampaignQuery["size"] })}
        />
      </FilterBar>

      <DataTable
        caption={t("title")}
        columns={columns}
        rows={list.items}
        rowKey={(row) => row.id}
        empty={
          <EmptyState
            icon={MegaphoneIcon}
            title={isFiltered(query, ["channel", "state"]) ? t("emptyFiltered") : t("empty")}
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

      {shown && (
        <SideSheet open={open} onOpenChange={setOpen} title={shown.title}>
          <CampaignDetails campaign={shown} when={when(shown.at)} />
        </SideSheet>
      )}
    </>
  );
}

/** A campaign in its sheet: to whom, how and when, then the notification as people got it. */
export function CampaignDetails({ campaign, when }: { campaign: CampaignRow; when: string }) {
  const t = useTranslations("admin.notifications");
  const [day, clock] = campaign.at
    ? vietnamDateTime(campaign.at).split("T")
    : [undefined, undefined];
  return (
    <>
      <dl className="flex flex-col gap-2 text-body-sm">
        {(
          [
            ["channel", t(`channels.${campaign.channel}`)],
            ["audience", t(`audiences.${campaign.audience}`)],
            ["at", when],
            ["state", t(`states.${campaign.state}`)],
          ] as const
        ).map(([key, value]) => (
          <div key={key} className="flex gap-4">
            <dt className="w-28 shrink-0 text-muted-foreground">{t(`columns.${key}`)}</dt>
            <dd className="text-foreground">{value}</dd>
          </div>
        ))}
      </dl>
      <NotificationPreview
        channel={campaign.channel}
        title={campaign.title}
        body={campaign.body}
        day={day}
        time={clock}
      />
    </>
  );
}
