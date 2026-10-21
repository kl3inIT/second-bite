"use client";

import { SearchIcon } from "lucide-react";
import { useState } from "react";

import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { cn } from "@/lib/utils";

/**
 * A list's search field (SEC-75 › Lists): it shows what is typed at once and hands the trimmed words on,
 * which the list writes to the address with nuqs after a pause. Not a form: nothing is submitted.
 */
export function SearchBox({
  label,
  value,
  onChange,
  className,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
}) {
  const [text, setText] = useState(value);

  return (
    <InputGroup className={cn("h-11 w-full", className)}>
      <InputGroupAddon>
        <SearchIcon aria-hidden />
      </InputGroupAddon>
      <InputGroupInput
        type="search"
        aria-label={label}
        placeholder={label}
        value={text}
        maxLength={100}
        onChange={(event) => {
          setText(event.target.value);
          onChange(event.target.value.trim());
        }}
      />
    </InputGroup>
  );
}
