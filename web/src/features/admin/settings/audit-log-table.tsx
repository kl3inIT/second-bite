"use client";

import { ChevronDownIcon, ScrollTextIcon } from "lucide-react";
import { useFormatter, useTranslations } from "next-intl";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Link } from "@/i18n/navigation";

import { showAdminToast } from "../lib/toast";
import { fromDay, toDay } from "../offers/offer";
import { useListQuery } from "../use-list-query";
import { AdminBadge } from "../ui/badge";
import { DataTable, TextCell } from "../ui/data-table";
import { EmptyState } from "../ui/empty-state";
import { DateRangeFilter, FilterBar, FilterSelect } from "../ui/filter-bar";
import {
  appendAuditPage,
  type AuditEntry,
  type AuditPage,
  type AuditQuery,
  auditActionLooks,
  auditActions,
  auditDefaults,
  auditResourceHref,
} from "./audit-log";
import { listAuditLog } from "./audit-log-source";
import { useAuditDetail } from "./audit-detail";

/**
 * The audit log (Figma AD-AL1): filters by action and by days, kept in the address; then each entry with its
 * time, who did it ("Tài khoản đã xoá" once deleted), a badge for the action, what it was done to, its detail
 * (the reason, or each setting before → after) and the request's id. "Tải thêm" adds the next page under the
 * rows, from where the last one ends. The page gives it a new key when the filters change, so it starts over.
 */
export function AuditLogTable({ query, page }: { query: AuditQuery; page: AuditPage }) {
  const t = useTranslations("admin.settings.auditLog");
  const deleted = useTranslations("admin.settings")("deletedAccount");
  const format = useFormatter();
  const detailOf = useAuditDetail();
  const { go } = useListQuery(query, auditDefaults);
  const [shown, setShown] = useState(page);
  const [loading, setLoading] = useState(false);

  async function loadMore() {
    if (!shown.next || loading) return;
    setLoading(true);
    try {
      setShown(appendAuditPage(shown.items, await listAuditLog(query, shown.next)));
    } catch {
      showAdminToast(t("loadFailed"), "error");
    } finally {
      setLoading(false);
    }
  }

  function resourceLabel(entry: AuditEntry) {
    const { resource } = entry;
    if (resource.type === "offer_settings") return t("resources.offerSettings");
    if (resource.type === "email_settings") return t("resources.emailSettings");
    return resource.label ?? deleted;
  }

  return (
    <div className="flex flex-col gap-4">
      <FilterBar>
        <FilterSelect
          label={t("action")}
          value={query.action}
          options={[
            { value: "all", label: t("all") },
            ...auditActions.map((action) => ({
              value: action,
              label: t(`actions.${auditActionLooks[action].key}`),
            })),
          ]}
          onChange={(action) => go({ action: action as AuditQuery["action"] })}
        />
        <DateRangeFilter
          label={t("day")}
          value={{ from: fromDay(query.from), to: fromDay(query.to) }}
          onChange={(range) =>
            go({
              from: range.from ? toDay(range.from) : "",
              to: range.to ? toDay(range.to) : "",
            })
          }
        />
      </FilterBar>
      <DataTable
        caption={t("caption")}
        rows={shown.items}
        rowKey={(entry) => entry.id}
        empty={<EmptyState icon={ScrollTextIcon} title={t("empty")} />}
        footer={
          shown.next ? (
            <div className="flex justify-center">
              <Button variant="outline" disabled={loading} onClick={() => void loadMore()}>
                {loading ? (
                  <Spinner data-icon="inline-start" />
                ) : (
                  <ChevronDownIcon data-icon="inline-start" aria-hidden />
                )}
                {t("loadMore")}
              </Button>
            </div>
          ) : undefined
        }
        columns={[
          {
            key: "occurredAt",
            header: t("columns.occurredAt"),
            cell: (entry) => {
              const at = new Date(entry.occurredAt);
              return (
                <time
                  dateTime={entry.occurredAt}
                  className="flex flex-col text-body-sm whitespace-nowrap text-foreground"
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
            cell: (entry) =>
              entry.actor.label === null ? (
                <span className="text-body-sm whitespace-nowrap text-muted-foreground">
                  {deleted}
                </span>
              ) : (
                <TextCell>{entry.actor.label}</TextCell>
              ),
          },
          {
            key: "action",
            header: t("columns.action"),
            cell: (entry) => {
              const { key, tone, icon } = auditActionLooks[entry.action];
              return (
                <AdminBadge tone={tone} icon={icon}>
                  {t(`badges.${key}`)}
                </AdminBadge>
              );
            },
          },
          {
            key: "resource",
            header: t("columns.resource"),
            cell: (entry) => {
              const label = resourceLabel(entry);
              const gone = entry.resource.type === "admin" && entry.resource.label === null;
              return gone ? (
                <span className="text-body-sm whitespace-nowrap text-muted-foreground">
                  {label}
                </span>
              ) : (
                <Link
                  href={auditResourceHref(entry.resource)}
                  className="block max-w-60 truncate rounded-sm text-body-sm-strong text-link underline underline-offset-3 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
                >
                  {label}
                </Link>
              );
            },
          },
          {
            key: "detail",
            header: t("columns.detail"),
            grow: true,
            cell: (entry) => {
              const lines = detailOf(entry);
              return lines.length === 0 ? (
                <span className="text-body-sm text-foreground">—</span>
              ) : (
                <span className="flex min-w-40 flex-col text-body-sm text-foreground">
                  {lines.map((line) => (
                    <span key={line}>{line}</span>
                  ))}
                </span>
              );
            },
          },
          {
            key: "requestId",
            header: t("columns.requestId"),
            cell: (entry) => (
              <span
                title={entry.requestId}
                className="block max-w-24 truncate text-label text-muted-foreground"
              >
                {entry.requestId}
              </span>
            ),
          },
        ]}
      />
    </div>
  );
}
