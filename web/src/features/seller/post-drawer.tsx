"use client";

import { CircleAlertIcon } from "lucide-react";
import Image from "next/image";
import { useFormatter, useTranslations } from "next-intl";
import { useState, useTransition } from "react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { NativeSelect } from "@/components/ui/native-select";
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "@/i18n/navigation";
import { ApiError } from "@/lib/api/client";
import { changeOffer, postOffer, uploadPhoto, type OfferBody } from "@/lib/api/generated";
import { cn } from "@/lib/utils";

import { Chip } from "./chip";
import {
  clock,
  type Dish,
  discountPercent,
  type EditTarget,
  lengthIsAllowed,
  MAX_WINDOW_MINUTES,
  maxPrice,
  MIN_DISCOUNT_PERCENT,
  MIN_WINDOW_MINUTES,
  priceProblem,
  type Start,
  windowIsOver,
  windowOf,
} from "./post-draft";

const kinds = [
  "bakery",
  "prepared_food",
  "ingredients",
  "drinks",
  "mixed_box",
  "other",
] as const satisfies readonly OfferBody["kind"][];

/** The hours offered besides the usual one and "now" (Figma P3). */
const FIXED_STARTS = [
  { hour: 20, minute: 0 },
  { hour: 21, minute: 0 },
  { hour: 21, minute: 30 },
  { hour: 22, minute: 0 },
] as const;
const LENGTHS = [60, 30, 90, 120] as const;
/** The usual hour of a store with nothing posted yet. */
const DEFAULT_USUAL = { hour: 20, minute: 30 };

type StartKey = "usual" | "now" | `${number}:${number}` | "custom";
type Problem =
  | { kind: "discount" }
  | { kind: "window" }
  | { kind: "details" }
  | { kind: "inactive" }
  | { kind: "locked" }
  | { kind: "failed"; reference?: string };

function problemOf(error: unknown): Problem {
  const code = error instanceof ApiError ? error.code : undefined;
  switch (code) {
    case "OFFER_DISCOUNT_TOO_SMALL":
      return { kind: "discount" };
    case "OFFER_WINDOW_INVALID":
      return { kind: "window" };
    case "OFFER_DETAILS_INVALID":
      return { kind: "details" };
    case "SELLER_NOT_ACTIVE":
      return { kind: "inactive" };
    case "OFFER_CHANGE_NOT_ALLOWED":
      return { kind: "locked" };
    default:
      return { kind: "failed", reference: error instanceof ApiError ? error.requestId : undefined };
  }
}

/** The moment of opening, read once; a function of its own so that rendering stays free of the clock. */
function currentTime(): Date {
  return new Date();
}

const digits = (value: string) => value.replace(/\D/g, "");
const grouped = new Intl.NumberFormat("vi-VN");
const shown = (value: string) => (value ? grouped.format(Number(value)) : "");

// The drawer that posts a dish (SEC-57, Figma P1 to P3, P2b, P3b, P3e, R1): the kind of post, the dish, then how
// it sells. Posting again from a closed post (`again`) starts at the last step with that dish filled in.
// "Báo trước dự kiến dư" (Figma P4) is shown as coming, and the dish step offers the store's earlier dishes
// instead of the catalog, until SEC-54 and SEC-55 give the backend what those need.
export function PostDrawer({
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
  const format = useFormatter();
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [now] = useState(currentTime);
  const base = edit?.dish ?? again ?? fromDish;
  const ordered = edit?.ordered ?? 0;
  // Once units are ordered the price and the hours stay as they were: the backend takes only more units.
  const locked = ordered > 0;

  const [step, setStep] = useState<1 | 2 | 3>(base ? 3 : 1);
  const [source, setSource] = useState<"catalog" | "earlier" | "oneoff">(
    catalog.length > 0 ? "catalog" : dishes.length > 0 ? "earlier" : "oneoff",
  );
  const [chosen, setChosen] = useState<Dish | undefined>(base);
  const [photo, setPhoto] = useState<File>();
  const [preview, setPreview] = useState<string>();
  const [name, setName] = useState("");
  const [kind, setKind] = useState<OfferBody["kind"]>("bakery");
  const [description, setDescription] = useState("");
  const [units, setUnits] = useState(base?.units ? String(base.units) : "");
  const [original, setOriginal] = useState(
    base?.originalPriceVnd ? String(base.originalPriceVnd) : "",
  );
  const [price, setPrice] = useState(base?.priceVnd ? String(base.priceVnd) : "");
  const [startKey, setStartKey] = useState<StartKey>("usual");
  const [customStart, setCustomStart] = useState(DEFAULT_USUAL);
  const [length, setLength] = useState<number | "custom">(
    edit && !(LENGTHS as readonly number[]).includes(edit.minutes)
      ? "custom"
      : (edit?.minutes ?? 60),
  );
  const [customLength, setCustomLength] = useState(
    edit
      ? Math.min(
          MAX_WINDOW_MINUTES,
          Math.max(MIN_WINDOW_MINUTES, Math.round(edit.minutes / 30) * 30),
        )
      : 90,
  );
  const [tried, setTried] = useState(false);
  const [problem, setProblem] = useState<Problem>();

  const usual = chosen?.usual ?? dishes[0]?.usual ?? DEFAULT_USUAL;
  const listed = source === "catalog" ? catalog : dishes;
  const start: Start =
    startKey === "now"
      ? { kind: "now" }
      : startKey === "usual"
        ? { kind: "at", ...usual }
        : startKey === "custom"
          ? { kind: "at", ...customStart }
          : {
              kind: "at",
              hour: Number(startKey.split(":")[0]),
              minute: Number(startKey.split(":")[1]),
            };
  const minutes = length === "custom" ? customLength : length;
  const window = windowOf(start, minutes, now);
  const over = windowIsOver(window, now);
  const time = (at: Date) => format.dateTime(at, "time");

  const originalNumber = Number(original);
  const priceNumber = Number(price);
  const priceIssue = priceProblem(originalNumber, priceNumber);
  const unitsNumber = Number(units);
  const unitsValid =
    Number.isInteger(unitsNumber) && unitsNumber >= Math.max(1, ordered) && unitsNumber <= 999;
  const dishName = chosen?.name ?? name.trim();
  const dishKind = chosen?.kind ?? kind;
  const dishReady =
    source !== "oneoff"
      ? chosen !== undefined
      : name.trim() !== "" &&
        photo !== undefined &&
        (kind !== "mixed_box" || description.trim() !== "");

  function close() {
    // Posted from the catalog, a closed drawer leaves the person where they were.
    router.push(`/stores/${sellerId}/${fromDish ? "catalog" : "offers"}`);
  }

  function choosePhoto(file: File | undefined) {
    if (preview) URL.revokeObjectURL(preview);
    setPhoto(file);
    setPreview(file ? URL.createObjectURL(file) : undefined);
  }

  function post() {
    setTried(true);
    setProblem(undefined);
    const at = currentTime();
    const finalWindow = windowOf(start, minutes, at);
    const windowChanged = startKey !== "usual" || minutes !== edit?.minutes;
    if (edit) {
      // A change that leaves the hours as they were does not send them, so a post made on another day is not moved to today.
      if (!unitsValid || (!locked && priceIssue)) return;
      if (!locked && windowChanged && (windowIsOver(finalWindow, at) || !lengthIsAllowed(minutes)))
        return;
      startTransition(async () => {
        try {
          await changeOffer({
            path: { offerId: edit.offerId },
            body: {
              units: unitsNumber,
              ...(locked
                ? {}
                : {
                    originalPriceVnd: originalNumber,
                    priceVnd: priceNumber,
                    ...(windowChanged
                      ? {
                          windowStart: finalWindow.start.toISOString(),
                          windowEnd: finalWindow.end.toISOString(),
                        }
                      : {}),
                  }),
            },
          });
          router.push({ pathname: `/stores/${sellerId}/offers`, query: { notice: "saved" } });
          router.refresh();
        } catch (error) {
          setProblem(problemOf(error));
        }
      });
      return;
    }
    if (!unitsValid || priceIssue || windowIsOver(finalWindow, at) || !lengthIsAllowed(minutes)) {
      return;
    }
    startTransition(async () => {
      try {
        let photoId = chosen?.photoId;
        if (!photoId && photo) photoId = (await uploadPhoto({ body: photo })).data.id;
        if (!photoId) return;
        await postOffer({
          path: { sellerId },
          body: {
            name: dishName,
            kind: dishKind,
            ...(chosen ? { unit: chosen.unit } : {}),
            description: chosen ? chosen.description : description.trim(),
            photoId,
            units: unitsNumber,
            originalPriceVnd: originalNumber,
            priceVnd: priceNumber,
            windowStart: finalWindow.start.toISOString(),
            windowEnd: finalWindow.end.toISOString(),
          },
        });
        router.push({
          pathname: `/stores/${sellerId}/offers`,
          query: { notice: `posted:${unitsNumber}` },
        });
        router.refresh();
      } catch (error) {
        setProblem(problemOf(error));
      }
    });
  }

  const showPriceError = tried && priceIssue !== undefined;

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

        <div className="flex flex-1 flex-col gap-4 overflow-y-auto px-6 pb-4">
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
                  <span className="rounded-full bg-secondary px-2 py-0.5 text-label-strong text-secondary-foreground">
                    {t("soon")}
                  </span>
                </span>
                <span className="text-body-sm text-muted-foreground">{t("expectedBody")}</span>
              </label>
            </fieldset>
          )}

          {step === 2 && (
            <>
              <div className="flex gap-2">
                <Chip
                  selected={source === "catalog"}
                  onClick={() => {
                    setSource("catalog");
                    setChosen(undefined);
                  }}
                >
                  {t("sourceCatalog")}
                </Chip>
                <Chip
                  selected={source === "earlier"}
                  onClick={() => {
                    setSource("earlier");
                    setChosen(undefined);
                  }}
                >
                  {t("sourceEarlier")}
                </Chip>
                <Chip
                  selected={source === "oneoff"}
                  onClick={() => {
                    setSource("oneoff");
                    setChosen(undefined);
                  }}
                >
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
                              src={`/api${dish.photoPath}`}
                              alt=""
                              fill
                              sizes="56px"
                              unoptimized
                              className="object-cover"
                            />
                          </span>
                          <span className="flex min-w-0 flex-1 flex-col">
                            <span className="truncate text-title">{dish.name}</span>
                            <span className="text-body-sm text-muted-foreground">
                              {kindName(dish.kind)} · {dish.unit}
                            </span>
                          </span>
                          <Button
                            type="button"
                            variant={chosen?.id === dish.id ? "default" : "outline"}
                            aria-pressed={chosen?.id === dish.id}
                            onClick={() => {
                              setChosen(dish);
                              setUnits(dish.units ? String(dish.units) : "");
                              setOriginal(
                                dish.originalPriceVnd ? String(dish.originalPriceVnd) : "",
                              );
                              setPrice(dish.priceVnd ? String(dish.priceVnd) : "");
                            }}
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
                  <Field>
                    <FieldLabel htmlFor="dish-photo">{t("photo")}</FieldLabel>
                    <label
                      htmlFor="dish-photo"
                      className="flex min-h-21 cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border border-dashed border-primary/30 bg-background px-4 py-5 text-center transition-colors focus-within:ring-3 focus-within:ring-ring/50 hover:bg-secondary"
                    >
                      {preview && (
                        <Image
                          src={preview}
                          alt=""
                          width={64}
                          height={64}
                          unoptimized
                          className="size-16 rounded-lg object-cover"
                        />
                      )}
                      <span className="text-label-strong text-link">
                        {photo ? photo.name : t("choosePhoto")}
                      </span>
                      <span className="text-label text-muted-foreground">{t("photoHint")}</span>
                      <input
                        id="dish-photo"
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        className="sr-only"
                        onChange={(event) => choosePhoto(event.target.files?.[0])}
                      />
                    </label>
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="dish-name">{t("name")}</FieldLabel>
                    <Input
                      id="dish-name"
                      value={name}
                      maxLength={80}
                      onChange={(event) => setName(event.target.value)}
                      placeholder={t("namePlaceholder")}
                    />
                  </Field>
                  <fieldset className="flex flex-col gap-2">
                    <legend className="mb-2 text-title">{t("kind")}</legend>
                    <div className="-my-1 flex flex-wrap gap-x-2">
                      {kinds.map((value) => (
                        <Chip key={value} selected={kind === value} onClick={() => setKind(value)}>
                          {kindName(value)}
                        </Chip>
                      ))}
                    </div>
                  </fieldset>
                  {kind === "mixed_box" && (
                    <Field>
                      <FieldLabel htmlFor="dish-description">{t("description")}</FieldLabel>
                      <Textarea
                        id="dish-description"
                        value={description}
                        onChange={(event) => setDescription(event.target.value)}
                        placeholder={t("descriptionPlaceholder")}
                      />
                    </Field>
                  )}
                </>
              )}
            </>
          )}

          {step === 3 && (
            <>
              <h3 className="border-b border-border pb-3 text-title">
                {edit ? t("editQuestion") : again ? t("againQuestion") : t("sellQuestion")}
              </h3>
              <div className="flex items-center gap-4">
                <span className="relative size-14 shrink-0 overflow-hidden rounded-lg bg-muted">
                  {(chosen?.photoPath ?? preview) && (
                    <Image
                      src={chosen ? `/api${chosen.photoPath}` : (preview ?? "")}
                      alt=""
                      fill
                      sizes="56px"
                      unoptimized
                      className="object-cover"
                    />
                  )}
                </span>
                <span className="flex min-w-0 flex-col">
                  <span className="truncate text-title">{dishName}</span>
                  <span className="text-body-sm text-muted-foreground">
                    {chosen
                      ? `${kindName(chosen.kind)} · ${chosen.unit}`
                      : `${t("sourceOneOff")} · ${kindName(kind)}`}
                  </span>
                </span>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <Field data-invalid={(tried && !unitsValid) || undefined}>
                  <FieldLabel htmlFor="post-units">{t("units")}</FieldLabel>
                  <Input
                    id="post-units"
                    inputMode="numeric"
                    value={units}
                    onChange={(event) => setUnits(digits(event.target.value).slice(0, 3))}
                    aria-invalid={(tried && !unitsValid) || undefined}
                    aria-describedby={ordered > 0 ? "post-units-note" : undefined}
                  />
                </Field>
                <Field data-invalid={(tried && priceIssue === "missing" && !original) || undefined}>
                  <FieldLabel htmlFor="post-original">{t("original")}</FieldLabel>
                  <Input
                    id="post-original"
                    inputMode="numeric"
                    value={shown(original)}
                    disabled={locked}
                    onChange={(event) => setOriginal(digits(event.target.value).slice(0, 9))}
                  />
                </Field>
                <Field data-invalid={showPriceError || undefined}>
                  <FieldLabel htmlFor="post-price">{t("price")}</FieldLabel>
                  <Input
                    id="post-price"
                    inputMode="numeric"
                    value={shown(price)}
                    disabled={locked}
                    onChange={(event) => setPrice(digits(event.target.value).slice(0, 9))}
                    aria-invalid={showPriceError || undefined}
                    aria-describedby="post-price-note"
                  />
                </Field>
              </div>
              {edit && tried && !unitsValid && ordered > 0 && (
                <FieldError id="post-units-note">
                  {t("unitsBelowOrdered", { count: ordered })}
                </FieldError>
              )}
              {locked ? (
                <p id="post-price-note" className="-mt-2 text-label text-muted-foreground">
                  {t("editLocked", { count: ordered })}
                </p>
              ) : showPriceError && priceIssue === "tooHigh" ? (
                <FieldError id="post-price-note">
                  {t("priceTooHigh", {
                    min: MIN_DISCOUNT_PERCENT,
                    max: `${grouped.format(maxPrice(originalNumber))}đ`,
                  })}
                </FieldError>
              ) : showPriceError ? (
                <FieldError id="post-price-note">{t("priceMissing")}</FieldError>
              ) : (
                <p id="post-price-note" className="-mt-2 text-label text-muted-foreground">
                  {edit && !priceIssue ? `${t("editFree")} ` : ""}
                  {priceIssue
                    ? t("discountHint", { min: MIN_DISCOUNT_PERCENT })
                    : t("discount", {
                        percent: discountPercent(originalNumber, priceNumber),
                        min: MIN_DISCOUNT_PERCENT,
                      })}
                </p>
              )}

              <fieldset disabled={locked} className="flex flex-col gap-2">
                <legend className="mb-2 text-title">{t("startQuestion")}</legend>
                <div className="-my-1 flex flex-wrap gap-x-2">
                  <Chip selected={startKey === "usual"} onClick={() => setStartKey("usual")}>
                    {t("usual", { time: clock(usual.hour, usual.minute) })}
                  </Chip>
                  <Chip selected={startKey === "now"} onClick={() => setStartKey("now")}>
                    {t("now")}
                  </Chip>
                  {FIXED_STARTS.filter(
                    (fixed) => fixed.hour !== usual.hour || fixed.minute !== usual.minute,
                  ).map((fixed) => {
                    const key = `${fixed.hour}:${fixed.minute}` as const;
                    return (
                      <Chip key={key} selected={startKey === key} onClick={() => setStartKey(key)}>
                        {clock(fixed.hour, fixed.minute)}
                      </Chip>
                    );
                  })}
                  <Chip selected={startKey === "custom"} onClick={() => setStartKey("custom")}>
                    {t("otherTime")}
                  </Chip>
                </div>
                {startKey === "custom" && (
                  <div className="flex items-center gap-2">
                    <NativeSelect
                      aria-label={t("hour")}
                      value={customStart.hour}
                      onChange={(event) =>
                        setCustomStart({ ...customStart, hour: Number(event.target.value) })
                      }
                    >
                      {Array.from({ length: 24 }, (_, hour) => (
                        <option key={hour} value={hour}>
                          {String(hour).padStart(2, "0")}
                        </option>
                      ))}
                    </NativeSelect>
                    <span aria-hidden>:</span>
                    <NativeSelect
                      aria-label={t("minute")}
                      value={customStart.minute}
                      onChange={(event) =>
                        setCustomStart({ ...customStart, minute: Number(event.target.value) })
                      }
                    >
                      {[0, 15, 30, 45].map((minute) => (
                        <option key={minute} value={minute}>
                          {String(minute).padStart(2, "0")}
                        </option>
                      ))}
                    </NativeSelect>
                  </div>
                )}
              </fieldset>

              <fieldset disabled={locked} className="flex flex-col gap-2">
                <legend className="mb-2 text-title">{t("lengthQuestion")}</legend>
                <div className="-my-1 flex flex-wrap gap-x-2">
                  {LENGTHS.map((value) => (
                    <Chip key={value} selected={length === value} onClick={() => setLength(value)}>
                      {t(`length.${value}`)}
                    </Chip>
                  ))}
                  <Chip selected={length === "custom"} onClick={() => setLength("custom")}>
                    {t("otherLength")}
                  </Chip>
                </div>
                {length === "custom" && (
                  <NativeSelect
                    aria-label={t("lengthQuestion")}
                    value={customLength}
                    onChange={(event) => setCustomLength(Number(event.target.value))}
                  >
                    {Array.from(
                      { length: (MAX_WINDOW_MINUTES - MIN_WINDOW_MINUTES) / 30 + 1 },
                      (_, index) => MIN_WINDOW_MINUTES + index * 30,
                    ).map((value) => (
                      <option key={value} value={value}>
                        {t("minutes", { minutes: value })}
                      </option>
                    ))}
                  </NativeSelect>
                )}
              </fieldset>

              <output
                className={cn(
                  "rounded-xl px-4 py-3 text-title",
                  over
                    ? "border border-warning-border bg-warning text-warning-foreground"
                    : "bg-secondary text-secondary-foreground",
                )}
              >
                {over
                  ? t("windowOver")
                  : t("window", { from: time(window.start), until: time(window.end) })}
              </output>

              {problem && (
                <Alert variant="destructive">
                  <CircleAlertIcon aria-hidden />
                  <AlertDescription>
                    {problem.kind === "failed"
                      ? `${t("failed")}${problem.reference ? ` ${t("reference", { id: problem.reference })}` : ""}`
                      : t(`problem.${problem.kind}`)}
                  </AlertDescription>
                </Alert>
              )}
            </>
          )}
        </div>

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
              <Button type="button" size="lg" disabled={!dishReady} onClick={() => setStep(3)}>
                {t("next")}
              </Button>
            </>
          )}
          {step === 3 && (
            <>
              <Button
                type="button"
                variant="outline"
                size="lg"
                disabled={pending}
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
              <Button type="button" size="lg" disabled={pending} onClick={post}>
                {pending && <Spinner data-icon="inline-start" />}
                {edit ? t("save") : t("post")}
              </Button>
            </>
          )}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
