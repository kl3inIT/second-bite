"use client";

import { revalidateLogic } from "@tanstack/react-form";
import { CheckIcon, StarIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { z } from "zod";

import { refuse, useAppForm } from "@/components/form/app-form";
import { useFieldValidity } from "@/components/form/form-context";
import { Button } from "@/components/ui/button";
import { FieldError } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "@/i18n/navigation";
import { reviewOrder } from "@/lib/api/generated";
import { cn } from "@/lib/utils";

import type { Order } from "./order";
import { REVIEW_TAGS, STARS, type ReviewTag, type Star } from "./review";

const COMMENT_LIMIT = 500;

// Rating a collected order (Figma K6b › chấm sao): one to five stars with the word for them, what pleased, and a
// few optional lines for the seller; "Gửi đánh giá" at the foot of the screen on a phone. An order placed without
// signing in is rated with its access (SEC-97 › decision 3). The page reads the order again afterwards and shows
// the rating given. The rating is a form (docs/guidelines/web.md › Forms): sent without stars, it says so under them.
export function ReviewForm({ order }: { order: Order }) {
  const t = useTranslations("Review");
  const router = useRouter();

  const form = useAppForm({
    defaultValues: { stars: 0 as Star | 0, tags: [] as ReviewTag[], comment: "" },
    validationLogic: revalidateLogic(),
    validators: {
      onDynamic: z.object({
        stars: z.custom<Star | 0>().refine((stars) => stars > 0, t("errors.stars")),
        tags: z.array(z.custom<ReviewTag>()),
        comment: z.string().max(COMMENT_LIMIT),
      }),
    },
    onSubmit: async ({ value, formApi }) => {
      const words = value.comment.trim();
      try {
        await reviewOrder({
          path: { orderId: order.id },
          headers: order.access ? { "Order-Access": order.access } : undefined,
          body: {
            stars: value.stars as Star,
            tags: value.tags,
            ...(words ? { comment: words } : {}),
          },
        });
      } catch (error) {
        refuse(formApi, error);
        return;
      }
      router.refresh();
    },
  });

  return (
    <form
      id={form.formId}
      noValidate
      className="flex flex-col gap-3"
      onSubmit={(event) => {
        event.preventDefault();
        void form.handleSubmit();
      }}
    >
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
        <form.AppField name="stars">
          {() => <StarsField name={`stars-${order.id}`} />}
        </form.AppField>
        <form.AppField name="tags">
          {(field) => (
            <fieldset className="border-t border-border pt-3.5">
              <legend className="float-left mb-2.5 w-full text-body-sm-strong">
                {t("tagsTitle")}
              </legend>
              <div className="grid w-full grid-cols-2 gap-2">
                {REVIEW_TAGS.map((tag) => {
                  const chosen = field.state.value.includes(tag);
                  return (
                    <Button
                      key={tag}
                      type="button"
                      variant={chosen ? "secondary" : "outline"}
                      aria-pressed={chosen}
                      onClick={() =>
                        field.handleChange(
                          chosen
                            ? field.state.value.filter((each) => each !== tag)
                            : [...field.state.value, tag],
                        )
                      }
                    >
                      {chosen ? <CheckIcon aria-hidden data-icon="inline-start" /> : null}
                      {t(`tag.${tag}`)}
                    </Button>
                  );
                })}
              </div>
            </fieldset>
          )}
        </form.AppField>
        <form.AppField name="comment">
          {(field) => (
            <Textarea
              surface="sky"
              value={field.state.value}
              maxLength={COMMENT_LIMIT}
              onChange={(event) => field.handleChange(event.target.value)}
              onBlur={field.handleBlur}
              aria-label={t("comment")}
              placeholder={t("comment")}
            />
          )}
        </form.AppField>
      </section>
      <div className="sticky bottom-0 z-40 -mx-4 flex flex-col gap-2 border-t border-border bg-card px-4 pt-3 pb-5 lg:static lg:order-first lg:mx-0 lg:border-0 lg:bg-transparent lg:p-0">
        <form.AppForm>
          <form.FormError fallback={t("failed")} />
          <form.SubmitButton size="lg">{t("submit")}</form.SubmitButton>
        </form.AppForm>
      </div>
    </form>
  );
}

/** One to five stars, as radios, with the word for the stars chosen. */
function StarsField({ name }: { name: string }) {
  const t = useTranslations("Review");
  const { field, invalid, errors, ids } = useFieldValidity<Star | 0>();
  const stars = field.state.value;
  return (
    <fieldset className="flex flex-col items-center gap-3">
      <legend className="sr-only">{t("starsLegend")}</legend>
      {/* The group says it is in error and, given the focus, hands it to the first star. */}
      <div
        role="radiogroup"
        aria-label={t("starsLegend")}
        aria-invalid={invalid || undefined}
        aria-describedby={invalid ? ids.error : undefined}
        tabIndex={-1}
        onFocus={(event) => {
          if (event.target === event.currentTarget) {
            event.currentTarget.querySelector("input")?.focus();
          }
        }}
        className="flex gap-3 outline-none"
      >
        {STARS.map((count) => (
          <label
            key={count}
            className="relative flex size-11 items-center justify-center rounded-full text-rating has-focus-visible:ring-3 has-focus-visible:ring-ring"
          >
            <input
              type="radio"
              name={name}
              value={count}
              checked={stars === count}
              onChange={() => field.handleChange(count)}
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
      {invalid && <FieldError id={ids.error} errors={errors} />}
    </fieldset>
  );
}
