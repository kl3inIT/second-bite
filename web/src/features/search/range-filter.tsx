"use client";

import { ChevronDownIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useId, useState } from "react";

import { Button } from "@/components/ui/button";
import { FieldError } from "@/components/ui/field";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select";
import { Popover, PopoverContent, PopoverTitle, PopoverTrigger } from "@/components/ui/popover";
import { useRouter } from "@/i18n/navigation";

import { searchHref, type SearchQuery } from "./search-query";

const HALF_HOUR = 30;
// Every half hour of the day, "00:00" to "23:30", for the times to collect.
const times = Array.from({ length: (24 * 60) / HALF_HOUR }, (_, index) => {
  const minutes = index * HALF_HOUR;
  return `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`;
});
const thousands = new Intl.NumberFormat("vi-VN");

/** A choice applied in one press, such as "Dưới 20.000đ" or "Nhận ngay". */
export type RangePreset = { label: string; href: string; current: boolean };

// A filter chip over a range, the price or the time to collect, "từ … đến …" (Shopee's "Khoảng giá", Too
// Good To Go's pickup window): quick choices first, then the two ends, either of which may stay empty.
// Applying opens the search with the range in the address, keeping every other filter in `keep`; the address is
// written by the search's own serializer (search-params.ts).
export function RangeFilter({
  type,
  name,
  chosen,
  from,
  to,
  keep,
  params,
  presets,
  raised = false,
}: {
  type: "price" | "time";
  /** What the chip filters by, shown until a range is chosen, and the panel's title. */
  name: string;
  /** The chosen range in words, such as "20.000đ–50.000đ". */
  chosen?: string;
  from?: string;
  to?: string;
  /** The search's query without this filter. */
  keep: SearchQuery;
  /** The address's keys for the two ends. */
  params: readonly ["minPrice", "maxPrice"] | readonly ["from", "to"];
  presets: readonly RangePreset[];
  raised?: boolean;
}) {
  const t = useTranslations("Search");
  const router = useRouter();
  const id = useId();
  const [open, setOpen] = useState(false);
  const [invalid, setInvalid] = useState(false);

  function show(href: string) {
    router.push(href);
    setOpen(false);
  }

  function apply(form: FormData) {
    const read = (key: string) => {
      const value = form.get(key);
      const text = typeof value === "string" ? value : "";
      return type === "price" ? text.replace(/\D/g, "") : text;
    };
    const start = read("from");
    const end = read("to");
    const outOfOrder =
      start !== "" && end !== "" && (type === "price" ? Number(start) > Number(end) : start > end);
    setInvalid(outOfOrder);
    if (outOfOrder) return;
    const end_ = (text: string) =>
      text === "" ? undefined : type === "price" ? Number(text) : text;
    show(searchHref(keep, { [params[0]]: end_(start), [params[1]]: end_(end) }));
  }

  const field = (end: "from" | "to", value?: string) =>
    type === "price" ? (
      <PriceInput
        id={`${id}-${end}`}
        name={end}
        value={value}
        invalid={invalid}
        describedBy={invalid ? `${id}-order` : undefined}
        placeholder={t(end === "from" ? "lowest" : "highest")}
      />
    ) : (
      <NativeSelect
        id={`${id}-${end}`}
        name={end}
        defaultValue={value ?? ""}
        aria-invalid={invalid || undefined}
        aria-describedby={invalid ? `${id}-order` : undefined}
        size="lg"
        className="w-full"
      >
        <NativeSelectOption value="">{t("anyTime")}</NativeSelectOption>
        {times.map((time) => (
          <NativeSelectOption key={time} value={time}>
            {time}
          </NativeSelectOption>
        ))}
      </NativeSelect>
    );

  return (
    <Popover
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        setInvalid(false);
      }}
    >
      <PopoverTrigger
        variant="chip"
        raised={raised}
        data-active={chosen ? "" : undefined}
        // A chip showing its range still says what it filters by.
        aria-label={chosen ? `${name}: ${chosen}` : undefined}
      >
        {chosen ?? name}
        <ChevronDownIcon aria-hidden className="size-3.5" />
      </PopoverTrigger>
      <PopoverContent align="start" className="w-72">
        <form
          // Not `action`: React resets a form after its action, which would clear the range a person must
          // correct when it is out of order.
          onSubmit={(event) => {
            event.preventDefault();
            apply(new FormData(event.currentTarget));
          }}
          className="flex flex-col gap-2.5 p-1"
        >
          <PopoverTitle>{name}</PopoverTitle>
          <ul aria-label={t("quick")} className="flex flex-wrap gap-1.5">
            {presets.map((preset) => (
              <li key={preset.label}>
                <Button
                  type="button"
                  variant="chip"
                  size="chip-sm"
                  aria-pressed={preset.current}
                  onClick={() => show(preset.href)}
                >
                  {preset.label}
                </Button>
              </li>
            ))}
          </ul>
          <div className="grid grid-cols-2 gap-2">
            <div className="flex flex-col gap-1">
              <label htmlFor={`${id}-from`} className="text-label text-muted-foreground">
                {t("from")}
              </label>
              {field("from", from)}
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor={`${id}-to`} className="text-label text-muted-foreground">
                {t("to")}
              </label>
              {field("to", to)}
            </div>
          </div>
          {invalid && (
            <FieldError id={`${id}-order`} className="-mt-2">
              {t(type === "price" ? "priceOrder" : "timeOrder")}
            </FieldError>
          )}
          <div className="grid grid-cols-2 gap-2">
            <Button
              type="button"
              variant="secondary"
              size="panel"
              onClick={() => show(searchHref(keep))}
            >
              {t("clearFilter")}
            </Button>
            <Button type="submit" size="panel">
              {t("apply")}
            </Button>
          </div>
        </form>
      </PopoverContent>
    </Popover>
  );
}

/** A price in đồng, its thousands marked as it is typed ("20.000"), with "đ" after it. */
function PriceInput({
  id,
  name,
  value,
  placeholder,
  invalid,
  describedBy,
}: {
  id: string;
  name: string;
  value?: string;
  placeholder: string;
  invalid?: boolean;
  describedBy?: string;
}) {
  const [digits, setDigits] = useState(value ?? "");

  return (
    <InputGroup surface="panel">
      <InputGroupInput
        id={id}
        name={name}
        inputMode="numeric"
        autoComplete="off"
        placeholder={placeholder}
        aria-invalid={invalid || undefined}
        aria-describedby={describedBy}
        value={digits ? thousands.format(Number(digits)) : ""}
        onChange={(event) => setDigits(event.target.value.replace(/\D/g, "").slice(0, 8))}
      />
      <InputGroupAddon align="inline-end">đ</InputGroupAddon>
    </InputGroup>
  );
}
