"use client";

import { CheckIcon, StarIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "@/i18n/navigation";
import { ApiError } from "@/lib/api/client";
import { reviewOrder } from "@/lib/api/generated";
import { cn } from "@/lib/utils";

import type { Order } from "./order";
import { REVIEW_TAGS, STARS, type ReviewTag, type Star } from "./review";

const COMMENT_LIMIT = 500;

// Rating a collected order (Figma K6b › chấm sao): one to five stars with the word for them, what pleased, and a
// few optional lines for the seller; "Gửi đánh giá" at the foot of the screen on a phone. An order placed without
// signing in is rated with its access (SEC-97 › decision 3). The page reads the order again afterwards and shows
// the rating given.
export function ReviewForm({ order }: { order: Order }) {
  const t = useTranslations("Review");
  const router = useRouter();
  const [stars, setStars] = useState<Star | 0>(0);
  const [tags, setTags] = useState<ReviewTag[]>([]);
  const [comment, setComment] = useState("");
  const [reference, setReference] = useState<string>();
  const [pending, startTransition] = useTransition();

  function toggle(tag: ReviewTag) {
    setTags((chosen) =>
      chosen.includes(tag) ? chosen.filter((each) => each !== tag) : [...chosen, tag],
    );
  }

  function submit(event: React.FormEvent) {
    event.preventDefault();
    setReference(undefined);
    startTransition(async () => {
      try {
        const words = comment.trim();
        await reviewOrder({
          path: { orderId: order.id },
          headers: order.access ? { "Order-Access": order.access } : undefined,
          body: { stars, tags, ...(words ? { comment: words } : {}) },
        });
        router.refresh();
      } catch (error) {
        setReference((error instanceof ApiError && error.requestId) || "—");
      }
    });
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-3">
      <section
        aria-labelledby={`review-${order.id}`}
        className="flex flex-col gap-4 rounded-2xl bg-card p-5 text-card-foreground"
      >
        <div className="flex flex-col gap-1">
          <h2 id={`review-${order.id}`} className="text-title-lg">
            {t("title")}
          </h2>
          <p className="text-body-sm text-muted-foreground">{t("hint")}</p>
        </div>
        <fieldset className="flex flex-col items-center gap-3">
          <legend className="sr-only">{t("starsLegend")}</legend>
          <div className="flex gap-3">
            {STARS.map((count) => (
              <label
                key={count}
                className="relative flex size-11 items-center justify-center rounded-full text-rating has-focus-visible:ring-3 has-focus-visible:ring-ring"
              >
                <input
                  type="radio"
                  name={`stars-${order.id}`}
                  value={count}
                  checked={stars === count}
                  onChange={() => setStars(count)}
                  aria-label={t("star", { count })}
                  className="absolute inset-0 cursor-pointer appearance-none rounded-full focus-visible:outline-none"
                />
                <StarIcon
                  aria-hidden
                  className={cn("pointer-events-none size-8", count <= stars && "fill-current")}
                />
              </label>
            ))}
          </div>
          <p aria-live="polite" className="min-h-5 text-label-strong text-primary">
            {stars === 0 ? null : t(`word.${stars}`)}
          </p>
        </fieldset>
        <fieldset className="border-t border-border pt-3.5">
          <legend className="float-left mb-2.5 w-full text-body-sm-strong">{t("tagsTitle")}</legend>
          <div className="grid w-full grid-cols-2 gap-2">
            {REVIEW_TAGS.map((tag) => {
              const chosen = tags.includes(tag);
              return (
                <Button
                  key={tag}
                  type="button"
                  variant={chosen ? "secondary" : "outline"}
                  aria-pressed={chosen}
                  onClick={() => toggle(tag)}
                >
                  {chosen ? <CheckIcon aria-hidden data-icon="inline-start" /> : null}
                  {t(`tag.${tag}`)}
                </Button>
              );
            })}
          </div>
        </fieldset>
        <Textarea
          surface="sky"
          value={comment}
          maxLength={COMMENT_LIMIT}
          onChange={(event) => setComment(event.target.value)}
          aria-label={t("comment")}
          placeholder={t("comment")}
        />
      </section>
      <div className="sticky bottom-0 z-40 -mx-4 flex flex-col gap-2 border-t border-border bg-card px-4 pt-3 pb-5 lg:static lg:order-first lg:mx-0 lg:border-0 lg:bg-transparent lg:p-0">
        {reference ? (
          <p role="alert" className="text-label text-destructive">
            {t("failed", { reference })}
          </p>
        ) : null}
        <Button type="submit" size="lg" disabled={stars === 0 || pending}>
          {pending ? <Spinner data-icon="inline-start" /> : null}
          {t("submit")}
        </Button>
      </div>
    </form>
  );
}
