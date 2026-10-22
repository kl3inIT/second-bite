"use client";

import { revalidateLogic, useStore } from "@tanstack/react-form";
import { CircleAlertIcon } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { z } from "zod";

import { refuse, useAppForm } from "@/components/form/app-form";
import { useFieldValidity } from "@/components/form/form-context";
import { Alert, AlertDescription } from "@/components/ui/alert";
import type { Point } from "@/components/map/location-picker";
import { Field, FieldLabel, FieldGroup } from "@/components/ui/field";
import { toast } from "@/components/ui/toast";
import { useRouter } from "@/i18n/navigation";
import { photoUrl } from "@/lib/api/photo";
import { setSellerPhoto, updateSeller, uploadPhoto, type SellerBody } from "@/lib/api/generated";

import { AddressField, isPhone, PinField, useAddressFill } from "./open-store-form";

// The owner changes the store's name, phone number, address, pin and photo (SEC-141, Figma O2), in the form that
// opens a store: the same fields, with the same address and map. The details are saved together, since the API
// changes them together, and the photo after: a photo that does not arrive says so, and the details stay saved.
export function StoreEditForm({
  store,
  photoFailed,
}: {
  store: SellerBody;
  /** The store was just opened and its photo did not arrive. */
  photoFailed: boolean;
}) {
  const t = useTranslations("StoreEditPage");
  const open = useTranslations("OpenStore");
  const location = useTranslations("StoreLocation");
  const router = useRouter();

  const form = useAppForm({
    defaultValues: {
      name: store.name,
      phone: store.phone,
      address: store.address,
      location: { latitude: store.latitude, longitude: store.longitude } as Point | undefined,
      photo: undefined as File | undefined,
    },
    validationLogic: revalidateLogic(),
    validators: {
      onDynamic: z.object({
        name: z.string().trim().min(1, open("errors.name")),
        phone: z.string().refine(isPhone, open("errors.phone")),
        address: z.string().trim().min(1, open("errors.address")),
        location: z.custom<Point | undefined>((point) => point !== undefined, location("required")),
        photo: z.custom<File | undefined>(),
      }),
    },
    onSubmit: async ({ value, formApi }) => {
      const place = value.location;
      if (!place) return;
      try {
        await updateSeller({
          path: { sellerId: store.id },
          body: {
            name: value.name.trim(),
            phone: value.phone.trim(),
            address: value.address.trim(),
            latitude: place.latitude,
            longitude: place.longitude,
          },
        });
      } catch (error) {
        refuse(formApi, error, {
          SELLER_PHONE_INVALID: "phone",
          SELLER_DETAILS_INVALID: "name",
          SELLER_LOCATION_OUTSIDE: "location",
        });
        return;
      }
      if (value.photo) {
        try {
          const { data } = await uploadPhoto({ body: value.photo });
          await setSellerPhoto({ path: { sellerId: store.id }, body: { photoId: data.id } });
        } catch (error) {
          refuse(formApi, error);
          router.refresh();
          return;
        }
      }
      toast.add({ type: "success", title: t("saved") });
      router.replace(`/stores/${store.id}`);
      router.refresh();
    },
  });

  const fillFrom = useAddressFill(
    () => form.getFieldValue("address"),
    (address) => form.setFieldValue("address", address),
  );
  const pin = useStore(form.store, (state) => state.values.location);

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
        {photoFailed && (
          <Alert variant="destructive">
            <CircleAlertIcon aria-hidden />
            <AlertDescription>{t("photoFailed")}</AlertDescription>
          </Alert>
        )}

        <form.AppForm>
          <form.FormError fallback={t("failed")} />
        </form.AppForm>

        <form.AppField name="name">
          {(field) => (
            <field.TextField
              label={open("name")}
              required
              autoComplete="organization"
              maxLength={80}
            />
          )}
        </form.AppField>

        <form.AppField name="phone">
          {(field) => (
            <field.TextField
              label={open("phone")}
              required
              type="tel"
              inputMode="tel"
              autoComplete="tel"
            />
          )}
        </form.AppField>

        <form.AppField name="address">
          {() => (
            <AddressField
              fillFrom={fillFrom}
              pin={pin}
              onLocated={({ latitude, longitude }) =>
                form.setFieldValue("location", { latitude, longitude })
              }
              onPlace={(point) => form.setFieldValue("location", point)}
            />
          )}
        </form.AppField>

        <form.AppField name="location">{() => <PinField onPinned={fillFrom} />}</form.AppField>

        <form.AppField name="photo">
          {() => (
            <PhotoField current={store.photoId ? `/photos/${store.photoId}/400.jpg` : undefined} />
          )}
        </form.AppField>

        <form.AppForm>
          <form.SubmitButton size="lg">{t("save")}</form.SubmitButton>
        </form.AppForm>
      </FieldGroup>
    </form>
  );
}

/** The store's photo: the one it has, or the one just chosen from the device, shown before it is sent. */
function PhotoField({ current }: { current: string | undefined }) {
  const t = useTranslations("StoreEditPage");
  const open = useTranslations("OpenStore");
  const { field, ids } = useFieldValidity<File | undefined>();
  const [preview, setPreview] = useState<string>();
  const photo = field.state.value;
  const shown = preview ?? (current ? photoUrl(current) : undefined);

  function choose(file: File | undefined) {
    if (preview) URL.revokeObjectURL(preview);
    field.handleChange(file);
    setPreview(file ? URL.createObjectURL(file) : undefined);
  }

  return (
    <Field>
      <FieldLabel htmlFor={ids.control}>{open("photo")}</FieldLabel>
      <label
        htmlFor={ids.control}
        className="flex min-h-21 cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border border-dashed border-primary/30 bg-background px-4 py-5 text-center transition-colors focus-within:ring-3 focus-within:ring-ring/50 hover:bg-secondary"
      >
        {shown && (
          <Image
            src={shown}
            alt=""
            width={64}
            height={64}
            unoptimized
            className="size-16 rounded-lg object-cover"
          />
        )}
        <span className="text-body-sm-strong text-link">
          {photo ? photo.name : current ? t("changePhoto") : open("choosePhoto")}
        </span>
        <span className="text-note text-muted-foreground">{open("photoHint")}</span>
        <input
          id={ids.control}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="sr-only"
          onChange={(event) => choose(event.target.files?.[0])}
        />
      </label>
    </Field>
  );
}
