"use client";

import { CheckIcon, PlusIcon, StoreIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SellerAvatar } from "@/features/offers/seller-avatar";
import { Link } from "@/i18n/navigation";

type Store = { id: string; name: string; photo?: { smallPath: string } };

// What the store's name in the header opens (Figma "Chủ quán · Mobile 390"): the way back to the shop the customers
// use, the person's stores to move between with the one they are in marked, and a way to open another while they
// have room for one. It opens on a store of one too, so the name always does something. The name, with its avatar,
// is what the page puts inside; the menu does not know how it is drawn.
export function StoreMenu({
  current,
  stores,
  canCreate,
  align,
  children,
}: {
  current: Store;
  stores: readonly Store[];
  /** Whether the person may open one more store: they own fewer than the limit. */
  canCreate: boolean;
  align: "start" | "end";
  children: React.ReactNode;
}) {
  const t = useTranslations("StoreMenu");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger variant="header" className="min-w-0 justify-start">
        {children}
      </DropdownMenuTrigger>
      <DropdownMenuContent align={align} className="min-w-64">
        <DropdownMenuGroup>
          <DropdownMenuItem render={<Link href="/" />}>
            <StoreIcon aria-hidden />
            {t("shop")}
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuLabel>{t("mine")}</DropdownMenuLabel>
          {stores.map((store) => (
            <DropdownMenuItem
              key={store.id}
              render={
                <Link
                  href={`/stores/${store.id}`}
                  aria-current={store.id === current.id ? "true" : undefined}
                />
              }
            >
              <SellerAvatar seller={store} size="sm" />
              <span className="min-w-0 flex-1 truncate">{store.name}</span>
              {store.id === current.id && <CheckIcon aria-hidden />}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
        {canCreate && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem render={<Link href="/open-store" />}>
                <PlusIcon aria-hidden />
                {t("create")}
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
