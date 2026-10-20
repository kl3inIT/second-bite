"use client";

import { useTranslations } from "next-intl";

import { Switch } from "@/components/ui/switch";

/**
 * A row's on and off with its state in words (Figma AD-CD1 "Đang hiện", AD-CD2 "Đang mở"), so it is not told by
 * colour alone. It cannot be turned until its backend exists; its hint says "Sắp có".
 */
export function ShownSwitch({
  checked,
  label,
  on,
  off,
}: {
  checked: boolean;
  label: string;
  on: string;
  off: string;
}) {
  const soon = useTranslations("admin.shell")("soon");
  return (
    <span className="flex items-center gap-2.5 whitespace-nowrap" title={soon}>
      <Switch checked={checked} disabled aria-label={label} />
      <span className="text-body-sm text-foreground">{checked ? on : off}</span>
    </span>
  );
}
