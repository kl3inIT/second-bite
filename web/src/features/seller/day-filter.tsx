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

import { type OrderTab, shiftDay } from "./store-orders";

const SEARCH_WAIT_MS = 300;

type View = { sellerId: string; day: string; today: string; tab: OrderTab; q: string };

/** The address of the order list for a view, without what is as it opens: today, the held tab, no search. */
function hrefFor(view: View, change: Partial<Pick<View, "day" | "q">> = {}) {
  const { sellerId, today, tab } = view;
  const { day, q } = { ...view, ...change };
  return {
    pathname: `/stores/${sellerId}/orders`,
    query: {
      ...(day === today ? {} : { day }),
      ...(tab === "holding" ? {} : { tab }),
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

// The search and the day of the order list (Figma Q5, Q5b, Q5g): a search by name, phone number or dish that
// reads as you type, and the day shown with a step to the day before and after, and a month to pick from. Orders
// belong to a day, so the page shows one. The view is the address, so it is shared and survives a reload.
export function OrdersFilter(view: View) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <OrderSearch {...view} />
      <DayBar {...view} />
    </div>
  );
}

function OrderSearch(view: View) {
  const t = useTranslations("StoreOrders");
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
    <InputGroup className="min-w-60 flex-1">
      <InputGroupAddon>
        <SearchIcon aria-hidden />
      </InputGroupAddon>
      <InputGroupInput
        type="search"
        aria-label={t("searchLabel")}
        placeholder={t("searchPlaceholder")}
        value={text}
        onChange={(event) => setText(event.target.value)}
      />
    </InputGroup>
  );
}

function DayBar(view: View) {
  const t = useTranslations("StoreOrders");
  const format = useFormatter();
  const router = useRouter();
  const language = useLocale();
  const [open, setOpen] = useState(false);
  const { day, today } = view;

  const written = format.dateTime(dateOf(day), { day: "2-digit", month: "2-digit" });
  let label = written;
  if (day === today) label = `${t("day.today")} · ${written}`;
  else if (day === shiftDay(today, -1)) label = `${t("day.yesterday")} · ${written}`;

  const quick = [
    { name: t("day.today"), day: today },
    { name: t("day.yesterday"), day: shiftDay(today, -1) },
    { name: t("day.dayBefore"), day: shiftDay(today, -2) },
  ];

  return (
    <div className="flex items-center gap-2 max-md:w-full">
      <Link
        href={hrefFor(view, { day: shiftDay(day, -1) })}
        aria-label={t("day.previous")}
        className={squareControl}
      >
        <ChevronLeftIcon aria-hidden className="size-5" />
      </Link>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger
          variant="field"
          className="max-md:flex-1"
          aria-label={`${t("day.pick")}: ${label}`}
        >
          <CalendarIcon aria-hidden className="size-5 text-muted-foreground" />
          {label}
        </PopoverTrigger>
        <PopoverContent align="end" sheet>
          <p className="sr-only">{t("day.quick")}</p>
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
        aria-label={t("day.next")}
        className={squareControl}
      >
        <ChevronRightIcon aria-hidden className="size-5" />
      </Link>
    </div>
  );
}
