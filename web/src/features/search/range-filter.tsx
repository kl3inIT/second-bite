"use client";

import { ChevronDownIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useId, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useRouter } from "@/i18n/navigation";

const PRICE_STEP = 1000;
const TIME_STEP_SECONDS = 15 * 60;

// A filter chip over a range, the price or the time to collect, "từ … đến …": either end may stay empty.
// Applying it opens the search with the range in the address, keeping every other filter in `keep`; for
// the times, "Nhận ngay" is a shortcut beside the range.
export function RangeFilter({
  type,
  name,
  chosen,
  from,
  to,
  keep,
  params,
  now,
  raised = false,
}: {
  type: "price" | "time";
  /** What the chip filters by, shown until a range is chosen. */
  name: string;
  /** The chosen range in words, such as "20.000đ–50.000đ". */
  chosen?: string;
  from?: string;
  to?: string;
  /** The search's query without this filter. */
  keep: Record<string, string>;
  /** The address's keys for the two ends. */
  params: readonly [string, string];
  /** The query for collecting now, offered beside a range of times. */
  now?: { query: Record<string, string>; current: boolean };
  raised?: boolean;
}) {
  const t = useTranslations("Search");
  const router = useRouter();
  const id = useId();
  const [open, setOpen] = useState(false);
  const [invalid, setInvalid] = useState(false);
  const active = Boolean(chosen);

  function show(query: Record<string, string>) {
    router.push({ pathname: "/search", query });
    setOpen(false);
  }

  function apply(form: FormData) {
    const start = text(form.get("from"));
    const end = text(form.get("to"));
    const outOfOrder =
      start !== "" && end !== "" && (type === "price" ? Number(start) > Number(end) : start > end);
    setInvalid(outOfOrder);
    if (outOfOrder) return;
    const query = { ...keep };
    if (start) query[params[0]] = start;
    if (end) query[params[1]] = end;
    show(query);
  }

  const input =
    type === "price"
      ? { type: "number", inputMode: "numeric" as const, min: 0, step: PRICE_STEP }
      : { type: "time", step: TIME_STEP_SECONDS };

  return (
    <Popover
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        setInvalid(false);
      }}
    >
      <PopoverTrigger
        data-active={active ? "" : undefined}
        // A chip showing its range still says what it filters by.
        aria-label={chosen ? `${name}: ${chosen}` : undefined}
        variant="chip"
        raised={raised}
      >
        {chosen ?? name}
        <ChevronDownIcon aria-hidden className="size-3.5" />
      </PopoverTrigger>
      <PopoverContent align="start" className="w-76">
        <form action={apply} className="flex flex-col gap-3">
          <div className="flex items-end gap-2">
            <div className="flex min-w-0 flex-1 flex-col gap-1.5">
              <Label htmlFor={`${id}-from`}>{t("from")}</Label>
              <Input id={`${id}-from`} name="from" defaultValue={from} {...input} />
            </div>
            <span aria-hidden className="pb-2.5 text-muted-foreground">
              –
            </span>
            <div className="flex min-w-0 flex-1 flex-col gap-1.5">
              <Label htmlFor={`${id}-to`}>{t("to")}</Label>
              <Input id={`${id}-to`} name="to" defaultValue={to} {...input} />
            </div>
          </div>
          {type === "price" && <p className="text-label text-muted-foreground">{t("inDong")}</p>}
          {invalid && (
            <p role="alert" className="text-label text-destructive">
              {t(type === "price" ? "priceOrder" : "timeOrder")}
            </p>
          )}
          {now && (
            <Button
              type="button"
              variant={now.current ? "default" : "secondary"}
              onClick={() => show(now.query)}
            >
              {t("now")}
            </Button>
          )}
          <div className="flex gap-2">
            <Button
              type="button"
              variant="ghost"
              className="flex-1"
              disabled={!active && !now?.current}
              onClick={() => show(keep)}
            >
              {t("clearFilter")}
            </Button>
            <Button type="submit" className="flex-1">
              {t("apply")}
            </Button>
          </div>
        </form>
      </PopoverContent>
    </Popover>
  );
}

function text(value: FormDataEntryValue | null): string {
  return typeof value === "string" ? value.trim() : "";
}
