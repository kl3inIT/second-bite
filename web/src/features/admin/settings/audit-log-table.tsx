"use client";

import { enUS, vi } from "date-fns/locale";
import { CalendarIcon, ChevronDownIcon, ScrollTextIcon } from "lucide-react";
import { useFormatter, useLocale, useTranslations } from "next-intl";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardFooter } from "@/components/ui/card";
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDayMonth } from "@/i18n/day-month";
import { Link } from "@/i18n/navigation";

import { toast } from "@/components/ui/toast";
import { fromDay, toDay } from "../offers/offer";
import { useListQuery } from "../use-list-query";
import {
  appendAuditPage,
  type AuditEntry,
  type AuditPage,
  type AuditQuery,
  auditActionLooks,
  auditActions,
  auditDefaults,
  auditResourceHref,
  type AuditTone,
} from "./audit-log";
import { listAuditLog } from "./audit-log-source";
import { useAuditDetail } from "./audit-detail";

// Each tone on the shared Badge's own variants; the icon and the words carry the action.
const toneVariants: Record<AuditTone, "fresh" | "outline" | "destructive" | "secondary"> = {
  success: "fresh",
  warning: "outline",
  error: "destructive",
  info: "secondary",
  neutral: "outline",
};

/**
 * The audit log (Figma AD-AL1): filters by action and by days, kept in the address; then each entry with its
 * time, who did it ("Tài khoản đã xoá" once deleted), a badge for the action, what it was done to, its detail
 * (the reason, or each setting before → after) and the request's id. "Tải thêm" adds the next page under the
 * rows, from where the last one ends. The page gives it a new key when the filters change, so it starts over.
 */
export function AuditLogTable({ query, page }: { query: AuditQuery; page: AuditPage }) {
  const t = useTranslations("admin.settings.auditLog");
  const range = useTranslations("admin.shell.dateRange");
  const deleted = useTranslations("admin.settings")("deletedAccount");
  const format = useFormatter();
  const localeCode = useLocale();
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
      toast.add({ title: t("loadFailed"), type: "error", timeout: 5000 });
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

  const actionOptions = [
    { value: "all", label: t("all") },
    ...auditActions.map((action) => ({
      value: action,
      label: t(`actions.${auditActionLooks[action].key}`),
    })),
  ];

  // Each end of the range on its own, as Figma writes it ("14/10 – 21/10/2026"); the start loses its year when
  // both ends share one. "Mọi lúc" with none chosen.
  const from = fromDay(query.from);
  const to = fromDay(query.to);
  const days =
    from && to
      ? `${
          from.getFullYear() === to.getFullYear()
            ? formatDayMonth(from, localeCode)
            : format.dateTime(from, "day")
        } – ${format.dateTime(to, "day")}`
      : from
        ? format.dateTime(from, "day")
        : range("any");

  return (
    <div className="flex flex-col gap-4">
      <search className="flex flex-wrap items-center gap-3">
        <Select
          value={query.action}
          items={actionOptions}
          onValueChange={(next) => {
            if (typeof next === "string") go({ action: next as AuditQuery["action"] });
          }}
        >
          {/* A combobox takes no name from what it holds, so its label names it. */}
          <SelectTrigger aria-labelledby="audit-action-label">
            <span id="audit-action-label">{t("action")}:</span>
            <SelectValue />
          </SelectTrigger>
          <SelectContent alignItemWithTrigger={false} align="start">
            {actionOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Popover>
          <PopoverTrigger render={<Button variant="outline" />}>
            <CalendarIcon data-icon="inline-start" aria-hidden />
            {t("day")}: {days}
            <ChevronDownIcon data-icon="inline-end" aria-hidden />
          </PopoverTrigger>
          <PopoverContent align="start" className="w-auto">
            <Calendar
              mode="range"
              locale={localeCode === "vi" ? vi : enUS}
              numberOfMonths={2}
              selected={{ from, to }}
              onSelect={(next) =>
                go({
                  from: next?.from ? toDay(next.from) : "",
                  to: next?.to ? toDay(next.to) : "",
                })
              }
            />
            <div className="flex justify-end">
              <Button variant="ghost" onClick={() => go({ from: "", to: "" })}>
                {range("clear")}
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </search>
      <Card>
        <Table>
          <caption className="sr-only">{t("caption")}</caption>
          <TableHeader>
            <TableRow>
              <TableHead>{t("columns.occurredAt")}</TableHead>
              <TableHead>{t("columns.actor")}</TableHead>
              <TableHead>{t("columns.action")}</TableHead>
              <TableHead>{t("columns.resource")}</TableHead>
              <TableHead className="w-full">{t("columns.detail")}</TableHead>
              <TableHead>{t("columns.requestId")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {shown.items.map((entry) => {
              const at = new Date(entry.occurredAt);
              const { key, tone, icon: Icon } = auditActionLooks[entry.action];
              const label = resourceLabel(entry);
              const gone = entry.resource.type === "admin" && entry.resource.label === null;
              const lines = detailOf(entry);
              return (
                <TableRow key={entry.id}>
                  <TableCell>
                    <time dateTime={entry.occurredAt} className="flex flex-col">
                      <span>{format.dateTime(at, "day")}</span>
                      <span>{format.dateTime(at, "time")}</span>
                    </time>
                  </TableCell>
                  <TableCell>
                    {entry.actor.label === null ? (
                      <span className="text-muted-foreground">{deleted}</span>
                    ) : (
                      <span className="block max-w-80 truncate">{entry.actor.label}</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant={toneVariants[tone]}>
                      <Icon aria-hidden />
                      {t(`badges.${key}`)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {gone ? (
                      <span className="text-muted-foreground">{label}</span>
                    ) : (
                      <Link
                        href={auditResourceHref(entry.resource)}
                        className="block max-w-60 truncate rounded-sm text-body-sm-strong text-link underline underline-offset-3 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
                      >
                        {label}
                      </Link>
                    )}
                  </TableCell>
                  <TableCell className="w-full">
                    {lines.length === 0 ? (
                      "—"
                    ) : (
                      <span className="flex min-w-40 flex-col">
                        {lines.map((line) => (
                          <span key={line}>{line}</span>
                        ))}
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    <span
                      title={entry.requestId}
                      className="block max-w-24 truncate text-label text-muted-foreground"
                    >
                      {entry.requestId}
                    </span>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        {shown.items.length === 0 && (
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <ScrollTextIcon aria-hidden />
              </EmptyMedia>
              <EmptyTitle>{t("empty")}</EmptyTitle>
            </EmptyHeader>
          </Empty>
        )}
        {shown.next && (
          <CardFooter className="justify-center">
            <Button variant="outline" disabled={loading} onClick={() => void loadMore()}>
              {loading ? (
                <Spinner data-icon="inline-start" />
              ) : (
                <ChevronDownIcon data-icon="inline-start" aria-hidden />
              )}
              {t("loadMore")}
            </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}
