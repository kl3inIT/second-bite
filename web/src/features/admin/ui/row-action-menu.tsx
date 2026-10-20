"use client";

import { EllipsisIcon, type LucideIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { Fragment } from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link } from "@/i18n/navigation";

export type RowAction = {
  label: string;
  icon: LucideIcon;
  /** A link, such as "Xem chi tiết", or a handler, such as "Chặn cửa hàng…" opening its ConfirmDialog. */
  href?: string;
  onSelect?: () => void;
  /** Red, for what takes something away (Figma Admin/ActionMenuItem tone=destructive). */
  destructive?: boolean;
  disabled?: boolean;
};

/**
 * The ⋯ at the end of a row (docs: admin-web-flow › Thao tác trên dòng; Figma Admin/IconButton, Admin/ActionMenu):
 * a 44px button named "Thao tác với {name}" that opens the row's actions, 36px each, with a hairline after the
 * first ("Xem chi tiết") as Figma draws it. The menu has no line naming the row.
 */
export function RowActionMenu({ name, actions }: { name: string; actions: RowAction[] }) {
  const t = useTranslations("admin.shell");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger variant="icon" aria-label={t("rowActions", { name })}>
        <EllipsisIcon aria-hidden />
      </DropdownMenuTrigger>
      <DropdownMenuContent size="admin" align="end">
        <DropdownMenuGroup>
          {actions.map(({ label, icon: Icon, href, onSelect, destructive, disabled }, index) => (
            <Fragment key={label}>
              {index === 1 && <DropdownMenuSeparator />}
              <DropdownMenuItem
                variant={destructive ? "destructive" : "default"}
                disabled={disabled}
                onClick={onSelect}
                render={href ? <Link href={href} /> : undefined}
              >
                <Icon aria-hidden />
                {label}
              </DropdownMenuItem>
            </Fragment>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
