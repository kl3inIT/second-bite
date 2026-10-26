import { getFormatter, getTranslations } from "next-intl/server";

import type { SellerReviewsOutputBody } from "@/lib/api/generated";

import { ReviewStars } from "./review-stars";
import { countsOf } from "./store-reviews";

const ONE_DECIMAL = { minimumFractionDigits: 1, maximumFractionDigits: 1 } as const;

/**
 * The mean stars of the store's shown reviews, how many there are, and how many give each number of stars (Figma
 * Q1b-3, Q1b-5). A store with no review has no mean and no bars.
 */
export async function ReviewSummary({
  reviews,
}: {
  reviews: Pick<SellerReviewsOutputBody, "average" | "counts">;
}) {
  const [t, format] = await Promise.all([getTranslations("StoreReviews"), getFormatter()]);
  const { counts, average } = reviews;
  const total = countsOf(counts).all;
  const rows = [
    [5, counts.fiveStars],
    [4, counts.fourStars],
    [3, counts.threeStars],
    [2, counts.twoStars],
    [1, counts.oneStar],
  ] as const;

  return (
    <div className="flex flex-col gap-3 rounded-2xl bg-secondary p-5">
      {average === undefined ? (
        <p className="text-body-sm text-muted-foreground">{t("none")}</p>
      ) : (
        <>
          <p className="flex items-baseline gap-1.5">
            <span className="text-display">{format.number(average, ONE_DECIMAL)}</span>
            <span className="text-body text-muted-foreground">{t("outOf")}</span>
          </p>
          <ReviewStars stars={Math.round(average)} label={t("average", { count: average })} />
          <p className="text-body-sm text-muted-foreground">{t("count", { count: total })}</p>
          <ul className="flex flex-col gap-2">
            {rows.map(([stars, count]) => (
              <li key={stars} className="flex items-center gap-2 text-note text-muted-foreground">
                <span className="w-10 shrink-0">{t("starRow", { count: stars })}</span>
                <span aria-hidden className="h-2 flex-1 overflow-hidden rounded-full bg-border">
                  <span
                    className="block h-full w-(--share) rounded-full bg-rating"
                    style={
                      {
                        "--share": `${total === 0 ? 0 : (count / total) * 100}%`,
                      } as React.CSSProperties
                    }
                  />
                </span>
                <span className="w-5 shrink-0 text-right">{count}</span>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
