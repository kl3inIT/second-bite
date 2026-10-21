"use client";

import { CircleAlertIcon, CircleCheckIcon, LocateFixedIcon } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useRef, useState, useTransition } from "react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Spinner } from "@/components/ui/spinner";
import { useRouter } from "@/i18n/navigation";
import { ApiError, failureOf } from "@/lib/api/client";
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

type Problem = {
  kind: "details" | "phone" | "limit" | "failed";
  detail?: string;
  reference?: string;
};

function problemOf(error: unknown): Problem {
  const failure = failureOf(error);
  switch (error instanceof ApiError ? error.code : undefined) {
    case "SELLER_DETAILS_INVALID":
      return { kind: "details", ...failure };
    case "SELLER_PHONE_INVALID":
      return { kind: "phone", ...failure };
    case "SELLER_LIMIT_REACHED":
      return { kind: "limit", ...failure };
    default:
      return { kind: "failed", ...failure };
  }
}

// The form that opens a store (SEC-57, Figma O1, O1b, O1c): name, phone, address and a photo, then "Tạo quán".
// The store is active at once and the person goes on to its home. The photo is a second step, so a store whose
// photo failed to upload is still opened.
function OpenStoreFormBody() {
  const t = useTranslations("OpenStore");
  const router = useRouter();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [photo, setPhoto] = useState<File>();
  const [preview, setPreview] = useState<string>();
  const [problem, setProblem] = useState<Problem>();
  const [pending, startTransition] = useTransition();
  const [located, setLocated] = useState<Located>();
  const [locating, setLocating] = useState(false);
  const [locateFailure, setLocateFailure] = useState<"denied" | "failed">();
  // Whether what the field holds was written from the place, and not by the person: a second press may replace it.
  const written = useRef(false);

  // The button at the end of the address (Figma O1d, O1e, O1f): where the person stands pins the store, in place
  // of the mall, and the server names the place to fill the address, unless the person has written their own.
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
        const mayFill = address.trim() === "" || written.current;
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
            setAddress(named);
          }
          setLocated({
            latitude,
            longitude,
            accuracy,
            address: !named ? "unknown" : mayFill ? "filled" : "kept",
          });
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

  function choose(file: File | undefined) {
    if (preview) URL.revokeObjectURL(preview);
    setPhoto(file);
    setPreview(file ? URL.createObjectURL(file) : undefined);
  }

  function submit() {
    setProblem(undefined);
    startTransition(async () => {
      let sellerId: string;
      const place = located ?? MALL;
      try {
        const { data } = await openSeller({
          body: {
            name: name.trim(),
            phone: phone.trim(),
            address: address.trim(),
            // Only the place: what became of the address is the form's own note, not the store's.
            latitude: place.latitude,
            longitude: place.longitude,
          },
        });
        sellerId = data.id;
      } catch (error) {
        setProblem(problemOf(error));
        return;
      }
      if (photo) {
        try {
          const { data } = await uploadPhoto({ body: photo });
          await setSellerPhoto({ path: { sellerId }, body: { photoId: data.id } });
        } catch {
          // The store exists; its photo can be set again later.
        }
      }
      router.replace(`/stores/${sellerId}`);
      router.refresh();
    });
  }

  const detailsInvalid = problem?.kind === "details";
  const phoneInvalid = problem?.kind === "phone";

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        submit();
      }}
      noValidate
    >
      <FieldGroup>
        <header className="flex flex-col gap-1">
          <h1 className="text-card-title text-foreground">{t("heading")}</h1>
          <p className="text-body-sm text-muted-foreground">{t("intro")}</p>
        </header>

        {problem?.kind === "limit" && (
          <Alert variant="destructive">
            <CircleAlertIcon aria-hidden />
            <AlertDescription>{problem.detail ?? t("failed")}</AlertDescription>
          </Alert>
        )}
        {problem?.kind === "failed" && (
          <Alert variant="destructive">
            <CircleAlertIcon aria-hidden />
            <AlertDescription>
              {problem.detail ?? t("failed")}
              {problem.detail && problem.reference && (
                <> {t("reference", { id: problem.reference })}</>
              )}
            </AlertDescription>
          </Alert>
        )}

        <Field data-invalid={detailsInvalid || undefined}>
          <FieldLabel htmlFor="store-name">{t("name")}</FieldLabel>
          <Input
            id="store-name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder={t("namePlaceholder")}
            autoComplete="organization"
            maxLength={80}
            required
            aria-invalid={detailsInvalid || undefined}
            disabled={pending}
          />
        </Field>

        <Field data-invalid={phoneInvalid || undefined}>
          <FieldLabel htmlFor="store-phone">{t("phone")}</FieldLabel>
          <Input
            id="store-phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            placeholder={t("phonePlaceholder")}
            required
            aria-invalid={phoneInvalid || undefined}
            aria-describedby={phoneInvalid ? "store-phone-problem" : undefined}
            disabled={pending}
          />
          {phoneInvalid && <FieldError id="store-phone-problem">{problem.detail}</FieldError>}
        </Field>

        <Field data-invalid={detailsInvalid || undefined}>
          <FieldLabel htmlFor="store-address">{t("address")}</FieldLabel>
          <InputGroup>
            <InputGroupInput
              id="store-address"
              value={address}
              onChange={(event) => {
                written.current = false;
                setAddress(event.target.value);
              }}
              placeholder={t("addressPlaceholder")}
              autoComplete="street-address"
              required
              aria-invalid={detailsInvalid || undefined}
              aria-describedby={detailsInvalid ? "store-details-problem" : "store-locate-note"}
              disabled={pending}
            />
            <InputGroupAddon align="inline-end">
              <InputGroupButton
                size="icon-sm"
                className="relative after:absolute after:-inset-1.5"
                aria-label={t("locate")}
                title={t("locate")}
                disabled={pending || locating}
                onClick={locate}
              >
                {locating ? <Spinner /> : <LocateFixedIcon aria-hidden />}
              </InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
          <output id="store-locate-note" className="block empty:hidden">
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
          {detailsInvalid && <FieldError id="store-details-problem">{problem.detail}</FieldError>}
        </Field>

        <Field>
          <FieldLabel htmlFor="store-photo">{t("photo")}</FieldLabel>
          <label
            htmlFor="store-photo"
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
              id="store-photo"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="sr-only"
              disabled={pending}
              onChange={(event) => choose(event.target.files?.[0])}
            />
          </label>
        </Field>

        <PhoneFootBar className="md:flex md:flex-col">
          <Button type="submit" size="lg" disabled={pending}>
            {pending && <Spinner data-icon="inline-start" />}
            {t("submit")}
          </Button>
        </PhoneFootBar>
      </FieldGroup>
    </form>
  );
}

// Each visit starts with an empty form: once a store is opened, the next one does not find the last one's answers.
export function OpenStoreForm() {
  return <OpenStoreFormBody key={useRemountKey()} />;
}
