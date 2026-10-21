"use client";

import { CalendarIcon, ChevronLeftIcon, ChevronRightIcon, SearchIcon } from "lucide-react";
import { useFormatter, useLocale, useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { enUS, vi } from "react-day-picker/locale";

import { Calendar } from "@/components/ui/calendar";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Link, useRouter } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

import { shiftDay } from "./store-day";

const SEARCH_WAIT_MS = 300;

type View = {
  /** The page the filter belongs to, as an address without its language: `/stores/{id}/orders`. */
  pathname: string;
  day: string;
  today: string;
  /** The tab shown, and the one the page opens on, which the address leaves out. */
  tab: string;
  defaultTab: string;
  q: string;
  /** What the search field is called, and what it says it searches by. */
  label: string;
  placeholder: string;
};

/** What stands beside the search, as the Đơn tab's scan button does. */
type Extra = { extra?: React.ReactNode };

/** The address of the page for a view, without what is as it opens: today, the first tab, no search. */
function hrefFor(view: View, change: Partial<Pick<View, "day" | "q">> = {}) {
  const { pathname, today, tab, defaultTab } = view;
  const { day, q } = { ...view, ...change };
  return {
    pathname,
    query: {
      ...(day === today ? {} : { day }),
      ...(tab === defaultTab ? {} : { tab }),
      ...(q ? { q } : {}),
    },
  };
}

/** A day written `2026-10-21` as the date it stands for in the reader's own clock, noon, so no zone moves it. */
function dateOf(day: string): Date {
  const [year, month, date] = day.split("-").map(Number);
  return new Date(year, month - 1, date, 12);
}

/** A weekday in one or two characters, so seven of them fit above the cells of a phone's popover: "T2" to "CN". */
function weekdayName(date: Date, language: string): string {
  if (language === "vi") return ["CN", "T2", "T3", "T4", "T5", "T6", "T7"][date.getDay()];
  return date.toLocaleDateString(language, { weekday: "narrow" });
}

function dayOf(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

const squareControl =
  "relative flex size-11 shrink-0 items-center justify-center rounded-xl border border-input bg-card text-foreground transition-colors outline-none hover:bg-secondary focus-visible:ring-3 focus-visible:ring-ring/50";

// The search and the day of a store's list, orders or posts (Figma Q5, Q5b, Q5g, Q2): a search by name, phone number or dish that
// reads as you type, and the day shown with a step to the day before and after, and a month to pick from. Orders
// belong to a day, so the page shows one. The view is the address, so it is shared and survives a reload.
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

function Search(view: View) {
  const router = useRouter();
  const [text, setText] = useState(view.q);

  useEffect(() => {
    if (text.trim() === view.q) return;
    const timer = setTimeout(
      () => router.replace(hrefFor(view, { q: text.trim() }), { scroll: false }),
      SEARCH_WAIT_MS,
    );
    return () => clearTimeout(timer);
  }, [text, view, router]);

  return (
    <InputGroup className="min-w-0 flex-1">
      <InputGroupAddon>
        <SearchIcon aria-hidden />
      </InputGroupAddon>
      <InputGroupInput
        type="search"
        aria-label={view.label}
        placeholder={view.placeholder}
        value={text}
        onChange={(event) => setText(event.target.value)}
      />
    </InputGroup>
  );
}

function DayBar(view: View) {
  const t = useTranslations("DayFilter");
  const format = useFormatter();
  const router = useRouter();
  const language = useLocale();
  const [open, setOpen] = useState(false);
  const { day, today } = view;

  const written = format.dateTime(dateOf(day), { day: "2-digit", month: "2-digit" });
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
      <Link
        href={hrefFor(view, { day: shiftDay(day, -1) })}
        aria-label={t("previous")}
        className={squareControl}
      >
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
                  href={hrefFor(view, { day: choice.day })}
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
              formatters={{ formatWeekdayName: (date) => weekdayName(date, language) }}
              onSelect={(picked) => {
                setOpen(false);
                router.push(hrefFor(view, { day: dayOf(picked) }));
              }}
            />
          </div>
        </PopoverContent>
      </Popover>
      <Link
        href={hrefFor(view, { day: shiftDay(day, 1) })}
        aria-label={t("next")}
        className={squareControl}
      >
        <ChevronRightIcon aria-hidden className="size-5" />
      </Link>
    </div>
  );
}
