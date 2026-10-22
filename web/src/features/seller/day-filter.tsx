"use client";

import { CalendarIcon, ChevronLeftIcon, ChevronRightIcon, SearchIcon } from "lucide-react";
import { createSerializer, debounce, useQueryStates } from "nuqs";
import { useFormatter, useLocale, useTranslations } from "next-intl";
import { useState, useTransition } from "react";
import { enUS, vi } from "react-day-picker/locale";

import { Calendar } from "@/components/ui/calendar";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

import { dayOrNull, type DayList, listSearchParams } from "./search-params";
import { shiftDay } from "./store-day";

/** How long the search waits after the last key before the list is read again. */
const SEARCH_WAIT_MS = 300;

/** The list a filter belongs to: its address, and today, which the page read at request time. */
type DayView = {
  /** The page, as an address without its language: `/stores/{id}/orders`. */
  pathname: string;
  list: DayList;
  today: string;
};

type View = DayView & {
  /** What the search field is called, and what it says it searches by. */
  label: string;
  placeholder: string;
};

/** What stands beside the search, as the Đơn tab's scan button does. */
type Extra = { extra?: React.ReactNode };

/** A day written `2026-10-21` as the date it stands for in the reader's own clock, noon, so no zone moves it. */
function dateOf(day: string): Date {
  const [year, month, date] = day.split("-").map(Number);
  return new Date(year, month - 1, date, 12);
}

function dayOf(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

/**
 * The list's view in the address (docs/guidelines/web.md › Lists and filters): read and changed with nuqs, the
 * server reading the list again on a change. What is as the list opens stays out of the address.
 */
function useListView(list: DayList) {
  const [, startTransition] = useTransition();
  const [view, setView] = useQueryStates(listSearchParams[list], {
    shallow: false,
    startTransition,
  });
  return { view, setView };
}

const squareControl =
  "relative flex size-11 shrink-0 items-center justify-center rounded-xl border border-input bg-card text-foreground transition-colors outline-none hover:bg-secondary focus-visible:ring-3 focus-visible:ring-ring/50";

// The search and the day of a store's list, orders or posts (Figma Q5, Q5b, Q5g, Q2): a search by name, phone number
// or dish that reads as you type, and the day shown with a step to the day before and after, and a month to pick
// from. Orders belong to a day, so the page shows one. The view is the address, so it is shared and survives a reload.
export function DayFilter({ extra, ...view }: View & Extra) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="flex min-w-60 flex-1 items-center gap-2 max-md:w-full">
        <Search {...view} />
        {extra}
      </div>
      <DayBar {...view} />
    </div>
  );
}

function Search({ list, label, placeholder }: View) {
  const { view, setView } = useListView(list);
  const q = "q" in view ? view.q : "";

  return (
    <InputGroup className="min-w-0 flex-1">
      <InputGroupAddon>
        <SearchIcon aria-hidden />
      </InputGroupAddon>
      <InputGroupInput
        type="search"
        aria-label={label}
        placeholder={placeholder}
        value={q}
        onChange={(event) =>
          void setView(
            { q: event.target.value },
            {
              // Clearing the field reads the list at once; typing waits for the last key.
              limitUrlUpdates: event.target.value ? debounce(SEARCH_WAIT_MS) : undefined,
            },
          )
        }
      />
    </InputGroup>
  );
}

/** The day alone, with its steps and its month, for a page with no search (the store's home, Figma Q1b). */
export function DayBar({ pathname, list, today }: DayView) {
  const t = useTranslations("DayFilter");
  const format = useFormatter();
  const language = useLocale();
  const [open, setOpen] = useState(false);
  const { view, setView } = useListView(list);
  const day = view.day ?? today;
  const serialize = createSerializer(listSearchParams[list]);
  // The address of the same view on another day.
  const hrefFor = (other: string) =>
    `${pathname}${serialize({ ...view, day: dayOrNull(other, today) })}`;

  const written = format.dateTime(dateOf(day), "dayMonth");
  let label = written;
  if (day === today) label = `${t("today")} · ${written}`;
  else if (day === shiftDay(today, -1)) label = `${t("yesterday")} · ${written}`;

  const quick = [
    { name: t("today"), day: today },
    { name: t("yesterday"), day: shiftDay(today, -1) },
    { name: t("dayBefore"), day: shiftDay(today, -2) },
  ];

  return (
    <div className="flex items-center gap-2 max-md:w-full">
      <Link href={hrefFor(shiftDay(day, -1))} aria-label={t("previous")} className={squareControl}>
        <ChevronLeftIcon aria-hidden className="size-5" />
      </Link>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger
          variant="field"
          className="max-md:flex-1"
          aria-label={`${t("pick")}: ${label}`}
        >
          <CalendarIcon aria-hidden className="size-5 text-muted-foreground" />
          {label}
        </PopoverTrigger>
        <PopoverContent align="end" sheet>
          <p className="sr-only">{t("quick")}</p>
          <ul className="grid grid-cols-3 gap-2">
            {quick.map((choice) => (
              <li key={choice.day}>
                <Link
                  href={hrefFor(choice.day)}
                  aria-current={choice.day === day ? "date" : undefined}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex h-9.5 items-center justify-center rounded-full border px-2 whitespace-nowrap transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring",
                    choice.day === day
                      ? "border-primary bg-primary text-body-sm-strong text-primary-foreground"
                      : "border-border bg-card text-body-sm text-foreground hover:bg-secondary",
                  )}
                >
                  {choice.name}
                </Link>
              </li>
            ))}
          </ul>
          <div className="flex justify-center">
            <Calendar
              className="max-sm:w-80"
              mode="single"
              required
              selected={dateOf(day)}
              defaultMonth={dateOf(day)}
              locale={language === "vi" ? vi : enUS}
              weekStartsOn={1}
              formatters={{ formatWeekdayName: (date) => format.dateTime(date, "weekday") }}
              onSelect={(picked) => {
                setOpen(false);
                void setView({ day: dayOrNull(dayOf(picked), today) }, { history: "push" });
              }}
            />
          </div>
        </PopoverContent>
      </Popover>
      <Link href={hrefFor(shiftDay(day, 1))} aria-label={t("next")} className={squareControl}>
        <ChevronRightIcon aria-hidden className="size-5" />
      </Link>
    </div>
  );
}
