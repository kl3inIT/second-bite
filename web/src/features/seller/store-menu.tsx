"use client";

import { MapPinnedIcon, MessageSquareTextIcon, PencilIcon, PlusIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

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

import { StoreFeedback } from "./store-feedback";

type Store = {
  id: string;
  name: string;
  photo?: { smallPath: string };
  photoId?: string;
  myRole?: "owner" | "staff";
};

// What the store's name in the header opens (Figma "Chủ quán · Mobile 390"): the store's location, the person's stores to move between with the one they are in standing out (filled, with a bar at its side), and a way to open another while they
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
  const [feedback, setFeedback] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger variant="header" className="min-w-0 justify-start">
          {children}
        </DropdownMenuTrigger>
        <DropdownMenuContent align={align} className="min-w-64">
          {current.myRole === "owner" && (
            <>
              <DropdownMenuGroup>
                <DropdownMenuItem render={<Link href={`/stores/${current.id}/edit`} />}>
                  <PencilIcon aria-hidden />
                  {t("edit")}
                </DropdownMenuItem>
                <DropdownMenuItem render={<Link href={`/stores/${current.id}/location`} />}>
                  <MapPinnedIcon aria-hidden />
                  {t("location")}
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
            </>
          )}
          <DropdownMenuGroup>
            <DropdownMenuLabel>{t("mine")}</DropdownMenuLabel>
            {stores.map((store) => (
              <DropdownMenuItem
                key={store.id}
                variant={store.id === current.id ? "current" : "default"}
                render={
                  <Link
                    href={`/stores/${store.id}`}
                    aria-current={store.id === current.id ? "true" : undefined}
                  />
                }
              >
                <SellerAvatar seller={store} size="sm" />
                <span className="min-w-0 flex-1 truncate">{store.name}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
          {/* What is hard or missing, told to the team by any of the store's people (SEC-82, Figma G1). */}
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={() => setFeedback(true)}>
              <MessageSquareTextIcon aria-hidden />
              {t("feedback")}
            </DropdownMenuItem>
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
      <StoreFeedback sellerId={current.id} open={feedback} onOpenChange={setFeedback} />
    </>
  );
}
