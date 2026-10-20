"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";

import { dayToDate } from "@/features/admin/overview/days";
import { AdminBadge } from "@/features/admin/ui/badge";
import { ConfirmDialog } from "@/features/admin/ui/confirm-dialog";
import { type DateRangeValue, DateRangeFilter } from "@/features/admin/ui/filter-bar";
import { SegmentedControl } from "@/features/admin/ui/segmented-control";

import type { ReportQuery } from "./report-query";

const kinds = ["orders", "sellers", "accounts"] as const;
const fileFormats = ["xlsx", "csv"] as const;

/**
 * The export (Figma AD-BC2): what to export, over which days, as Excel or CSV. The backend has no export yet
 * (SEC-13), so "Tải về" stays locked and says "Sắp có"; nothing is downloaded or pretended to be.
 */
export function ExportDialog({
  open,
  onOpenChange,
  range,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  range: ReportQuery;
}) {
  const t = useTranslations("admin.reports.export");
  const [kind, setKind] = useState<(typeof kinds)[number]>("orders");
  const [days, setDays] = useState<DateRangeValue>({
    from: dayToDate(range.from),
    to: dayToDate(range.to),
  });
  const [fileFormat, setFileFormat] = useState<(typeof fileFormats)[number]>("xlsx");

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      title={t("title")}
      confirmLabel={t("download")}
      confirmDisabled
      confirmTitle={t("soon")}
      onConfirm={() => undefined}
      form={
        <>
          <fieldset className="flex flex-col gap-2">
            <legend className="pb-2 text-body-sm-strong text-foreground">{t("kind")}</legend>
            {kinds.map((value) => (
              <label
                key={value}
                className="flex cursor-pointer items-center gap-3 rounded-md border border-border bg-card px-4 py-3.5 text-body-sm-strong text-foreground transition-colors has-checked:border-primary has-checked:bg-muted has-checked:ring-1 has-checked:ring-primary has-focus-visible:ring-3 has-focus-visible:ring-ring/50"
              >
                <input
                  type="radio"
                  name="export-kind"
                  value={value}
                  checked={kind === value}
                  onChange={() => setKind(value)}
                  className="size-5 shrink-0 accent-primary"
                />
                {t(`kinds.${value}`)}
              </label>
            ))}
          </fieldset>
          <div className="flex flex-col gap-2">
            <p className="text-body-sm-strong text-foreground">{t("range")}</p>
            <DateRangeFilter label={t("rangeField")} value={days} onChange={setDays} />
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-body-sm-strong text-foreground">{t("format")}</p>
            <SegmentedControl
              label={t("format")}
              value={fileFormat}
              onChange={setFileFormat}
              segments={fileFormats.map((value) => ({ value, label: t(`formats.${value}`) }))}
            />
          </div>
          <div className="flex justify-end">
            <AdminBadge tone="neutral">{t("soon")}</AdminBadge>
          </div>
        </>
      }
    />
  );
}
