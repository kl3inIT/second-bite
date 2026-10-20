"use client";

import { CircleAlertIcon } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useState, useTransition } from "react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { useRouter } from "@/i18n/navigation";
import { ApiError } from "@/lib/api/client";
import { openSeller, setSellerPhoto, uploadPhoto } from "@/lib/api/generated";

/** Tasco Mall Long Biên, where every store of the pilot is: the form has no map (Figma O1), so a store is pinned here. */
const MALL = { latitude: 21.0565, longitude: 105.8964 };

type Problem =
  | { kind: "details" }
  | { kind: "phone" }
  | { kind: "limit" }
  | { kind: "failed"; reference?: string };

function problemOf(error: unknown): Problem {
  const code = error instanceof ApiError ? error.code : undefined;
  switch (code) {
    case "SELLER_DETAILS_INVALID":
      return { kind: "details" };
    case "SELLER_PHONE_INVALID":
      return { kind: "phone" };
    case "SELLER_LIMIT_REACHED":
      return { kind: "limit" };
    default:
      return { kind: "failed", reference: error instanceof ApiError ? error.requestId : undefined };
  }
}

// The form that opens a store (SEC-57, Figma O1, O1b, O1c): name, phone, address and a photo, then "Tạo quán".
// The store is active at once and the person goes on to its home. The photo is a second step, so a store whose
// photo failed to upload is still opened.
export function OpenStoreForm() {
  const t = useTranslations("OpenStore");
  const router = useRouter();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [photo, setPhoto] = useState<File>();
  const [preview, setPreview] = useState<string>();
  const [problem, setProblem] = useState<Problem>();
  const [pending, startTransition] = useTransition();

  function choose(file: File | undefined) {
    if (preview) URL.revokeObjectURL(preview);
    setPhoto(file);
    setPreview(file ? URL.createObjectURL(file) : undefined);
  }

  function submit() {
    setProblem(undefined);
    startTransition(async () => {
      let sellerId: string;
      try {
        const { data } = await openSeller({
          body: { name: name.trim(), phone: phone.trim(), address: address.trim(), ...MALL },
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
          {phoneInvalid && <FieldError id="store-phone-problem">{t("phoneInvalid")}</FieldError>}
        </Field>

        <Field data-invalid={detailsInvalid || undefined}>
          <FieldLabel htmlFor="store-address">{t("address")}</FieldLabel>
          <Input
            id="store-address"
            value={address}
            onChange={(event) => setAddress(event.target.value)}
            placeholder={t("addressPlaceholder")}
            autoComplete="street-address"
            required
            aria-invalid={detailsInvalid || undefined}
            aria-describedby={detailsInvalid ? "store-details-problem" : undefined}
            disabled={pending}
          />
          {detailsInvalid && (
            <FieldError id="store-details-problem">{t("detailsInvalid")}</FieldError>
          )}
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

        <Button type="submit" size="lg" disabled={pending}>
          {pending && <Spinner data-icon="inline-start" />}
          {t("submit")}
        </Button>
      </FieldGroup>
    </form>
  );
}
