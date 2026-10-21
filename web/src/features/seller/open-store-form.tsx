"use client";

import { revalidateLogic } from "@tanstack/react-form";
import { CircleAlertIcon, CircleCheckIcon, LocateFixedIcon } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useRef, useState } from "react";
import { z } from "zod";

import { refuse, useAppForm } from "@/components/form/app-form";
import { useFieldValidity } from "@/components/form/form-context";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Spinner } from "@/components/ui/spinner";
import { useRouter } from "@/i18n/navigation";
import { addressAt, openSeller, setSellerPhoto, uploadPhoto } from "@/lib/api/generated";

import { PhoneFootBar } from "./phone-foot-bar";
import { useRemountKey } from "./remount-key";

/** Tasco Mall Long Biên, where every store of the pilot is: a store is pinned here until its owner gives where they are. */
const MALL = { latitude: 21.0565, longitude: 105.8964 };

/** How long the browser may look for the place; it is asked afresh at each press, never for a place it kept. */
const LOCATION_TIMEOUT_MS = 10_000;

/**
 * Where the person is, as the browser gave it, with how far off it may be, in metres, and what became of the
 * address: written from the place, kept as the person had typed it, or not known to the geocoder.
 */
type Located = {
  latitude: number;
  longitude: number;
  accuracy: number;
  address: "filled" | "kept" | "unknown";
};

/** A phone of 9 to 15 digits, a leading + allowed, spaces, dots, dashes and brackets between them: the server's rule. */
function isPhone(raw: string) {
  const value = raw.trim();
  if (!/^\+?[\d .\-()]+$/.test(value)) return false;
  const digits = value.replace(/\D/g, "").length;
  return digits >= 9 && digits <= 15;
}

// The form that opens a store (SEC-57, Figma O1, O1b, O1c): name, phone, address and a photo, then "Tạo quán".
// The store is active at once and the person goes on to its home. The photo is a second step, so a store whose
// photo failed to upload is still opened. The rules are the server's (seller.Details.normalized), checked here
// first so a mistake is said under its field before anything is sent.
function OpenStoreFormBody() {
  const t = useTranslations("OpenStore");
  const router = useRouter();

  const form = useAppForm({
    defaultValues: { name: "", phone: "", address: "", photo: undefined as File | undefined },
    validationLogic: revalidateLogic(),
    validators: {
      onDynamic: z.object({
        name: z.string().trim().min(1, t("errors.name")),
        phone: z.string().refine(isPhone, t("errors.phone")),
        address: z.string().trim().min(1, t("errors.address")),
        photo: z.custom<File | undefined>(),
      }),
    },
    onSubmit: async ({ value, formApi }) => {
      let sellerId: string;
      const place = located.current ?? MALL;
      try {
        const { data } = await openSeller({
          body: {
            name: value.name.trim(),
            phone: value.phone.trim(),
            address: value.address.trim(),
            // Only the place: what became of the address is the form's own note, not the store's.
            latitude: place.latitude,
            longitude: place.longitude,
          },
        });
        sellerId = data.id;
      } catch (error) {
        refuse(formApi, error, { SELLER_PHONE_INVALID: "phone", SELLER_DETAILS_INVALID: "name" });
        return;
      }
      if (value.photo) {
        try {
          const { data } = await uploadPhoto({ body: value.photo });
          await setSellerPhoto({ path: { sellerId }, body: { photoId: data.id } });
        } catch {
          // The store exists; its photo can be set again later.
        }
      }
      router.replace(`/stores/${sellerId}`);
      router.refresh();
    },
  });

  // The place the address field pinned, read when the form is sent.
  const located = useRef<Located>(undefined);

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
        <header className="flex flex-col gap-1">
          <h1 className="text-card-title text-foreground">{t("heading")}</h1>
          <p className="text-body-sm text-muted-foreground">{t("intro")}</p>
        </header>

        <form.AppForm>
          <form.FormError fallback={t("failed")} />
        </form.AppForm>

        <form.AppField name="name">
          {(field) => (
            <field.TextField
              label={t("name")}
              required
              placeholder={t("namePlaceholder")}
              autoComplete="organization"
              maxLength={80}
            />
          )}
        </form.AppField>

        <form.AppField name="phone">
          {(field) => (
            <field.TextField
              label={t("phone")}
              required
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              placeholder={t("phonePlaceholder")}
            />
          )}
        </form.AppField>

        <form.AppField name="address">
          {() => <AddressField onLocated={(place) => (located.current = place)} />}
        </form.AppField>

        <form.AppField name="photo">{() => <PhotoField />}</form.AppField>

        <PhoneFootBar className="md:flex md:flex-col">
          <form.AppForm>
            <form.SubmitButton size="lg">{t("submit")}</form.SubmitButton>
          </form.AppForm>
        </PhoneFootBar>
      </FieldGroup>
    </form>
  );
}

/**
 * The store's address, with the button at its end (Figma O1d, O1e, O1f): where the person stands pins the store,
 * in place of the mall, and the server names the place to fill the address, unless the person has written their own.
 */
function AddressField({ onLocated }: { onLocated: (place: Located) => void }) {
  const t = useTranslations("OpenStore");
  const { field, invalid, errors, ids } = useFieldValidity<string>();
  const [located, setLocated] = useState<Located>();
  const [locating, setLocating] = useState(false);
  const [locateFailure, setLocateFailure] = useState<"denied" | "failed">();
  // Whether what the field holds was written from the place, and not by the person: a second press may replace it.
  const written = useRef(false);
  const note = `${ids.control}-note`;

  function locate() {
    setLocateFailure(undefined);
    if (!("geolocation" in navigator)) {
      setLocateFailure("failed");
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const { latitude, longitude } = coords;
        const accuracy = Math.round(coords.accuracy);
        const mayFill = field.state.value.trim() === "" || written.current;
        void (async () => {
          let named = "";
          try {
            ({
              data: { address: named },
            } = await addressAt({ query: { latitude, longitude } }));
          } catch {
            // The place is pinned all the same; the person writes the address.
          }
          if (named && mayFill) {
            written.current = true;
            field.handleChange(named);
          }
          const place: Located = {
            latitude,
            longitude,
            accuracy,
            address: !named ? "unknown" : mayFill ? "filled" : "kept",
          };
          setLocated(place);
          onLocated(place);
          setLocating(false);
        })();
      },
      (error) => {
        setLocating(false);
        setLocateFailure(error.code === error.PERMISSION_DENIED ? "denied" : "failed");
      },
      { enableHighAccuracy: true, timeout: LOCATION_TIMEOUT_MS, maximumAge: 0 },
    );
  }

  return (
    <Field data-invalid={invalid || undefined}>
      <FieldLabel htmlFor={ids.control}>{t("address")}</FieldLabel>
      <InputGroup>
        <InputGroupInput
          id={ids.control}
          name={field.name}
          value={field.state.value}
          onBlur={field.handleBlur}
          onChange={(event) => {
            written.current = false;
            field.handleChange(event.target.value);
          }}
          placeholder={t("addressPlaceholder")}
          autoComplete="street-address"
          aria-required
          aria-invalid={invalid || undefined}
          aria-describedby={invalid ? `${ids.error} ${note}` : note}
        />
        <InputGroupAddon align="inline-end">
          <InputGroupButton
            size="icon-sm"
            className="relative after:absolute after:-inset-1.5"
            aria-label={t("locate")}
            title={t("locate")}
            disabled={locating}
            onClick={locate}
          >
            {locating ? <Spinner /> : <LocateFixedIcon aria-hidden />}
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
      <output id={note} className="block empty:hidden">
        {located && !locateFailure && (
          <span className="flex items-start gap-2 text-note text-muted-foreground">
            <CircleCheckIcon aria-hidden className="mt-0.5 size-4 shrink-0 text-success" />
            {t(`located.${located.address}`, { meters: located.accuracy })}
          </span>
        )}
        {locateFailure && (
          <span className="flex items-start gap-2 text-note text-warning-foreground">
            <CircleAlertIcon aria-hidden className="mt-0.5 size-4 shrink-0" />
            {t(locateFailure === "denied" ? "locateDenied" : "locateFailed")}
          </span>
        )}
      </output>
      {invalid && <FieldError id={ids.error} errors={errors} />}
    </Field>
  );
}

/** The store's photo, chosen from the device and shown before it is sent. */
function PhotoField() {
  const t = useTranslations("OpenStore");
  const { field, ids } = useFieldValidity<File | undefined>();
  const [preview, setPreview] = useState<string>();
  const photo = field.state.value;

  function choose(file: File | undefined) {
    if (preview) URL.revokeObjectURL(preview);
    field.handleChange(file);
    setPreview(file ? URL.createObjectURL(file) : undefined);
  }

  return (
    <Field>
      <FieldLabel htmlFor={ids.control}>{t("photo")}</FieldLabel>
      <label
        htmlFor={ids.control}
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
        <span className="text-body-sm-strong text-link">
          {photo ? photo.name : t("choosePhoto")}
        </span>
        <span className="text-note text-muted-foreground">{t("photoHint")}</span>
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

// Each visit starts with an empty form: once a store is opened, the next one does not find the last one's answers.
export function OpenStoreForm() {
  return <OpenStoreFormBody key={useRemountKey()} />;
}
