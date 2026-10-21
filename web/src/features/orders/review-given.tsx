import { StarIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import { cn } from "@/lib/utils";

import type { Order } from "./order";
import { isReviewTag, STARS, type Star } from "./review";

/** The rating given to a collected order: its stars and their word, what pleased, and the lines for the seller. */
export function ReviewGiven({ review }: { review: NonNullable<Order["review"]> }) {
  const t = useTranslations("Review");
  const tags = review.tags.filter(isReviewTag);

  return (
    <section
      aria-labelledby="review-given"
      className="flex flex-col gap-3.5 rounded-2xl bg-card p-5 text-card-foreground"
    >
      <div className="flex flex-col gap-1">
        <h2 id="review-given" className="text-title-lg">
          {t("given")}
        </h2>
        <p className="text-body-sm text-muted-foreground">{t("thanks")}</p>
      </div>
      <p className="flex items-center gap-2">
        <span className="sr-only">{t("star", { count: review.stars })}</span>
        <span aria-hidden className="flex gap-1">
          {STARS.map((count) => (
            <StarIcon
              key={count}
              aria-hidden
              className={cn("size-6 text-rating", count <= review.stars && "fill-current")}
            />
          ))}
        </span>
        <span className="text-label-strong text-primary">{t(`word.${review.stars as Star}`)}</span>
      </p>
      {tags.length > 0 ? (
        <ul className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <li
              key={tag}
              className="rounded-full bg-secondary px-3 py-1.5 text-label-strong text-primary"
            >
              {t(`tag.${tag}`)}
            </li>
          ))}
        </ul>
      ) : null}
      {review.comment ? <p className="text-body-sm">“{review.comment}”</p> : null}
    </section>
  );
}
