"use client";

import { ChevronDownIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useId, useState } from "react";

import { Button } from "@/components/ui/button";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select";
import { Popover, PopoverContent, PopoverTitle, PopoverTrigger } from "@/components/ui/popover";
import { useRouter } from "@/i18n/navigation";

const HALF_HOUR = 30;
// Every half hour of the day, "00:00" to "23:30", for the times to collect.
const times = Array.from({ length: (24 * 60) / HALF_HOUR }, (_, index) => {
  const minutes = index * HALF_HOUR;
  return `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`;
});
const thousands = new Intl.NumberFormat("vi-VN");

/** A choice applied in one press, such as "Dưới 20.000đ" or "Nhận ngay". */
export type RangePreset = { label: string; query: Record<string, string>; current: boolean };

// A filter chip over a range, the price or the time to collect, "từ … đến …" (Shopee's "Khoảng giá", Too
// Good To Go's pickup window): quick choices first, then the two ends, either of which may stay empty.
// Applying opens the search with the range in the address, keeping every other filter in `keep`.
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
  keep: Record<string, string>;
  /** The address's keys for the two ends. */
  params: readonly [string, string];
  presets: readonly RangePreset[];
  raised?: boolean;
}) {
  const t = useTranslations("Search");
  const router = useRouter();
  const id = useId();
  const [open, setOpen] = useState(false);
  const [invalid, setInvalid] = useState(false);

  function show(query: Record<string, string>) {
    router.push({ pathname: "/search", query });
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
    const query = { ...keep };
    if (start) query[params[0]] = start;
    if (end) query[params[1]] = end;
    show(query);
  }

  const field = (end: "from" | "to", value?: string) =>
    type === "price" ? (
      <PriceInput
        id={`${id}-${end}`}
        name={end}
        value={value}
        placeholder={t(end === "from" ? "lowest" : "highest")}
      />
    ) : (
      <NativeSelect
        id={`${id}-${end}`}
        name={end}
        defaultValue={value ?? ""}
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
        <form action={apply} className="flex flex-col gap-2.5 p-1">
          <PopoverTitle>{name}</PopoverTitle>
          <ul aria-label={t("quick")} className="flex flex-wrap gap-1.5">
            {presets.map((preset) => (
              <li key={preset.label}>
                <Button
                  type="button"
                  variant="chip"
                  size="chip-sm"
                  aria-pressed={preset.current}
                  onClick={() => show(preset.query)}
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
            <p role="alert" className="-mt-2 text-label text-destructive">
              {t(type === "price" ? "priceOrder" : "timeOrder")}
            </p>
          )}
          <div className="grid grid-cols-2 gap-2">
            <Button type="button" variant="secondary" size="panel" onClick={() => show(keep)}>
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
}: {
  id: string;
  name: string;
  value?: string;
  placeholder: string;
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
        value={digits ? thousands.format(Number(digits)) : ""}
        onChange={(event) => setDigits(event.target.value.replace(/\D/g, "").slice(0, 8))}
      />
      <InputGroupAddon align="inline-end">đ</InputGroupAddon>
    </InputGroup>
  );
}
