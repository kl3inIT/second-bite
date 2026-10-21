"use client";

import { revalidateLogic } from "@tanstack/react-form";
import { useTranslations } from "next-intl";
import { useRef } from "react";
import { z } from "zod";

import { refuse, useAppForm } from "@/components/form/app-form";
import { useFieldValidity } from "@/components/form/form-context";
import { LocationField } from "@/components/map/location-field";
import type { Point } from "@/components/map/location-picker";
import { FieldError, FieldGroup } from "@/components/ui/field";
import { toast } from "@/components/ui/toast";
import { useRouter } from "@/i18n/navigation";
import { updateSeller, type SellerBody } from "@/lib/api/generated";

import { describePlace, suggestAddress } from "./suggested-address";

// The owner moves their store's pin and its written address (SEC-66, design decision 7). The store's other details
// go back as they are, since the API changes them together; the offers on sale and the orders still to collect
// follow the new place.
export function StoreLocationForm({ store }: { store: SellerBody }) {
  const t = useTranslations("StoreLocationPage");
  const location = useTranslations("StoreLocation");
  const router = useRouter();
  // What a place last wrote into the address: the owner's own words are never replaced.
  const lastFilled = useRef<string>(undefined);

  const form = useAppForm({
    defaultValues: {
      location: { latitude: store.latitude, longitude: store.longitude } as Point | undefined,
      address: store.address,
    },
    validationLogic: revalidateLogic(),
    validators: {
      onDynamic: z.object({
        location: z.custom<Point | undefined>((point) => point !== undefined, location("required")),
        address: z.string().trim().min(1, t("addressRequired")),
      }),
    },
    onSubmit: async ({ value, formApi }) => {
      if (!value.location) return;
      try {
        await updateSeller({
          path: { sellerId: store.id },
          body: {
            name: store.name,
            phone: store.phone,
            address: value.address.trim(),
            ...value.location,
          },
        });
      } catch (error) {
        refuse(formApi, error, {
          SELLER_LOCATION_OUTSIDE: "location",
          SELLER_DETAILS_INVALID: "address",
        });
        return;
      }
      toast.add({ type: "success", title: t("saved") });
      router.refresh();
    },
  });

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

        <form.AppField name="location">
          {() => (
            <PinField
              onPinned={async (point) => {
                const { fill } = await suggestAddress(
                  point,
                  form.getFieldValue("address"),
                  lastFilled.current,
                );
                if (fill) {
                  lastFilled.current = fill;
                  form.setFieldValue("address", fill);
                }
              }}
            />
          )}
        </form.AppField>

        <form.AppField name="address">
          {(field) => (
            <field.TextField label={t("address")} required autoComplete="street-address" />
          )}
        </form.AppField>

        <form.AppForm>
          <form.SubmitButton size="lg">{t("save")}</form.SubmitButton>
        </form.AppForm>
      </FieldGroup>
    </form>
  );
}

function PinField({ onPinned }: { onPinned: (point: Point) => Promise<void> }) {
  const { field, invalid, errors, ids } = useFieldValidity<Point | undefined>();
  return (
    <LocationField
      ids={ids}
      value={field.state.value}
      onChange={(point) => {
        field.handleChange(point);
        void onPinned(point);
      }}
      describe={describePlace}
      invalid={invalid}
      error={<FieldError id={ids.error} errors={errors} />}
    />
  );
}
