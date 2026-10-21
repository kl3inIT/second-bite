"use client";

import { enUS, vi } from "date-fns/locale";
import { CalendarIcon, ChevronDownIcon, SearchIcon } from "lucide-react";
import { useFormatter, useLocale, useTranslations } from "next-intl";
import { type ReactNode, useId } from "react";
import type { DateRange as DayRange } from "react-day-picker";

import { Button } from "@/components/ui/button";
import { formatDayMonth } from "@/i18n/day-month";
import { Calendar } from "@/components/ui/calendar";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

/**
 * The row of filters over a list (Figma Admin/FilterBar 228:5660): the search field takes the room left, then
 * the selects and the date range at their own width. On a phone they wrap.
 */
export function FilterBar({ children }: { children: ReactNode }) {
  return <search className="flex flex-wrap items-center gap-3">{children}</search>;
}

/**
 * The search field of a filter bar (Figma Admin/SearchField 228:5657): its placeholder names what it searches,
 * and `label` names the field for the screen reader.
 */
export function SearchField({
  label,
  placeholder,
  value,
  onChange,
  name,
}: {
  label: string;
  placeholder: string;
  value?: string;
  onChange?: (value: string) => void;
  name?: string;
}) {
  return (
    <div className="min-w-60 flex-1">
      <InputGroup>
        <InputGroupAddon>
          <SearchIcon aria-hidden />
        </InputGroupAddon>
        <InputGroupInput
          type="search"
          name={name}
          aria-label={label}
          placeholder={placeholder}
          value={value}
          onChange={onChange && ((event) => onChange(event.target.value))}
        />
      </InputGroup>
    </div>
  );
}

export type FilterOption = { value: string; label: string };

/**
 * A select of a filter bar (Figma Admin/Select 228:5658): "Khu vực: Tất cả", its name muted and its value
 * strong. The trigger is a combobox, which takes no name from what it holds, so it is named by its label;
 * the value is read out as the combobox's own.
 */
export function FilterSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: FilterOption[];
  onChange: (value: string) => void;
}) {
  const labelId = useId();
  return (
    <Select
      value={value}
      items={options}
      onValueChange={(next) => {
        if (typeof next === "string") onChange(next);
      }}
    >
      <SelectTrigger aria-labelledby={labelId}>
        <span id={labelId} className="text-muted-foreground">
          {label}:
        </span>
        <span className="text-body-sm-strong text-foreground">
          <SelectValue />
        </span>
      </SelectTrigger>
      <SelectContent alignItemWithTrigger={false} align="start">
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export type DateRangeValue = { from?: Date; to?: Date };

/**
 * A range of days for a filter (Figma Admin/DateRange 238:55307): "Thời gian: 01/10 – 20/10/2026", or
 * "Mọi lúc" when none is chosen; a calendar of two months opens under it.
 */
export function DateRangeFilter({
  label,
  value,
  onChange,
}: {
  label: string;
  value: DateRangeValue;
  onChange: (value: DateRangeValue) => void;
}) {
  const t = useTranslations("admin.shell.dateRange");
  const format = useFormatter();
  const localeCode = useLocale();
  const locale = localeCode === "vi" ? vi : enUS;
  // Each end on its own, as Figma writes it ("21/09 – 20/10/2026"): Intl's own range drops the two-digit month in
  // Vietnamese ("22/9/2026 – 21/10/2026"). The start loses its year when both ends share one.
  const shown =
    value.from && value.to
      ? `${
          value.from.getFullYear() === value.to.getFullYear()
            ? formatDayMonth(value.from, localeCode)
            : format.dateTime(value.from, "day")
        } – ${format.dateTime(value.to, "day")}`
      : value.from
        ? format.dateTime(value.from, "day")
        : t("any");

  return (
    <Popover>
      <PopoverTrigger render={<Button variant="outline" />}>
        <CalendarIcon aria-hidden className="size-4.5 text-muted-foreground" />
        <span className="text-muted-foreground">{label}:</span>
        <span className="text-body-sm-strong text-foreground">{shown}</span>
        <ChevronDownIcon aria-hidden className="size-4 text-muted-foreground" />
      </PopoverTrigger>
      <PopoverContent align="start" className="w-auto">
        <Calendar
          mode="range"
          locale={locale}
          numberOfMonths={2}
          selected={value as DayRange}
          onSelect={(range) => onChange({ from: range?.from, to: range?.to })}
        />
        <div className="flex justify-end">
          <Button variant="ghost" onClick={() => onChange({})}>
            {t("clear")}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
