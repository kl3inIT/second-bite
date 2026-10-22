"use client";

import { EllipsisIcon, EyeIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link } from "@/i18n/navigation";
import type { OrderBody } from "@/lib/api/generated";

/**
 * An order row's "⋯" (Figma AD-QD6, ĐX-2): what an admin does with it, which is only to open its page, as
 * admins read orders and never act on them. From a store's orders tab the page's crumbs lead back to the store.
 */
export function OrderActions({
  order,
  fromStore = false,
}: {
  order: OrderBody;
  fromStore?: boolean;
}) {
  const t = useTranslations("Admin.orders");
  const href = fromStore ? `/admin/orders/${order.id}?from=store` : `/admin/orders/${order.id}`;

  return (
    <div className="flex justify-end">
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              variant="ghost"
              size="icon"
              aria-label={t("actions", { number: order.number })}
            />
          }
        >
          <EllipsisIcon aria-hidden />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem render={<Link href={href} />}>
            <EyeIcon aria-hidden />
            {t("view")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
