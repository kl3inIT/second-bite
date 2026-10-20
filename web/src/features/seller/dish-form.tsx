"use client";

import { CircleAlertIcon } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useState, useTransition } from "react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button, buttonVariants } from "@/components/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Link, useRouter } from "@/i18n/navigation";
import { ApiError } from "@/lib/api/client";
import { addDish, changeDish, type DishBody, removeDish, uploadPhoto } from "@/lib/api/generated";

import { Chip } from "./chip";
import { NumberInput } from "./number-input";

const kinds = [
  "bakery",
  "prepared_food",
  "ingredients",
  "drinks",
  "mixed_box",
  "other",
] as const satisfies readonly DishBody["kind"][];

type Problem = { kind: "details" } | { kind: "limit" } | { kind: "failed"; reference?: string };

function problemOf(error: unknown): Problem {
  const code = error instanceof ApiError ? error.code : undefined;
  switch (code) {
    case "OFFER_DETAILS_INVALID":
      return { kind: "details" };
    case "OFFER_DISH_LIMIT_REACHED":
      return { kind: "limit" };
    default:
      return { kind: "failed", reference: error instanceof ApiError ? error.requestId : undefined };
  }
}

// The form of a dish of the catalog (SEC-55, Figma Q3c "Thêm món", C1 "Sửa món"): its photo, name, kind, unit,
// description, and ingredients and allergens, and, once it exists, "Xoá món", which asks first (C2). A mixed box needs its description, as a post of it does.
export function DishForm({ sellerId, dish }: { sellerId: string; dish?: DishBody }) {
  const t = useTranslations("DishForm");
  const kindName = useTranslations("OfferKind");
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [photo, setPhoto] = useState<File>();
  const [preview, setPreview] = useState<string>();
  const [name, setName] = useState(dish?.name ?? "");
  const [kind, setKind] = useState<DishBody["kind"]>(dish?.kind ?? "bakery");
  const [unit, setUnit] = useState(dish?.unit ?? "suất");
  const [original, setOriginal] = useState(
    dish?.originalPriceVnd ? String(dish.originalPriceVnd) : "",
  );
  const [description, setDescription] = useState(dish?.description ?? "");
  const [ingredients, setIngredients] = useState(dish?.ingredients ?? "");
  const [tried, setTried] = useState(false);
  const [problem, setProblem] = useState<Problem>();
  const [confirming, setConfirming] = useState(false);

  const nameMissing = name.trim() === "";
  const photoMissing = !dish && !photo;
  const descriptionMissing =
    kind === "mixed_box" && description.trim() === "" && ingredients.trim() === "";
  // The original price is optional; a price, when given, is from 1.001đ, as the backend asks.
  const originalInvalid = original !== "" && Number(original) <= 1000;
  const back = `/stores/${sellerId}/catalog`;

  function choosePhoto(file: File | undefined) {
    if (preview) URL.revokeObjectURL(preview);
    setPhoto(file);
    setPreview(file ? URL.createObjectURL(file) : undefined);
  }

  function done(notice: string) {
    router.push({ pathname: back, query: { notice } });
    router.refresh();
  }

  function save() {
    setTried(true);
    setProblem(undefined);
    if (nameMissing || photoMissing || descriptionMissing || originalInvalid) return;
    startTransition(async () => {
      try {
        const photoId = photo ? (await uploadPhoto({ body: photo })).data.id : undefined;
        const fields = {
          name: name.trim(),
          kind,
          unit: unit.trim(),
          description: description.trim(),
          ingredients: ingredients.trim(),
        };
        if (dish) {
          // Emptying the price takes it away (the backend reads 0 so).
          await changeDish({
            path: { dishId: dish.id },
            body: {
              ...fields,
              originalPriceVnd: Number(original),
              ...(photoId ? { photoId } : {}),
            },
          });
        } else if (photoId) {
          await addDish({
            path: { sellerId },
            body: {
              ...fields,
              ...(original ? { originalPriceVnd: Number(original) } : {}),
              photoId,
            },
          });
        }
        done("saved");
      } catch (error) {
        setProblem(problemOf(error));
      }
    });
  }

  function remove() {
    if (!dish) return;
    setProblem(undefined);
    startTransition(async () => {
      try {
        await removeDish({ path: { dishId: dish.id } });
        done("deleted");
      } catch (error) {
        setConfirming(false);
        setProblem(problemOf(error));
      }
    });
  }

  const shownPhoto = preview ?? (dish ? `/api${dish.photo.smallPath}` : undefined);

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        save();
      }}
      noValidate
    >
      <FieldGroup>
        {problem?.kind === "limit" && (
          <Alert variant="destructive">
            <CircleAlertIcon aria-hidden />
            <AlertDescription>{t("limit")}</AlertDescription>
          </Alert>
        )}
        {problem?.kind === "failed" && (
          <Alert variant="destructive">
            <CircleAlertIcon aria-hidden />
            <AlertDescription>
              {t("failed")}
              {problem.reference && <> {t("reference", { id: problem.reference })}</>}
            </AlertDescription>
          </Alert>
        )}

        <Field data-invalid={(tried && photoMissing) || undefined}>
          <FieldLabel htmlFor="dish-photo">{t("photo")}</FieldLabel>
          <label
            htmlFor="dish-photo"
            className="flex min-h-21 cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border border-dashed border-primary/30 bg-background px-4 py-5 text-center transition-colors focus-within:ring-3 focus-within:ring-ring/50 hover:bg-secondary"
          >
            {shownPhoto && (
              <Image
                src={shownPhoto}
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
              disabled={pending}
              onChange={(event) => choosePhoto(event.target.files?.[0])}
            />
          </label>
          {tried && photoMissing && <FieldError>{t("photoMissing")}</FieldError>}
        </Field>

        <Field data-invalid={(tried && nameMissing) || undefined}>
          <FieldLabel htmlFor="dish-name">{t("name")}</FieldLabel>
          <Input
            id="dish-name"
            value={name}
            maxLength={80}
            onChange={(event) => setName(event.target.value)}
            placeholder={t("namePlaceholder")}
            aria-invalid={(tried && nameMissing) || undefined}
            disabled={pending}
          />
          {tried && nameMissing && <FieldError>{t("nameMissing")}</FieldError>}
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

        <div className="grid grid-cols-2 gap-3">
          <Field>
            <FieldLabel htmlFor="dish-unit">{t("unit")}</FieldLabel>
            <Input
              id="dish-unit"
              value={unit}
              maxLength={20}
              onChange={(event) => setUnit(event.target.value)}
              disabled={pending}
            />
          </Field>

          <Field data-invalid={(tried && originalInvalid) || undefined}>
            <FieldLabel htmlFor="dish-original">{t("original")}</FieldLabel>
            <NumberInput
              id="dish-original"
              value={original}
              grouped
              onValueChange={setOriginal}
              placeholder={t("originalPlaceholder")}
              aria-invalid={(tried && originalInvalid) || undefined}
              aria-describedby={tried && originalInvalid ? "dish-original-problem" : undefined}
              disabled={pending}
            />
          </Field>
        </div>
        {tried && originalInvalid && (
          <FieldError id="dish-original-problem" className="-mt-4">
            {t("originalInvalid")}
          </FieldError>
        )}

        <Field data-invalid={(tried && descriptionMissing) || undefined}>
          <FieldLabel htmlFor="dish-description">
            {kind === "mixed_box" ? t("descriptionRequired") : t("description")}
          </FieldLabel>
          <Input
            id="dish-description"
            value={description}
            maxLength={1000}
            onChange={(event) => setDescription(event.target.value)}
            placeholder={t("descriptionPlaceholder")}
            aria-invalid={(tried && descriptionMissing) || undefined}
            aria-describedby={tried && descriptionMissing ? "dish-description-problem" : undefined}
            disabled={pending}
          />
          {tried && descriptionMissing && (
            <FieldError id="dish-description-problem">{t("descriptionMissing")}</FieldError>
          )}
        </Field>

        <Field>
          <FieldLabel htmlFor="dish-ingredients">{t("ingredients")}</FieldLabel>
          <Input
            id="dish-ingredients"
            value={ingredients}
            maxLength={500}
            onChange={(event) => setIngredients(event.target.value)}
            placeholder={t("ingredientsPlaceholder")}
            disabled={pending}
          />
        </Field>

        <div className="flex flex-wrap items-center gap-3">
          <Link href={back} className={buttonVariants({ variant: "outline", size: "lg" })}>
            {t("cancel")}
          </Link>
          <Button type="submit" size="lg" disabled={pending}>
            {pending && <Spinner data-icon="inline-start" />}
            {dish ? t("saveChanges") : t("save")}
          </Button>
          {dish && (
            <Button
              type="button"
              variant="outline"
              size="lg"
              disabled={pending}
              onClick={() => setConfirming(true)}
            >
              {t("delete")}
            </Button>
          )}
        </div>
      </FieldGroup>

      <AlertDialog open={confirming} onOpenChange={setConfirming}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("deleteTitle")}</AlertDialogTitle>
            <AlertDialogDescription>{t("deleteBody")}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("keep")}</AlertDialogCancel>
            <Button type="button" disabled={pending} onClick={remove}>
              {pending && <Spinner data-icon="inline-start" />}
              {t("delete")}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </form>
  );
}
