"use client";

import { EllipsisIcon, PackageIcon, StoreIcon, UsersIcon } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useId } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Spinner } from "@/components/ui/spinner";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { isFeatureOn } from "@/features/admin/features";
import { adminHref } from "@/features/admin/pages";
import { Link } from "@/i18n/navigation";
import type { SellerBody } from "@/lib/api/generated";

import { type StatusAction, useSellerActions } from "./seller-actions";
import { sellerStatusLook, toneBadge } from "./seller-list";
import { sellerPhoto } from "./seller-photo";

/**
 * The head of a store's page (Figma Admin/DetailHeader, AD-Q3, AD-Q4): its newest posts' photos across the top,
 * its photo, its name and status, the ⋯ menu and the status action, "Chặn cửa hàng" in red, or "Gỡ chặn" or
 * "Duyệt" in full colour. Blocking asks first (AD-Q7); the others run at once.
 *
 * With the `storeReview` flag (`review`, SEC-64, SEC-65) a pending store shows "Từ chối" in red beside "Duyệt"
 * (AD-DS2), and a store with no owner left (`ownerless`) cannot be unblocked or approved, which a tooltip and the
 * button's description say (AD-DS6).
 */
export function SellerHeader({
  seller,
  cover,
  review = isFeatureOn("storeReview"),
  ownerless = false,
}: {
  seller: SellerBody;
  cover: string[];
  review?: boolean;
  ownerless?: boolean;
}) {
  const t = useTranslations("admin.sellers.detail");
  const shell = useTranslations("admin.shell");
  const actions = useSellerActions({ review });
  const statusActions = actions.actionsFor(seller, { ownerless });
  const href = adminHref("sellerDetail", { sellerId: seller.id });
  const logo = sellerPhoto(seller, 400);
  const { tone, icon: StatusIcon } = sellerStatusLook[seller.status];

  return (
    <section className="flex flex-col gap-5">
      <div className="flex h-28 overflow-hidden rounded-3xl bg-secondary md:h-40">
        {cover.map((path) => (
          <span key={path} className="relative flex-1">
            <Image
              src={`/api${path}`}
              alt=""
              fill
              sizes="33vw"
              unoptimized
              className="object-cover"
            />
          </span>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <Avatar size="lg" aria-hidden>
          {logo && <AvatarImage src={logo} alt="" />}
          <AvatarFallback>
            <StoreIcon aria-hidden className="size-5" />
          </AvatarFallback>
        </Avatar>
        <div className="flex min-w-0 flex-1 basis-48 flex-wrap items-center gap-3">
          <h1 className="text-headline text-foreground">{seller.name}</h1>
          <Badge variant={toneBadge[tone]}>
            <StatusIcon aria-hidden />
            {shell(`status.${seller.status}`)}
          </Badge>
        </div>
        <div className="ml-auto flex items-center gap-2.5">
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label={shell("rowActions", { name: seller.name })}
                />
              }
            >
              <EllipsisIcon aria-hidden />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuGroup>
                <DropdownMenuItem render={<Link href={`${href}?tab=posts`} />}>
                  <PackageIcon aria-hidden />
                  {t("menu.posts")}
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem render={<Link href={`${href}?tab=members`} />}>
                  <UsersIcon aria-hidden />
                  {t("menu.members")}
                </DropdownMenuItem>
                {statusActions.map((action) => (
                  <MenuAction
                    key={action.kind}
                    action={action}
                    disabled={actions.locked || action.refusal !== undefined}
                    onSelect={() => actions.act(seller, action.kind)}
                  />
                ))}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          {/* The main action sits last, at the right: "Từ chối" then "Duyệt" (AD-DS2). */}
          {statusActions.toReversed().map((action) => (
            <ActionButton
              key={action.kind}
              action={action}
              disabled={actions.locked || action.refusal !== undefined}
              pending={actions.pending === seller.id}
              onClick={() => actions.act(seller, action.kind)}
            />
          ))}
        </div>
      </div>
      {actions.dialog}
    </section>
  );
}

// A status action in the ⋯ menu; one that cannot be taken says why in a tooltip.
function MenuAction({
  action,
  disabled,
  onSelect,
}: {
  action: StatusAction;
  disabled: boolean;
  onSelect: () => void;
}) {
  const Icon = action.icon;
  const item = (
    <DropdownMenuItem
      variant={action.destructive ? "destructive" : "default"}
      disabled={disabled}
      onClick={onSelect}
    >
      <Icon aria-hidden />
      {action.menuLabel}
    </DropdownMenuItem>
  );
  if (!action.refusal) return item;
  return (
    <Tooltip>
      <TooltipTrigger render={<div />}>{item}</TooltipTrigger>
      <TooltipContent side="left">{action.refusal}</TooltipContent>
    </Tooltip>
  );
}

// A status action as a button; one that cannot be taken says why in a tooltip and in its description.
function ActionButton({
  action,
  disabled,
  pending,
  onClick,
}: {
  action: StatusAction;
  disabled: boolean;
  pending: boolean;
  onClick: () => void;
}) {
  const reasonId = useId();
  const Icon = action.icon;
  const button = (
    <Button
      variant={action.destructive ? "destructive" : "default"}
      disabled={disabled}
      aria-describedby={action.refusal ? reasonId : undefined}
      onClick={onClick}
    >
      {pending ? (
        <Spinner data-icon="inline-start" />
      ) : (
        <Icon data-icon="inline-start" aria-hidden />
      )}
      {action.label}
    </Button>
  );
  if (!action.refusal) return button;
  return (
    <>
      {/* A disabled button takes no pointer, so its reason sits on a wrapper the pointer reaches. */}
      <Tooltip>
        <TooltipTrigger render={<span />}>{button}</TooltipTrigger>
        <TooltipContent>{action.refusal}</TooltipContent>
      </Tooltip>
      <span id={reasonId} className="sr-only">
        {action.refusal}
      </span>
    </>
  );
}
