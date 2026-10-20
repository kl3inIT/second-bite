"use client";

import { useId } from "react";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

/**
 * One choice of a few, each on its own bordered row, the chosen one edged in blue on the sky (Figma AD-BL3
 * "Kết quả xử lý", AD-DG2 "Lý do ẩn"). `label` heads the list and names the group.
 */
export function ChoiceCards<Value extends string>({
  label,
  value,
  choices,
  onChange,
}: {
  label: string;
  value: Value;
  choices: { value: Value; label: string }[];
  onChange: (value: Value) => void;
}) {
  const id = useId();
  return (
    <div className="flex flex-col gap-2">
      <p id={id} className="text-label-strong text-foreground">
        {label}
      </p>
      <RadioGroup
        aria-labelledby={id}
        value={value}
        onValueChange={(next) => onChange(next as Value)}
      >
        {choices.map((choice) => (
          <label
            key={choice.value}
            className="flex min-h-12 cursor-pointer items-center gap-3 rounded-md border border-border bg-card px-4 py-3 text-body-sm text-foreground transition-colors hover:bg-muted has-data-checked:border-2 has-data-checked:border-primary has-data-checked:bg-muted has-data-checked:px-3.75 has-data-checked:py-2.75"
          >
            <RadioGroupItem value={choice.value} />
            {choice.label}
          </label>
        ))}
      </RadioGroup>
    </div>
  );
}
