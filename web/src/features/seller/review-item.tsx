import { getFormatter, getTranslations } from "next-intl/server";

import { isReviewTag } from "@/features/orders/review";
import type { SellerReviewBody } from "@/lib/api/generated";

import { ReviewStars } from "./review-stars";
import { customerOf } from "@/features/orders/order";

/** One review of the store (Figma Q1b-3, Q1b-5): its stars and who gave it, for which dishes and when, the comment and what pleased. */
export async function ReviewItem({ review }: { review: SellerReviewBody }) {
  const [t, tags, orders, format] = await Promise.all([
    getTranslations("StoreReviews"),
    getTranslations("Review.tag"),
    getTranslations("Orders"),
    getFormatter(),
  ]);
  const when = format.dateTime(new Date(review.createdAt), "dayMonth");
  const known = review.tags.filter(isReviewTag);

  return (
    <li className="flex flex-col gap-2 border-b border-border py-4 first:pt-0 last:border-b-0 last:pb-0">
      <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
        <ReviewStars
          stars={review.stars}
          label={t("stars", { count: review.stars })}
          className="size-4"
        />
        <span className="text-body-sm-strong">{customerOf(review, orders("customerGone"))}</span>
        <span className="text-body-sm text-muted-foreground">
          {review.dishes ? `· ${review.dishes} · ${when}` : `· ${when}`}
        </span>
      </div>
      {review.comment ? <p className="text-body">{review.comment}</p> : null}
      {known.length > 0 ? (
        <ul className="flex flex-wrap gap-2">
          {known.map((tag) => (
            <li
              key={tag}
              className="rounded-full bg-fresh-muted px-2.5 py-1 text-label-strong text-success"
            >
              {tags(tag)}
            </li>
          ))}
        </ul>
      ) : null}
    </li>
  );
}
