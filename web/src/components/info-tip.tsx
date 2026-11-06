"use client";

import { InfoIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

// A hint behind an info icon beside a label, instead of a line under the field (Figma L1, SEC-158). It opens under the
// pointer and on a tap, since stores post from a phone, which has no hover; a tooltip opens on neither a tap nor a
// screen reader's activation. The icon draws 16px in a 44px target.
export function InfoTip({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <Popover>
      <PopoverTrigger
        openOnHover
        delay={0}
        render={<Button type="button" variant="ghost" size="hint" aria-label={label} />}
      >
        <InfoIcon aria-hidden />
      </PopoverTrigger>
      <PopoverContent variant="tip" side="top">
        {children}
      </PopoverContent>
    </Popover>
  );
}
