"use client";

import { ChevronDownIcon } from "lucide-react";
import { useQueryStates } from "nuqs";
import { useFormatter, useTranslations } from "next-intl";
import { useTransition } from "react";

import { Button } from "@/components/ui/button";
import type { GetOfferUnitsForAdminsResponse } from "@/lib/api/generated";
import { cn } from "@/lib/utils";

import { offerSearchParams } from "./search-params";

export type OfferUnits = GetOfferUnitsForAdminsResponse;

const boxId = "offer-units";

/**
 * "Xem số suất" at the end of the title's row (approved HTML preview, 22 November 2026): it opens and closes the
 * "Sản phẩm" box over the list, kept in the address, so the server reads its numbers only while it is open.
 */
export function UnitsToggle() {
  const t = useTranslations("Admin.offers.units");
  const [pending, startTransition] = useTransition();
  const [{ units }, setParams] = useQueryStates(offerSearchParams, {
    shallow: false,
    startTransition,
  });

  return (
    <Button
      variant="outline"
      aria-expanded={units}
      aria-controls={boxId}
      aria-busy={pending}
      onClick={() => void setParams({ units: !units })}
    >
      {units ? t("hide") : t("show")}
      <ChevronDownIcon
        data-icon="inline-end"
        className={cn("transition-transform", units && "rotate-180")}
      />
    </Button>
  );
}

/**
 * What became of the units of every post the filters keep (GET /admin/offer-units): posted, sold, waiting, not
 * collected and left, each in portions with the posts or customers behind it. Orders stand for customers.
 */
export function UnitsBox({ units }: { units: OfferUnits }) {
  const t = useTranslations("Admin.offers.units");
  const format = useFormatter();
  const figures = [
    { key: "posted", value: units.posted, note: t("postedNote", { posts: units.posts }), tone: "" },
    {
      key: "collected",
      value: units.collected,
      note: t("collectedNote", { customers: units.collectedOrders }),
      tone: "good",
    },
    {
      key: "held",
      value: units.held,
      note: t("heldNote", { customers: units.heldOrders }),
      tone: "",
    },
    {
      key: "missed",
      value: units.missed,
      note: t("missedNote", { customers: units.missedOrders }),
      tone: units.missed > 0 ? "warn" : "",
    },
    {
      key: "left",
      value: units.left,
      note: units.leftover > 0 ? t("leftoverNote", { leftover: units.leftover }) : t("leftNote"),
      tone: units.leftover > 0 ? "warn" : "",
    },
  ] as const;

  return (
    <section id={boxId} aria-labelledby={`${boxId}-title`} className="flex flex-col gap-3">
      {/* The title stands over the box, not inside it (asked on 22 November 2026). */}
      <h2 id={`${boxId}-title`} className="text-title-lg text-foreground">
        {t("title")}
      </h2>
      <dl className="grid grid-cols-2 gap-4 rounded-2xl border border-border bg-card p-4 md:grid-cols-3 md:px-5 xl:grid-cols-5 xl:gap-0 xl:divide-x xl:divide-border">
        {figures.map((f) => (
          <div
            key={f.key}
            className="flex min-w-0 flex-col gap-0.5 last:col-span-2 md:last:col-span-1 xl:px-5 xl:first:ps-0"
          >
            <dt className="text-body-sm-strong text-muted-foreground">{t(f.key)}</dt>
            <dd className="flex items-baseline gap-1">
              <span className="font-display text-headline text-foreground">
                {format.number(f.value)}
              </span>
              <span className="text-body-sm text-muted-foreground">{t("unit")}</span>
            </dd>
            <dd
              className={
                f.tone === "good"
                  ? "text-label-strong text-success"
                  : f.tone === "warn"
                    ? "text-label-strong text-warning-foreground"
                    : "text-label text-muted-foreground"
              }
            >
              {f.note}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
