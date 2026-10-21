"use client";

import type { LucideIcon } from "lucide-react";
import { useId } from "react";

import { RadioGroupItem } from "@/components/ui/radio-group";

// One choice of a RadioGroup as a white option with a 14px radius and a hairline, edged in Tasco blue once
// chosen (Figma K1a "lựa chọn", K5 "Thanh toán"). With an `icon` the option shows it in its radio's place
// until chosen (Figma K1a). A `disabled` option is shown dimmed and cannot be chosen; its `note` (as "sắp
// có") is read to a screen reader only (Figma K5 "Chuyển khoản", SEC-114).
export function ChoiceOption({
  value,
  title,
  hint,
  icon: Icon,
  disabled = false,
  note,
}: {
  value: string;
  title: string;
  hint?: string;
  icon?: LucideIcon;
  disabled?: boolean;
  note?: string;
}) {
  const id = useId();

  return (
    <label
      htmlFor={id}
      className="group flex min-h-16 items-center gap-3 rounded-lg border border-border bg-card px-3.5 py-3 transition-colors has-focus-visible:ring-3 has-focus-visible:ring-ring/50 has-data-checked:border-primary has-data-disabled:cursor-not-allowed has-data-disabled:opacity-50"
    >
      <span className="relative flex size-5 shrink-0 items-center justify-center">
        <span className={Icon ? "opacity-0 group-has-data-checked:opacity-100" : undefined}>
          <RadioGroupItem id={id} value={value} disabled={disabled} />
        </span>
        {Icon && (
          <Icon
            aria-hidden
            className="absolute size-5 text-primary group-has-data-checked:hidden"
          />
        )}
      </span>
      <span className="flex min-w-0 flex-1 flex-col">
        <span className="text-body-sm-strong text-foreground">
          {title}
          {note && <span className="sr-only"> {note}</span>}
        </span>
        {hint && <span className="text-label text-muted-foreground">{hint}</span>}
      </span>
    </label>
  );
}
