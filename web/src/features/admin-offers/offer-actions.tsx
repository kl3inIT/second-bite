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
import type { OfferBody } from "@/lib/api/generated";

/**
 * A post row's "⋯" (Figma ĐX-3): what an admin does with it, which is only to open it in its panel, as no
 * operation lets an admin change or withdraw a post.
 */
export function OfferActions({
  offer,
  onOpen,
}: {
  offer: OfferBody;
  onOpen: (offer: OfferBody) => void;
}) {
  const t = useTranslations("Admin.offers");

  return (
    <div className="flex justify-end">
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button variant="ghost" size="icon" aria-label={t("actions", { name: offer.name })} />
          }
        >
          <EllipsisIcon aria-hidden />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => onOpen(offer)}>
            <EyeIcon aria-hidden />
            {t("view")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
