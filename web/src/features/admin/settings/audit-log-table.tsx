"use client";

import { ArrowRightIcon, ScrollTextIcon } from "lucide-react";
import { useFormatter, useTranslations } from "next-intl";
import { useEffect, useState } from "react";

import { Link, usePathname, useRouter } from "@/i18n/navigation";

import { AdminBadge } from "../ui/badge";
import { DataTable, TextCell } from "../ui/data-table";
import { EmptyState } from "../ui/empty-state";
import { DateRangeFilter, FilterBar, FilterSelect, SearchField } from "../ui/filter-bar";
import { Pagination } from "../ui/pagination";
import { type AuditQuery, auditActionLook, auditActions, auditSearch } from "./audit-log";
import type { AuditEntry } from "./audit-log-source";

/** A day of the address ("2026-10-14") as the date picker holds it, at noon so no zone moves it. */
function dayOf(value: string | undefined) {
  return value ? new Date(`${value}T12:00:00`) : undefined;
}

function dayText(value: Date | undefined) {
  if (!value) return undefined;
  const month = String(value.getMonth() + 1).padStart(2, "0");
  const day = String(value.getDate()).padStart(2, "0");
  return `${value.getFullYear()}-${month}-${day}`;
}

/**
 * The audit log (Figma AD-CD5): a search and filters by who, what and when, kept in the address; then each action
 * with its time, who did it, a badge for what was done, what it was done to and the change. Until the audit log
 * has a backend there is nothing in it.
 */
export function AuditLogTable({
  query,
  rows,
  total,
  pageSize,
  actors,
}: {
  query: AuditQuery;
  rows: AuditEntry[];
  total: number;
  pageSize: number;
  actors: string[];
}) {
  const t = useTranslations("admin.settings.auditLog");
  const format = useFormatter();
  const router = useRouter();
  const pathname = usePathname();

  // The words being typed, sent to the address once typing pauses.
  const [search, setSearch] = useState(query.q);

  function filter(change: Partial<AuditQuery>) {
    router.replace(`${pathname}${auditSearch({ ...query, page: 1, ...change })}`, {
      scroll: false,
    });
  }

  useEffect(() => {
    if (search.trim() === query.q) return;
    const timer = setTimeout(() => filter({ q: search.trim() }), 400);
    return () => clearTimeout(timer);
  });

  return (
    <div className="flex flex-col gap-4">
      <FilterBar>
        <SearchField
          label={t("search")}
          placeholder={t("searchPlaceholder")}
          value={search}
          onChange={setSearch}
        />
        <FilterSelect
          label={t("actor")}
          value={query.actor}
          options={[
            { value: "all", label: t("all") },
            ...actors.map((actor) => ({ value: actor, label: actor })),
          ]}
          onChange={(actor) => filter({ actor })}
        />
        <FilterSelect
          label={t("action")}
          value={query.action}
          options={[
            { value: "all", label: t("all") },
            ...auditActions.map((action) => ({ value: action, label: t(`actions.${action}`) })),
          ]}
          onChange={(action) => filter({ action: action as AuditQuery["action"] })}
        />
        <DateRangeFilter
          label={t("day")}
          value={{ from: dayOf(query.from), to: dayOf(query.to) }}
          onChange={({ from, to }) => filter({ from: dayText(from), to: dayText(to) })}
        />
      </FilterBar>
      <DataTable
        caption={t("caption")}
        rows={rows}
        rowKey={(row) => row.id}
        empty={<EmptyState icon={ScrollTextIcon} title={t("empty")} />}
        footer={
          total > 0 ? (
            <Pagination
              page={query.page}
              pageSize={pageSize}
              total={total}
              hrefFor={(page) => `${pathname}${auditSearch({ ...query, page })}`}
              summary={({ from, to, total: count }) => t("summary", { from, to, total: count })}
            />
          ) : undefined
        }
        columns={[
          {
            key: "at",
            header: t("columns.at"),
            cell: (row) => {
              const at = new Date(row.at);
              return (
                <time
                  dateTime={at.toISOString()}
                  className="flex flex-col text-body-sm text-foreground"
                >
                  <span>{format.dateTime(at, "day")}</span>
                  <span>{format.dateTime(at, "time")}</span>
                </time>
              );
            },
          },
          {
            key: "actor",
            header: t("columns.actor"),
            cell: (row) => <TextCell>{row.actor}</TextCell>,
          },
          {
            key: "action",
            header: t("columns.action"),
            cell: (row) => {
              const { tone, icon } = auditActionLook(row.action);
              return (
                <AdminBadge tone={tone} icon={icon}>
                  {t(`actions.${row.action}`)}
                </AdminBadge>
              );
            },
          },
          {
            key: "target",
            header: t("columns.target"),
            cell: (row) =>
              row.target.href ? (
                <Link
                  href={row.target.href}
                  className="block max-w-60 truncate rounded-sm text-body-sm-strong text-link underline underline-offset-3 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
                >
                  {row.target.label}
                </Link>
              ) : (
                <TextCell>{row.target.label}</TextCell>
              ),
          },
          {
            key: "change",
            header: t("columns.change"),
            grow: true,
            cell: (row) => (
              <span className="flex items-center gap-1.5 text-body-sm text-foreground">
                <span>{row.change.before ?? "—"}</span>
                <ArrowRightIcon aria-label={t("to")} className="size-3.5 shrink-0" />
                <span>{row.change.after}</span>
              </span>
            ),
          },
        ]}
      />
    </div>
  );
}
