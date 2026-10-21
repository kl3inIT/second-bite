"use client";

import { enUS, vi } from "date-fns/locale";
import { CalendarIcon, ChevronDownIcon } from "lucide-react";
import { useFormatter, useLocale, useTranslations } from "next-intl";
import { useId, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldLabel, FieldLegend, FieldSet } from "@/components/ui/field";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Calendar } from "@/components/ui/calendar";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { dayToDate } from "@/features/admin/overview/days";

import { type DayRange, type ReportQuery, rangeText } from "./report-query";

const kinds = ["orders", "sellers", "accounts"] as const;
const fileFormats = ["xlsx", "csv"] as const;

/**
 * The export (Figma AD-BC2): what to export, over which days, as Excel or CSV. The backend has no export yet
 * (SEC-13), so "Tải về" stays locked beside "Sắp có"; nothing is downloaded or pretended to be.
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
  const tShell = useTranslations("admin.shell");
  const format = useFormatter();
  const locale = useLocale();
  const id = useId();
  const [kind, setKind] = useState<(typeof kinds)[number]>("orders");
  const [days, setDays] = useState<DayRange>({
    from: dayToDate(range.from),
    to: dayToDate(range.to),
  });
  const [fileFormat, setFileFormat] = useState<(typeof fileFormats)[number]>("xlsx");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("title")}</DialogTitle>
        </DialogHeader>
        <FieldSet>
          <FieldLegend variant="label">{t("kind")}</FieldLegend>
          <RadioGroup
            value={kind}
            onValueChange={(next) => setKind(next as (typeof kinds)[number])}
          >
            {kinds.map((value) => (
              <FieldLabel key={value} htmlFor={`${id}-${value}`}>
                <Field orientation="horizontal">
                  <RadioGroupItem id={`${id}-${value}`} value={value} />
                  {t(`kinds.${value}`)}
                </Field>
              </FieldLabel>
            ))}
          </RadioGroup>
        </FieldSet>
        <FieldSet>
          <FieldLegend variant="label">{t("range")}</FieldLegend>
          <Popover>
            <PopoverTrigger render={<Button variant="outline" />}>
              <CalendarIcon data-icon="inline-start" aria-hidden />
              <span className="text-muted-foreground">{t("rangeField")}:</span>
              <span className="text-body-sm-strong text-foreground">
                {rangeText(days, locale, (at) => format.dateTime(at, "day")) ??
                  tShell("dateRange.any")}
              </span>
              <ChevronDownIcon data-icon="inline-end" aria-hidden />
            </PopoverTrigger>
            <PopoverContent align="start" className="w-auto">
              <Calendar
                mode="range"
                locale={locale === "vi" ? vi : enUS}
                numberOfMonths={2}
                selected={{ from: days.from, to: days.to }}
                onSelect={(next) => setDays({ from: next?.from, to: next?.to })}
              />
              <div className="flex justify-end">
                <Button variant="ghost" onClick={() => setDays({})}>
                  {tShell("dateRange.clear")}
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </FieldSet>
        <FieldSet>
          <FieldLegend variant="label">{t("format")}</FieldLegend>
          <ToggleGroup
            variant="outline"
            value={[fileFormat]}
            onValueChange={([next]) => {
              if (next) setFileFormat(next as (typeof fileFormats)[number]);
            }}
          >
            {fileFormats.map((value) => (
              <ToggleGroupItem key={value} value={value} className="h-11">
                {t(`formats.${value}`)}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </FieldSet>
        <DialogFooter>
          <DialogClose render={<Button variant="outline" />}>
            {tShell("confirm.cancel")}
          </DialogClose>
          <Badge variant="outline" id={`${id}-soon`}>
            {t("soon")}
          </Badge>
          <Button disabled aria-describedby={`${id}-soon`}>
            {t("download")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
