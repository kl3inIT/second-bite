"use client";

import { EyeIcon, LifeBuoyIcon } from "lucide-react";
import { useFormatter, useLocale, useTranslations } from "next-intl";
import { useEffect, useState } from "react";

import { formatDayMonth } from "@/i18n/day-month";
import { Link, useRouter } from "@/i18n/navigation";

import { adminHref } from "../pages";
import { EmptyState } from "../ui/empty-state";
import { FilterBar, FilterSelect, SearchField } from "../ui/filter-bar";
import { PageHeader } from "../ui/page-header";
import { Pagination } from "../ui/pagination";
import { DataTable, StrongCell } from "../ui/data-table";
import { RowActionMenu } from "../ui/row-action-menu";
import { AdminTabs } from "../ui/tabs";
import {
  type AdminIssueRow,
  type IssuePerson,
  type IssueQuery,
  issueKinds,
  issueStatuses,
  issuesHref,
  pageSizes,
} from "./issue";
import { HandlerCell, IssueKindBadge } from "./issue-badges";

/** Moves the list to a new state through its address, back on the first page. */
function useIssueFilters(query: IssueQuery) {
  const router = useRouter();
  return (patch: Partial<IssueQuery>) =>
    router.replace(issuesHref({ ...query, page: 1, ...patch }), { scroll: false });
}

/**
 * The queue of problem reports (Figma AD-BL1, AD-BL4): the tabs Mới, Đang xử lý, Đã xong with their counts, the
 * filters, then one row per report with its type, who sent it, the order or store it is about and who handles it,
 * the newest first. A row opens the report. Its state lives in the address.
 */
export function IssuesList({
  query,
  rows,
  total,
  counts,
  handlers,
}: {
  query: IssueQuery;
  rows: AdminIssueRow[];
  total: number;
  counts?: Record<IssueQuery["tab"], number>;
  handlers: IssuePerson[];
}) {
  const t = useTranslations("admin.issues");
  const shell = useTranslations("admin.shell");
  const setFilters = useIssueFilters(query);
  const [search, setSearch] = useState(query.q);

  // The search follows the typing once it pauses, so each key does not reload the list.
  useEffect(() => {
    if (search.trim() === query.q) return;
    const timer = setTimeout(() => setFilters({ q: search.trim() }), 300);
    return () => clearTimeout(timer);
  }, [search, query.q, setFilters]);

  const done = query.tab === "done";
  const all = { value: "", label: t("filters.all") };

  return (
    <>
      <PageHeader title={shell("pages.issues.label")} />
      <AdminTabs
        label={t("tabs.label")}
        current={query.tab}
        tabs={issueStatuses.map((status) => ({
          key: status,
          label: t(`tabs.${status}`),
          href: issuesHref({ ...query, tab: status, page: 1 }),
          count: counts?.[status],
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
          label={t("filters.kind")}
          value={query.kind ?? ""}
          options={[all, ...issueKinds.map((kind) => ({ value: kind, label: t(`kind.${kind}`) }))]}
          onChange={(kind) => setFilters({ kind: kind ? (kind as IssueQuery["kind"]) : undefined })}
        />
        <FilterSelect
          label={t("filters.handler")}
          value={query.handler ?? ""}
          options={[
            all,
            { value: "none", label: t("filters.unassigned") },
            ...handlers.map((handler) => ({ value: handler.id, label: handler.name })),
          ]}
          onChange={(handler) => setFilters({ handler: handler || undefined })}
        />
        <FilterSelect
          label={t("filters.size")}
          value={String(query.size)}
          options={pageSizes.map((size) => ({ value: String(size), label: String(size) }))}
          onChange={(size) => setFilters({ size: Number(size) as IssueQuery["size"] })}
        />
      </FilterBar>
      <DataTable
        caption={shell("pages.issues.label")}
        rows={rows}
        rowKey={(issue) => issue.id}
        rowHref={(issue) => adminHref("issueDetail", { issueId: issue.id })}
        columns={[
          {
            key: "code",
            header: t("columns.code"),
            cell: (issue) => (
              <StrongCell href={adminHref("issueDetail", { issueId: issue.id })}>
                {issue.code}
              </StrongCell>
            ),
          },
          {
            key: "kind",
            header: t("columns.kind"),
            cell: (issue) => <IssueKindBadge kind={issue.kind} />,
          },
          {
            key: "sender",
            header: t("columns.sender"),
            cell: (issue) => <StrongCell>{issue.senderName}</StrongCell>,
          },
          {
            key: "related",
            header: t("columns.related"),
            grow: true,
            cell: (issue) => <RelatedCell issue={issue} />,
          },
          {
            key: "handler",
            header: t("columns.handler"),
            cell: (issue) => <HandlerCell handler={issue.handler} />,
          },
          {
            key: "at",
            header: done ? t("columns.resolvedAt") : t("columns.updatedAt"),
            sort: {
              direction: query.sort,
              href: issuesHref({
                ...query,
                page: 1,
                sort: query.sort === "desc" ? "asc" : "desc",
              }),
            },
            cell: (issue) => (
              <AtCell value={done ? (issue.resolvedAt ?? issue.updatedAt) : issue.updatedAt} />
            ),
          },
          {
            key: "actions",
            header: t("columns.actions"),
            align: "end",
            cell: (issue) => (
              <RowActionMenu
                name={issue.code}
                actions={[
                  {
                    label: t("view"),
                    icon: EyeIcon,
                    href: adminHref("issueDetail", { issueId: issue.id }),
                  },
                ]}
              />
            ),
          },
        ]}
        empty={<EmptyState icon={LifeBuoyIcon} title={t(`empty.${query.tab}`)} />}
        footer={
          total > 0 && (
            <Pagination
              page={query.page}
              pageSize={query.size}
              total={total}
              hrefFor={(page) => issuesHref({ ...query, page })}
              summary={(range) => t(`summary.${query.tab}`, range)}
            />
          )
        }
      />
    </>
  );
}

/** The order or the store a report is about, as a link in blue (Figma AD-BL1 › Cell/Liên quan). */
function RelatedCell({ issue }: { issue: AdminIssueRow }) {
  const t = useTranslations("admin.issues");
  const related = issue.related;
  if (!related) return null;
  const [href, label] =
    related.kind === "order"
      ? [
          adminHref("orderDetail", { orderId: related.id }),
          t("relatedOrder", { code: related.code }),
        ]
      : [adminHref("sellerDetail", { sellerId: related.id }), related.name];
  return (
    <Link
      href={href}
      className="block max-w-80 truncate rounded-sm text-body-sm-strong text-primary hover:underline focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
    >
      {label}
    </Link>
  );
}

/** A time in a row, its day and hour: "20/10 · 19:42". */
function AtCell({ value }: { value: string }) {
  const t = useTranslations("admin.issues");
  const format = useFormatter();
  const locale = useLocale();
  const at = new Date(value);
  return (
    <time
      dateTime={at.toISOString()}
      className="text-body-sm whitespace-nowrap text-muted-foreground"
    >
      {t("at", { day: formatDayMonth(at, locale), time: format.dateTime(at, "time") })}
    </time>
  );
}
