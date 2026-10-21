"use client";

import {
  ArrowRightIcon,
  CircleCheckIcon,
  ClockIcon,
  EllipsisIcon,
  GripVerticalIcon,
  ImageIcon,
  LayoutGridIcon,
  type LucideIcon,
  PauseIcon,
  PencilIcon,
  Trash2Icon,
} from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useId } from "react";

import type { VariantProps } from "class-variance-authority";

import { Badge, type badgeVariants } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { Item, ItemContent, ItemDescription, ItemMedia, ItemTitle } from "@/components/ui/item";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Link } from "@/i18n/navigation";

import { adminHref } from "../pages";
import type { CampaignStatus } from "../promotions/promotion";
import { useListQuery } from "../use-list-query";
import {
  type BannerPlacement,
  bannerPlacements,
  bannersIn,
  type ContentData,
  placementCounts,
} from "./banner";

// Each status on the Badge's own variants (Figma Admin/Badge in AD-MK3): the tick or the clock and the words carry
// the status, never the colour alone.
const statusBadges: Record<
  CampaignStatus,
  { variant: VariantProps<typeof badgeVariants>["variant"]; icon: LucideIcon }
> = {
  running: { variant: "fresh", icon: CircleCheckIcon },
  scheduled: { variant: "secondary", icon: ClockIcon },
  paused: { variant: "outline", icon: ClockIcon },
  ended: { variant: "outline", icon: ClockIcon },
};

/**
 * Banners and featured collections (Figma AD-MK3): "Thêm banner", a choice of where the banners show with how
 * many each place holds, the grid of that place's banners in their order, and the featured collections. The data
 * comes in `content`; until a backend keeps banners it is empty and each card shows its empty state.
 */
export function ContentView({
  content,
  placement,
}: {
  content: ContentData;
  placement: BannerPlacement;
}) {
  const t = useTranslations("admin.content");
  const tStatus = useTranslations("admin.promotions.status");
  const tShell = useTranslations("admin.shell");
  const soonId = useId();
  const { go } = useListQuery({ placement }, { placement: "home" });
  const counts = placementCounts(content.banners);
  const banners = bannersIn(content.banners, placement);

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-page-title text-foreground">{t("title")}</h1>
        <Link href={adminHref("bannerDetail", { bannerId: "new" })} className={buttonVariants()}>
          {t("addBanner")}
        </Link>
      </div>

      <ToggleGroup
        variant="outline"
        aria-label={t("placementLabel")}
        value={[placement]}
        onValueChange={([next]) => {
          if (next) go({ placement: next as BannerPlacement });
        }}
        className="max-w-full overflow-x-auto"
      >
        {bannerPlacements.map((each) => (
          <ToggleGroupItem key={each} value={each} className="h-11">
            {t("placementCount", { place: t(`placements.${each}`), count: counts[each] })}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>

      <section aria-labelledby="banners-title">
        <Card>
          <CardHeader>
            <CardTitle>
              <h2 id="banners-title">{t(`bannersOf.${placement}`)}</h2>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {banners.length === 0 ? (
              <Empty>
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <ImageIcon aria-hidden />
                  </EmptyMedia>
                  <EmptyTitle>{t(`emptyBanners.${placement}`)}</EmptyTitle>
                </EmptyHeader>
              </Empty>
            ) : (
              <ul className="grid gap-4 lg:grid-cols-2">
                {banners.map((banner) => {
                  const badge = statusBadges[banner.status];
                  return (
                    <li key={banner.id}>
                      <Item variant="outline" className="flex-col items-stretch">
                        <Item variant="muted">
                          <ItemContent className="min-w-0">
                            <ItemTitle>{banner.title}</ItemTitle>
                            <ItemDescription>{banner.subtitle}</ItemDescription>
                          </ItemContent>
                          <ItemMedia variant="image">
                            {banner.imageUrl ? (
                              <Image
                                src={banner.imageUrl}
                                alt=""
                                width={84}
                                height={60}
                                unoptimized
                              />
                            ) : (
                              <ImageIcon aria-hidden />
                            )}
                          </ItemMedia>
                          <ArrowRightIcon aria-hidden />
                        </Item>
                        <div className="flex items-center gap-2">
                          <GripVerticalIcon aria-hidden />
                          <h3 className="min-w-0 flex-1 truncate text-body-sm-strong text-foreground">
                            {t("bannerName", { position: banner.position, title: banner.title })}
                          </h3>
                          <Badge variant={badge.variant}>
                            <badge.icon aria-hidden />
                            {tStatus(banner.status)}
                          </Badge>
                          <DropdownMenu>
                            <DropdownMenuTrigger
                              render={<Button variant="ghost" size="icon" />}
                              aria-label={tShell("rowActions", { name: banner.title })}
                            >
                              <EllipsisIcon aria-hidden />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuGroup>
                                <DropdownMenuItem
                                  render={
                                    <Link
                                      href={adminHref("bannerDetail", { bannerId: banner.id })}
                                    />
                                  }
                                >
                                  <PencilIcon aria-hidden />
                                  {t("actions.edit")}
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem disabled>
                                  <PauseIcon aria-hidden />
                                  {t("actions.pause")}
                                </DropdownMenuItem>
                                <DropdownMenuItem variant="destructive" disabled>
                                  <Trash2Icon aria-hidden />
                                  {t("actions.delete")}
                                </DropdownMenuItem>
                              </DropdownMenuGroup>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </Item>
                    </li>
                  );
                })}
              </ul>
            )}
          </CardContent>
        </Card>
      </section>

      <section aria-labelledby="collections-title">
        <Card>
          <CardHeader>
            <CardTitle>
              <h2 id="collections-title">{t("collections")}</h2>
            </CardTitle>
            <CardAction>
              <div className="flex items-center gap-3">
                <Badge variant="outline" id={soonId}>
                  {tShell("soon")}
                </Badge>
                <Button variant="outline" disabled aria-describedby={soonId}>
                  {t("addCollection")}
                </Button>
              </div>
            </CardAction>
          </CardHeader>
          <CardContent>
            {content.collections.length === 0 ? (
              <Empty>
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <LayoutGridIcon aria-hidden />
                  </EmptyMedia>
                  <EmptyTitle>{t("emptyCollections")}</EmptyTitle>
                </EmptyHeader>
              </Empty>
            ) : (
              <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {content.collections.map((collection) => (
                  <li key={collection.id}>
                    <Item variant="muted">
                      <ItemMedia variant="image">
                        {collection.imageUrl ? (
                          <Image
                            src={collection.imageUrl}
                            alt=""
                            width={48}
                            height={48}
                            unoptimized
                          />
                        ) : (
                          <LayoutGridIcon aria-hidden />
                        )}
                      </ItemMedia>
                      <ItemContent className="min-w-0">
                        <ItemTitle>{collection.name}</ItemTitle>
                      </ItemContent>
                    </Item>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </section>
    </>
  );
}
