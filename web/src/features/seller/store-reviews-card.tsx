import { ChevronRightIcon } from "lucide-react";
import { getFormatter, getTranslations } from "next-intl/server";

import { Link } from "@/i18n/navigation";
import type { SellerReviewsOutputBody } from "@/lib/api/generated";

import { ReviewItem } from "./review-item";
import { ReviewStars } from "./review-stars";
import { ReviewSummary } from "./review-summary";
import { StorePanel } from "./store-panel";
import { countsOf } from "./store-reviews";

const ONE_DECIMAL = { minimumFractionDigits: 1, maximumFractionDigits: 1 } as const;

/**
 * The store's reviews on its home, under the posts and the catalog (Figma Q1b-3, Q1b-4): the mean and how many
 * give each number of stars, the latest reviews, and the way to all of them. It does not follow the day above it,
 * since a review does not end with a post. On a phone it is a line of the mean and the latest review.
 */
export async function StoreReviewsCard({
  sellerId,
  reviews,
}: {
  sellerId: string;
  reviews: SellerReviewsOutputBody;
}) {
  const [t, format] = await Promise.all([getTranslations("StoreReviews"), getFormatter()]);
  const total = countsOf(reviews.counts).all;

  return (
    <StorePanel labelledBy="store-reviews">
      <div className="flex items-center justify-between gap-4">
        <h2 id="store-reviews" className="text-card-title">
          {t("title")}
        </h2>
        {total > 0 ? (
          <Link
            href={`/stores/${sellerId}/reviews`}
            className="flex min-h-11 items-center gap-0.5 text-button text-primary"
          >
            {t("seeAll")}
            <ChevronRightIcon aria-hidden className="size-4 md:hidden" />
          </Link>
        ) : null}
      </div>
      {total === 0 ? (
        <p className="border-t border-border pt-4 text-body-sm text-muted-foreground">
          {t("empty")}
        </p>
      ) : (
        <div className="flex flex-col gap-4 border-t border-border pt-4 md:grid md:grid-cols-3 md:gap-6">
          <div className="max-md:hidden md:col-span-1">
            <ReviewSummary reviews={reviews} />
          </div>
          {reviews.average !== undefined ? (
            <p className="flex items-center gap-3 md:hidden">
              <span className="text-display">{format.number(reviews.average, ONE_DECIMAL)}</span>
              <span className="flex flex-col gap-0.5">
                <ReviewStars
                  stars={Math.round(reviews.average)}
                  label={t("average", { count: reviews.average })}
                  className="size-4"
                />
                <span className="text-body-sm text-muted-foreground">
                  {t("count", { count: total })}
                </span>
              </span>
            </p>
          ) : null}
          <ul className="flex flex-col max-md:border-t max-md:border-border max-md:pt-4 md:col-span-2 max-md:[&>li:nth-child(n+2)]:hidden">
            {reviews.items.map((review) => (
              <ReviewItem key={review.orderId} review={review} />
            ))}
          </ul>
        </div>
      )}
    </StorePanel>
  );
}
