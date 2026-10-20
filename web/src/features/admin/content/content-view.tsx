"use client";

import {
  GripVerticalIcon,
  ImageIcon,
  LayoutGridIcon,
  PauseIcon,
  PencilIcon,
  Trash2Icon,
} from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useId } from "react";

import { Button, buttonVariants } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";

import { adminHref } from "../pages";
import { CampaignBadge } from "../promotions/campaign-badge";
import { SoonBadge } from "../promotions/soon-badge";
import { useListQuery } from "../promotions/use-list-query";
import { EmptyState } from "../ui/empty-state";
import { PageHeader } from "../ui/page-header";
import { RowActionMenu } from "../ui/row-action-menu";
import { SegmentedControl } from "../ui/segmented-control";
import {
  type BannerPlacement,
  type BannerRow,
  bannerPlacements,
  bannersIn,
  type Collection,
  type ContentData,
  placementCounts,
} from "./banner";
import { BannerArt } from "./banner-art";

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
  const tShell = useTranslations("admin.shell");
  const soonId = useId();
  const { go } = useListQuery({ placement }, { placement: "home" });
  const counts = placementCounts(content.banners);
  const banners = bannersIn(content.banners, placement);

  return (
    <>
      <PageHeader
        title={t("title")}
        actions={
          <Link href={adminHref("bannerDetail", { bannerId: "new" })} className={buttonVariants()}>
            {t("addBanner")}
          </Link>
        }
      />

      <div className="max-w-full overflow-x-auto">
        <SegmentedControl<BannerPlacement>
          label={t("placementLabel")}
          value={placement}
          segments={bannerPlacements.map((each) => ({
            value: each,
            label: t("placementCount", { place: t(`placements.${each}`), count: counts[each] }),
          }))}
          onChange={(next) => go({ placement: next })}
        />
      </div>

      <section
        aria-labelledby="banners-title"
        className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-6"
      >
        <h2 id="banners-title" className="text-title-lg text-foreground">
          {t(`bannersOf.${placement}`)}
        </h2>
        {banners.length === 0 ? (
          <EmptyState icon={ImageIcon} title={t(`emptyBanners.${placement}`)} />
        ) : (
          <ul className="grid gap-4 lg:grid-cols-2">
            {banners.map((banner) => (
              <li key={banner.id}>
                <BannerItem banner={banner} />
              </li>
            ))}
          </ul>
        )}
      </section>

      <section
        aria-labelledby="collections-title"
        className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-6"
      >
        <div className="flex flex-wrap items-center gap-4">
          <h2 id="collections-title" className="min-w-0 flex-1 text-title-lg text-foreground">
            {t("collections")}
          </h2>
          <SoonBadge id={soonId} />
          <Button variant="neutral" disabled title={tShell("soon")} aria-describedby={soonId}>
            {t("addCollection")}
          </Button>
        </div>
        {content.collections.length === 0 ? (
          <EmptyState icon={LayoutGridIcon} title={t("emptyCollections")} />
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {content.collections.map((collection) => (
              <li key={collection.id}>
                <CollectionTile collection={collection} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}

// One banner of the grid (Figma AD-MK3 › BannerItem): the banner on its pale ground, then its place and title,
// its status and its menu. The grip shows its order; moving banners waits for their backend.
function BannerItem({ banner }: { banner: BannerRow }) {
  const t = useTranslations("admin.content");
  const name = t("bannerName", { position: banner.position, title: banner.title });
  return (
    <article className="flex flex-col gap-3 rounded-xl border border-border bg-card p-3">
      <div className="flex h-26 items-center justify-center overflow-hidden rounded-md bg-muted px-4">
        <BannerArt title={banner.title} subtitle={banner.subtitle} imageUrl={banner.imageUrl} />
      </div>
      <div className="flex items-center gap-2">
        <GripVerticalIcon aria-hidden className="size-5 shrink-0 text-muted-foreground" />
        <h3 className="min-w-0 flex-1 truncate text-body-sm-strong text-foreground">{name}</h3>
        <CampaignBadge status={banner.status} />
        <RowActionMenu
          name={banner.title}
          actions={[
            {
              label: t("actions.edit"),
              icon: PencilIcon,
              href: adminHref("bannerDetail", { bannerId: banner.id }),
            },
            { label: t("actions.pause"), icon: PauseIcon, disabled: true },
            { label: t("actions.delete"), icon: Trash2Icon, destructive: true, disabled: true },
          ]}
        />
      </div>
    </article>
  );
}

// A featured collection (Figma AD-MK3 › Collection): its picture and its name on the pale ground.
function CollectionTile({ collection }: { collection: Collection }) {
  return (
    <div className="flex items-center gap-3 rounded-xl bg-muted p-3">
      {collection.imageUrl ? (
        <Image
          src={collection.imageUrl}
          alt=""
          width={48}
          height={48}
          unoptimized
          className="size-12 shrink-0 rounded-md object-cover"
        />
      ) : (
        <span aria-hidden className="size-12 shrink-0 rounded-md bg-card" />
      )}
      <span className="min-w-0 truncate text-body-sm-strong text-foreground">
        {collection.name}
      </span>
    </div>
  );
}
