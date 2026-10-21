"use client";

import { CircleCheckIcon, CircleSlashIcon, ClockIcon, PackageXIcon, XIcon } from "lucide-react";
import Image from "next/image";
import { useFormatter, useTranslations } from "next-intl";
import { type ReactNode, useEffect, useEffectEvent, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/toast";
import { formatPrice } from "@/features/offers/format";
import { getOffer, type OfferBody } from "@/lib/api/generated";

import { type BadgeTone, toneBadge } from "./seller-list";
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
  const close = useTranslations("admin.shell")("sheetClose");
  const [offer, setOffer] = useState<OfferBody>();
  const failed = useEffectEvent(() => {
    toast.add({ title: t("failed"), type: "error", timeout: 5000 });
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
    <Sheet open={offerId !== undefined} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="right" showCloseButton={false}>
        <SheetHeader variant="bar" className="items-center justify-between">
          <SheetTitle variant="headline">{t("title")}</SheetTitle>
          <SheetClose render={<Button variant="ghost" size="icon" aria-label={close} />}>
            <XIcon aria-hidden />
          </SheetClose>
        </SheetHeader>
        <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-6 pb-6">
          {offer?.id === offerId && offer ? (
            <OfferDetails offer={offer} />
          ) : (
            <output aria-label={t("loading")} className="flex flex-col gap-4">
              <Skeleton className="aspect-video w-full" />
              <Skeleton className="h-5 w-2/3" />
              <Skeleton className="h-24 w-full" />
            </output>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

function OfferDetails({ offer }: { offer: OfferBody }) {
  const t = useTranslations("admin.sellers.detail");
  const kind = useTranslations("OfferKind");
  const format = useFormatter();
  const time = (at: string) => format.dateTime(new Date(at), "time");
  const moment = (at: string) =>
    `${format.dateTime(new Date(at), "day")} · ${format.dateTime(new Date(at), "time")}`;
  const { tone, icon: Icon } = badges[offer.status];

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
          <Badge variant={toneBadge.info}>{kind(offer.kind)}</Badge>
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
          <Badge variant={toneBadge[tone]}>
            <Icon aria-hidden />
            {t(`posts.status.${offer.status}`)}
          </Badge>
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

// One line of the post's facts: its name muted on the left, its value on the right, a hairline under it.
function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-border py-2.5 last:border-b-0">
      <dt className="shrink-0 text-body-sm text-muted-foreground">{label}</dt>
      <dd className="text-right text-body-sm-strong text-foreground">{children}</dd>
    </div>
  );
}
