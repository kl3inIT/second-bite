"use client";

import { MinusIcon, PlusIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState, useTransition } from "react";

import { Button, buttonVariants } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { formatPrice } from "@/features/offers/format";
import { Link, useRouter } from "@/i18n/navigation";
import { ApiError } from "@/lib/api/client";
import { placeOrder } from "@/lib/api/generated";

type Problem = { kind: "gone" } | { kind: "failed"; reference?: string };

function problemOf(error: unknown): Problem {
  const code = error instanceof ApiError ? error.code : undefined;
  // The offer sold out or closed between the page and the press (Figma W1b): nothing was taken.
  if (code === "ORDER_OFFER_SOLD_OUT" || code === "ORDER_OFFER_UNAVAILABLE")
    return { kind: "gone" };
  return { kind: "failed", reference: error instanceof ApiError ? error.requestId : undefined };
}

export type OrderableOffer = {
  id: string;
  name: string;
  priceVnd: number;
  originalPriceVnd: number;
  unitsLeft: number;
};

// The order panel of the confirm page (Figma W1, Mobbin: Instacart's and Shop's panels): how many units, the
// total on the button, and "Đặt món". One key per visit is sent with every press, so a second press or a
// retried request returns the order placed first (SEC-15 › Idempotency). Someone signed out is sent to
// sign in and comes back here with the same units.
export function PlaceOrder({
  offer,
  initialUnits,
  signedIn,
}: {
  offer: OrderableOffer;
  initialUnits: number;
  signedIn: boolean;
}) {
  const t = useTranslations("Orders.place");
  const router = useRouter();
  const [units, setUnits] = useState(initialUnits);
  const [key] = useState(() => crypto.randomUUID());
  const [problem, setProblem] = useState<Problem>();
  const [pending, startTransition] = useTransition();
  const total = offer.priceVnd * units;
  const saving = (offer.originalPriceVnd - offer.priceVnd) * units;

  function place() {
    setProblem(undefined);
    startTransition(async () => {
      try {
        const { data } = await placeOrder({
          headers: { "Idempotency-Key": key },
          body: { lines: [{ offerId: offer.id, units }] },
        });
        router.push(`/orders/${data.id}`);
      } catch (error) {
        setProblem(problemOf(error));
      }
    });
  }

  return (
    <section
      aria-labelledby="place-order"
      className="flex flex-col gap-4 rounded-2xl bg-card p-5 text-card-foreground"
    >
      <h2 id="place-order" className="text-title">
        {t("title")}
      </h2>
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 flex-col">
          <p className="text-body-sm-strong">{offer.name}</p>
          <p className="text-label text-muted-foreground">
            {t("left", { units: offer.unitsLeft })}
          </p>
        </div>
        <fieldset className="flex items-center gap-1">
          <legend className="sr-only">{t("units")}</legend>
          <Button
            variant="secondary"
            size="icon"
            aria-label={t("fewer")}
            disabled={units <= 1 || pending}
            onClick={() => setUnits(units - 1)}
          >
            <MinusIcon />
          </Button>
          <output aria-live="polite" className="w-8 text-center font-display text-price">
            {units}
          </output>
          <Button
            variant="secondary"
            size="icon"
            aria-label={t("more")}
            disabled={units >= offer.unitsLeft || pending}
            onClick={() => setUnits(units + 1)}
          >
            <PlusIcon />
          </Button>
        </fieldset>
      </div>
      <div className="flex items-baseline justify-between gap-3 border-t border-border pt-3">
        <span className="text-body-sm-strong">{t("total")}</span>
        <span className="font-display text-price-lg text-primary">{formatPrice(total)}</span>
      </div>
      <p className="text-label text-muted-foreground">
        {t("payAtCounter", { saving: formatPrice(saving) })}
      </p>
      {problem ? (
        <div role="alert" className="flex flex-col gap-2 rounded-xl bg-muted p-3">
          <p className="text-body-sm-strong">
            {problem.kind === "gone" ? t("goneTitle") : t("failedTitle")}
          </p>
          <p className="text-body-sm text-muted-foreground">
            {problem.kind === "gone"
              ? t("goneBody")
              : t("failedBody", { reference: problem.reference ?? "—" })}
          </p>
          {problem.kind === "gone" ? (
            <Link href="/" className={buttonVariants({ variant: "outline" })}>
              {t("other")}
            </Link>
          ) : null}
        </div>
      ) : null}
      {signedIn ? (
        <Button size="lg" disabled={pending || problem?.kind === "gone"} onClick={place}>
          {pending ? <Spinner data-icon="inline-start" /> : null}
          {t("submit", { total: formatPrice(total) })}
        </Button>
      ) : (
        <>
          <Link
            href={{
              pathname: "/sign-in",
              query: { returnTo: `/orders/new?offer=${offer.id}&units=${units}` },
            }}
            className={buttonVariants({ size: "lg" })}
          >
            {t("signInFirst")}
          </Link>
          <p className="text-label text-muted-foreground">{t("signInWhy")}</p>
        </>
      )}
    </section>
  );
}
