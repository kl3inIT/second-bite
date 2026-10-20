"use client";

import { CircleCheckIcon, CircleSlashIcon, ClockIcon, PackageXIcon } from "lucide-react";
import Image from "next/image";
import { useFormatter, useTranslations } from "next-intl";
import { useEffect, useEffectEvent, useState } from "react";

import { Skeleton } from "@/components/ui/skeleton";
import { showAdminToast } from "@/features/admin/admin-toast";
import { AdminBadge, type BadgeTone } from "@/features/admin/ui/badge";
import { SideSheet } from "@/features/admin/ui/side-sheet";
import { formatPrice } from "@/features/offers/format";
import { getOffer, type OfferBody } from "@/lib/api/generated";

import type { PostStatus } from "./seller-posts";

const badges: Record<PostStatus, { tone: BadgeTone; icon: typeof CircleCheckIcon }> = {
  on_sale: { tone: "success", icon: CircleCheckIcon },
  sold_out: { tone: "warning", icon: PackageXIcon },
  closed: { tone: "neutral", icon: ClockIcon },
  withdrawn: { tone: "neutral", icon: CircleSlashIcon },
};

/**
 * A post read in the side panel (Figma AD-QD3), without leaving the store's page: read again from
 * `GET /offers/{id}` when it opens, so it shows the post as it is now. An admin only reads it. Who posted it is
 * not kept by the backend, so the panel does not show it.
 */
export function OfferSheet({ offerId, onClose }: { offerId?: string; onClose: () => void }) {
  const t = useTranslations("admin.sellers.detail.sheet");
  const [offer, setOffer] = useState<OfferBody>();
  const failed = useEffectEvent(() => {
    showAdminToast(t("failed"), "error");
    onClose();
  });

  useEffect(() => {
    if (!offerId) return;
    let current = true;
    getOffer({ path: { offerId } }).then(
      ({ data }) => current && setOffer(data),
      () => current && failed(),
    );
    return () => {
      current = false;
    };
  }, [offerId]);

  return (
    <SideSheet
      open={offerId !== undefined}
      onOpenChange={(open) => !open && onClose()}
      title={t("title")}
    >
      {offer?.id === offerId && offer ? (
        <OfferDetails offer={offer} />
      ) : (
        <output aria-label={t("loading")} className="flex flex-col gap-4">
          <Skeleton className="aspect-video w-full" />
          <Skeleton className="h-5 w-2/3" />
          <Skeleton className="h-24 w-full" />
        </output>
      )}
    </SideSheet>
  );
}

function OfferDetails({ offer }: { offer: OfferBody }) {
  const t = useTranslations("admin.sellers.detail");
  const kind = useTranslations("OfferKind");
  const format = useFormatter();
  const time = (at: string) => format.dateTime(new Date(at), "time");
  const moment = (at: string) =>
    `${format.dateTime(new Date(at), "day")} · ${format.dateTime(new Date(at), "time")}`;
  const { tone, icon } = badges[offer.status];

  return (
    <>
      <span className="relative aspect-video w-full overflow-hidden rounded-md bg-muted">
        <Image
          src={`/api${offer.photo.largePath}`}
          alt=""
          fill
          sizes="432px"
          unoptimized
          className="object-cover"
        />
      </span>
      <div className="flex flex-col gap-2">
        <h3 className="text-title-lg text-foreground">{offer.name}</h3>
        <span>
          <AdminBadge tone="info" icon={null}>
            {kind(offer.kind)}
          </AdminBadge>
        </span>
        <p className="flex items-baseline gap-2">
          <span className="font-display text-price-lg text-primary">
            {formatPrice(offer.priceVnd)}
          </span>
          <s className="text-body-sm text-muted-foreground">
            {formatPrice(offer.originalPriceVnd)}
          </s>
          <span className="text-body-sm-strong text-destructive">
            {t("posts.discount", { percent: offer.discountPercent })}
          </span>
        </p>
      </div>
      {offer.description && (
        <div className="flex flex-col gap-1">
          <h4 className="text-label-strong text-muted-foreground">{t("sheet.description")}</h4>
          <p className="text-body-sm whitespace-pre-line text-foreground">{offer.description}</p>
        </div>
      )}
      <dl className="flex flex-col">
        <Row label={t("sheet.status")}>
          <AdminBadge tone={tone} icon={icon}>
            {t(`posts.status.${offer.status}`)}
          </AdminBadge>
        </Row>
        <Row label={t("sheet.units")}>
          {t("sheet.unitsValue", {
            left: offer.unitsLeft,
            units: offer.units,
            unit: offer.unit,
            held: offer.units - offer.unitsLeft,
          })}
        </Row>
        {offer.weightGrams !== undefined && (
          <Row label={t("sheet.weight")}>
            {t("sheet.weightValue", { grams: offer.weightGrams })}
          </Row>
        )}
        <Row label={t("sheet.window")}>
          {`${time(offer.windowStart)}–${time(offer.windowEnd)} · ${format.dateTime(new Date(offer.windowStart), "day")}`}
        </Row>
        <Row label={t("sheet.place")}>{offer.collectionPoint.address}</Row>
        <Row label={t("sheet.created")}>{moment(offer.createdAt)}</Row>
        <Row label={t("sheet.updated")}>{moment(offer.updatedAt)}</Row>
      </dl>
    </>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-border py-2.5 last:border-b-0">
      <dt className="shrink-0 text-body-sm text-muted-foreground">{label}</dt>
      <dd className="text-right text-body-sm-strong text-foreground">{children}</dd>
    </div>
  );
}
