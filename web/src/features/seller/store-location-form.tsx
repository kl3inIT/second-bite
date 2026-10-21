"use client";

import { CircleAlertIcon, CircleCheckIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState, useTransition } from "react";

import { LocationField } from "@/components/map/location-field";
import type { Point } from "@/components/map/location-picker";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { useRouter } from "@/i18n/navigation";
import { ApiError, failureOf } from "@/lib/api/client";
import { updateSeller, type SellerBody } from "@/lib/api/generated";

import { describePlace, useSuggestedAddress } from "./suggested-address";

type Problem = { kind: "details" | "location" | "failed"; detail?: string; reference?: string };

function problemOf(error: unknown): Problem {
  const failure = failureOf(error);
  switch (error instanceof ApiError ? error.code : undefined) {
    case "SELLER_DETAILS_INVALID":
      return { kind: "details", ...failure };
    case "SELLER_LOCATION_OUTSIDE":
      return { kind: "location", ...failure };
    default:
      return { kind: "failed", ...failure };
  }
}

// The owner moves their store's pin and its written address (SEC-66, design decision 7). The store's other details
// go back as they are, since the API changes them together; the offers on sale and the orders still to collect
// follow the new place.
export function StoreLocationForm({ store }: { store: SellerBody }) {
  const t = useTranslations("StoreLocationPage");
  const router = useRouter();
  const [pin, setPin] = useState<Point>({ latitude: store.latitude, longitude: store.longitude });
  const { address, type, suggest } = useSuggestedAddress(store.address);
  const [problem, setProblem] = useState<Problem>();
  const [saved, setSaved] = useState(false);
  const [pending, startTransition] = useTransition();

  function pinned(point: Point) {
    setPin(point);
    setSaved(false);
    setProblem(undefined);
    void suggest(point);
  }

  function save() {
    setProblem(undefined);
    setSaved(false);
    startTransition(async () => {
      try {
        await updateSeller({
          path: { sellerId: store.id },
          body: { name: store.name, phone: store.phone, address: address.trim(), ...pin },
        });
      } catch (error) {
        setProblem(problemOf(error));
        return;
      }
      setSaved(true);
      router.refresh();
    });
  }

  const detailsInvalid = problem?.kind === "details";

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        save();
      }}
      noValidate
    >
      <FieldGroup>
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

        <LocationField
          id="store-location"
          value={pin}
          onChange={pinned}
          describe={describePlace}
          error={problem?.kind === "location" ? problem.detail : undefined}
          disabled={pending}
        />

        <Field data-invalid={detailsInvalid || undefined}>
          <FieldLabel htmlFor="store-address">{t("address")}</FieldLabel>
          <Input
            id="store-address"
            value={address}
            onChange={(event) => {
              setSaved(false);
              type(event.target.value);
            }}
            autoComplete="street-address"
            required
            aria-invalid={detailsInvalid || undefined}
            aria-describedby={detailsInvalid ? "store-address-problem" : undefined}
            disabled={pending}
          />
          {detailsInvalid && <FieldError id="store-address-problem">{problem.detail}</FieldError>}
        </Field>

        <output aria-live="polite" className="block empty:hidden">
          {saved && (
            <span className="flex items-start gap-2 text-note text-muted-foreground">
              <CircleCheckIcon aria-hidden className="mt-0.5 size-4 shrink-0 text-success" />
              {t("saved")}
            </span>
          )}
        </output>

        <Button type="submit" size="lg" disabled={pending}>
          {pending && <Spinner data-icon="inline-start" />}
          {t("save")}
        </Button>
      </FieldGroup>
    </form>
  );
}
