"use client";

import { revalidateLogic } from "@tanstack/react-form";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { z } from "zod";

import { refuse, useAppForm } from "@/components/form/app-form";
import { useFieldValidity } from "@/components/form/form-context";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { formatPrice } from "@/features/offers/format";
import { useRouter } from "@/i18n/navigation";
import { changeOffer, postOffer, type OfferBody, uploadPhoto } from "@/lib/api/generated";
import { photoUrl } from "@/lib/api/photo";

import { Chip } from "./chip";
import { NumberInput } from "./number-input";
import { type ChosenPhoto, PhotoField } from "./photo-drop";
import { DiscountField } from "./post-discount";
import {
  type Dish,
  discountPercent,
  type EditTarget,
  lengthIsAllowed,
  maxPrice,
  MIN_DISCOUNT_PERCENT,
  priceProblem,
  suggestedPrice,
  windowIsOver,
  windowOf,
} from "./post-draft";
import { WindowChoices } from "./post-window";
import { useRemountKey } from "./remount-key";
import { UnitField } from "./unit-field";

const kinds = [
  "bakery",
  "prepared_food",
  "ingredients",
  "drinks",
  "mixed_box",
  "other",
] as const satisfies readonly OfferBody["kind"][];

/** What the drawer sends: a one-off dish of step 2, then how it sells, of step 3. */
type Values = {
  photo: ChosenPhoto | undefined;
  name: string;
  kind: OfferBody["kind"];
  /** What one unit is called, for a dish typed in the drawer; a dish chosen keeps its own. */
  unit: string;
  description: string;
  units: string;
  original: string;
  price: string;
  discount: string;
};

/** The moment of opening, read once; a function of its own so that rendering stays free of the clock. */
function currentTime(): Date {
  return new Date();
}

/** The price a post starts from, as the form holds it: the suggested one for an original price, or empty. */
function startingPrice(original: number | undefined, percent = MIN_DISCOUNT_PERCENT): string {
  const suggested = original ? suggestedPrice(original, percent) : undefined;
  return suggested ? String(suggested) : "";
}

// The drawer that posts a dish (SEC-57, Figma P1 to P3, P2b, P3b, P3e, R1): the kind of post, the dish, then how
// it sells. Posting again from a closed post (`again`) starts at the last step with that dish filled in.
// "Báo trước dự kiến dư" (Figma P4) is shown as coming until SEC-54. One form holds every step's values, and each
// step that must hold something before the next has rules of its own (docs/guidelines/web.md › Forms): "Tiếp tục"
// and "Đăng" submit the form, which checks the step on the screen.
function PostDrawerBody({
  sellerId,
  dishes,
  catalog,
  again,
  fromDish,
  edit,
}: {
  sellerId: string;
  /** The dishes of the store's earlier posts. */
  dishes: Dish[];
  /** The dishes of its catalog that are shown. */
  catalog: Dish[];
  again?: Dish;
  /** A dish of the catalog posted straight from its row (Figma D1): the drawer starts at the last step. */
  fromDish?: Dish;
  /** A live post being changed (Figma E1, E2): the drawer starts at the last step, with its details. */
  edit?: EditTarget;
}) {
  const t = useTranslations("PostDrawer");
  const kindName = useTranslations("OfferKind");
  const router = useRouter();
  const [now] = useState(currentTime);
  const base = edit?.dish ?? again ?? fromDish;
  const ordered = edit?.ordered ?? 0;
  // Once units are ordered the price stays as it was, since an order keeps it; the hours may move, and the orders follow them.
  const locked = ordered > 0;

  const [step, setStep] = useState<1 | 2 | 3>(base ? 3 : 1);
  // The body scrolls, and keeps where it was when the step changes, so a step opens at its top, not where the one before ended.
  const body = useRef<HTMLFormElement>(null);
  useEffect(() => {
    body.current?.scrollTo({ top: 0 });
  }, [step]);
  const [source, setSource] = useState<"catalog" | "earlier" | "oneoff">(
    catalog.length > 0 ? "catalog" : dishes.length > 0 ? "earlier" : "oneoff",
  );
  const [chosen, setChosen] = useState<Dish | undefined>(base);
  const [start, setStart] = useState(() =>
    edit ? new Date(edit.windowStart) : windowOf({ kind: "now" }, 60, now).start,
  );
  const [minutes, setMinutes] = useState(edit?.minutes ?? 60);
  const [windowChanged, setWindowChanged] = useState(false);
  // A window found over or too long when the post was sent: said under the window until it is chosen again.
  const [windowRefused, setWindowRefused] = useState(false);

  const listed = source === "catalog" ? catalog : dishes;
  const window = { start, end: new Date(start.getTime() + minutes * 60_000) };
  const over = windowIsOver(window, now);

  const defaultValues: Values = {
    photo: undefined,
    name: "",
    kind: "bakery",
    unit: "suất",
    description: "",
    units: base?.units ? String(base.units) : "",
    original: base?.originalPriceVnd ? String(base.originalPriceVnd) : "",
    price: edit && base?.priceVnd ? String(base.priceVnd) : startingPrice(base?.originalPriceVnd),
    discount: String(
      edit && base?.originalPriceVnd && base.priceVnd
        ? discountPercent(base.originalPriceVnd, base.priceVnd)
        : MIN_DISCOUNT_PERCENT,
    ),
  };

  // Step 2 checks the one-off dish; step 3 the units and the price, which a post with orders no longer changes.
  // Each step's rules name every value, those of the other step unchecked.
  const unchecked = {
    photo: z.custom<ChosenPhoto | undefined>(),
    name: z.string(),
    kind: z.enum(kinds),
    unit: z.string(),
    description: z.string(),
    units: z.string(),
    original: z.string(),
    price: z.string(),
    discount: z.string(),
  };
  const oneOffRules = z
    .object({
      ...unchecked,
      photo: z.custom<ChosenPhoto | undefined>().refine(Boolean, t("errors.photo")),
      name: z.string().trim().min(1, t("errors.name")),
    })
    .refine((value) => value.kind !== "mixed_box" || value.description.trim() !== "", {
      message: t("errors.description"),
      path: ["description"],
    });
  const sellRules = z.object(unchecked).superRefine((value, context) => {
    const units = Number(value.units);
    if (!Number.isInteger(units) || units < Math.max(1, ordered) || units > 999 || !value.units) {
      context.addIssue({
        code: "custom",
        path: ["units"],
        message: ordered > 0 ? t("unitsBelowOrdered", { count: ordered }) : t("errors.units"),
      });
    }
    if (locked) return;
    const original = Number(value.original);
    const percent = Number(value.discount);
    if (!Number.isInteger(percent) || percent < MIN_DISCOUNT_PERCENT || percent >= 100) {
      context.addIssue({
        code: "custom",
        path: ["discount"],
        message: t("discountInvalid", { min: MIN_DISCOUNT_PERCENT }),
      });
    }
    const issue = priceProblem(original, Number(value.price));
    if (issue === "missing" && value.original === "") {
      context.addIssue({ code: "custom", path: ["original"], message: t("priceMissing") });
    } else if (issue === "tooHigh") {
      context.addIssue({
        code: "custom",
        path: ["discount"],
        message: t("priceTooHigh", {
          min: MIN_DISCOUNT_PERCENT,
          max: formatPrice(maxPrice(original)),
        }),
      });
    } else if (issue) {
      context.addIssue({ code: "custom", path: ["original"], message: t("priceForDiscount") });
    }
  });

  function close() {
    // Posted from the catalog, a closed drawer leaves the person where they were.
    router.push(`/stores/${sellerId}/${fromDish ? "catalog" : "offers"}`);
  }

  async function send(value: Values) {
    const at = currentTime();
    const finalWindow = window;
    // A change that leaves the hours as they were does not send them, so a post made on another day is not moved to today.
    if ((!edit || windowChanged) && (windowIsOver(finalWindow, at) || !lengthIsAllowed(minutes))) {
      setWindowRefused(true);
      return;
    }
    const units = Number(value.units);
    const prices = { originalPriceVnd: Number(value.original), priceVnd: Number(value.price) };
    if (edit) {
      await changeOffer({
        path: { offerId: edit.offerId },
        body: {
          units,
          ...(locked ? {} : prices),
          ...(windowChanged
            ? {
                windowStart: finalWindow.start.toISOString(),
                windowEnd: finalWindow.end.toISOString(),
              }
            : {}),
        },
      });
      router.push({ pathname: `/stores/${sellerId}/offers`, query: { notice: "saved" } });
      router.refresh();
      return;
    }
    const photoId =
      chosen?.photoId ??
      (value.photo ? (await uploadPhoto({ body: value.photo.file })).data.id : undefined);
    if (!photoId) return;
    await postOffer({
      path: { sellerId },
      body: {
        name: chosen?.name ?? value.name.trim(),
        kind: chosen?.kind ?? value.kind,
        unit: chosen ? chosen.unit : value.unit,
        description: chosen ? chosen.description : value.description.trim(),
        photoId,
        units,
        ...prices,
        windowStart: finalWindow.start.toISOString(),
        windowEnd: finalWindow.end.toISOString(),
      },
    });
    router.push({ pathname: `/stores/${sellerId}/offers`, query: { notice: `posted:${units}` } });
    router.refresh();
  }

  const form = useAppForm({
    defaultValues,
    validationLogic: revalidateLogic(),
    validators: {
      onDynamic:
        step === 2 && source === "oneoff" ? oneOffRules : step === 3 ? sellRules : undefined,
    },
    onSubmit: async ({ value, formApi }) => {
      if (step === 2) {
        setStep(3);
        return;
      }
      try {
        await send(value);
      } catch (error) {
        refuse(formApi, error);
      }
    },
  });

  function choose(dish: Dish) {
    setChosen(dish);
    form.setFieldValue("units", dish.units ? String(dish.units) : "");
    form.setFieldValue("original", dish.originalPriceVnd ? String(dish.originalPriceVnd) : "");
    form.setFieldValue("price", startingPrice(dish.originalPriceVnd));
    form.setFieldValue("discount", String(MIN_DISCOUNT_PERCENT));
  }

  function pick(next: typeof source) {
    setSource(next);
    setChosen(undefined);
  }

  return (
    <Sheet open onOpenChange={(open) => !open && close()}>
      <SheetContent size="wide" showCloseButton={false}>
        <SheetHeader variant="bar">
          <SheetTitle variant="headline">
            {edit ? t("editTitle") : again ? t("againTitle") : t("title")}
          </SheetTitle>
          <span className="text-body-sm text-muted-foreground">
            {edit
              ? `${t(`editStatus.${edit.status}`)}${ordered > 0 ? `, ${t("editOrdered", { count: ordered })}` : ""}`
              : again
                ? t("againFrom")
                : t("step", { step })}
          </span>
        </SheetHeader>

        <form
          ref={body}
          id={form.formId}
          noValidate
          className="flex min-w-0 flex-1 flex-col gap-4 overflow-x-hidden overflow-y-auto px-4 pb-4 sm:px-6"
          onSubmit={(event) => {
            event.preventDefault();
            void form.handleSubmit();
          }}
        >
          {step === 1 && (
            <fieldset className="flex flex-col gap-3">
              <legend className="mb-3 text-title">{t("kindQuestion")}</legend>
              <label className="flex cursor-pointer flex-col gap-1 rounded-xl border-2 border-primary bg-background p-4 has-focus-visible:ring-3 has-focus-visible:ring-ring">
                <input type="radio" name="post-kind" checked readOnly className="sr-only" />
                <span className="text-title">{t("todayTitle")}</span>
                <span className="text-body-sm text-muted-foreground">{t("todayBody")}</span>
              </label>
              <label className="flex flex-col gap-1 rounded-xl border border-border p-4 opacity-60">
                <input type="radio" name="post-kind" disabled className="sr-only" />
                <span className="flex items-center gap-2 text-title">
                  {t("expectedTitle")}
                  <Badge variant="info">{t("soon")}</Badge>
                </span>
                <span className="text-body-sm text-muted-foreground">{t("expectedBody")}</span>
              </label>
            </fieldset>
          )}

          {step === 2 && (
            <>
              <div className="grid grid-cols-3 gap-2">
                <Chip fit selected={source === "catalog"} onClick={() => pick("catalog")}>
                  {t("sourceCatalog")}
                </Chip>
                <Chip fit selected={source === "earlier"} onClick={() => pick("earlier")}>
                  {t("sourceEarlier")}
                </Chip>
                <Chip fit selected={source === "oneoff"} onClick={() => pick("oneoff")}>
                  {t("sourceOneOff")}
                </Chip>
              </div>

              {source !== "oneoff" ? (
                <section aria-labelledby="post-dishes" className="flex flex-col">
                  <h3 id="post-dishes" className="pb-2 text-title">
                    {t("chooseDish")}
                  </h3>
                  {listed.length === 0 ? (
                    <p className="border-t border-border pt-3 text-body-sm text-muted-foreground">
                      {source === "catalog" ? t("noCatalog") : t("noDishes")}
                    </p>
                  ) : (
                    <ul className="flex flex-col border-t border-border">
                      {listed.map((dish) => (
                        <li
                          key={dish.id}
                          className="flex items-center gap-4 border-b border-border py-3 last:border-b-0"
                        >
                          <span className="relative size-14 shrink-0 overflow-hidden rounded-lg bg-muted">
                            <Image
                              src={photoUrl(dish.photoPath)}
                              alt=""
                              fill
                              sizes="56px"
                              unoptimized
                              className="object-cover"
                            />
                          </span>
                          <span className="flex min-w-0 flex-1 flex-col">
                            <span className="truncate text-title-lg">{dish.name}</span>
                            <span className="text-body-sm text-muted-foreground">
                              {kindName(dish.kind)} · {dish.unit}
                            </span>
                          </span>
                          <Button
                            type="button"
                            variant={chosen?.id === dish.id ? "default" : "outline"}
                            aria-pressed={chosen?.id === dish.id}
                            onClick={() => choose(dish)}
                          >
                            {chosen?.id === dish.id ? t("chosen") : t("choose")}
                          </Button>
                        </li>
                      ))}
                    </ul>
                  )}
                </section>
              ) : (
                <>
                  <form.AppField name="photo">
                    {() => <PhotoField label={t("photo")} />}
                  </form.AppField>
                  <form.AppField name="name">
                    {(field) => (
                      <field.TextField
                        label={t("name")}
                        required
                        maxLength={80}
                        placeholder={t("namePlaceholder")}
                      />
                    )}
                  </form.AppField>
                  <form.AppField name="kind">
                    {(field) => (
                      <fieldset className="flex flex-col gap-2">
                        <legend className="mb-2 text-title">{t("kind")}</legend>
                        <div className="-my-1 flex flex-wrap gap-x-2">
                          {kinds.map((value) => (
                            <Chip
                              key={value}
                              selected={field.state.value === value}
                              onClick={() => field.handleChange(value)}
                            >
                              {kindName(value)}
                            </Chip>
                          ))}
                        </div>
                      </fieldset>
                    )}
                  </form.AppField>
                  <div className="grid grid-cols-5 gap-3">
                    <form.AppField name="unit">{() => <UnitField />}</form.AppField>
                  </div>
                  <form.Subscribe selector={(state) => state.values.kind === "mixed_box"}>
                    {(mixedBox) =>
                      mixedBox && (
                        <form.AppField name="description">
                          {(field) => (
                            <field.TextareaField
                              label={t("description")}
                              required
                              placeholder={t("descriptionPlaceholder")}
                            />
                          )}
                        </form.AppField>
                      )
                    }
                  </form.Subscribe>
                </>
              )}
            </>
          )}

          {step === 3 && (
            <>
              <h3 className="border-b border-border pb-3 text-title-lg">
                {edit ? t("editQuestion") : again ? t("againQuestion") : t("sellQuestion")}
              </h3>
              <form.Subscribe selector={(state) => state.values}>
                {(values) => (
                  <div className="flex items-center gap-4">
                    <span className="relative size-14 shrink-0 overflow-hidden rounded-lg bg-muted">
                      {(chosen?.photoPath ?? values.photo?.preview) && (
                        <Image
                          src={chosen ? photoUrl(chosen.photoPath) : (values.photo?.preview ?? "")}
                          alt=""
                          fill
                          sizes="56px"
                          unoptimized
                          className="object-cover"
                        />
                      )}
                    </span>
                    <span className="flex min-w-0 flex-1 flex-col">
                      <span className="truncate text-title-lg">
                        {chosen?.name ?? values.name.trim()}
                      </span>
                      <span className="text-body-sm text-muted-foreground">
                        {chosen
                          ? `${kindName(chosen.kind)} · ${chosen.unit}`
                          : `${t("sourceOneOff")} · ${kindName(values.kind)}`}
                      </span>
                    </span>
                    {values.original !== "" && (
                      <span className="flex shrink-0 flex-col items-end gap-1" aria-live="polite">
                        <del className="text-body-sm text-muted-foreground">
                          {formatPrice(Number(values.original))}
                        </del>
                        <output aria-label={t("price")} className="text-price-lg text-primary">
                          {values.price ? formatPrice(Number(values.price)) : t("priceUnavailable")}
                        </output>
                      </span>
                    )}
                  </div>
                )}
              </form.Subscribe>

              <div className="grid grid-cols-2 gap-3">
                <form.AppField name="original">
                  {() => (
                    <NumberField
                      label={t("original")}
                      grouped
                      disabled={locked}
                      onValue={(next) =>
                        form.setFieldValue(
                          "price",
                          startingPrice(Number(next), Number(form.getFieldValue("discount"))),
                        )
                      }
                    />
                  )}
                </form.AppField>
                <form.AppField name="units">
                  {() => <NumberField label={t("units")} digits={3} focusOnOpen={!edit} />}
                </form.AppField>
              </div>
              <form.Subscribe selector={(state) => state.values.original}>
                {(original) => (
                  <form.AppField name="discount">
                    {() => (
                      <DiscountField
                        original={Number(original)}
                        disabled={locked}
                        onValue={(percent) =>
                          form.setFieldValue("price", startingPrice(Number(original), percent))
                        }
                      />
                    )}
                  </form.AppField>
                )}
              </form.Subscribe>
              {edit && (
                <p className="text-note text-muted-foreground">
                  {locked ? t("editLocked", { count: ordered }) : t("editFree")}
                </p>
              )}
              <Separator />
              <WindowChoices
                now={now}
                start={start}
                minutes={minutes}
                onStart={(next) => {
                  setStart(next);
                  setMinutes(60);
                  setWindowChanged(true);
                  setWindowRefused(false);
                }}
                onMinutes={(next) => {
                  setMinutes(next);
                  setWindowChanged(true);
                  setWindowRefused(false);
                }}
              />
              {over && <FieldError>{t("windowOver")}</FieldError>}
              {windowRefused && <FieldError className="-mt-2">{t("windowOver")}</FieldError>}
              {edit && ordered > 0 && (
                <p className="-mt-2 text-note text-muted-foreground">
                  {t("editHoursNote", { count: ordered })}
                </p>
              )}

              <form.AppForm>
                <form.FormError fallback={t("failed")} />
              </form.AppForm>
            </>
          )}
        </form>

        <SheetFooter variant="bar">
          {step === 1 && (
            <>
              <Button type="button" variant="outline" size="lg" onClick={close}>
                {t("cancel")}
              </Button>
              <Button type="button" size="lg" onClick={() => setStep(2)}>
                {t("next")}
              </Button>
            </>
          )}
          {step === 2 && (
            <>
              <Button type="button" variant="outline" size="lg" onClick={() => setStep(1)}>
                {t("back")}
              </Button>
              <form.AppForm>
                <form.SubmitButton size="lg" disabled={source !== "oneoff" && !chosen}>
                  {t("next")}
                </form.SubmitButton>
              </form.AppForm>
            </>
          )}
          {step === 3 && (
            <form.Subscribe selector={(state) => state.isSubmitting}>
              {(submitting) => (
                <>
                  <Button
                    type="button"
                    variant="outline"
                    size="lg"
                    disabled={submitting}
                    onClick={
                      edit
                        ? locked
                          ? close
                          : () => router.push(`/stores/${sellerId}/offers/${edit.offerId}/withdraw`)
                        : again || fromDish
                          ? close
                          : () => setStep(2)
                    }
                  >
                    {edit && !locked ? t("withdraw") : t("back")}
                  </Button>
                  <form.AppForm>
                    <form.SubmitButton size="lg">{edit ? t("save") : t("post")}</form.SubmitButton>
                  </form.AppForm>
                </>
              )}
            </form.Subscribe>
          )}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

/** A count or an amount in đồng, typed as digits, grouped as it is typed when `grouped`. */
function NumberField({
  label,
  grouped,
  digits,
  disabled,
  focusOnOpen,
  className,
  onValue,
}: {
  label: string;
  grouped?: boolean;
  /** At most this many digits. */
  digits?: number;
  disabled?: boolean;
  /** Takes the focus as it opens: the field the person has to fill, so the keyboard opens on it. */
  focusOnOpen?: boolean;
  className?: string;
  /** Told of each change, after the field holds it. */
  onValue?: (value: string) => void;
}) {
  const { field, invalid, errors, ids } = useFieldValidity<string>();
  const control = ids.control;
  useEffect(() => {
    if (focusOnOpen) document.getElementById(control)?.focus();
  }, [focusOnOpen, control]);
  return (
    <Field data-invalid={invalid || undefined} className={className}>
      <FieldLabel htmlFor={ids.control}>{label}</FieldLabel>
      <NumberInput
        id={ids.control}
        value={field.state.value}
        grouped={grouped}
        max={digits}
        disabled={disabled}
        onValueChange={(value) => {
          field.handleChange(value);
          onValue?.(value);
        }}
        onBlur={field.handleBlur}
        aria-invalid={invalid || undefined}
        aria-describedby={invalid ? ids.error : undefined}
      />
      {invalid && <FieldError id={ids.error} errors={errors} />}
    </Field>
  );
}

// The drawer starts again from its first step each time it is opened: once a dish is posted, the next "Đăng món"
// does not find the last one's answers (the page that held it is kept hidden, with its state).
export function PostDrawer(props: React.ComponentProps<typeof PostDrawerBody>) {
  return <PostDrawerBody key={useRemountKey()} {...props} />;
}
