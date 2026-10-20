"use client";

import { PackageIcon, StoreIcon, UsersIcon } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { adminHref } from "@/features/admin/pages";
import { StatusBadge } from "@/features/admin/ui/badge";
import { RowActionMenu } from "@/features/admin/ui/row-action-menu";
import type { SellerBody } from "@/lib/api/generated";

import { useSellerActions } from "./seller-actions";
import { sellerPhoto } from "./seller-photo";

/**
 * The head of a store's page (Figma Admin/DetailHeader, AD-Q3, AD-Q4): its newest posts' photos across the top,
 * its photo, its name and status, the ⋯ menu and the one status action, "Chặn cửa hàng" in a red edge, or
 * "Gỡ chặn" or "Duyệt" in full colour. Blocking asks first (AD-Q7); the others run at once.
 */
export function SellerHeader({ seller, cover }: { seller: SellerBody; cover: string[] }) {
  const t = useTranslations("admin.sellers.detail");
  const actions = useSellerActions();
  const action = actions.actionFor(seller);
  const Icon = action.icon;
  const href = adminHref("sellerDetail", { sellerId: seller.id });
  const logo = sellerPhoto(seller, 400);

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
        <span className="relative flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-md border border-border bg-muted text-muted-foreground">
          {logo ? (
            <Image src={logo} alt="" fill sizes="56px" unoptimized className="object-cover" />
          ) : (
            <StoreIcon aria-hidden className="size-6" />
          )}
        </span>
        <div className="flex min-w-0 flex-1 basis-48 flex-wrap items-center gap-3">
          <h1 className="text-headline text-foreground">{seller.name}</h1>
          <StatusBadge status={seller.status} />
        </div>
        <div className="ml-auto flex items-center gap-2.5">
          <RowActionMenu
            name={seller.name}
            actions={[
              { label: t("menu.posts"), icon: PackageIcon, href: `${href}?tab=posts` },
              { label: t("menu.members"), icon: UsersIcon, href: `${href}?tab=members` },
              {
                label: action.menuLabel,
                icon: action.icon,
                destructive: action.destructive,
                disabled: actions.locked,
                onSelect: () => actions.act(seller),
              },
            ]}
          />
          <Button
            variant={action.kind === "block" ? "destructive-outline" : "default"}
            disabled={actions.locked}
            onClick={() => actions.act(seller)}
          >
            {actions.pending === seller.id ? (
              <Spinner data-icon="inline-start" />
            ) : (
              <Icon data-icon="inline-start" aria-hidden />
            )}
            {action.label}
          </Button>
        </div>
      </div>
      {actions.dialog}
    </section>
  );
}
