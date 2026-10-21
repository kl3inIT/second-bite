"use client";

import { BanIcon } from "lucide-react";
import Image from "next/image";
import { useFormatter, useTranslations } from "next-intl";

import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { formatPrice } from "@/features/offers/format";
import { Link } from "@/i18n/navigation";

import { adminHref } from "../pages";
import { type AdminOfferRow, canRemove, statusLook } from "./offer";

/**
 * A post in the panel on the right (Figma AD-BD2), to look at, never to change: its photo, name and status, its
 * price against the original, what is left and held, the window, the weight, who posted it and its description.
 * At the foot the store's page, and taking the post down when it is still up (AD-BD3). On a phone the panel takes
 * the whole width.
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
    <Sheet open={offer !== undefined} onOpenChange={onOpenChange}>
      <SheetContent side="right">
        <SheetHeader variant="bar">
          <SheetTitle variant="headline">{t("title")}</SheetTitle>
        </SheetHeader>
        <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-6 py-5">
          {offer && <OfferFacts offer={offer} />}
        </div>
        {offer && (
          <SheetFooter variant="bar">
            <Link
              href={adminHref("sellerDetail", { sellerId: offer.sellerId })}
              className={buttonVariants({ variant: "outline" })}
            >
              {t("store")}
            </Link>
            {canRemove(offer.status) && (
              <Button variant="destructive" onClick={() => onRemove(offer)}>
                <BanIcon data-icon="inline-start" aria-hidden />
                {t("remove")}
              </Button>
            )}
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}

/** What the panel shows of a post, under its title and over its foot. */
export function OfferFacts({ offer }: { offer: AdminOfferRow }) {
  const t = useTranslations("admin.offers");
  const kinds = useTranslations("OfferKind");
  const format = useFormatter();
  const start = new Date(offer.windowStart);
  const end = new Date(offer.windowEnd);
  const posted = new Date(offer.createdAt);
  const status = statusLook(offer.status);
  const held =
    offer.unitsHeld > 0
      ? ` · ${t("sheet.held", { count: offer.unitsHeld, unit: offer.unit })}`
      : "";
  const facts = [
    { term: t("sheet.kind"), value: kinds(offer.kind) },
    {
      term: t("sheet.left"),
      value: `${t("sheet.leftValue", { left: offer.unitsLeft, units: offer.units, unit: offer.unit })}${held}`,
    },
    {
      term: t("sheet.window"),
      value: t("sheet.windowValue", {
        start: format.dateTime(start, "time"),
        end: format.dateTime(end, "time"),
        day: format.dateTime(start, "day"),
      }),
    },
    ...(offer.weightGrams !== undefined
      ? [
          {
            term: t("sheet.weight", { unit: offer.unit }),
            value: t("sheet.weightValue", { grams: offer.weightGrams }),
          },
        ]
      : []),
    {
      term: t("sheet.posted"),
      value: `${t("sheet.postedValue", {
        time: format.dateTime(posted, "time"),
        day: format.dateTime(posted, "day"),
      })}${offer.postedBy ? ` · ${offer.postedBy}` : ""}`,
    },
  ];

  return (
    <>
      {offer.photoUrl && (
        <Image
          src={offer.photoUrl}
          alt=""
          width={432}
          height={200}
          unoptimized
          className="h-50 w-full rounded-md object-cover"
        />
      )}
      <div className="flex flex-wrap items-center gap-2.5">
        <h3 className="text-headline text-foreground">{offer.name}</h3>
        <Badge variant={status.variant}>
          <status.icon aria-hidden />
          {t(`status.${offer.status}`)}
        </Badge>
      </div>
      <p className="flex flex-wrap items-baseline gap-2">
        <span className="font-display text-price-lg text-primary">
          {formatPrice(offer.priceVnd)}
        </span>
        <s className="text-body-sm text-muted-foreground">{formatPrice(offer.originalPriceVnd)}</s>
        <Badge variant="discount">{t("sheet.discount", { percent: offer.discountPercent })}</Badge>
      </p>
      <Card>
        <CardHeader>
          <CardTitle>
            <h4>{t("sheet.info")}</h4>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="flex flex-col gap-3">
            {facts.map(({ term, value }) => (
              <div key={term} className="flex items-center justify-between gap-3">
                <dt className="shrink-0 text-body-sm text-muted-foreground">{term}</dt>
                <dd className="text-right text-body-sm-strong text-foreground">{value}</dd>
              </div>
            ))}
          </dl>
        </CardContent>
      </Card>
      {offer.description && (
        <div className="flex flex-col gap-1">
          <p className="text-label-strong text-muted-foreground">{t("sheet.description")}</p>
          <p className="text-body-sm whitespace-pre-line text-foreground">{offer.description}</p>
        </div>
      )}
    </>
  );
}
