import { ChevronLeftIcon } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { Link } from "@/i18n/navigation";

import { getStoreReviews } from "./my-sellers";
import { requireStore } from "./require-store";
import { ReviewItem } from "./review-item";
import { ReviewSummary } from "./review-summary";
import { loadReviewSearchParams, serializeReviewSearchParams } from "./search-params";
import { StatusTabs } from "./status-tabs";
import { StorePanel } from "./store-panel";
import { countsOf, reviewFilters, starsOf } from "./store-reviews";

/** How many reviews the page lists at most; the pilot's stores do not reach it, and the page says so when one does. */
const LISTED = 50;

// The page of a store's reviews (SEC-154, Figma Q1b-5): a pushed screen on a phone, with the mean and the bars, four
// cells that filter by stars (the choice is in the address) and the list, the latest first. It reads the session,
// so it renders inside Suspense.
export async function StoreReviewsPage({
  sellerId: pendingId,
  query: pendingQuery,
}: {
  sellerId: Promise<string>;
  query: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sellerId = await pendingId;
  const filter = loadReviewSearchParams(await pendingQuery).filter;

  await requireStore(sellerId, `/stores/${sellerId}/reviews`);
  const [t, all] = await Promise.all([
    getTranslations("StoreReviews"),
    getStoreReviews(sellerId, [], LISTED),
  ]);
  const shown = filter === "all" ? all : await getStoreReviews(sellerId, starsOf(filter), LISTED);
  const counts = countsOf(all.counts);

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-4">
      <div className="flex flex-col gap-1 max-md:hidden">
        <Link
          href={`/stores/${sellerId}`}
          className="flex min-h-11 w-fit items-center gap-1 text-body-sm-strong text-primary"
        >
          <ChevronLeftIcon aria-hidden className="size-4" />
          {t("backToHome")}
        </Link>
        <h1 className="text-page-title">{t("title")}</h1>
      </div>
      <h1 className="sr-only md:hidden">{t("title")}</h1>

      <StorePanel labelledBy="store-reviews-summary">
        <h2 id="store-reviews-summary" className="sr-only">
          {t("summary")}
        </h2>
        <ReviewSummary reviews={all} />
      </StorePanel>

      <StatusTabs
        label={t("filters")}
        selected={filter}
        scroll={false}
        tabs={reviewFilters.map((name) => ({
          name,
          href: `/stores/${sellerId}/reviews${serializeReviewSearchParams({ filter: name })}`,
          label: t(`filter.${name}`),
          accessibleLabel: t("filterCount", { name: t(`filter.${name}`), count: counts[name] }),
          count: counts[name],
        }))}
      />

      <StorePanel labelledBy="store-reviews-list">
        <h2 id="store-reviews-list" className="sr-only">
          {t("list")}
        </h2>
        {shown.items.length === 0 ? (
          <p className="text-body-sm text-muted-foreground">
            {counts.all === 0 ? t("empty") : t("noneOfThese")}
          </p>
        ) : (
          <ul className="flex flex-col">
            {shown.items.map((review) => (
              <ReviewItem key={review.orderId} review={review} />
            ))}
          </ul>
        )}
        {shown.total > shown.items.length ? (
          <p className="text-note text-muted-foreground">
            {t("limit", { shown: shown.items.length, total: shown.total })}
          </p>
        ) : null}
      </StorePanel>
    </div>
  );
}
