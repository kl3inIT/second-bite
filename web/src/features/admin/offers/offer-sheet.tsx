"use client";

import { BanIcon } from "lucide-react";
import Image from "next/image";
import { useFormatter, useTranslations } from "next-intl";
import type { ReactNode } from "react";

import { Button, buttonVariants } from "@/components/ui/button";
import { formatPrice } from "@/features/offers/format";
import { Link } from "@/i18n/navigation";

import { adminHref } from "../pages";
import { SideSheet } from "../ui/side-sheet";
import { type AdminOfferRow, canRemove } from "./offer";
import { OfferStatusBadge } from "./offer-status-badge";

/**
 * A post in the panel on the right (Figma AD-BD2), to look at, never to change: its photo, name and status, its
 * price against the original, what is left and held, the window, the weight, who posted it and its description.
 * At the foot the store's page, and taking the post down when it is still up (AD-BD3).
 */
export function OfferSheet({
  offer,
  onOpenChange,
  onRemove,
}: {
  offer?: AdminOfferRow;
  onOpenChange: (open: boolean) => void;
  onRemove: (offer: AdminOfferRow) => void;
}) {
  const t = useTranslations("admin.offers.sheet");

  return (
    <SideSheet
      open={offer !== undefined}
      onOpenChange={onOpenChange}
      title={t("title")}
      footer={
        offer && (
          <>
            <Link
              href={adminHref("sellerDetail", { sellerId: offer.sellerId })}
              className={buttonVariants({ variant: "neutral" })}
            >
              {t("store")}
            </Link>
            {canRemove(offer.status) && (
              <Button variant="destructive-outline" onClick={() => onRemove(offer)}>
                <BanIcon data-icon="inline-start" aria-hidden />
                {t("remove")}
              </Button>
            )}
          </>
        )
      }
    >
      {offer && <OfferFacts offer={offer} />}
    </SideSheet>
  );
}

/** What the panel shows of a post, under its title and over its foot. */
export function OfferFacts({ offer }: { offer: AdminOfferRow }) {
  const t = useTranslations("admin.offers.sheet");
  const kinds = useTranslations("OfferKind");
  const format = useFormatter();
  const start = new Date(offer.windowStart);
  const end = new Date(offer.windowEnd);
  const posted = new Date(offer.createdAt);
  const held =
    offer.unitsHeld > 0 ? ` · ${t("held", { count: offer.unitsHeld, unit: offer.unit })}` : "";

  return (
    <>
      {offer.photoUrl ? (
        <Image
          src={offer.photoUrl}
          alt=""
          width={432}
          height={200}
          unoptimized
          className="h-50 w-full rounded-md object-cover"
        />
      ) : (
        <span aria-hidden className="h-50 w-full rounded-md bg-muted" />
      )}
      <div className="flex flex-wrap items-center gap-2.5">
        <h3 className="text-headline text-foreground">{offer.name}</h3>
        <OfferStatusBadge status={offer.status} />
      </div>
      <p className="flex flex-wrap items-baseline gap-2">
        <span className="font-display text-price-lg text-primary">
          {formatPrice(offer.priceVnd)}
        </span>
        <s className="text-body-sm text-muted-foreground">{formatPrice(offer.originalPriceVnd)}</s>
        <span className="text-body-sm-strong text-sale">
          {t("discount", { percent: offer.discountPercent })}
        </span>
      </p>
      <section className="flex flex-col gap-3 rounded-2xl border border-border bg-card px-6 pt-5 pb-5.5">
        <h4 className="text-title-lg text-foreground">{t("info")}</h4>
        <dl className="flex flex-col gap-3">
          <Fact term={t("kind")}>{kinds(offer.kind)}</Fact>
          <Fact term={t("left")}>
            {t("leftValue", { left: offer.unitsLeft, units: offer.units, unit: offer.unit })}
            {held}
          </Fact>
          <Fact term={t("window")}>
            {t("windowValue", {
              start: format.dateTime(start, "time"),
              end: format.dateTime(end, "time"),
              day: format.dateTime(start, "day"),
            })}
          </Fact>
          {offer.weightGrams !== undefined && (
            <Fact term={t("weight", { unit: offer.unit })}>
              {t("weightValue", { grams: offer.weightGrams })}
            </Fact>
          )}
          <Fact term={t("posted")}>
            {t("postedValue", {
              time: format.dateTime(posted, "time"),
              day: format.dateTime(posted, "day"),
            })}
            {offer.postedBy && ` · ${offer.postedBy}`}
          </Fact>
        </dl>
      </section>
      {offer.description && (
        <div className="flex flex-col gap-1">
          <p className="text-label-strong text-muted-foreground">{t("description")}</p>
          <p className="text-body-sm whitespace-pre-line text-foreground">{offer.description}</p>
        </div>
      )}
    </>
  );
}

function Fact({ term, children }: { term: string; children: ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <dt className="shrink-0 text-body-sm text-muted-foreground">{term}</dt>
      <dd className="text-right text-body-sm-strong text-foreground">{children}</dd>
    </div>
  );
}
