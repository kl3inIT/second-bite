import { useFormatter, useTranslations } from "next-intl";

import { ScrollRow } from "@/components/scroll-row";
import { SectionHeader } from "@/components/section-header";
import { DiscountLabel, PhotoLabel } from "@/features/offers/discount-label";
import { MiniCard } from "@/features/offers/mini-card";
import type { OfferSummary } from "@/features/offers/offer";
import { bestRatedFirst, sellerRating, type Announcement } from "@/features/offers/proposed";
import { Rating } from "@/features/offers/rating";
import { useCollectionWindow } from "@/features/offers/window";

import { FollowButton } from "./follow-button";

const ROW_COUNT = 6;

// The home's rows of small cards (Figma K1b): "Sắp có tối nay", what sellers expect later, and "Gợi ý cho
// bạn", the best-rated sellers' dishes. Each shows only when the backend returns what it needs.

export function UpcomingSection({ announcements }: { announcements: readonly Announcement[] }) {
  const t = useTranslations("Home");
  if (announcements.length === 0) return null;
  const soonest = announcements
    .toSorted((a, b) => Date.parse(a.windowStart) - Date.parse(b.windowStart))
    .slice(0, ROW_COUNT);

  return (
    <section aria-labelledby="upcoming" className="flex flex-col gap-3">
      <SectionHeader id="upcoming" title={t("upcoming")} />
      <ScrollRow label={t("upcoming")} className="gap-3">
        {soonest.map((announcement) => (
          <li key={announcement.id} className="shrink-0 snap-start">
            <UpcomingCard announcement={announcement} />
          </li>
        ))}
      </ScrollRow>
    </section>
  );
}

function UpcomingCard({ announcement }: { announcement: Announcement }) {
  const t = useTranslations("Home");
  const format = useFormatter();
  const opensAt = format.dateTime(new Date(announcement.windowStart), "time");

  return (
    <MiniCard
      offer={announcement}
      label={
        <PhotoLabel className="rounded-tl-lg">
          {t("expected", { units: announcement.estimatedUnits })}
        </PhotoLabel>
      }
      action={
        <FollowButton
          announcementId={announcement.id}
          dish={announcement.name}
          seller={announcement.seller.name}
          units={announcement.estimatedUnits}
          opensAt={opensAt}
        />
      }
      meta={t("opensAt", { time: opensAt })}
    />
  );
}

export function RecommendedSection({ offers }: { offers: readonly OfferSummary[] }) {
  const t = useTranslations("Home");
  const rated = bestRatedFirst(offers).slice(0, ROW_COUNT);
  if (rated.length === 0) return null;

  return (
    <section aria-labelledby="recommended" className="flex flex-col gap-3">
      <SectionHeader id="recommended" title={t("recommended")} />
      <ScrollRow label={t("recommended")} className="gap-3">
        {rated.map((offer) => (
          <li key={offer.id} className="shrink-0 snap-start">
            <RecommendedCard offer={offer} />
          </li>
        ))}
      </ScrollRow>
    </section>
  );
}

function RecommendedCard({ offer }: { offer: OfferSummary }) {
  const t = useTranslations("OfferCard");
  const { from, until } = useCollectionWindow(offer);
  const rating = sellerRating(offer);

  return (
    <MiniCard
      offer={offer}
      linked
      label={<DiscountLabel percent={offer.discountPercent} className="rounded-tl-lg" />}
      badge={rating !== undefined && <Rating rating={rating} badge />}
      meta={t("window", { from, until })}
    />
  );
}
