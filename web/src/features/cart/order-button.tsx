"use client";

import { XIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { SignInForm } from "@/features/identity/sign-in-form";
import { useRouter } from "@/i18n/navigation";
import { failureOf } from "@/lib/api/client";
import { setMyDisplayName } from "@/lib/api/generated";

import { nextStep, type Account, type Sheet } from "./order-steps";

/** As the server keeps it (server/internal/identity, maxDisplayNameLength). */
const MAX_NAME_LENGTH = 50;
/** Where signing in comes back to: the cart, which then takes the next step by itself (SEC-76 decision 2). */
export const RESUME_HREF = "/cart?continue=1";

/**
 * "Đặt món" on the confirmation (Figma K5) and what it asks first: someone signed out signs in in a sheet over
 * the cart (L5), and an account with no name yet gives the one the seller will call (L6). `onReady` runs once
 * nothing is left to ask. After signing in the cart comes back `resumed` and takes the next step by itself:
 * the name sheet here, or ordering, which the caller starts with `resumesReady`.
 */
export function OrderButton({
  account,
  googleClientId,
  held,
  resumed,
  onReady,
}: {
  account: Account;
  googleClientId?: string;
  held: { units: number; seller: string };
  resumed: boolean;
  onReady: () => void;
}) {
  const t = useTranslations("Cart");
  const router = useRouter();
  // Back from signing in, an account with no name is asked for one at once.
  const [sheet, setSheet] = useState<Sheet | undefined>(() =>
    resumed && nextStep(account) === "name" ? "name" : undefined,
  );

  // The address loses `continue`, so a reload does not take the step again.
  useEffect(() => {
    if (resumed) router.replace("/cart");
  }, [resumed, router]);

  function order() {
    const step = nextStep(account);
    if (step === "ready") onReady();
    else setSheet(step);
  }

  return (
    <>
      <Button size="lg" onClick={order}>
        {t("order")}
      </Button>
      <Drawer open={sheet !== undefined} onOpenChange={(open) => !open && setSheet(undefined)}>
        <DrawerContent>
          <div className="mx-auto flex w-full max-w-md flex-col gap-4 px-4 pt-5 pb-6">
            <div className="flex items-center justify-between gap-3">
              <DrawerTitle>{t(sheet === "name" ? "nameTitle" : "signInTitle")}</DrawerTitle>
              <DrawerClose render={<Button variant="ghost" size="icon" aria-label={t("close")} />}>
                <XIcon aria-hidden className="size-5" />
              </DrawerClose>
            </div>
            {sheet === "signIn" && (
              <>
                <DrawerDescription>{t("signInBody", held)}</DrawerDescription>
                <SignInForm returnTo={RESUME_HREF} googleClientId={googleClientId} untitled />
              </>
            )}
            {sheet === "name" && (
              <>
                <DrawerDescription>{t("nameBody")}</DrawerDescription>
                <NameForm
                  onSaved={() => {
                    setSheet(undefined);
                    router.refresh();
                    onReady();
                  }}
                />
              </>
            )}
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
}

// The name the seller sees on the order and calls at the counter (Figma L6), kept on the account (SEC-61);
// the server trims it and says in its own words when it refuses one (SEC-28).
function NameForm({ onSaved }: { onSaved: () => void }) {
  const t = useTranslations("Cart");
  const [name, setName] = useState("");
  const [problem, setProblem] = useState<string>();
  const [pending, startTransition] = useTransition();

  function save(event: React.FormEvent) {
    event.preventDefault();
    setProblem(undefined);
    startTransition(async () => {
      try {
        await setMyDisplayName({ body: { displayName: name } });
        onSaved();
      } catch (error) {
        setProblem(failureOf(error).detail ?? t("nameFailed"));
      }
    });
  }

  return (
    <form onSubmit={save} className="flex flex-col gap-4" noValidate>
      <Field data-invalid={problem ? true : undefined}>
        <FieldLabel htmlFor="order-name">{t("nameLabel")}</FieldLabel>
        <Input
          id="order-name"
          variant="pill"
          value={name}
          onChange={(event) => setName(event.target.value)}
          maxLength={MAX_NAME_LENGTH}
          autoComplete="name"
          required
          aria-invalid={problem ? true : undefined}
          aria-describedby={problem ? "order-name-problem" : undefined}
        />
        {problem && <FieldError id="order-name-problem">{problem}</FieldError>}
      </Field>
      <Button type="submit" size="lg" disabled={pending || !name.trim()}>
        {pending && <Spinner data-icon="inline-start" />}
        {t("nameSubmit")}
      </Button>
    </form>
  );
}
