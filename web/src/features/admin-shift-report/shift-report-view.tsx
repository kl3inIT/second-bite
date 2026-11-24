"use client";

import { DownloadIcon, SlidersHorizontalIcon } from "lucide-react";
import { useQueryStates } from "nuqs";
import { useFormatter, useTranslations } from "next-intl";
import { useEffect, useState, useTransition } from "react";
import { z } from "zod";

import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { stored } from "@/lib/stored";
import { DayRange } from "@/features/admin/day-range";
import { OrderStatusBadge } from "@/features/admin-orders/order-status";
import { isoDay, vietnamToday } from "@/features/admin-reports/report-numbers";
import type {
  ShiftBlockBody,
  ShiftDayBody,
  ShiftOrderBody,
  ShiftReportOutputBody,
  ShiftSummaryBody,
} from "@/lib/api/generated";

import { shiftReportSearchParams } from "./search-params";
import { ShiftSettingsDialog } from "./shift-settings-dialog";
import {
  defaultShifts,
  maxShiftReportDays,
  parseShiftValue,
  queryString,
  shiftReportQuery,
  shiftValue,
  type Shift,
} from "./shifts";

const anyStore = "all";

/** The shifts last chosen, as the address writes them, kept in this browser. */
const keptShifts = stored("secondbite.admin.shifts", z.array(z.string()), []);

const dayMs = 86_400_000;

/** The ranges one tap chooses: today, yesterday, the last seven days and the last thirty-one at most. */
const presets = ["today", "yesterday", "week", "month"] as const;
type Preset = (typeof presets)[number];

function presetRange(preset: Preset, today: Date): { from: Date; to: Date } {
  if (preset === "today") return { from: today, to: today };
  if (preset === "yesterday") {
    const yesterday = new Date(today.getTime() - dayMs);
    return { from: yesterday, to: yesterday };
  }
  return { from: new Date(today.getTime() - (preset === "week" ? 6 : 29) * dayMs), to: today };
}

/**
 * The report by shift (SEC-209, Figma "Báo cáo theo ca"): the range and the store in the address, one tab per
 * day, and in a day's tab its summary first, then a table per shift of its orders with their buyers. "Cài đặt ca"
 * on a shift sets the shifts' names and hours, kept in the address and in the admin's browser. "Xuất Excel" is
 * the server's workbook of the same days and shifts, a plain link.
 */
export function ShiftReportView({
  report,
  stores,
  range,
  shifts,
}: {
  report: ShiftReportOutputBody;
  stores: Array<{ id: string; name: string }>;
  /** The days the server read, the address' or the last three by default. */
  range: { from: Date; to: Date };
  shifts: Shift[];
}) {
  const t = useTranslations("Admin.shiftReports");
  const format = useFormatter();
  const [, startTransition] = useTransition();
  const [params, setParams] = useQueryStates(shiftReportSearchParams, {
    shallow: false,
    startTransition,
  });
  const [today] = useState(() => vietnamToday());
  const [day, setDay] = useState<string | null>(null);
  const shown = report.days.find((d) => d.day === day) ?? report.days.at(-1);

  // The shifts an admin chose last are kept in their browser: an address without any takes them back.
  useEffect(() => {
    if (params.shift && params.shift.length > 0) {
      keptShifts.save(params.shift);
      return;
    }
    const kept = keptShifts.read();
    if (kept.length > 0 && kept.every((v) => parseShiftValue(v) !== null))
      void setParams({ shift: kept });
  }, [params.shift, setParams]);

  const query = shiftReportQuery({ ...range, store: params.store, shifts });
  const exportHref = `/api/admin/shift-reports/export?${queryString(query)}`;
  const chosen = presets.find((p) => {
    const r = presetRange(p, today);
    return isoDay(r.from) === isoDay(range.from) && isoDay(r.to) === isoDay(range.to);
  });

  const apply = (next: Shift[]) => {
    const isDefault = JSON.stringify(next) === JSON.stringify(defaultShifts);
    if (isDefault) keptShifts.clear();
    void setParams({ shift: isDefault ? null : next.map(shiftValue) });
  };

  const dayLabel = (iso: string) =>
    format.dateTime(new Date(`${iso}T00:00:00Z`), {
      day: "numeric",
      month: "numeric",
      timeZone: "UTC",
    });

  return (
    <section aria-label={t("title")} className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center gap-3">
        <fieldset aria-label={t("presets.label")} className="flex flex-wrap gap-2">
          {presets.map((preset) => (
            <Button
              key={preset}
              variant="choice"
              size="default"
              aria-pressed={chosen === preset}
              onClick={() => {
                const r = presetRange(preset, today);
                void setParams({ from: r.from, to: r.to });
              }}
            >
              {t(`presets.${preset}`)}
            </Button>
          ))}
        </fieldset>
        <DayRange
          label={t("days")}
          anytime={t("lastThree")}
          from={range.from}
          to={range.to}
          onChange={(from, to) => void setParams({ from, to })}
        />
        <Select
          value={params.store ?? anyStore}
          items={[
            { value: anyStore, label: t("anyStore") },
            ...stores.map((s) => ({ value: s.id, label: s.name })),
          ]}
          onValueChange={(store) => void setParams({ store: store === anyStore ? null : store })}
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
        {/* A plain download: the server answers the file and its name, under the session's cookie. */}
        <a
          href={exportHref}
          download
          className={buttonVariants({ size: "lg", className: "ml-auto" })}
        >
          <DownloadIcon data-icon="inline-start" />
          {t("export")}
        </a>
      </div>
      {report.days.length >= maxShiftReportDays && (
        <p className="text-body-sm text-muted-foreground">
          {t("capped", { days: maxShiftReportDays })}
        </p>
      )}

      {shown && (
        <Tabs value={shown.day} onValueChange={(next) => setDay(String(next))}>
          <TabsList variant="line" aria-label={t("tabs")} className="h-auto flex-wrap">
            {report.days.map((d) => (
              <TabsTrigger key={d.day} value={d.day} className="min-h-11">
                {dayLabel(d.day)}
              </TabsTrigger>
            ))}
          </TabsList>
          {report.days.map((d) => (
            <TabsContent key={d.day} value={d.day}>
              <DayPanel day={d} shifts={shifts} onApply={apply} />
            </TabsContent>
          ))}
        </Tabs>
      )}
    </section>
  );
}

function DayPanel({
  day,
  shifts,
  onApply,
}: {
  day: ShiftDayBody;
  shifts: Shift[];
  onApply: (shifts: Shift[]) => void;
}) {
  const t = useTranslations("Admin.shiftReports");

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader>
          <CardTitle>{t("summary.title")}</CardTitle>
          <CardDescription>{t("summary.note", { orders: day.summary.orders })}</CardDescription>
        </CardHeader>
        <CardContent>
          <Table aria-label={t("summary.title")}>
            <TableHeader>
              <TableRow>
                <TableHead>{t("summary.shift")}</TableHead>
                <TableHead>{t("summary.hours")}</TableHead>
                <TableHead className="text-right">{t("summary.stores")}</TableHead>
                <TableHead className="text-right">{t("summary.posted")}</TableHead>
                <TableHead className="text-right">{t("summary.collected")}</TableHead>
                <TableHead className="text-right">{t("summary.notCollected")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {day.shifts.map((block) => (
                <SummaryRow
                  key={`${block.from}-${block.name}`}
                  name={block.name}
                  hours={`${block.from}–${block.until}`}
                  summary={block.summary}
                />
              ))}
              <SummaryRow name={t("summary.wholeDay")} hours="" summary={day.summary} />
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {day.shifts.map((block) => (
        <ShiftCard
          key={`${block.from}-${block.name}`}
          block={block}
          shifts={shifts}
          onApply={onApply}
        />
      ))}
    </div>
  );
}

function SummaryRow({
  name,
  hours,
  summary,
}: {
  name: string;
  hours: string;
  summary: ShiftSummaryBody;
}) {
  return (
    <TableRow>
      <TableCell>
        <span className="text-body-sm-strong">{name}</span>
      </TableCell>
      <TableCell>{hours}</TableCell>
      <TableCell className="text-right">{summary.stores}</TableCell>
      <TableCell className="text-right">{summary.unitsPosted}</TableCell>
      <TableCell className="text-right">{summary.unitsCollected}</TableCell>
      <TableCell className="text-right">{summary.unitsNotCollected}</TableCell>
    </TableRow>
  );
}

function ShiftCard({
  block,
  shifts,
  onApply,
}: {
  block: ShiftBlockBody;
  shifts: Shift[];
  onApply: (shifts: Shift[]) => void;
}) {
  const t = useTranslations("Admin.shiftReports");
  const orders = block.orders ?? [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {t("shift.title", { name: block.name, from: block.from, until: block.until })}
        </CardTitle>
        <CardDescription>
          {t("shift.note", {
            stores: block.summary.stores,
            posted: block.summary.unitsPosted,
            collected: block.summary.unitsCollected,
            notCollected: block.summary.unitsNotCollected,
          })}
        </CardDescription>
        <CardAction>
          <ShiftSettingsDialog shifts={shifts} onApply={onApply}>
            <SlidersHorizontalIcon data-icon="inline-start" aria-hidden />
            {t("settings.open")}
          </ShiftSettingsDialog>
        </CardAction>
      </CardHeader>
      <CardContent>
        {orders.length === 0 ? (
          <p className="py-3 text-body-sm-strong">{t("shift.empty")}</p>
        ) : (
          <OrdersTable orders={orders} caption={block.name} />
        )}
      </CardContent>
    </Card>
  );
}

function OrdersTable({ orders, caption }: { orders: ShiftOrderBody[]; caption: string }) {
  const t = useTranslations("Admin.shiftReports.orders");
  const format = useFormatter();
  const time = (iso: string) =>
    format.dateTime(new Date(iso), {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: "Asia/Ho_Chi_Minh",
    });

  return (
    <Table aria-label={t("caption", { shift: caption })}>
      <TableHeader>
        <TableRow>
          <TableHead>{t("number")}</TableHead>
          <TableHead>{t("store")}</TableHead>
          <TableHead>{t("customer")}</TableHead>
          <TableHead>{t("phone")}</TableHead>
          <TableHead>{t("dishes")}</TableHead>
          <TableHead className="text-right">{t("units")}</TableHead>
          <TableHead>{t("orderedAt")}</TableHead>
          <TableHead>{t("window")}</TableHead>
          <TableHead>{t("status")}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders.map((o) => (
          <TableRow key={o.number}>
            <TableCell className="whitespace-nowrap">
              <span className="text-body-sm-strong">SB-{o.number}</span>
            </TableCell>
            <TableCell>{o.store}</TableCell>
            <TableCell>{o.customer}</TableCell>
            <TableCell className="whitespace-nowrap">{o.phone}</TableCell>
            <TableCell>{o.dishes}</TableCell>
            <TableCell className="text-right">{o.units}</TableCell>
            <TableCell className="whitespace-nowrap">{time(o.orderedAt)}</TableCell>
            <TableCell className="whitespace-nowrap">
              {time(o.windowStart)}–{time(o.windowEnd)}
            </TableCell>
            <TableCell>
              <OrderStatusBadge status={o.status} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
