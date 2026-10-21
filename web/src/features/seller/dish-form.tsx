"use client";

import { revalidateLogic } from "@tanstack/react-form";
import { useTranslations } from "next-intl";
import { useState, useTransition } from "react";
import { z } from "zod";

import { FailureAlert, type Failure } from "@/components/failure-alert";
import { refuse, useAppForm } from "@/components/form/app-form";
import { useFieldValidity } from "@/components/form/form-context";
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
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select";
import { Spinner } from "@/components/ui/spinner";
import { Link, useRouter } from "@/i18n/navigation";
import { failureOf } from "@/lib/api/client";
import { addDish, changeDish, type DishBody, removeDish } from "@/lib/api/generated";

import { Chip } from "./chip";
import { NumberInput } from "./number-input";
import { PhoneFootBar } from "./phone-foot-bar";
import { type PhotoSlot, PhotoSlots, slotsOf, uploadedIds } from "./photo-slots";
import { useRemountKey } from "./remount-key";

const kinds = [
  "bakery",
  "prepared_food",
  "ingredients",
  "drinks",
  "mixed_box",
  "other",
] as const satisfies readonly DishBody["kind"][];

// What a dish is counted in, chosen rather than typed: a seller's own word would reach every card and order as it
// was written. The unit is the dish's data, shown on cards and orders as it is saved, so the words stay Vietnamese
// in both languages, as the dish's name does. A dish saved earlier with another word keeps it as one more choice.
const units = ["suất", "phần", "cái", "chiếc", "túi", "hộp", "ổ", "ly", "chai"];

type Values = {
  photos: PhotoSlot[];
  name: string;
  kind: DishBody["kind"];
  unit: string;
  original: string;
  description: string;
  ingredients: string;
};

// The form of a dish of the catalog (SEC-55, Figma Q3c "Thêm món", C1 "Sửa món"): its photo, name, kind, unit,
// description, and ingredients and allergens, and, once it exists, "Xoá món", which asks first (C2). The rules are
// the server's (offer.DishDetails.normalized), and a mixed box needs its description, as a post of it does. A
// refusal the server gives (OFFER_DETAILS_INVALID, OFFER_DISH_LIMIT_REACHED) is said above the buttons in its words.
function DishFormBody({ sellerId, dish }: { sellerId: string; dish?: DishBody }) {
  const t = useTranslations("DishForm");
  const kindName = useTranslations("OfferKind");
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [removing, startRemoving] = useTransition();
  const [removeFailure, setRemoveFailure] = useState<Failure>();
  const back = `/stores/${sellerId}/catalog`;

  function done(notice: string) {
    router.push({ pathname: back, query: { notice } });
    router.refresh();
  }

  const defaultValues: Values = {
    photos: dish ? slotsOf(dish.photos) : [],
    name: dish?.name ?? "",
    kind: dish?.kind ?? "bakery",
    unit: dish?.unit ?? "suất",
    original: dish?.originalPriceVnd ? String(dish.originalPriceVnd) : "",
    description: dish?.description ?? "",
    ingredients: dish?.ingredients ?? "",
  };

  const form = useAppForm({
    defaultValues,
    validationLogic: revalidateLogic(),
    validators: {
      onDynamic: z
        .object({
          photos: z.array(z.custom<PhotoSlot>()).min(1, t("photoMissing")),
          name: z.string().trim().min(1, t("nameMissing")),
          kind: z.enum(kinds),
          unit: z.string(),
          // The original price is optional; a price, when given, is from 1.001đ, as the backend asks.
          original: z.string().refine((value) => value === "" || Number(value) > 1000, {
            message: t("originalInvalid"),
          }),
          description: z.string(),
          ingredients: z.string(),
        })
        .refine(
          (value) =>
            value.kind !== "mixed_box" ||
            value.description.trim() !== "" ||
            value.ingredients.trim() !== "",
          { message: t("descriptionMissing"), path: ["description"] },
        ),
    },
    onSubmit: async ({ value, formApi }) => {
      setRemoveFailure(undefined);
      try {
        const [photoId, ...morePhotoIds] = await uploadedIds(value.photos);
        if (!photoId) return;
        const fields = {
          name: value.name.trim(),
          kind: value.kind,
          unit: value.unit.trim(),
          description: value.description.trim(),
          ingredients: value.ingredients.trim(),
        };
        if (dish) {
          // Emptying the price takes it away (the backend reads 0 so).
          await changeDish({
            path: { dishId: dish.id },
            body: { ...fields, originalPriceVnd: Number(value.original), photoId, morePhotoIds },
          });
        } else {
          await addDish({
            path: { sellerId },
            body: {
              ...fields,
              ...(value.original ? { originalPriceVnd: Number(value.original) } : {}),
              photoId,
              morePhotoIds,
            },
          });
        }
      } catch (error) {
        refuse(formApi, error);
        return;
      }
      done("saved");
    },
  });

  function remove() {
    if (!dish) return;
    setRemoveFailure(undefined);
    startRemoving(async () => {
      try {
        await removeDish({ path: { dishId: dish.id } });
        done("deleted");
      } catch (error) {
        setConfirming(false);
        setRemoveFailure(failureOf(error));
      }
    });
  }

  return (
    <form
      id={form.formId}
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        void form.handleSubmit();
      }}
    >
      <FieldGroup>
        <form.AppForm>
          <form.FormError fallback={t("failed")} />
        </form.AppForm>
        {removeFailure && <FailureAlert failure={removeFailure} fallback={t("failed")} />}

        <form.AppField name="photos">{() => <PhotosField />}</form.AppField>

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
          <form.AppField name="original">{() => <OriginalPriceField />}</form.AppField>
        </div>

        <form.Subscribe selector={(state) => state.values.kind === "mixed_box"}>
          {(mixedBox) => (
            <form.AppField name="description">
              {(field) => (
                <field.TextField
                  label={mixedBox ? t("descriptionRequired") : t("description")}
                  required={mixedBox}
                  maxLength={1000}
                  placeholder={t("descriptionPlaceholder")}
                />
              )}
            </form.AppField>
          )}
        </form.Subscribe>

        <form.AppField name="ingredients">
          {(field) => (
            <field.TextField
              label={t("ingredients")}
              maxLength={500}
              placeholder={t("ingredientsPlaceholder")}
            />
          )}
        </form.AppField>

        <PhoneFootBar className="flex flex-wrap items-center gap-3">
          <Link href={back} className={buttonVariants({ variant: "outline", size: "lg" })}>
            {t("cancel")}
          </Link>
          <form.AppForm>
            <form.SubmitButton size="lg" disabled={removing}>
              {dish ? t("saveChanges") : t("save")}
            </form.SubmitButton>
          </form.AppForm>
          {dish && (
            <Button
              type="button"
              variant="outline"
              size="lg"
              disabled={removing}
              onClick={() => setConfirming(true)}
            >
              {t("delete")}
            </Button>
          )}
        </PhoneFootBar>
      </FieldGroup>

      <AlertDialog open={confirming} onOpenChange={setConfirming}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("deleteTitle")}</AlertDialogTitle>
            <AlertDialogDescription>{t("deleteBody")}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("keep")}</AlertDialogCancel>
            <Button type="button" disabled={removing} onClick={remove}>
              {removing && <Spinner data-icon="inline-start" />}
              {t("delete")}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </form>
  );
}

/** The dish's photos: up to three, the first its cover. */
function PhotosField() {
  const t = useTranslations("DishForm");
  const { field, invalid, errors, ids } = useFieldValidity<PhotoSlot[]>();
  return (
    <Field data-invalid={invalid || undefined}>
      <FieldLabel htmlFor={ids.control}>{t("photo")}</FieldLabel>
      <PhotoSlots
        id={ids.control}
        slots={field.state.value}
        invalid={invalid}
        describedBy={invalid ? ids.error : undefined}
        onChange={(slots) => field.handleChange(slots)}
      />
      {invalid && <FieldError id={ids.error} errors={errors} />}
    </Field>
  );
}

/** What the dish is counted in, from the list, or the word it was saved with. */
function UnitField() {
  const t = useTranslations("DishForm");
  const { field, ids } = useFieldValidity<string>();
  const unit = field.state.value;
  return (
    <Field className="col-span-2">
      <FieldLabel htmlFor={ids.control}>{t("unit")}</FieldLabel>
      <NativeSelect
        id={ids.control}
        size="field"
        value={unit}
        onChange={(event) => field.handleChange(event.target.value)}
      >
        {(units.includes(unit) ? units : [...units, unit]).map((value) => (
          <NativeSelectOption key={value} value={value}>
            {value}
          </NativeSelectOption>
        ))}
      </NativeSelect>
    </Field>
  );
}

/** The dish's price before the discount, in đồng, grouped as it is typed. */
function OriginalPriceField() {
  const t = useTranslations("DishForm");
  const { field, invalid, errors, ids } = useFieldValidity<string>();
  return (
    <Field className="col-span-3" data-invalid={invalid || undefined}>
      <FieldLabel htmlFor={ids.control}>{t("original")}</FieldLabel>
      <NumberInput
        id={ids.control}
        value={field.state.value}
        grouped
        onValueChange={(value) => field.handleChange(value)}
        onBlur={field.handleBlur}
        placeholder={t("originalPlaceholder")}
        aria-invalid={invalid || undefined}
        aria-describedby={invalid ? ids.error : undefined}
      />
      {invalid && <FieldError id={ids.error} errors={errors} />}
    </Field>
  );
}

// Each visit starts with an empty form (or the dish as it now is), not with what was typed the last time.
export function DishForm(props: React.ComponentProps<typeof DishFormBody>) {
  return <DishFormBody key={useRemountKey()} {...props} />;
}
